import React from 'react';
import { useFleet } from '../../store/fleetStore';
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Package, 
  Truck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode,
  Gauge
} from 'lucide-react';

interface WarehouseManagementProps {
  onOpenScanner: () => void;
}

export const WarehouseManagement: React.FC<WarehouseManagementProps> = ({ onOpenScanner }) => {
  const { warehouses, shipments } = useFleet();

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Regional Fulfillment Centers & Depots</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-dock inventory tracking, storage bay capacity, inbound staging and dispatch docks.
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Intake Scanner</span>
        </button>
      </div>

      {/* Warehouse Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map(wh => {
          const occupancyPercent = Math.round((wh.currentOccupancyTons / wh.capacityTons) * 100);
          const facilityShipments = shipments.filter(s => s.warehouseId === wh.id);

          return (
            <div key={wh.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xs">
              
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">{wh.code}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{wh.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{wh.address}</span>
                  </p>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Bay Storage Capacity</span>
                  <span className="font-mono font-bold text-white">{wh.currentOccupancyTons} / {wh.capacityTons} Tons ({occupancyPercent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      occupancyPercent > 85 ? 'bg-rose-500' :
                      occupancyPercent > 70 ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`}
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
              </div>

              {/* Facility Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Loading Docks</span>
                  <span className="font-bold text-slate-200 font-mono">{wh.baysCount} Active Bays</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block">Parcels Staged</span>
                  <span className="font-bold text-blue-400 font-mono">{facilityShipments.length} Orders</span>
                </div>
              </div>

              {/* Manager & Contact */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-300 font-medium">{wh.managerName}</span>
                </div>
                <span className="font-mono text-[11px] text-slate-500">{wh.phone}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
