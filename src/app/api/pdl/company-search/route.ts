import { NextRequest, NextResponse } from 'next/server';
import { companySearchAPI } from '@/lib/pdl-client';
import { mapPdlToCompany } from '@/lib/pdl-mapper';
import { CompanySearchResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Call PDL API
    const pdlResponse = await companySearchAPI(body);

    // Narrow unknown -> array of the mapper's input type
    type PdlCompanyLike = Parameters<typeof mapPdlToCompany>[0];
    const rows: PdlCompanyLike[] = Array.isArray(pdlResponse.data)
      ? (pdlResponse.data as PdlCompanyLike[])
      : [];

    // Map PDL response to your CompanySearchResult type
    const searchResult: CompanySearchResult = {
      companies: rows.map(mapPdlToCompany),
      total: typeof pdlResponse.total === 'number' ? pdlResponse.total : rows.length,
      scroll_token: pdlResponse.scroll_token,
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error('Company search error:', error);
    return NextResponse.json({ error: 'Company Search Error' }, { status: 400 });
  }
}