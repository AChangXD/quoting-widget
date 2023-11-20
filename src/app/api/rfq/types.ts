import { InventoryItem } from '../inventory/types';

export type Rfq = {
  id: number;
  customer: string;
  requestDate: string;
  itemsRequested: { item: InventoryItem; quantity: number }[];
};
