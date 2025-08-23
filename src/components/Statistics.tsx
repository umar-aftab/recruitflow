'use client';

import { Users, Link, Github, TrendingUp } from 'lucide-react';

interface StatisticsProps {
  totalCandidates: number;
  linkedinProfiles: number;
  githubProfiles: number;
  searchesPerformed: number;
}

export default function Statistics({
  totalCandidates,
  linkedinProfiles,
  githubProfiles,
  searchesPerformed,
}: StatisticsProps) {
  const stats = [
    {
      label: 'Total Candidates',
      value: totalCandidates,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'LinkedIn Profiles',
      value: linkedinProfiles,
      icon: Link,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'GitHub Profiles',
      value: githubProfiles,
      icon: Github,
      color: 'from-gray-600 to-gray-800',
    },
    {
      label: 'Searches Today',
      value: searchesPerformed,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}