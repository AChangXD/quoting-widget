import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Quote } from './types';

let quotes: Quote[] = [];

// Adding new files:
export async function POST(request: Request) {
  const reqBody = await request.json();

  if (reqBody && reqBody.quote) {
    const newQuote = { ...reqBody.quote, id: quotes.length + 1 };
    quotes.push(newQuote);
    // TODO: Logic to update the inventory in DB.
    // TODO: Logic to update the RFQ in DB to mark it as quoted.
    return NextResponse.json({ quote: newQuote }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
}
