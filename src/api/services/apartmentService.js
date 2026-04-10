import { delay } from '../../utils/helpers';
import apartments from '../mockData/apartments.json';
import blocks from '../mockData/blocks.json';
import flats from '../mockData/flats.json';

export const getApartments = async () => {
  await delay(400);
  return apartments;
};

export const getApartmentById = async (id) => {
  await delay(300);
  return apartments.find((a) => a.id === id) || null;
};

export const getBlocks = async (apartmentId) => {
  await delay(300);
  return blocks.filter((b) => b.apartment_id === apartmentId);
};

export const getFlats = async (apartmentId) => {
  await delay(400);
  return flats.filter((f) => f.apartment_id === apartmentId);
};

export const getFlatsByBlock = async (blockId) => {
  await delay(300);
  return flats.filter((f) => f.block_id === blockId);
};

export const getFlatById = async (id) => {
  await delay(200);
  return flats.find((f) => f.id === id) || null;
};
