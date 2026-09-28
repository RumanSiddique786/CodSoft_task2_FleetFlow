import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Driver, DriverStatus } from '../../types';
import { 
  Users, 
  Award, 
  Phone, 
  Mail, 
  FileCheck, 
  MapPin, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  ExternalLink
} from 'lucide-react';

export const DriverManagement: React.FC = () => {
  const { drivers, vehicles } = useFleet();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      
      {/* Header & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search driver name, ID or mobile..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_DELIVERY">On Delivery</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Total Active Drivers: <span className="text-white font-bold">{drivers.length}</span>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrivers.map(d => {
          const veh = vehicles.find(v => v.id === d.assignedVehicleId);
          const completionRate = (
            (d.metrics.successfulDeliveries / Math.max(1, d.metrics.totalDeliveries)) * 100
          ).toFixed(1);

          return (
            <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
              
              {/* Profile Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {d.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{d.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">({d.id})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> {d.phone}</span>
                      <span>·</span>
                      <span>{d.experienceYears} yrs exp</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  d.status === 'ON_DELIVERY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  d.status === 'AVAILABLE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {d.status.replace('_', ' ')}
                </span>
              </div>

              {/* Underlying Performance Metrics (Transparent SRS compliance) */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Performance Metrics Breakdown
                </span>
                <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">On-Time Rate</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">{d.metrics.onTimeRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Completion</span>
                    <span className="font-mono font-bold text-blue-400 text-xs">{completionRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Rating</span>
                    <span className="font-mono font-bold text-amber-400 text-xs">★ {d.metrics.customerRating}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Distance</span>
                    <span className="font-mono font-bold text-slate-200 text-xs">{d.metrics.distanceTravelledKm} km</span>
                  </div>
                </div>
              </div>

              {/* Legal & Vehicle Info */}
              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
                <div>
                  <span className="text-slate-500 text-[10px] block">License & Expiry</span>
                  <span className="font-mono text-slate-300 text-[11px] block">{d.licenseNumber}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Exp: {d.licenseExpiry}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Assigned Vehicle</span>
                  {veh ? (
                    <div>
                      <span className="font-mono font-bold text-white text-[11px] block">{veh.registrationNumber}</span>
                      <span className="text-[10px] text-slate-400">{veh.model}</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic text-[11px]">No vehicle assigned</span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
