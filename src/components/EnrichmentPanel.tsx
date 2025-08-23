'use client';

import { useState } from 'react';
import { UserPlus, Building2, Search } from 'lucide-react';

interface EnrichmentPanelProps {
  onEnrichPerson: (data: any) => void;
  onEnrichCompany: (data: any) => void;
  loading: boolean;
}

export default function EnrichmentPanel({ 
  onEnrichPerson, 
  onEnrichCompany, 
  loading 
}: EnrichmentPanelProps) {
  const [enrichType, setEnrichType] = useState<'person' | 'company'>('person');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');

  const handleEnrich = () => {
    if (enrichType === 'person') {
      onEnrichPerson({ linkedin: linkedinUrl, email });
    } else {
      onEnrichCompany({ domain });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Enrichment
      </h3>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg mb-4">
        <button
          onClick={() => setEnrichType('person')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition ${
            enrichType === 'person' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Person
        </button>
        <button
          onClick={() => setEnrichType('company')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition ${
            enrichType === 'company' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company
        </button>
      </div>

      {enrichType === 'person' ? (
        <div className="space-y-3">
          <input
            type="text"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="LinkedIn URL (e.g., linkedin.com/in/johndoe)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      ) : (
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Company domain (e.g., google.com)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      )}

      <button
        onClick={handleEnrich}
        disabled={loading || (!linkedinUrl && !email && !domain)}
        className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Enriching...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Enrich
          </>
        )}
      </button>
    </div>
  );
}