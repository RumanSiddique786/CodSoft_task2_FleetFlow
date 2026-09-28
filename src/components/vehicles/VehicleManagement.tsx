import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Vehicle, MaintenanceRecord, VehicleType } from '../../types';
import { 
  Truck, 
  Wrench, 
  BatteryCharging, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Plus, 
  Zap,
  Gauge,
  Clock
} from 'lucide-react';

export const VehicleManagement: React.FC = () => {
  const { 
    vehicles, 
    maintenanceRecords, 
    scheduleMaintenance, 
    completeMaintenance 
  } = useFleet();

  const [activeSubTab, setActiveSubTab] = useState<'FLEET' | 'MAINTENANCE'>('FLEET');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Maintenance form
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || 'VEH-01');
  const [serviceType, setServiceType] = useState<MaintenanceRecord['serviceType']>('Scheduled Service');
  const [scheduledDate, setScheduledDate] = useState('2026-10-05');
  const [estimatedCost, setEstimatedCost] = useState('350');
  const [notes, setNotes] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('2027-01-05');

  // Check expiration within 30 days
  const isExpiringSoon = (dateStr: string) => {
    const diffDays = (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 30;
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr).getTime() < new Date().getTime();
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = vehicles.find(v => v.id === selectedVehicleId);
    if (!veh) return;

    scheduleMaintenance({
      vehicleId: veh.id,
      vehicleReg: veh.registrationNumber,
      serviceType,
      scheduledDate,
      cost: parseFloat(estimatedCost) || 0,
      notes,
      nextServiceDate,
    });

    setIsScheduleModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveSubTab('FLEET')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeSubTab === 'FLEET'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Fleet Inventory ({vehicles.length})
            </button>
            <button
              onClick={() => setActiveSubTab('MAINTENANCE')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeSubTab === 'MAINTENANCE'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Maintenance & Inspections ({maintenanceRecords.length})
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Service</span>
        </button>
      </div>

      {/* Subtab 1: Fleet Inventory Cards */}
      {activeSubTab === 'FLEET' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(veh => {
            const hasUrgentAlert = 
              isExpiringSoon(veh.pucExpiry) || 
              isExpiringSoon(veh.fitnessExpiry) || 
              isExpiringSoon(veh.insuranceExpiry);

            return (
              <div 
                key={veh.id} 
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative hover:border-slate-700 transition-colors shadow-xs"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">{veh.registrationNumber}</span>
                      {veh.fuelType === 'Electric' && (
                        <span className="p-1 rounded bg-emerald-500/20 text-emerald-400" title="Zero Emission EV">
                          <Zap className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{veh.manufacturer} {veh.model} ({veh.year})</p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    veh.status === 'ON_TRIP' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    veh.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    veh.status === 'MAINTENANCE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {veh.status}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Payload Capacity</span>
                    <span className="font-bold text-slate-200 font-mono">{veh.capacityKg.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Odometer Mileage</span>
                    <span className="font-bold text-slate-200 font-mono">{veh.mileageKm.toLocaleString()} km</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {veh.fuelType === 'Electric' ? 'Battery Level' : 'Fuel Tank'}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">{veh.fuelOrBatteryPercent}%</span>
                  </div>
                </div>

                {/* Expiry Dates & Alert Badges */}
                <div className="space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Insurance Expiry:</span>
                    <span className={isExpiringSoon(veh.insuranceExpiry) ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {veh.insuranceExpiry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fitness Test Expiry:</span>
                    <span className={isExpiringSoon(veh.fitnessExpiry) ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {veh.fitnessExpiry}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">PUC Emission Cert:</span>
                    <span className={isExpiringSoon(veh.pucExpiry) ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {veh.pucExpiry}
                    </span>
                  </div>
                </div>

                {hasUrgentAlert && (
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded text-[11px] text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Inspection / Cert renewal due soon</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Subtab 2: Maintenance Records Table */}
      {activeSubTab === 'MAINTENANCE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Vehicle Reg</th>
                <th className="py-3 px-4">Service Type</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Cost ($)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Next Inspection</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {maintenanceRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-400">{rec.id}</td>
                  <td className="py-3 px-4 font-mono font-medium text-white">{rec.vehicleReg}</td>
                  <td className="py-3 px-4 text-slate-200">
                    <div>
                      <span className="font-semibold">{rec.serviceType}</span>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{rec.notes}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{rec.scheduledDate}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">${rec.cost.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      rec.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                      rec.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{rec.nextServiceDate}</td>
                  <td className="py-3 px-4 text-right">
                    {rec.status !== 'COMPLETED' && (
                      <button
                        onClick={() => {
                          const cost = prompt('Confirm actual maintenance cost ($):', rec.cost.toString());
                          const inv = prompt('Invoice Number:', `INV-${Date.now().toString().slice(-4)}`);
                          if (cost) {
                            completeMaintenance(rec.id, parseFloat(cost) || rec.cost, inv || 'INV-PAID');
                          }
                        }}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded text-xs font-semibold border border-emerald-500/30"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: Schedule Service Form */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-400" />
              <span>Schedule Fleet Maintenance</span>
            </h3>

            <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Target Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={e => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber} - {v.model} ({v.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Maintenance Type</label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value as MaintenanceRecord['serviceType'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Scheduled Service">Scheduled Service / Oil & Filter</option>
                  <option value="Brake Replacement">Brake Pad & Caliper Overhaul</option>
                  <option value="Battery Health Check">EV Battery Balance & Diagnostic</option>
                  <option value="Tire Rotation">Tire Alignment & Rotation</option>
                  <option value="Routine Inspection">Annual Statutory Fitness & PUC Check</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Service Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Est. Cost ($)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Service Notes & Symptoms</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Driver reported steering vibration at 60 km/h"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Next Service Due Target</label>
                <input
                  type="date"
                  value={nextServiceDate}
                  onChange={e => setNextServiceDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
