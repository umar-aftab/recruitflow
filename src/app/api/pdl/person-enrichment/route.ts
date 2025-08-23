import { NextRequest, NextResponse } from 'next/server';
import { personEnrichmentAPI } from '@/lib/pdl-client';
import { mapPdlToCandidate } from '@/lib/pdl-mapper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Call PDL API
    const pdlResponse = await personEnrichmentAPI(body);
    
    // Map to Candidate if data exists
    if (pdlResponse.data) {
      const candidate = mapPdlToCandidate(pdlResponse.data);
      return NextResponse.json({ 
        candidate,
        likelihood: pdlResponse.likelihood 
      });
    }
    
    return NextResponse.json({ 
      candidate: null,
      likelihood: pdlResponse.likelihood || 0 
    });
  } catch (error: any) {
    console.error('Person enrichment error:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 400 }
    );
  }
}