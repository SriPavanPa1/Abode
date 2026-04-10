import { create } from 'zustand';
import * as expenseService from '../api/services/expenseService';

const useExpenseStore = create((set, get) => ({
  maintenance: [],
  expenses: [],
  isLoading: false,
  filters: {
    block: 'all',
    status: 'all',
    month: 'all',
    search: '',
  },
  sortBy: 'flat_number',
  sortOrder: 'asc',

  fetchMaintenance: async (apartmentId) => {
    set({ isLoading: true });
    try {
      const data = await expenseService.getMaintenanceByApartment(apartmentId);
      set({ maintenance: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchMaintenanceByFlat: async (flatId) => {
    set({ isLoading: true });
    try {
      const data = await expenseService.getMaintenanceByFlat(flatId);
      set({ maintenance: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchExpenses: async (apartmentId) => {
    set({ isLoading: true });
    try {
      const data = await expenseService.getExpensesByApartment(apartmentId);
      set({ expenses: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateMaintenanceStatus: async (id, status) => {
    const updated = await expenseService.updateMaintenanceStatus(id, status);
    set((state) => ({
      maintenance: state.maintenance.map((m) => (m.id === id ? updated : m)),
    }));
  },

  addExpense: async (expense) => {
    const newExpense = await expenseService.addExpense(expense);
    set((state) => ({ expenses: [...state.expenses, newExpense] }));
    return newExpense;
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  setSort: (field) => {
    const state = get();
    set({
      sortBy: field,
      sortOrder: state.sortBy === field && state.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  },
}));

export default useExpenseStore;
