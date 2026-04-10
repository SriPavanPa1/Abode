import { create } from 'zustand';
import * as noticeService from '../api/services/noticeService';

const useNoticeStore = create((set) => ({
  notices: [],
  isLoading: false,
  categoryFilter: 'all',

  fetchNotices: async (apartmentId) => {
    set({ isLoading: true });
    try {
      const data = await noticeService.getNoticesByApartment(apartmentId);
      set({ notices: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  getNoticeById: async (id) => {
    return await noticeService.getNoticeById(id);
  },

  createNotice: async (notice) => {
    const newNotice = await noticeService.createNotice(notice);
    set((state) => ({ notices: [newNotice, ...state.notices] }));
    return newNotice;
  },

  deleteNotice: async (id) => {
    await noticeService.deleteNotice(id);
    set((state) => ({
      notices: state.notices.filter((n) => n.id !== id),
    }));
  },

  setCategoryFilter: (category) => set({ categoryFilter: category }),
}));

export default useNoticeStore;
