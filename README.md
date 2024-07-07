## Description

Service for reservation of time slots by Telegram bot.

## Installation & Configuration

Install dependencies:

```bash
$ npm install
```

Copy sample configuration from `.env.sample` to `.env`, review it and configure credentials for database and telegram. It is not recommeded to use it without transactions, but there is such option. Also there is option to skip sending responses by Telegram bot.

Configure Telegram bot webhook to receive messages:

```bash
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<YOUR_DOMAIN>/api/v1/tg/webhook

```

## Bot commands

- `/start` - display help
- `/doctors` - display list of doctors
- `/slots <DOCTOR_NAME>, <DATE>` - display list of available slots
- `/reservations` - display list of future reservations
- `/reserve  <DOCTOR_NAME>, <DATE>` - make reservation

## REST API

There is REST API for administration at `/api/v1`. Do not allow public access to it!
Swagger documentation is available at `/api/docs`.
Note that user can not receive messages from bot if user didn't send messages to that bot before.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
