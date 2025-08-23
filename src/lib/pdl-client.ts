// Complete PDL Client with all APIs from your dashboard

const BASE_URL = process.env.PDL_BASE_URL || 'https://api.peopledatalabs.com/v5';
const API_KEY = process.env.PDL_API_KEY;

if (!API_KEY) throw new Error('Missing PDL_API_KEY environment variable');

const commonHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Api-Key': API_KEY,
};

// Types
export interface PdlResponse<T = any> {
  status: number;
  data: T;
  likelihood?: number;
  scroll_token?: string;
  total?: number;
  error?: string;
}

export interface PersonSearchParams {
  sql?: string;
  role?: string;
  level?: string;
  country?: string;
  region?: string;
  locality?: string;
  companies?: string[];
  skills?: string[];
  mustHavePhone?: boolean;
  mustHaveEmail?: boolean;
  size?: number;
  scroll_token?: string;
}

export interface CompanySearchParams {
  sql?: string;
  name?: string;
  website?: string;
  industry?: string;
  location?: string;
  size?: string;
  founded?: string;
  scroll_token?: string;
  limit?: number;
}

// ==========================================
// API 1: PERSON ENRICHMENT API
// ==========================================
export async function personEnrichmentAPI(params: {
  linkedin?: string;
  email?: string;
  phone?: string;
  name?: string;
  company?: string;
}) {
  console.log('🔍 Calling Person Enrichment API...');
  
  const url = new URL(`${BASE_URL}/person/enrich`);
  
  // Add parameters based on what's provided
  if (params.linkedin) url.searchParams.set('profile', params.linkedin);
  if (params.email) url.searchParams.set('email', params.email);
  if (params.phone) url.searchParams.set('phone', params.phone);
  if (params.name && params.company) {
    url.searchParams.set('name', params.name);
    url.searchParams.set('company', params.company);
  }
  
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: commonHeaders,
      cache: 'no-store',
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || `Person enrichment failed: ${res.status}`);
    }
    
    return json as PdlResponse;
  } catch (error) {
    console.error('❌ Person Enrichment API Error:', error);
    throw error;
  }
}

// ==========================================
// API 2: PERSON SEARCH API
// ==========================================
export async function personSearchAPI(params: PersonSearchParams) {
  console.log('🔍 Calling Person Search API...');
  
  const { 
    sql,
    role, 
    level, 
    country, 
    region, 
    locality, 
    companies,
    skills,
    mustHavePhone,
    mustHaveEmail,
    size = 10,
    scroll_token 
  } = params;

  let finalSql = sql;
  
  // Build SQL if not provided
  if (!sql) {
    const parts: string[] = [];
    
    if (country) parts.push(`location_country='${escapeSql(country)}'`);
    if (region) parts.push(`location_region='${escapeSql(region)}'`);
    if (locality) parts.push(`location_locality='${escapeSql(locality)}'`);
    if (role) parts.push(`job_title_role='${escapeSql(role)}'`);
    if (level) parts.push(`job_title_levels='${escapeSql(level)}'`);
    if (mustHavePhone) parts.push(`EXISTS phone_numbers`);
    if (mustHaveEmail) parts.push(`EXISTS emails`);
    
    if (skills && skills.length > 0) {
      const skillsCondition = skills.map(s => `skills='${escapeSql(s)}'`).join(' OR ');
      parts.push(`(${skillsCondition})`);
    }
    
    if (companies && companies.length > 0) {
      const companiesCondition = companies.map(c => `job_company_name='${escapeSql(c)}'`).join(' OR ');
      parts.push(`(${companiesCondition})`);
    }

    const where = parts.length ? `WHERE ${parts.join(' AND ')}` : '';
    finalSql = `SELECT * FROM person ${where}`;
  }

  const body: any = { 
    sql: finalSql, 
    size: clampSize(size), 
    titlecase: true 
  };
  
  if (scroll_token) body.scroll_token = scroll_token;

  try {
    const res = await fetch(`${BASE_URL}/person/search`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || `Person search failed: ${res.status}`);
    }
    
    console.log(`✅ Found ${json.data?.length || 0} candidates`);
    return json as PdlResponse<any[]>;
  } catch (error) {
    console.error('❌ Person Search API Error:', error);
    throw error;
  }
}

// ==========================================
// API 3: PERSON IDENTIFY API
// ==========================================
export async function personIdentifyAPI(params: {
  ip?: string;
  cookie?: string;
  email?: string;
  phone?: string;
}) {
  console.log('🔍 Calling Person Identify API...');
  
  const body: any = {};
  
  if (params.ip) body.ip = params.ip;
  if (params.cookie) body.cookie = params.cookie;
  if (params.email) body.email = params.email;
  if (params.phone) body.phone = params.phone;
  
  try {
    const res = await fetch(`${BASE_URL}/person/identify`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || `Person identify failed: ${res.status}`);
    }
    
    return json as PdlResponse;
  } catch (error) {
    console.error('❌ Person Identify API Error:', error);
    throw error;
  }
}

// ==========================================
// API 4: COMPANY ENRICHMENT API
// ==========================================
export async function companyEnrichmentAPI(params: {
  domain?: string;
  name?: string;
  ticker?: string;
  linkedin?: string;
}) {
  console.log('🔍 Calling Company Enrichment API...');
  
  const url = new URL(`${BASE_URL}/company/enrich`);
  
  // Add parameters based on what's provided
  if (params.domain) url.searchParams.set('website', params.domain);
  if (params.name) url.searchParams.set('name', params.name);
  if (params.ticker) url.searchParams.set('ticker', params.ticker);
  if (params.linkedin) url.searchParams.set('profile', params.linkedin);
  
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: commonHeaders,
      cache: 'no-store',
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || `Company enrichment failed: ${res.status}`);
    }
    
    return json as PdlResponse;
  } catch (error) {
    console.error('❌ Company Enrichment API Error:', error);
    throw error;
  }
}

// ==========================================
// API 5: COMPANY SEARCH API
// ==========================================
export async function companySearchAPI(params: CompanySearchParams) {
  console.log('🔍 Calling Company Search API...');
  
  const { 
    sql,
    name,
    website,
    industry,
    location,
    size,
    founded,
    limit = 10,
    scroll_token 
  } = params;

  let finalSql = sql;
  
  // Build SQL if not provided
  if (!sql) {
    const parts: string[] = [];
    
    if (name) parts.push(`name='${escapeSql(name)}'`);
    if (website) parts.push(`website='${escapeSql(website)}'`);
    if (industry) parts.push(`industry='${escapeSql(industry)}'`);
    if (location) parts.push(`location.name='${escapeSql(location)}'`);
    if (size) parts.push(`size='${escapeSql(size)}'`);
    if (founded) parts.push(`founded='${escapeSql(founded)}'`);

    const where = parts.length ? `WHERE ${parts.join(' AND ')}` : '';
    finalSql = `SELECT * FROM company ${where}`;
  }

  const body: any = { 
    sql: finalSql, 
    size: clampSize(limit),
  };
  
  if (scroll_token) body.scroll_token = scroll_token;

  try {
    const res = await fetch(`${BASE_URL}/company/search`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || `Company search failed: ${res.status}`);
    }
    
    console.log(`✅ Found ${json.data?.length || 0} companies`);
    return json as PdlResponse<any[]>;
  } catch (error) {
    console.error('❌ Company Search API Error:', error);
    throw error;
  }
}

// ==========================================
// BONUS: IP ENRICHMENT API
// ==========================================
export async function ipEnrichmentAPI(ip: string) {
  console.log('🔍 Calling IP Enrichment API...');
  
  const url = new URL(`${BASE_URL}/ip/enrich`);
  url.searchParams.set('ip', ip);
  
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: commonHeaders,
      cache: 'no-store',
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || `IP enrichment failed: ${res.status}`);
    }
    
    return json as PdlResponse;
  } catch (error) {
    console.error('❌ IP Enrichment API Error:', error);
    throw error;
  }
}

// ==========================================
// BONUS: JOB TITLE ENRICHMENT API
// ==========================================
export async function jobTitleEnrichmentAPI(jobTitle: string) {
  console.log('🔍 Calling Job Title Enrichment API...');
  
  const url = new URL(`${BASE_URL}/job_title/enrich`);
  url.searchParams.set('job_title', jobTitle);
  
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: commonHeaders,
      cache: 'no-store',
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || `Job title enrichment failed: ${res.status}`);
    }
    
    return json as PdlResponse;
  } catch (error) {
    console.error('❌ Job Title Enrichment API Error:', error);
    throw error;
  }
}

// ==========================================
// BULK OPERATIONS
// ==========================================
export async function bulkPersonEnrichment(requests: Array<{
  linkedin?: string;
  email?: string;
  phone?: string;
}>) {
  console.log(`🔍 Bulk enriching ${requests.length} persons...`);
  
  const payload = {
    requests: requests.slice(0, 100).map(req => ({
      params: {
        profile: req.linkedin,
        email: req.email,
        phone: req.phone,
      }
    }))
  };
  
  try {
    const res = await fetch(`${BASE_URL}/person/enrich/bulk`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(payload),
    });
    
    const json = await res.json();
    
    if (!res.ok) {
      throw new Error(json?.error || 'Bulk enrichment failed');
    }
    
    return json as Array<{ status: number; data?: any; error?: any }>;
  } catch (error) {
    console.error('❌ Bulk Person Enrichment Error:', error);
    throw error;
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function escapeSql(s: string): string {
  return s.replace(/'/g, "''");
}

function clampSize(n?: number): number {
  const def = Number(process.env.PDL_DEFAULT_SIZE || 10);
  return Math.max(1, Math.min(Number(n ?? def), 100));
}

// ==========================================
// CREDIT TRACKING
// ==========================================
export async function checkRemainingCredits(response: Response) {
  const remainingCredits = response.headers.get('X-RateLimit-Remaining');
  const creditLimit = response.headers.get('X-RateLimit-Limit');
  
  if (remainingCredits && creditLimit) {
    console.log(`📊 Credits: ${remainingCredits}/${creditLimit} remaining`);
    return {
      remaining: parseInt(remainingCredits),
      limit: parseInt(creditLimit),
    };
  }
  
  return null;
}