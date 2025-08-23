import { NextRequest, NextResponse } from 'next/server';
import { jobTitleEnrichmentAPI } from '@/lib/pdl-client';

export async function POST(req: NextRequest) {
  try {
    const { jobTitle } = await req.json();
    const data = await jobTitleEnrichmentAPI(jobTitle);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 400 }
    );
  }
}