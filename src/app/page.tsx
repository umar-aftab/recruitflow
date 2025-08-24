'use client';

import { useState, useEffect } from 'react';
import { Candidate, Company, SearchFilters } from '@/lib/types';
import EnhancedSearchForm from '@/components/EnhancedSearchForm';
import CandidateList from '@/components/CandidateList';
import CompanyList from '@/components/CompanyList';
import EnrichmentPanel from '@/components/EnrichmentPanel';
import Statistics from '@/components/Statistics';
import { Users, Building2, Sparkles, Database } from 'lucide-react';

// Define proper types for the parameters
interface CompanySearchParams {
  industry?: string;
  size?: string;
  location?: string;
  limit?: number;
}

interface PersonEnrichParams {
  linkedin?: string;
  email?: string;
}

interface CompanyEnrichParams {
  domain?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'candidates' | 'companies'>('candidates');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    linkedinProfiles: 0,
    githubProfiles: 0,
    searchesPerformed: 0,
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('recruitflow_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const handlePersonSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    setActiveTab('candidates');

    try {
      const response = await fetch('/api/pdl/person-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setCandidates(data.candidates || []);

      // Update statistics
      const newStats = {
        totalCandidates: stats.totalCandidates + (data.candidates?.length || 0),
        linkedinProfiles: stats.linkedinProfiles + (data.candidates?.filter((c: Candidate) => c.linkedin_url).length || 0),
        githubProfiles: stats.githubProfiles + (data.candidates?.filter((c: Candidate) => c.github_url).length || 0),
        searchesPerformed: stats.searchesPerformed + 1,
      };
      setStats(newStats);
      localStorage.setItem('recruitflow_stats', JSON.stringify(newStats));
    } catch (err) {
      setError("Error occurred during search");
      console.error('Person search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySearch = async (filters: CompanySearchParams) => {
    setLoading(true);
    setError(null);
    setActiveTab('companies');

    try {
      const response = await fetch('/api/pdl/company-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setCompanies(data.companies || []);
    } catch (err) {
      setError("Error occurred during company search");
      console.error('Company search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonEnrichment = async (params: PersonEnrichParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pdl/person-enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Enrichment failed');
      }

      if (data.candidate) {
        // Add enriched candidate to the list
        setCandidates([data.candidate, ...candidates]);
        setActiveTab('candidates');
      }
    } catch (err) {
      setError("Error occurred during enrichment");
      console.error('Person enrichment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyEnrichment = async (params: CompanyEnrichParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pdl/company-enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Enrichment failed');
      }

      if (data.company) {
        // Add enriched company to the list
        setCompanies([data.company, ...companies]);
        setActiveTab('companies');
      }
    } catch (err) {
      setError("Error occurred during company enrichment");
      console.error('Company enrichment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = async (company: Company) => {
    // When a company is selected, search for people in that company
    await handlePersonSearch({
      role: '',
      companies: [company.name],
      locations: [],
      size: 25,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RecruitFlow Discovery</h1>
                <p className="text-sm text-gray-600">AI-Powered Talent & Company Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Powered by People Data Labs
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Fixed Layout */}
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Fixed width on large screens */}
          <div className="xl:col-span-3 space-y-6">
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Discovery Filters</h2>
              <EnhancedSearchForm 
                onPersonSearch={handlePersonSearch}
                onCompanySearch={handleCompanySearch}
                loading={loading} 
              />
            </div>

            {/* Enrichment Panel */}
            <EnrichmentPanel
              onEnrichPerson={handlePersonEnrichment}
              onEnrichCompany={handleCompanyEnrichment}
              loading={loading}
            />
          </div>

          {/* Right Content - Results */}
          <div className="xl:col-span-9 space-y-6">
            {/* Statistics */}
            <Statistics {...stats} />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Results Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('candidates')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
                      activeTab === 'candidates'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Candidates
                    {candidates.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                        {candidates.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('companies')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition ${
                      activeTab === 'companies'
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    Companies
                    {companies.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                        {companies.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'candidates' ? (
                  <CandidateList candidates={candidates} loading={loading} />
                ) : (
                  <CompanyList 
                    companies={companies} 
                    loading={loading}
                    onSelectCompany={handleSelectCompany}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}