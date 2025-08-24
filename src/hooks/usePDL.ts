import { useState } from 'react';

export function usePDL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Person Search
type PersonSearchParams = Record<string, unknown>;
type SearchResultLike = { error?: string } & Record<string, unknown>;

const searchPersons = async (
    params: PersonSearchParams
    ): Promise<SearchResultLike> => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch("/api/pdl/person-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
        });

        const data = (await response.json()) as SearchResultLike;
        if (!response.ok) throw new Error(data?.error || "Person search failed");
        return data;
    } catch (err) {
        console.error("Person search error:", err);
        setError("Person search error:");
        throw err;
    } finally {
        setLoading(false);
    }
};

  // Person Enrichment
type PersonEnrichmentParams = {
  linkedin?: string;
  email?: string;
  phone?: string;
  name?: string;
  company?: string;
};

type PersonEnrichmentResult = Record<string, unknown> & { error?: string };

const enrichPerson = async (
  params: PersonEnrichmentParams
): Promise<PersonEnrichmentResult> => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/pdl/person-enrichment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = (await response.json()) as PersonEnrichmentResult;
    if (!response.ok) throw new Error((data as { error?: string }).error as string);
    return data;
  } catch (err) {
    console.error('Person Enrichment error:', err);
    setError('Person Enrichment error');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Company Search
type CompanySearchParams = {
  sql?: string;
  name?: string;
  website?: string;
  industry?: string;
  location?: string;
  size?: string;
  founded?: string | number;
  limit?: number;
  scroll_token?: string;
};

type CompanySearchResultLike = Record<string, unknown> & { error?: string };

const searchCompanies = async (
  params: CompanySearchParams
): Promise<CompanySearchResultLike> => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/pdl/company-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = (await response.json()) as CompanySearchResultLike;
    if (!response.ok) throw new Error(data?.error || 'Company search failed');
    return data;
  } catch (err) {
    console.error('Company Search error:', err);
    setError('Company Search error');
    throw err;
  } finally {
    setLoading(false);
  }
};

  // Company Enrichment
type CompanyEnrichmentParams = {
  domain?: string;   // website
  name?: string;
  ticker?: string;
  linkedin?: string; // profile URL
};

type CompanyEnrichmentResult = Record<string, unknown> & { error?: string };

const enrichCompany = async (
  params: CompanyEnrichmentParams
): Promise<CompanyEnrichmentResult> => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/pdl/company-enrichment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = (await response.json()) as CompanyEnrichmentResult;
    if (!response.ok) throw new Error(data?.error || 'Company enrichment failed');
    return data;
  } catch (err) {
    console.error('Company Enrichment error:', err);
    setError('Company Enrichment error:');
    throw err;
  } finally {
    setLoading(false);
  }
};


  // Person Identify
type PersonIdentifyParams = {
  ip?: string;
  cookie?: string;
  email?: string;
  phone?: string;
};

type PersonIdentifyResult = Record<string, unknown> & { error?: string };

const identifyPerson = async (
  params: PersonIdentifyParams
): Promise<PersonIdentifyResult> => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch('/api/pdl/person-identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = (await response.json()) as PersonIdentifyResult;
    if (!response.ok) throw new Error(data?.error || 'Person identify failed');
    return data;
  } catch (err) {
    console.error('Person Identify error:', err);
    setError('Person Identify error:');
    throw err;
  } finally {
    setLoading(false);
  }
};


  return {
    loading,
    error,
    searchPersons,
    enrichPerson,
    searchCompanies,
    enrichCompany,
    identifyPerson,
  };
}