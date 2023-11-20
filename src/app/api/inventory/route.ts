import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import inventoryData from './inventory.json';
import { InventoryItem } from './types';

export let data: InventoryItem[] = inventoryData;
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json',
      },
    });
  } else {
    const matchingItem = data.find((item) => item.id === Number(id));
    if (matchingItem) {
      return new Response(JSON.stringify(matchingItem), {
        headers: {
          'content-type': 'application/json',
        },
      });
    } else {
      return new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
        headers: {
          'content-type': 'application/json',
        },
      });
    }
  }
}
