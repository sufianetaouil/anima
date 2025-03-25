'use client';

import { useState } from "react";
import { toast } from 'sonner';

interface DashboardClientProps {
  stats: {
    employersCount: number;
    employeesCount: number;
    jobsCount: number;
    refundsCount: number;
  };
}

export function DashboardClient({ stats }: DashboardClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/backup', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create backup');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Backup created and downloaded successfully');
    } catch (error) {
      console.error('Backup failed:', error);
      toast.error('Failed to create backup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Employers</h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.employersCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Employees</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.employeesCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Active Jobs</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{stats.jobsCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Refunds</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.refundsCount}</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Database Backup</h2>
            <p className="mt-1 text-gray-500">Create and download a backup of the database</p>
          </div>
          <button
            onClick={handleBackup}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Creating backup...' : 'Create Backup'}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <p className="mt-2 text-gray-600">
          This section will show recent changes and updates across the system.
        </p>
      </div>
    </div>
  );
} 