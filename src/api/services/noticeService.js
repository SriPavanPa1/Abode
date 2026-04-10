import { delay, generateId } from '../../utils/helpers';
import noticesData from '../mockData/notices.json';

let notices = [...noticesData];

export const getNoticesByApartment = async (apartmentId) => {
  await delay(400);
  return notices
    .filter((n) => n.apartment_id === apartmentId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getNoticeById = async (id) => {
  await delay(300);
  return notices.find((n) => n.id === id) || null;
};

export const createNotice = async (notice) => {
  await delay(500);
  const newNotice = {
    ...notice,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  notices = [newNotice, ...notices];
  return newNotice;
};

export const deleteNotice = async (id) => {
  await delay(300);
  notices = notices.filter((n) => n.id !== id);
  return true;
};
