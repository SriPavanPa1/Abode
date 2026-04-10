import { create } from 'zustand';
import * as complaintService from '../api/services/complaintService';

const useComplaintStore = create((set) => ({
  complaints: [],
  isLoading: false,
  statusFilter: 'all',
  priorityFilter: 'all',

  fetchComplaints: async (apartmentId) => {
    set({ isLoading: true });
    try {
      const data = await complaintService.getComplaintsByApartment(apartmentId);
      set({ complaints: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchComplaintsByFlat: async (flatId) => {
    set({ isLoading: true });
    try {
      const data = await complaintService.getComplaintsByFlat(flatId);
      set({ complaints: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  getComplaintById: async (id) => {
    return await complaintService.getComplaintById(id);
  },

  createComplaint: async (complaint) => {
    const newComplaint = await complaintService.createComplaint(complaint);
    set((state) => ({ complaints: [newComplaint, ...state.complaints] }));
    return newComplaint;
  },

  updateStatus: async (id, status, note) => {
    const updated = await complaintService.updateComplaintStatus(id, status, note);
    set((state) => ({
      complaints: state.complaints.map((c) => (c.id === id ? updated : c)),
    }));
    return updated;
  },

  assignComplaint: async (id, assignedTo, assignedToName) => {
    const updated = await complaintService.assignComplaint(id, assignedTo, assignedToName);
    set((state) => ({
      complaints: state.complaints.map((c) => (c.id === id ? updated : c)),
    }));
  },

  setStatusFilter: (status) => set({ statusFilter: status }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority }),
}));

export default useComplaintStore;
