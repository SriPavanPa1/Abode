import { delay, generateId } from '../../utils/helpers';
import complaintsData from '../mockData/complaints.json';

let complaints = [...complaintsData];

export const getComplaintsByApartment = async (apartmentId) => {
  await delay(400);
  return complaints
    .filter((c) => c.apartment_id === apartmentId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getComplaintsByFlat = async (flatId) => {
  await delay(300);
  return complaints
    .filter((c) => c.flat_id === flatId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const getComplaintById = async (id) => {
  await delay(300);
  return complaints.find((c) => c.id === id) || null;
};

export const createComplaint = async (complaint) => {
  await delay(500);
  const newComplaint = {
    ...complaint,
    id: generateId(),
    status: 'open',
    assigned_to: null,
    assigned_to_name: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    timeline: [
      { status: 'open', date: new Date().toISOString(), note: 'Complaint registered' },
    ],
  };
  complaints = [newComplaint, ...complaints];
  return newComplaint;
};

export const updateComplaintStatus = async (id, status, note = '') => {
  await delay(400);
  complaints = complaints.map((c) => {
    if (c.id === id) {
      return {
        ...c,
        status,
        updated_at: new Date().toISOString(),
        timeline: [
          ...c.timeline,
          { status, date: new Date().toISOString(), note: note || `Status changed to ${status}` },
        ],
      };
    }
    return c;
  });
  return complaints.find((c) => c.id === id);
};

export const assignComplaint = async (id, assignedTo, assignedToName) => {
  await delay(300);
  complaints = complaints.map((c) =>
    c.id === id ? { ...c, assigned_to: assignedTo, assigned_to_name: assignedToName } : c
  );
  return complaints.find((c) => c.id === id);
};
