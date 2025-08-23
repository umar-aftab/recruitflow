'use client';

import { ExternalLink, Globe, Users, MapPin, Calendar } from 'lucide-react';
import { Company } from '@/lib/types';

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  onSelectCompany?: (company: Company) => void;
}

export default function CompanyList({ companies, loading, onSelectCompany }: CompanyListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Discovering companies...</p>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No companies found</p>
        <p className="text-sm">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {companies.map((company) => (
        <div
          key={company.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectCompany?.(company)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {company.name}
              </h3>
              
              {company.industry && (
                <p className="text-sm text-gray-600 mt-1">
                  {company.industry}
                </p>
              )}
              
              {company.description && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {company.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                {company.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </div>
                )}
                
                {company.employee_count && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.employee_count.toLocaleString()} employees
                  </div>
                )}
                
                {company.founded && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Founded {company.founded}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-3">
                {company.domain && (
                  <a
                    href={`https://${company.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}