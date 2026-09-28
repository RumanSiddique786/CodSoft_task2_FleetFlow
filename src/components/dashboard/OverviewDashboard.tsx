import React from 'react';
import { useFleet } from '../../store/fleetStore';
import { 
  Package, 
  Truck, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  QrCode, 
  Navigation, 
  Building2, 
  MapPin, 
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Zap,
  Phone
} from 'lucide-react';

interface OverviewDashboardProps {
  setActiveTab: (tab: string) => void;
  onOpenScanner: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ setActiveTab, onOpenScanner }) => {
  const { 
    shipments, 
    drivers, 
    vehicles, 
    warehouses, 
    routes, 
    notifications,
    isGpsSimulating 
  } = useFleet();

  const totalShipments = shipments.length;
  const activeDeliveries = shipments.filter(s => s.status === 'OUT_FOR_DELIVERY').length;
  const deliveredShipments = shipments.filter(s => s.status === 'DELIVERED').length;
  const failedShipments = shipments.filter(s => s.status === 'DELIVERY_FAILED').length;
  const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE').length;
  const onTripDrivers = drivers.filter(d => d.status === 'ON_DELIVERY').length;
  const activeAlerts = notifications.filter(n => !n.read);

  // Status pipeline items
  const pipeline = [
    { label: 'Created', count: shipments.filter(s => s.status === 'CREATED').length, color: 'text-slate-400' },
    { label: 'Scheduled', count: shipments.filter(s => s.status === 'PICKUP_SCHEDULED').length, color: 'text-sky-400' },
    { label: 'At Warehouse', count: shipments.filter(s => s.status === 'AT_WAREHOUSE' || s.status === 'PROCESSING').length, color: 'text-purple-400' },
    { label: 'Out for Delivery', count: activeDeliveries, color: 'text-blue-400' },
    { label: 'Delivered', count: deliveredShipments, color: 'text-emerald-400' },
    { label: 'Exceptions', count: failedShipments, color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-5">
      
      {/* Welcome & Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-bold block mb-1">
            OPERATIONS COMMAND CENTER
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Central Logistics Dispatch
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time fleet telemetry, active routing corridors, and package lifecycle execution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('shipments')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>Manage Shipments</span>
          </button>

          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>Intake Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Live GPS Map</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Active In-Transit Drops</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{activeDeliveries}</span>
            <span className="text-xs text-slate-500">of {totalShipments} total</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Moving on routes</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Fleet On Duty</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{onTripDrivers}</span>
            <span className="text-xs text-slate-500">drivers on road</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono">
            {availableDrivers} couriers on standby
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Completed Drops</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{deliveredShipments}</span>
            <span className="text-xs text-slate-500 font-mono">
              ({totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 100}%)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            Verified OTP & signature
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Operational Alerts</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{activeAlerts.length}</span>
            <span className="text-xs text-slate-500">pending review</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400/90 font-mono">
            {failedShipments > 0 ? `${failedShipments} delivery exceptions` : 'Vehicle compliance'}
          </div>
        </div>

      </div>

      {/* Shipment Lifecycle Pipeline Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Shipment Lifecycle State Machine
          </span>
          <button 
            onClick={() => setActiveTab('shipments')} 
            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {pipeline.map(stage => (
            <div 
              key={stage.label}
              onClick={() => setActiveTab('shipments')}
              className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors text-center"
            >
              <span className={`text-xl font-bold font-mono block ${stage.color}`}>{stage.count}</span>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5 block truncate">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Active Deliveries Telemetry (Left) + Warehouse Capacities & Urgent Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (7 cols): Active Courier Telemetry Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Active Courier Telemetry Stream</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Live broadcast from in-vehicle GPS and mobile app</p>
              </div>

              <button
                onClick={() => setActiveTab('map')}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Full Map</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {drivers.filter(d => d.status === 'ON_DELIVERY').map(drv => {
                const veh = vehicles.find(v => v.id === drv.assignedVehicleId);
                const assignedShp = shipments.find(s => s.assignedDriverId === drv.id && s.status === 'OUT_FOR_DELIVERY');

                return (
                  <div
                    key={drv.id}
                    className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/90 text-xs space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                          {drv.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{drv.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">({drv.id})</span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-400">
                            {veh?.registrationNumber} · {veh?.model}
                          </span>
                        </div>
                      </div>

                      {/* Speed & Battery */}
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1 font-mono">
                          <span className="text-base font-bold text-blue-400 tabular-nums">{drv.currentLocation.speedKmH}</span>
                          <span className="text-[10px] text-slate-500">km/h</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {veh?.fuelType === 'Electric' ? '⚡ EV' : '⛽ Diesel'} {veh?.fuelOrBatteryPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Active Shipment Drop */}
                    {assignedShp && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <div className="truncate max-w-[280px]">
                          <span className="text-slate-500">Delivering to: </span>
                          <span className="text-slate-200 font-medium truncate">{assignedShp.customerName}</span>
                          <span className="text-slate-500 text-[10px] block truncate">{assignedShp.deliveryAddress}</span>
                        </div>
                        <span className="font-mono font-bold text-blue-400 shrink-0 ml-2">
                          {assignedShp.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Warehouse Capacities & Operational Alerts */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Warehouse Storage Capacities */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Warehouse Hub Capacities</span>
              </h3>
              <button 
                onClick={() => setActiveTab('warehouses')} 
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {warehouses.map(wh => {
                const pct = Math.round((wh.currentOccupancyTons / wh.capacityTons) * 100);
                return (
                  <div key={wh.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-medium truncate max-w-[200px] text-white">{wh.name}</span>
                      <span className="font-mono text-[11px] text-slate-400">{wh.currentOccupancyTons}/{wh.capacityTons} T ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct > 80 ? 'bg-amber-400' : 'bg-blue-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent Alerts Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Operational Risk & Expiry Alerts</span>
            </h3>

            <div className="space-y-2.5">
              {notifications.slice(0, 3).map(notif => (
                <div 
                  key={notif.id}
                  onClick={() => notif.linkAction && setActiveTab(notif.linkAction)}
                  className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <p className="font-semibold text-slate-200">{notif.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
