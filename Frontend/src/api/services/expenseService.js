import { delay } from '../../utils/helpers';
import maintenance from '../mockData/maintenance.json';
import expenses from '../mockData/expenses.json';

let maintenanceData = [...maintenance];
let expenseData = [...expenses];

export const getMaintenanceByApartment = async (apartmentId) => {
  await delay(400);
  return maintenanceData.filter((m) => m.apartment_id === apartmentId);
};

export const getMaintenanceByFlat = async (flatId) => {
  await delay(300);
  return maintenanceData.filter((m) => m.flat_id === flatId);
};

export const getExpensesByApartment = async (apartmentId) => {
  await delay(400);
  return expenseData.filter((e) => e.apartment_id === apartmentId);
};

export const updateMaintenanceStatus = async (id, status) => {
  await delay(300);
  maintenanceData = maintenanceData.map((m) =>
    m.id === id ? { ...m, status, paid_date: status === 'paid' ? new Date().toISOString() : m.paid_date } : m
  );
  return maintenanceData.find((m) => m.id === id);
};

export const addExpense = async (expense) => {
  await delay(400);
  const newExpense = { ...expense, id: 'e' + (expenseData.length + 1) };
  expenseData = [...expenseData, newExpense];
  return newExpense;
};
