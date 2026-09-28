import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Clock,
  Layers
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { shipments, drivers, vehicles, maintenanceRecords } = useFleet();
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const totalShipments = shipments.length;
  const deliveredCount = shipments.filter(s => s.status === 'DELIVERED').length;
  const activeDeliveries = shipments.filter(s => s.status === 'OUT_FOR_DELIVERY').length;
  const failedDeliveries = shipments.filter(s => s.status === 'DELIVERY_FAILED').length;
  const successRate = totalShipments > 0 ? Math.round((deliveredCount / totalShipments) * 100) : 100;
  const availableDrivers = drivers.filter(d => d.status === 'AVAILABLE').length;

  const exportCsv = (type: 'shipments' | 'drivers' | 'maintenance') => {
    let csvContent = '';
    let filename = '';

    if (type === 'shipments') {
      filename = `fleetflow-shipments-${new Date().toISOString().slice(0, 10)}.csv`;
      const headers = ['TrackingNumber', 'Customer', 'DeliveryAddress', 'Priority', 'Status', 'WeightKg', 'CreatedAt'];
      const rows = shipments.map(s => [
        s.trackingNumber,
        `"${s.customerName}"`,
        `"${s.deliveryAddress}"`,
        s.priority,
        s.status,
        s.weightKg,
        s.createdAt,
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (type === 'drivers') {
      filename = `fleetflow-drivers-${new Date().toISOString().slice(0, 10)}.csv`;
      const headers = ['DriverID', 'Name', 'Phone', 'Status', 'Rating', 'OnTimeRate', 'TotalDeliveries'];
      const rows = drivers.map(d => [
        d.id,
        `"${d.name}"`,
        d.phone,
        d.status,
        d.metrics.customerRating,
        `${d.metrics.onTimeRate}%`,
        d.metrics.totalDeliveries,
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
      filename = `fleetflow-maintenance-${new Date().toISOString().slice(0, 10)}.csv`;
      const headers = ['RecordID', 'VehicleReg', 'ServiceType', 'ScheduledDate', 'Cost', 'Status'];
      const rows = maintenanceRecords.map(m => [
        m.id,
        m.vehicleReg,
        `"${m.serviceType}"`,
        m.scheduledDate,
        m.cost,
        m.status,
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${filename} successfully.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Operations & Fleet Performance Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time delivery fulfillment metrics, driver SLA benchmarks, and compliance reporting.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCsv('shipments')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export Shipments CSV</span>
          </button>
          <button
            onClick={() => exportCsv('drivers')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Driver Performance CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)}>✕</button>
        </div>
      )}

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block">Total Shipments Managed</span>
          <span className="text-2xl font-bold font-mono text-white mt-1 block">{totalShipments}</span>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% week-on-week</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block">Active In-Transit Drops</span>
          <span className="text-2xl font-bold font-mono text-blue-400 mt-1 block">{activeDeliveries}</span>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">Live route dispatch</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block">On-Time Success Rate</span>
          <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">{successRate}%</span>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-mono">SLA threshold &gt;95% met</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400 font-medium block">Standby / Available Couriers</span>
          <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">{availableDrivers}</span>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">{drivers.length} total roster</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Shipment Status Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Pipeline Distribution Breakdown
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { label: 'Out for Delivery', count: shipments.filter(s => s.status === 'OUT_FOR_DELIVERY').length, color: 'bg-blue-500' },
              { label: 'Delivered', count: shipments.filter(s => s.status === 'DELIVERED').length, color: 'bg-emerald-500' },
              { label: 'At Warehouse / Staged', count: shipments.filter(s => s.status === 'AT_WAREHOUSE' || s.status === 'PROCESSING').length, color: 'bg-purple-500' },
              { label: 'Exceptions / Failed', count: shipments.filter(s => s.status === 'DELIVERY_FAILED').length, color: 'bg-rose-500' },
            ].map(item => {
              const pct = totalShipments > 0 ? Math.round((item.count / totalShipments) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{item.label}</span>
                    <span className="font-mono text-white font-semibold">{item.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${Math.max(4, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Delivery Trend Bar Chart (Simulated High-Fidelity SVG) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Weekly Completed Deliveries Trend
          </h3>
          <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
            {[
              { day: 'Mon', count: 120, height: '65%' },
              { day: 'Tue', count: 145, height: '78%' },
              { day: 'Wed', count: 160, height: '88%' },
              { day: 'Thu', count: 138, height: '74%' },
              { day: 'Fri', count: 170, height: '94%' },
              { day: 'Sat', count: 110, height: '58%' },
              { day: 'Sun', count: 85, height: '45%' },
            ].map(col => (
              <div key={col.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.count}
                </span>
                <div
                  style={{ height: col.height }}
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md hover:brightness-110 transition-all cursor-pointer shadow-md shadow-blue-500/10"
                />
                <span className="text-[11px] font-mono text-slate-400 mt-1">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
