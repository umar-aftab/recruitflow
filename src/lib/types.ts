// Keep your existing interfaces exactly as they are
export interface Candidate {
  id: string;
  full_name: string;
  job_title?: string;
  job_company_name?: string;
  location_name?: string;
  linkedin_url?: string;
  github_url?: string;
  emails?: string[];
  phone_numbers?: string[];
  experience?: any[];
  skills?: string[];
}

export interface SearchFilters {
  role: string;
  companies: string[];
  locations: string[];
  level?: string;
  mustHaveEmail?: boolean;
  mustHavePhone?: boolean;
  size: number;
}

export interface SearchResult {
  candidates: Candidate[];
  total: number;
  scroll_token?: string;
}

// Add company-specific types
export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  linkedin_url?: string;
  description?: string;
  founded?: number;
  employee_count?: number;
}

export interface CompanySearchResult {
  companies: Company[];
  total: number;
  scroll_token?: string;
}