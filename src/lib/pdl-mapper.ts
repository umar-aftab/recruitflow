import { Candidate, Company } from './types';

/**
 * Maps PDL person data to your Candidate interface
 */
export function mapPdlToCandidate(pdlPerson: any): Candidate {
  return {
    id: pdlPerson.id || generateId(),
    full_name: pdlPerson.full_name || `${pdlPerson.first_name || ''} ${pdlPerson.last_name || ''}`.trim(),
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
export function mapPdlToCompany(pdlCompany: any): Company {
  return {
    id: pdlCompany.id || generateId(),
    name: pdlCompany.name,
    domain: pdlCompany.website,
    industry: pdlCompany.industry,
    size: pdlCompany.size,
    location: pdlCompany.location?.name || pdlCompany.location,
    linkedin_url: pdlCompany.linkedin_url,
    description: pdlCompany.summary,
    founded: pdlCompany.founded,
    employee_count: pdlCompany.employee_count,
  };
}

/**
 * Helper function to format location from PDL data
 */
function formatLocation(pdlPerson: any): string {
  const parts = [];
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