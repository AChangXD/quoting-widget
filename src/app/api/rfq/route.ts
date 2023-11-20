import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import rfqData from './rfq.json';
import { Rfq } from './types';

let data: Rfq[] = rfqData;

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
    const matchingRfq = data.find((rfq) => rfq.id === Number(id));
    if (matchingRfq) {
      return new Response(JSON.stringify(matchingRfq), {
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
