import { NextRequest, NextResponse } from 'next/server';
import { ipEnrichmentAPI } from '@/lib/pdl-client';

export async function POST(req: NextRequest) {
  try {
    const { ip } = await req.json();
    const data = await ipEnrichmentAPI(ip);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 400 }
    );
  }
}