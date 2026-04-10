import { create } from 'zustand';
import * as visitorService from '../api/services/visitorService';

const useVisitorStore = create((set) => ({
  visitors: [],
  isLoading: false,
  typeFilter: 'all',
  statusFilter: 'all',

  fetchVisitors: async (apartmentId) => {
    set({ isLoading: true });
    try {
      const data = await visitorService.getVisitorsByApartment(apartmentId);
      set({ visitors: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addVisitor: async (visitor) => {
    const newVisitor = await visitorService.addVisitor(visitor);
    set((state) => ({ visitors: [newVisitor, ...state.visitors] }));
    return newVisitor;
  },

  markExit: async (id) => {
    const updated = await visitorService.markVisitorExit(id);
    set((state) => ({
      visitors: state.visitors.map((v) => (v.id === id ? updated : v)),
    }));
  },

  approveEntry: async (id, approvedBy) => {
    const updated = await visitorService.approveVisitorEntry(id, approvedBy);
    set((state) => ({
      visitors: state.visitors.map((v) => (v.id === id ? updated : v)),
    }));
  },

  setTypeFilter: (type) => set({ typeFilter: type }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));

export default useVisitorStore;
