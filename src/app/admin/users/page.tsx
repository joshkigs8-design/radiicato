'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Check, X, UserCheck, UserPlus } from 'lucide-react';
import { useStore } from '@/lib/use-store';
import { AdminRole } from '@/types';

const ROLES_MATRIX = [
  {
    role: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Unrestricted full access across all store systems, database keys, settings, and finances.',
    permissions: ['Products', 'Collections', 'Orders', 'Customers', 'Inventory', 'Discounts', 'Content', 'Analytics', 'Settings'],
  },
  {
    role: 'ADMIN',
    name: 'Atelier Administrator',
    description: 'Manages catalog, dispatches orders, processes reviews, and reviews financial analytics.',
    permissions: ['Products', 'Collections', 'Orders', 'Customers', 'Inventory', 'Discounts', 'Content', 'Analytics'],
  },
  {
    role: 'INVENTORY_MANAGER',
    name: 'Inventory Manager',
    description: 'Controls raw fabric inventory, stock adjustments, restock logs, and low stock thresholds.',
    permissions: ['Products', 'Inventory'],
  },
  {
    role: 'ORDER_MANAGER',
    name: 'Order Fulfillment Manager',
    description: 'Handles order status progression, packing verification, courier tracking, and customer contact.',
    permissions: ['Orders', 'Customers'],
  },
  {
    role: 'CONTENT_MANAGER',
    name: 'Editorial Content Manager',
    description: 'Oversees Homepage CMS, Lookbook photo exhibits, brand copy, and review approvals.',
    permissions: ['Content', 'Collections'],
  },
];

export default function AdminUsersPage() {
  const { adminUsers, currentAdmin, switchAdminRole } = useStore();

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-16">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Admin Users & Role Permissions</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Role-Based Access Control (RBAC) matrix defining permissions across atelier management modules.
          </p>
        </div>
        <Link
          href="/admin/signup"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#4D5936] hover:bg-[#3D472B] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto"
        >
          <UserPlus size={14} />
          <span>Onboard New Staff</span>
        </Link>
      </div>

      {/* Active Admin Staff Roster */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h3 className="text-sm font-bold text-[#111827]">Atelier Admin Team Roster</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-mono border-b border-[#E5E7EB]">
              <tr>
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">ASSIGNED ROLE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">SIMULATE SESSION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#111827]">
              {adminUsers.map((user) => {
                const isCurrent = currentAdmin.role === user.role;
                return (
                  <tr key={user.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-4 font-bold">{user.name}</td>
                    <td className="py-3 px-4 font-mono text-[#4B5563]">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#374151] font-mono font-bold rounded text-[10px]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#ECFDF5] text-[#065F46] rounded text-[10px] font-bold uppercase">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => switchAdminRole(user.role)}
                        disabled={isCurrent}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                          isCurrent
                            ? 'bg-[#4D5936] text-white cursor-default'
                            : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827]'
                        }`}
                      >
                        {isCurrent ? 'Active Session' : 'Switch to This Role'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm p-6 space-y-6">
        <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">
          Permission Entitlements Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROLES_MATRIX.map((r) => (
            <div key={r.role} className="p-5 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] space-y-3">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#4D5936]" />
                <h4 className="text-xs font-bold uppercase text-[#111827]">{r.name}</h4>
              </div>
              <p className="text-xs text-[#6B7280]">{r.description}</p>
              <div className="pt-2 border-t border-[#E5E7EB] space-y-1">
                <span className="text-[10px] font-mono text-[#9CA3AF] uppercase block">ENTITLED MODULES:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {r.permissions.map((p) => (
                    <span key={p} className="px-2 py-0.5 bg-white border border-[#D1D5DB] rounded text-[10px] font-medium text-[#374151]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

