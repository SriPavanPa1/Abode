import { delay } from '../../utils/helpers';
import residents from '../mockData/residents.json';
import users from '../mockData/users.json';
import flats from '../mockData/flats.json';

export const getResidentsByApartment = async (apartmentId) => {
  await delay(400);
  return residents
    .filter((r) => r.apartment_id === apartmentId)
    .map((r) => ({
      ...r,
      user: users.find((u) => u.id === r.user_id),
      flat: flats.find((f) => f.id === r.flat_id),
    }));
};

export const getResidentByFlat = async (flatId) => {
  await delay(300);
  const resident = residents.find((r) => r.flat_id === flatId);
  if (!resident) return null;
  return {
    ...resident,
    user: users.find((u) => u.id === resident.user_id),
    flat: flats.find((f) => f.id === resident.flat_id),
  };
};

export const getResidentByUserId = async (userId) => {
  await delay(300);
  const resident = residents.find((r) => r.user_id === userId);
  if (!resident) return null;
  return {
    ...resident,
    user: users.find((u) => u.id === resident.user_id),
    flat: flats.find((f) => f.id === resident.flat_id),
  };
};
