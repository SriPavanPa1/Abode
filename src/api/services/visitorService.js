import { delay, generateId } from '../../utils/helpers';
import visitorsData from '../mockData/visitors.json';

let visitors = [...visitorsData];

export const getVisitorsByApartment = async (apartmentId) => {
  await delay(400);
  return visitors
    .filter((v) => v.apartment_id === apartmentId)
    .sort((a, b) => {
      const dateA = a.checked_in_at || a.created_at || '';
      const dateB = b.checked_in_at || b.created_at || '';
      return new Date(dateB) - new Date(dateA);
    });
};

export const addVisitor = async (visitor) => {
  await delay(500);
  const newVisitor = {
    ...visitor,
    id: generateId(),
    status: 'checked_in',
    checked_in_at: new Date().toISOString(),
    checked_out_at: null,
  };
  visitors = [newVisitor, ...visitors];
  return newVisitor;
};

export const markVisitorExit = async (id) => {
  await delay(300);
  visitors = visitors.map((v) =>
    v.id === id
      ? { ...v, status: 'checked_out', checked_out_at: new Date().toISOString() }
      : v
  );
  return visitors.find((v) => v.id === id);
};

export const approveVisitorEntry = async (id, approvedBy) => {
  await delay(300);
  visitors = visitors.map((v) =>
    v.id === id
      ? { ...v, status: 'checked_in', checked_in_at: new Date().toISOString(), approved_by: approvedBy }
      : v
  );
  return visitors.find((v) => v.id === id);
};
