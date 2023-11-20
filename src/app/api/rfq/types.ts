import { InventoryItem } from '../inventory/types';

export type Rfq = {
  id: number;
  customer: string;
  requestDate: string; // ISO 8601 date string
  itemsRequested: { item: InventoryItem; quantity: number }[];
};
