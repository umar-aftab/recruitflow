import { NextRequest, NextResponse } from 'next/server';
import { personSearchAPI } from '@/lib/pdl-client';
import { mapPdlToCandidate } from '@/lib/pdl-mapper';
import { SearchResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Call PDL API
    const pdlResponse = await personSearchAPI(body);

    // Narrow unknown -> array of the mapper's input type
    type PdlPersonLike = Parameters<typeof mapPdlToCandidate>[0];
    const rows: PdlPersonLike[] = Array.isArray(pdlResponse.data)
      ? (pdlResponse.data as PdlPersonLike[])
      : [];

    // Map PDL response to your SearchResult type
    const searchResult: SearchResult = {
      candidates: rows.map(mapPdlToCandidate),
      total: typeof pdlResponse.total === 'number' ? pdlResponse.total : rows.length,
      scroll_token: pdlResponse.scroll_token,
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error('Person search error:', error);
    return NextResponse.json({ error: 'Person Search Error' }, { status: 400 });
  }
}