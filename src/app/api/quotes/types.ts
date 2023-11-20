import { InventoryItem } from '../inventory/types';

export type Quote = {
  id?: number;
  customer: string;
  rfqId: number;
  quoteDate: string; // ISO 8601 date string
  itemsQuoted: {
    item: InventoryItem;
    quantity: number;
    price: number;
    leadTime: number;
  }[];
};
