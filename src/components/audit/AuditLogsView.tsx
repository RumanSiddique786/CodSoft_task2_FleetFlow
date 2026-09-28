import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Shield, Search, ArrowRight, User, Terminal } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useFleet();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.resourceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Immutable Enterprise Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic change logs capturing actor identity, resource IDs, IP origin, and property diffs.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor or resource..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">State Transition / Modification</th>
                <th className="py-3 px-4 text-right">IP Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{log.actor}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{log.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-blue-400 border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="text-slate-300 font-medium">{log.resource}:</span>{' '}
                    <span className="text-white font-bold">{log.resourceId}</span>
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    {log.oldValue && log.newValue ? (
                      <div className="flex items-center gap-1.5 text-[11px] truncate">
                        <span className="text-slate-400 line-through truncate max-w-[140px]">{log.oldValue}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="text-emerald-400 font-medium truncate max-w-[140px]">{log.newValue}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300 text-[11px] truncate block">{log.newValue || log.oldValue || 'Audit logged'}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-500 text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
