'use client';

import { ExternalLink, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

interface CandidateListProps {
  candidates: any[];
  loading: boolean;
}

export default function CandidateList({ candidates, loading }: CandidateListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Discovering candidates...</p>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-2">No candidates discovered yet</p>
        <p className="text-sm">Start a search to find potential candidates</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {candidates.map((candidate, index) => (
        <div
          key={candidate.id || index}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {candidate.full_name || 'Name not available'}
              </h3>
              
              {candidate.job_title && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">
                    {candidate.job_title}
                    {candidate.job_company_name && ` at ${candidate.job_company_name}`}
                  </span>
                </div>
              )}
              
              {candidate.location_name && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{candidate.location_name}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-3">
                {candidate.linkedin_url && (
                  <a
                    href={candidate.linkedin_url.startsWith('http') ? candidate.linkedin_url : `https://${candidate.linkedin_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                
                {candidate.github_url && (
                  <a
                    href={candidate.github_url.startsWith('http') ? candidate.github_url : `https://${candidate.github_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                
                {candidate.emails && candidate.emails.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                    <Mail className="w-4 h-4" />
                    Has Email
                  </span>
                )}
                
                {candidate.phone_numbers && candidate.phone_numbers.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                    <Phone className="w-4 h-4" />
                    Has Phone
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}