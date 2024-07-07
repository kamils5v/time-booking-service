import { ServiceRequestParams } from '@libs/shared/interfaces/service.interface';
import { TelegramMessageDto } from './dto/telegram-message.dto';
import { ITelegramBotService } from './interfaces/telegram-bot-service.interface';
import { FindOneQuery } from '@libs/shared/interfaces/repository.interface';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IReservationsService } from '../reservations/interfaces/reservations-service.interface';
import { User } from '../users/entities/user.entity';
import { IUsersService } from '../users/interfaces/users-service.interface';
import { validateDto } from '@libs/shared/dto/validate';
import { TELEGRAM_BOT_HELLO, TelegramBotCommand } from './constants';
import { IDoctorsService } from '../doctors/interfaces/doctors-service.interface';
import { IDateTimeUtils } from '@libs/shared/utils/datetime/datetime-utils.interface';
import { DoctorsMessage } from '../doctors/constants';
import { UsersMessage } from '../users/constants';
import { ITelegramApiService } from './interfaces/telegram-api-service.interface';
import { HttpStatusMessage } from '@libs/shared/constants';

export class TelegramBotService implements ITelegramBotService {
  constructor(
    @Inject(IUsersService)
    private readonly usersService: IUsersService,
    @Inject(ITelegramApiService)
    private readonly telegramApiService: ITelegramApiService,
    @Inject(IDoctorsService)
    private readonly doctorsService: IDoctorsService,
    @Inject(IReservationsService)
    private readonly reservationsService: IReservationsService,
    @Inject(IDateTimeUtils)
    private readonly dateTimeUtils: IDateTimeUtils,
  ) {}

  private parseBotCommand(dto: TelegramMessageDto) {
    const { text = '' } = dto?.message || {};
    const [command] = String(text).split(' ');

    if (-1 === Object.values(TelegramBotCommand).indexOf(command as TelegramBotCommand)) {
      throw new BadRequestException(`Unrecognized bot command`);
    }
    return { command, body: String(text).substring(command.length) };
  }

  async onMessage(dto: TelegramMessageDto, params?: ServiceRequestParams): Promise<any> {
    this.onMessagePromise(dto, params);
    return { ok: true };
  }

  async onMessagePromise(dto: TelegramMessageDto, params?: ServiceRequestParams) {
    const user = await this.getUserByMessage(dto, params);
    const { id: userId, telegramId } = user || {};
    if (!userId) throw new InternalServerErrorException(UsersMessage.MISSING_ID);
    try {
      const { command, body } = this.parseBotCommand(dto);
      const promises = [];
      let result = '';

      if (command === TelegramBotCommand.START) {
        promises.push(this.onMessageHelp());
      } else if (command === TelegramBotCommand.DOCTORS) {
        promises.push(this.onMessageDoctors(body, dto, { ...params, user }));
      } else if (command === TelegramBotCommand.SLOTS) {
        promises.push(this.onMessageSlots(body, dto, { ...params, user }));
      } else if (command === TelegramBotCommand.RESERVATIONS) {
        promises.push(this.onMessageReservations(body, dto, { ...params, user }));
      } else if (command === TelegramBotCommand.RESERVE) {
        promises.push(this.onMessageReserve(body, dto, { ...params, user }));
      }
      if (promises.length) {
        [result] = await Promise.all(promises);
      }
      // console.log(`TelegramBotService.onMessagePromise: command result:`, result);
      if (result) {
        this.telegramApiService.send(telegramId, result);
      }
      return result;
    } catch (error) {
      // console.warn(`TelegramBotService.onMessagePromise: command error:`, error);
      let message = error.message || HttpStatusMessage.INTERNAL_SERVER_ERROR;
      let statusCode = error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;

      if (typeof error.getStatus === 'function') {
        statusCode = error.getStatus();
      }
      if (typeof error.getResponse === 'function') {
        message = error.getResponse();
      }
      if (typeof message === 'object') {
        const {
          // it can be nested
          message: nestedMessage,
          statusCode: nestedStatusCode,
        } = message || ({} as any);
        if (nestedMessage) message = nestedMessage;
        if (nestedStatusCode) statusCode = nestedStatusCode;
      }
      const result = { statusCode, message };

      console.warn(`TelegramBotService.onMessagePromise:`, { telegramId, result });

      this.telegramApiService.send(telegramId, `${statusCode}: ${message}`);
      // throw error;
    }
  }

  async onMessageHelp() {
    return TELEGRAM_BOT_HELLO;
  }

  async onMessageDoctors(body: string, dto: TelegramMessageDto, params: ServiceRequestParams) {
    const { transactionManager } = params || {};
    const result = await this.doctorsService.findAll({}, { transactionManager });
    if (!result?.data?.length) return `**No doctors available**`;
    return `**Doctors:**\n` + (result?.data || []).map((doctor) => doctor.name).join(`\n`);
  }

  async onMessageSlots(body: string, dto: TelegramMessageDto, params: ServiceRequestParams) {
    const [doctorName, dateInput] = String(body)
      .split(',')
      .map((v) => v.trim());
    const [doctor, date] = await Promise.all([
      this.doctorsService.findOne(
        { where: { $or: [{ id: doctorName }, { name: { $regex: new RegExp(doctorName, 'i') } }] } },
        params,
      ),
      this.dateTimeUtils.parseDate(dateInput),
    ]);

    if (!doctor?.id) throw new UnprocessableEntityException(DoctorsMessage.NOT_FOUND);
    const slots = await this.reservationsService.getAvailableSlots(doctor, date, params);
    if (!slots.length) return `**No slots available**`;
    return `**Available slots:**\n` + slots.join(`, `);
  }

  async onMessageReservations(body: string, dto: TelegramMessageDto, params: ServiceRequestParams) {
    const { user } = params || {};
    const { id: userId } = user || {};
    if (!userId) throw new InternalServerErrorException(UsersMessage.MISSING_ID);

    const reservations = await this.reservationsService.findAll(
      {
        where: { userId, start: { $gt: new Date() } },
      },
      params,
    );
    if (!reservations?.data?.length) return `**No reservations created**`;
    return (
      `**Reservations:**\n` + (reservations?.data || []).map((item) => `${item.start}: ${item.doctorName}`).join(`\n`)
    );
  }

  async onMessageReserve(body: string, dto: TelegramMessageDto, params: ServiceRequestParams) {
    const { user } = params || {};
    const { id: userId } = user || {};
    if (!userId) throw new InternalServerErrorException(UsersMessage.MISSING_ID);

    const [doctorName, dateInput] = String(body)
      .split(',')
      .map((v) => v.trim());

    const [doctor, date] = await Promise.all([
      this.doctorsService.findOne({ where: { name: { $regex: new RegExp(doctorName, 'i') } } }, params),
      this.dateTimeUtils.parseDate(dateInput),
    ]);

    const doctorId = doctor?.id;

    if (!doctorId) throw new UnprocessableEntityException(DoctorsMessage.NOT_FOUND);
    const reservation = await this.reservationsService.create(
      {
        doctorId,
        userId,
        start: dateInput,
      },
      params,
    );

    return `**Created reservation:**\n` + `${reservation.start}: ${reservation.doctorName}`;
  }

  async getUserByMessage(dto: TelegramMessageDto, params: ServiceRequestParams) {
    await validateDto(TelegramMessageDto, dto);
    const { message } = dto;
    const { from } = message || {};
    const { id: telegramId, first_name: firstName, last_name: lastName, username } = from || {};
    // console.log(`TelegramService.getUserByMessage:`, { telegramId });
    let user = await this.usersService.findOne({ telegramId } as FindOneQuery<User>, params);
    if (!user?.id) {
      // user not existing yet
      user = await this.usersService.create(
        {
          telegramId,
          name: [firstName, lastName].join(' ') || username,
          telegramData: from,
        },
        params,
      );
    }
    // console.log(`TelegramService.getUserByMessage: user:`, user);
    return user;
  }
}
