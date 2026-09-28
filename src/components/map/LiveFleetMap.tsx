import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Driver, Vehicle } from '../../types';
import { 
  Play, 
  Pause, 
  Truck, 
  BatteryCharging, 
  Fuel, 
  Compass, 
  MapPin, 
  Phone, 
  Navigation, 
  Zap, 
  AlertCircle,
  ExternalLink,
  Layers,
  RotateCcw
} from 'lucide-react';

export const LiveFleetMap: React.FC = () => {
  const { 
    drivers, 
    vehicles, 
    warehouses, 
    routes, 
    shipments,
    isGpsSimulating, 
    toggleGpsSimulation 
  } = useFleet();

  const [selectedDriverId, setSelectedDriverId] = useState<string>('DRV001');
  const [filterType, setFilterType] = useState<'ALL' | 'ON_TRIP' | 'ELECTRIC' | 'AVAILABLE'>('ALL');
  const [showRoutesLayer, setShowRoutesLayer] = useState<boolean>(true);
  const [showWarehousesLayer, setShowWarehousesLayer] = useState<boolean>(true);

  // Geographic bounds for coordinate projection (Delhi-NCR regional bounding box)
  const mapBounds = {
    minLat: 28.45,
    maxLat: 28.70,
    minLng: 77.05,
    maxLng: 77.40,
  };

  // Convert lat/lng to SVG percentage (0% to 100%)
  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    // Invert Y because latitude goes North-positive while SVG Y goes down
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(4, Math.min(96, y)),
    };
  };

  const selectedDriver = drivers.find(d => d.id === selectedDriverId) || drivers[0];
  const selectedVehicle = vehicles.find(v => v.id === selectedDriver?.assignedVehicleId);
  const activeRoute = routes.find(r => r.driverId === selectedDriver?.id && r.status === 'IN_PROGRESS');

  const filteredDrivers = drivers.filter(d => {
    if (filterType === 'ON_TRIP') return d.status === 'ON_DELIVERY';
    if (filterType === 'AVAILABLE') return d.status === 'AVAILABLE';
    if (filterType === 'ELECTRIC') {
      const v = vehicles.find(veh => veh.id === d.assignedVehicleId);
      return v?.fuelType === 'Electric';
    }
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Top Map Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Live Fleet GPS Telemetry</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{drivers.filter(d => d.status === 'ON_DELIVERY').length} vehicles active on road</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Update frequency: 3.0s</span>
            </div>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-md border border-slate-700/60">
            {(['ALL', 'ON_TRIP', 'ELECTRIC', 'AVAILABLE'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  filterType === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'ALL' && 'All Fleet'}
                {tab === 'ON_TRIP' && 'On Trip'}
                {tab === 'ELECTRIC' && 'EV Only'}
                {tab === 'AVAILABLE' && 'Idle / Standby'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2">
            <button
              onClick={() => setShowRoutesLayer(prev => !prev)}
              className={`p-1.5 rounded text-xs border ${
                showRoutesLayer 
                  ? 'bg-slate-800 text-blue-400 border-blue-500/40' 
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Toggle Routes Polyline Layer"
            >
              <Layers className="w-4 h-4" />
            </button>

            <button
              onClick={toggleGpsSimulation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isGpsSimulating
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isGpsSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isGpsSimulating ? 'Pause Stream' : 'Resume GPS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Map Canvas on Left (70%) + Driver Telemetry HUD on Right (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Vector Map Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden h-[540px] shadow-inner select-none">
          
          {/* Subtle Map Grid lines representing city blocks & expressway corridors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
            
            {/* Simulated River / Natural Corridor */}
            <path
              d="M 68 0 Q 75 35 62 70 T 58 100"
              fill="none"
              stroke="#0f3b5e"
              strokeWidth="14"
              strokeLinecap="round"
              className="opacity-70"
            />
            {/* Major Arterial Highway Corridors */}
            <path d="M 10 50 Q 50 48 90 52" fill="none" stroke="#334155" strokeWidth="3" />
            <path d="M 30 10 Q 55 50 80 90" fill="none" stroke="#334155" strokeWidth="3" />
            <path d="M 15 85 Q 50 75 85 85" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="4 2" />
          </svg>

          {/* Polyline Routes Layer */}
          {showRoutesLayer && routes.map(route => {
            const driver = drivers.find(d => d.id === route.driverId);
            const isSelected = selectedDriverId === route.driverId;
            const startPt = projectCoords(route.startLocation.lat, route.startLocation.lng);
            
            const stopPts = route.stops.map(st => projectCoords(st.coordinates.lat, st.coordinates.lng));
            const pathD = [`M ${startPt.x}% ${startPt.y}%`, ...stopPts.map(pt => `L ${pt.x}% ${pt.y}%`)].join(' ');

            return (
              <svg key={route.id} className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d={pathD}
                  fill="none"
                  stroke={isSelected ? '#3b82f6' : '#64748b'}
                  strokeWidth={isSelected ? '3' : '1.8'}
                  strokeDasharray={isSelected ? '6 4' : '3 3'}
                  strokeOpacity={isSelected ? '0.9' : '0.4'}
                  className={isSelected ? 'animate-pulse' : ''}
                />
              </svg>
            );
          })}

          {/* Warehouse Markers */}
          {showWarehousesLayer && warehouses.map(wh => {
            const { x, y } = projectCoords(wh.coordinates.lat, wh.coordinates.lng);
            return (
              <div
                key={wh.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md backdrop-blur-xs hover:scale-110 transition-transform">
                  <span className="text-xs font-bold font-mono">WH</span>
                </div>
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-[11px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                  <p className="font-semibold text-amber-300">{wh.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Occ: {wh.currentOccupancyTons}/{wh.capacityTons}T</p>
                </div>
              </div>
            );
          })}

          {/* Delivery Stop Pins */}
          {showRoutesLayer && activeRoute?.stops.map(st => {
            const { x, y } = projectCoords(st.coordinates.lat, st.coordinates.lng);
            return (
              <div
                key={st.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-xs ${
                  st.status === 'COMPLETED' 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300' 
                    : st.status === 'FAILED'
                    ? 'bg-rose-500 text-white border-rose-300'
                    : 'bg-blue-600 text-white border-blue-300'
                }`}>
                  {st.sequence}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 font-medium">
                  {st.recipientName} ({st.status})
                </div>
              </div>
            );
          })}

          {/* Moving Driver Vehicle Markers */}
          {filteredDrivers.map(drv => {
            const { x, y } = projectCoords(drv.currentLocation.lat, drv.currentLocation.lng);
            const isSelected = drv.id === selectedDriverId;
            const veh = vehicles.find(v => v.id === drv.assignedVehicleId);

            return (
              <div
                key={drv.id}
                onClick={() => setSelectedDriverId(drv.id)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 transition-all duration-1000 ease-linear group"
              >
                {/* Pulse Ring when moving */}
                {drv.status === 'ON_DELIVERY' && isGpsSimulating && (
                  <div className="absolute inset-0 -m-2 rounded-full border border-blue-400 animate-ping opacity-60 pointer-events-none" />
                )}

                <div className={`relative p-2 rounded-full shadow-lg transition-transform ${
                  isSelected 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/40 scale-110' 
                    : drv.status === 'ON_DELIVERY'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/50 hover:scale-105'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  <Truck 
                    className="w-4 h-4 transition-transform duration-500" 
                    style={{ transform: `rotate(${drv.currentLocation.headingDeg}deg)` }}
                  />

                  {/* EV Badge if electric */}
                  {veh?.fuelType === 'Electric' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Zap className="w-2 h-2 text-slate-950 fill-current" />
                    </span>
                  )}
                </div>

                {/* Driver label pill */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border shadow-sm ${
                  isSelected 
                    ? 'bg-blue-950 text-blue-200 border-blue-600' 
                    : 'bg-slate-900/90 text-slate-300 border-slate-700'
                }`}>
                  {drv.name.split(' ')[0]} · {drv.currentLocation.speedKmH}km/h
                </div>
              </div>
            );
          })}

          {/* Map Compass & Scale Badge */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-md p-2 text-[10px] text-slate-400 flex items-center gap-3 backdrop-blur-xs">
            <div className="flex items-center gap-1 font-mono">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>NORTH 360°</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">|</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="w-8 h-1 bg-slate-500 inline-block rounded-xs" />
              <span>5.0 km</span>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded-md p-2 text-[11px] text-slate-300 space-y-1 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Active Courier In-Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
              <span>Warehouse Fulfillment Depot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Customer Delivery Point</span>
            </div>
          </div>

        </div>

        {/* Right Column: Driver Telemetry HUD & Details Card */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Active Driver Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedDriver.name}</h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    selectedDriver.status === 'ON_DELIVERY'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {selectedDriver.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID: <span className="font-mono text-slate-300">{selectedDriver.id}</span> · {selectedDriver.experienceYears}y exp
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-amber-400 font-bold font-mono">★ {selectedDriver.metrics.customerRating}</div>
                <div className="text-[10px] text-slate-500">{selectedDriver.metrics.totalDeliveries} total drops</div>
              </div>
            </div>

            {/* Vehicle Telemetry Gauges */}
            <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Speed Telemetry</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold font-mono text-blue-400 tabular-nums">
                    {selectedDriver.currentLocation.speedKmH}
                  </span>
                  <span className="text-xs text-slate-500">km/h</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {selectedVehicle?.fuelType === 'Electric' ? 'Battery SoC' : 'Fuel Level'}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-xl font-bold font-mono tabular-nums ${
                    (selectedVehicle?.fuelOrBatteryPercent ?? 50) < 25 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {selectedVehicle?.fuelOrBatteryPercent ?? 75}%
                  </span>
                  {selectedVehicle?.fuelType === 'Electric' ? (
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 inline" />
                  ) : (
                    <Fuel className="w-3.5 h-3.5 text-amber-400 inline" />
                  )}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800 col-span-2 flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">Assigned Vehicle:</span>
                <span className="font-mono font-medium text-white">{selectedVehicle?.registrationNumber} ({selectedVehicle?.model})</span>
              </div>
              
              <div className="col-span-2 flex items-center justify-between text-xs text-slate-300">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="font-mono text-[11px] text-slate-300">
                  {selectedDriver.currentLocation.lat.toFixed(4)}° N, {selectedDriver.currentLocation.lng.toFixed(4)}° E
                </span>
              </div>
            </div>

            {/* Active Route & Assigned Stops */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">Active Delivery Stops</span>
                {activeRoute && (
                  <span className="text-blue-400 font-mono text-[11px]">{activeRoute.stops.length} stops</span>
                )}
              </div>

              {activeRoute ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeRoute.stops.map(st => (
                    <div 
                      key={st.id} 
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                        st.status === 'COMPLETED'
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300'
                          : st.status === 'FAILED'
                          ? 'bg-rose-950/20 border-rose-800/40 text-slate-300'
                          : 'bg-slate-800/70 border-slate-700 text-slate-200'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                        {st.sequence}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate text-white">{st.recipientName}</p>
                          <span className="text-[10px] font-mono text-slate-400">{st.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{st.address}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-1">
                          <span>{st.packageType}</span>
                          <span>·</span>
                          <span>{st.weightKg} kg</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-950/40 rounded-lg text-center text-xs text-slate-400 border border-dashed border-slate-800">
                  No active route dispatched for this driver.
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
              <a
                href={`tel:${selectedDriver.phone}`}
                className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium text-center flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>Call Driver</span>
              </a>
              <button
                onClick={() => {
                  alert(`Direct dispatcher message sent to driver ${selectedDriver.name} on console.`);
                }}
                className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold text-center"
              >
                Send Dispatch Ping
              </button>
            </div>

          </div>

          {/* Quick Fleet Quick Select list */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Fleet Drivers</h4>
            <div className="space-y-1.5">
              {drivers.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDriverId(d.id)}
                  className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                    d.id === selectedDriverId ? 'bg-blue-600/20 border border-blue-500/40 text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${d.status === 'ON_DELIVERY' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <span className="font-medium">{d.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{d.currentLocation.speedKmH} km/h</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
