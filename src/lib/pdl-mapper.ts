import { Candidate, Company } from './types';

/**
 * Maps PDL person data to your Candidate interface
 */
type PdlPersonLike = {
  id?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  job_title_role?: string;
  job_company_name?: string;
  location_name?: string;
  linkedin_url?: string;
  github_url?: string;
  emails?: string[];
  phone_numbers?: string[];
  experience?: unknown[];
  skills?: string[];
  location_locality?: string;
  location_region?: string;
  location_country?: string;
};

export function mapPdlToCandidate(pdlPerson: PdlPersonLike): Candidate {
  return {
    id: pdlPerson.id || generateId(),
    full_name:
      pdlPerson.full_name ||
      `${pdlPerson.first_name || ''} ${pdlPerson.last_name || ''}`.trim(),
    job_title: pdlPerson.job_title || pdlPerson.job_title_role,
    job_company_name: pdlPerson.job_company_name,
    location_name: pdlPerson.location_name || formatLocation(pdlPerson),
    linkedin_url: pdlPerson.linkedin_url,
    github_url: pdlPerson.github_url,
    emails: pdlPerson.emails || [],
    phone_numbers: pdlPerson.phone_numbers || [],
    experience: pdlPerson.experience || [],
    skills: pdlPerson.skills || [],
  };
}

/**
 * Maps PDL company data to your Company interface
 */
type PdlCompanyLike = {
  id?: string;
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: { name?: string } | string;
  linkedin_url?: string;
  summary?: string;
  founded?: string | number | undefined;
  employee_count?: number;
  [key: string]: unknown;
};

export function mapPdlToCompany(pdlCompany: PdlCompanyLike): Company {
  return {
    id: pdlCompany.id || generateId(),
    // keep logic; cast to satisfy strict Company types
    name: pdlCompany.name as Company['name'],
    domain: pdlCompany.website,
    industry: pdlCompany.industry,
    size: pdlCompany.size,
    // same logic as before, just typed & casted
    location: (
      (pdlCompany.location as { name?: string } | undefined)?.name ||
      (pdlCompany.location as string | undefined)
    ) as Company['location'],
    linkedin_url: pdlCompany.linkedin_url,
    description: pdlCompany.summary,
    founded: pdlCompany.founded as Company['founded'],
    employee_count: pdlCompany.employee_count,
  };
}

/**
 * Helper function to format location from PDL data
 */
type PdlLocationLike = {
  location_locality?: string;
  location_region?: string;
  location_country?: string;
};

function formatLocation(pdlPerson: PdlLocationLike): string {
  const parts: string[] = [];
  if (pdlPerson.location_locality) parts.push(pdlPerson.location_locality);
  if (pdlPerson.location_region) parts.push(pdlPerson.location_region);
  if (pdlPerson.location_country) parts.push(pdlPerson.location_country);
  return parts.join(', ');
}

/**
 * Generate a unique ID if PDL doesn't provide one
 */
function generateId(): string {
  return `pdl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}