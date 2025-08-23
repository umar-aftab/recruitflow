import { useState } from 'react';

export function usePDL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Person Search
  const searchPersons = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pdl/person-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Person Enrichment
  const enrichPerson = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pdl/person-enrichment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Company Search
  const searchCompanies = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pdl/company-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Company Enrichment
  const enrichCompany = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pdl/company-enrichment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Person Identify
  const identifyPerson = async (params: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pdl/person-identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (err: any) {
      setError(err.message);
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