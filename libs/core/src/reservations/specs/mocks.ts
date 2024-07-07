import { johnDoe } from '@libs/core/users/specs/mocks';
import { Reservation } from '../entities/reservation.entity';
import { ReservationStatus } from '../constants';
import { doctorBobSmith } from '@libs/core/doctors/specs/mocks';

export const mockReservationsData: Reservation[] = [
  {
    id: 'ea8bddfb-72f8-4a80-adb3-91fd259f53e5',
    userId: johnDoe.id,
    userName: johnDoe.name,
    doctorId: '',
    doctorName: '',
    start: new Date(`1 January 2025 11:30`),
    status: ReservationStatus.CONFIRMED,
  },
  {
    id: 'ea8bddfb-72f8-4a80-adb3-91fd259f53e6',
    userId: johnDoe.id,
    userName: johnDoe.name,
    doctorId: doctorBobSmith.id,
    doctorName: doctorBobSmith.name,
    start: new Date(`1 January 2025 15:00`),
    status: ReservationStatus.CONFIRMED,
  },
];

export const [mockReservation01, mockReservation02] = mockReservationsData;
