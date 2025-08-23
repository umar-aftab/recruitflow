import { NextRequest, NextResponse } from 'next/server';
import { companyEnrichmentAPI } from '@/lib/pdl-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await companyEnrichmentAPI(body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 400 }
    );
  }
}