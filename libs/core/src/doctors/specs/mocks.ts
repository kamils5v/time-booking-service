import { Doctor } from '../entities/doctor.entity';

export const mockDoctorsData: Doctor[] = [
  {
    id: `0d41173d-a982-4824-955a-1f72f3ad24b2`,
    name: `Bob Smith`,
  },
  {
    id: `0d41173d-a982-4824-955a-1f72f3ad24b2`,
    name: `Matthew Johnson`,
  },
];

export const [doctorBobSmith, doctorMatthewJohnson] = mockDoctorsData;
