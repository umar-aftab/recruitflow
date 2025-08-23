import { NextRequest, NextResponse } from 'next/server';
import { ipEnrichmentAPI } from '@/lib/pdl-client';

export async function POST(req: NextRequest) {
  try {
    const { ip } = await req.json();
    const data = await ipEnrichmentAPI(ip);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 400 }
    );
  }
}