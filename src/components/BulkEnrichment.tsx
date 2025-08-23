'use client';

import { useState } from 'react';
import { Upload, Users, AlertCircle } from 'lucide-react';

interface BulkEnrichmentProps {
  onBulkEnrich: (data: string[]) => void;
  loading: boolean;
}

export default function BulkEnrichment({ onBulkEnrich, loading }: BulkEnrichmentProps) {
  const [textInput, setTextInput] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setFileError('Please upload a CSV or TXT file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      // Extract LinkedIn URLs or emails from the text
      const items = lines.map(line => {
        // Check if it's a LinkedIn URL
        if (line.includes('linkedin.com')) {
          return line.trim();
        }
        // Check if it's an email
        if (line.includes('@')) {
          return line.trim();
        }
        return null;
      }).filter(Boolean) as string[];

      if (items.length > 0) {
        onBulkEnrich(items);
        setFileError(null);
      } else {
        setFileError('No valid LinkedIn URLs or emails found in the file');
      }
    };
    reader.readAsText(file);
  };

  const handleTextSubmit = () => {
    const lines = textInput.split('\n').filter(line => line.trim());
    const items = lines.map(line => line.trim());
    
    if (items.length > 0) {
      onBulkEnrich(items);
      setTextInput('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Bulk Enrichment
      </h3>

      <div className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload CSV/TXT File
          </label>
          <div className="relative">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 cursor-pointer transition"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                Click to upload or drag and drop
              </span>
            </label>
          </div>
          {fileError && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {fileError}
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste LinkedIn URLs or Emails (one per line)
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="linkedin.com/in/johndoe&#10;john@example.com&#10;linkedin.com/in/janedoe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-32 font-mono"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleTextSubmit}
          disabled={loading || !textInput.trim()}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              Enrich Bulk Profiles
            </>
          )}
        </button>
      </div>
    </div>
  );
}