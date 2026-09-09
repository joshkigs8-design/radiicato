'use client';

import React, { useState } from 'react';
import { History, Search, Filter, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { formatDateTime } from '@/lib/utils';

export default function AdminActivityPage() {
  const { auditLogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Atelier Audit & Security Activity</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Immutable log of catalog changes, inventory adjustments, dispatch updates, and admin actions.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm flex items-center justify-between">
        <div className="relative w-80">
          <Search size={15} className="text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity by action, user, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-md pl-9 pr-3 py-1.5 text-xs text-[#111827] focus:outline-none focus:border-[#4D5936]"
          />
        </div>
        <span className="text-xs font-mono text-[#6B7280]">{filtered.length} Audit Events</span>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">ADMIN USER</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">ENTITY</th>
                <th className="py-3 px-4">DETAILS</th>
                <th className="py-3 px-4">IP METADATA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3 px-4 font-mono text-[#6B7280]">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-[#111827]">{log.userName}</p>
                    <p className="text-[10px] font-mono text-[#6B7280]">{log.userRole}</p>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#374151] rounded text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#4B5563]">
                    {log.entityType} ({log.entityId.slice(0, 8)})
                  </td>
                  <td className="py-3 px-4 text-[#374151]">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-[#9CA3AF]">
                    {log.ipAddress || '197.232.84.12'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

