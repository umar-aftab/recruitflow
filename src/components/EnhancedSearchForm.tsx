'use client';

import { useState } from 'react';
import { Search, Building2, Users, Plus, X } from 'lucide-react';
import { SearchFilters } from '@/lib/types';

interface EnhancedSearchFormProps {
  onPersonSearch: (filters: SearchFilters) => void;
  onCompanySearch: (filters: any) => void;
  loading: boolean;
}

export default function EnhancedSearchForm({ 
  onPersonSearch, 
  onCompanySearch, 
  loading 
}: EnhancedSearchFormProps) {
  const [searchType, setSearchType] = useState<'person' | 'company'>('person');
  const [role, setRole] = useState('');
  const [companies, setCompanies] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [companyInput, setCompanyInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [size, setSize] = useState(10);
  const [level, setLevel] = useState('');
  const [mustHaveEmail, setMustHaveEmail] = useState(true);
  const [mustHavePhone, setMustHavePhone] = useState(false);
  
  // Company search specific
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');

  const addCompany = () => {
    if (companyInput.trim() && !companies.includes(companyInput.trim())) {
      setCompanies([...companies, companyInput.trim()]);
      setCompanyInput('');
    }
  };

  const addLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()]);
      setLocationInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchType === 'person') {
      onPersonSearch({
        role,
        companies,
        locations,
        level,
        mustHaveEmail,
        mustHavePhone,
        size,
      });
    } else {
      onCompanySearch({
        industry,
        size: companySize,
        location: locations[0], // Use first location for company search
        limit: size,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Search Type Toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          type="button"
          onClick={() => setSearchType('person')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
            searchType === 'person' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          People Search
        </button>
        <button
          type="button"
          onClick={() => setSearchType('company')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
            searchType === 'company' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Company Search
        </button>
      </div>

      {searchType === 'person' ? (
        <>
          {/* Person Search Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Role *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., engineering, sales, marketing"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seniority Level (Optional)
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Any Level</option>
              <option value="entry">Entry</option>
              <option value="senior">Senior</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
              <option value="vp">VP</option>
              <option value="cxo">C-Level</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Companies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                placeholder="Type company name and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addCompany}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {companies.map((company) => (
                <span
                  key={company}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {company}
                  <button
                    type="button"
                    onClick={() => setCompanies(companies.filter(c => c !== company))}
                    className="hover:text-purple-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={mustHaveEmail}
                onChange={(e) => setMustHaveEmail(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Must have email</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={mustHavePhone}
                onChange={(e) => setMustHavePhone(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Must have phone</span>
            </label>
          </div>
        </>
      ) : (
        <>
          {/* Company Search Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., technology, healthcare, finance"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Size
            </label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Any Size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1001-5000">1001-5000 employees</option>
              <option value="5001+">5000+ employees</option>
            </select>
          </div>
        </>
      )}

      {/* Shared Fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Locations (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
            placeholder="e.g., Canada, California, New York"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addLocation}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <span
              key={location}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {location}
              <button
                type="button"
                onClick={() => setLocations(locations.filter(l => l !== location))}
                className="hover:text-blue-900"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Results Size
        </label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value={10}>10 results (Quick test)</option>
          <option value={25}>25 results</option>
          <option value={50}>50 results</option>
          <option value={100}>100 results (Max)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading || (searchType === 'person' && !role)}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Start {searchType === 'person' ? 'People' : 'Company'} Discovery
          </>
        )}
      </button>
    </form>
  );
}