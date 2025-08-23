'use client';

import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Candidate, Company } from '@/lib/types';

interface ExportButtonProps {
  data: Candidate[] | Company[];
  type: 'candidates' | 'companies';
}

export default function ExportButton({ data, type }: ExportButtonProps) {
  const exportToCSV = () => {
    if (data.length === 0) return;

    let csv = '';
    
    if (type === 'candidates') {
      // CSV headers for candidates
      csv = 'Name,Job Title,Company,Location,LinkedIn,GitHub,Email,Phone\n';
      
      (data as Candidate[]).forEach((candidate) => {
        csv += `"${candidate.full_name}",`;
        csv += `"${candidate.job_title || ''}",`;
        csv += `"${candidate.job_company_name || ''}",`;
        csv += `"${candidate.location_name || ''}",`;
        csv += `"${candidate.linkedin_url || ''}",`;
        csv += `"${candidate.github_url || ''}",`;
        csv += `"${candidate.emails?.join('; ') || ''}",`;
        csv += `"${candidate.phone_numbers?.join('; ') || ''}"\n`;
      });
    } else {
      // CSV headers for companies
      csv = 'Name,Domain,Industry,Size,Location,LinkedIn,Employees,Founded\n';
      
      (data as Company[]).forEach((company) => {
        csv += `"${company.name}",`;
        csv += `"${company.domain || ''}",`;
        csv += `"${company.industry || ''}",`;
        csv += `"${company.size || ''}",`;
        csv += `"${company.location || ''}",`;
        csv += `"${company.linkedin_url || ''}",`;
        csv += `"${company.employee_count || ''}",`;
        csv += `"${company.founded || ''}"\n`;
      });
    }

    // Download the CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    if (data.length === 0) return;

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (data.length === 0) return null;

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Export CSV
      </button>
      <button
        onClick={exportToJSON}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
      >
        <FileText className="w-4 h-4" />
        Export JSON
      </button>
    </div>
  );
}