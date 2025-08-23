import { NextRequest, NextResponse } from 'next/server';
import { personSearchAPI } from '@/lib/pdl-client';
import { mapPdlToCandidate } from '@/lib/pdl-mapper';
import { SearchResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Call PDL API
    const pdlResponse = await personSearchAPI(body);
    
    // Map PDL response to your SearchResult type
    const searchResult: SearchResult = {
      candidates: (pdlResponse.data || []).map(mapPdlToCandidate),
      total: pdlResponse.total || pdlResponse.data?.length || 0,
      scroll_token: pdlResponse.scroll_token,
    };
    
    return NextResponse.json(searchResult);
  } catch (error: any) {
    console.error('Person search error:', error);
    return NextResponse.json(
      { error: error.message }, 
      { status: 400 }
    );
  }
}