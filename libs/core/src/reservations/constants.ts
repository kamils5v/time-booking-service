export enum ReservationsMessage {
  MISSING_DATE = `Date should not be empty`,
  BAD_DATA = `Bad reservations data`,
  SLOT_NOT_AVAILABLE = `Slot not available`,
}

export enum ReservationStatus {
  DRAFT = 'draft',
  CREATED = 'created',
  CONFIRMED = 'confirmed',
}

export const RESERVATIONS_DEFAULT_SCHEDULE = [
  { start: '09:00', end: '13:00' },
  { start: '14:00', end: '22:00' },
];

export const RESERVATIONS_DEFAULT_SLOT_MINUTES = 5;
