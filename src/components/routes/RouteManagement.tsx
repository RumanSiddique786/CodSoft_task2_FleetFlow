import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { DeliveryRoute, RouteStop } from '../../types';
import { 
  Sparkles, 
  MapPin, 
  Truck, 
  Navigation, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Play, 
  Layers, 
  RotateCw,
  AlertCircle
} from 'lucide-react';

export const RouteManagement: React.FC = () => {
  const { 
    routes, 
    drivers, 
    vehicles, 
    warehouses, 
    shipments, 
    optimizeRouteStops, 
    startRoute,
    createRoute 
  } = useFleet();

  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || 'RT-101');
  const [optimizationAlert, setOptimizationAlert] = useState<{ id: string; dist: number; time: number } | null>(null);
  const [isNewRouteModalOpen, setIsNewRouteModalOpen] = useState(false);

  // New Route Form State
  const [newRouteName, setNewRouteName] = useState('');
  const [newDriverId, setNewDriverId] = useState(drivers[0]?.id || '');
  const [newWarehouseId, setNewWarehouseId] = useState(warehouses[0]?.id || '');
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([]);

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const handleOptimize = (routeId: string) => {
    const res = optimizeRouteStops(routeId);
    setOptimizationAlert({ id: routeId, dist: res.distanceSavedKm, time: res.timeSavedMin });
    setTimeout(() => {
      setOptimizationAlert(null);
    }, 6000);
  };

  const handleCreateRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName || selectedShipmentIds.length === 0) {
      alert('Please provide a route name and select at least one shipment.');
      return;
    }

    const driver = drivers.find(d => d.id === newDriverId);
    const vehicle = vehicles.find(v => v.id === driver?.assignedVehicleId);
    const warehouse = warehouses.find(w => w.id === newWarehouseId) || warehouses[0];

    const chosenShipments = shipments.filter(s => selectedShipmentIds.includes(s.id));

    const stops: RouteStop[] = chosenShipments.map((shp, idx) => ({
      id: `ST-${Date.now()}-${idx}`,
      shipmentId: shp.id,
      trackingNumber: shp.trackingNumber,
      recipientName: shp.customerName,
      address: shp.deliveryAddress,
      coordinates: shp.deliveryCoords,
      sequence: idx + 1,
      estimatedArrival: new Date(Date.now() + (idx + 1) * 45 * 60 * 1000).toISOString(),
      status: 'PENDING',
      packageType: shp.packageType,
      weightKg: shp.weightKg,
    }));

    createRoute({
      name: newRouteName,
      driverId: driver?.id || 'DRV001',
      driverName: driver?.name || 'Assigned Driver',
      vehicleId: vehicle?.id || 'VEH-01',
      vehicleReg: vehicle?.registrationNumber || 'VEH-REG',
      startLocation: { name: warehouse.name, lat: warehouse.coordinates.lat, lng: warehouse.coordinates.lng },
      endLocation: { name: warehouse.name, lat: warehouse.coordinates.lat, lng: warehouse.coordinates.lng },
      stops,
    });

    setIsNewRouteModalOpen(false);
    setNewRouteName('');
    setSelectedShipmentIds([]);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-400" />
            <span>Multi-Stop Route Dispatch & Optimization</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatic TSP heuristic recalculation minimizing deadhead kilometers and delivery duration.
          </p>
        </div>

        <button
          onClick={() => setIsNewRouteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Route</span>
        </button>
      </div>

      {/* Optimization Savings Banner */}
      {optimizationAlert && (
        <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold">Algorithmic Route Optimization Applied!</span>
              <p className="text-[11px] text-emerald-400/90 mt-0.5">
                Stops re-sequenced for shortest geodesic path: Saved{' '}
                <span className="font-bold font-mono text-white">{optimizationAlert.dist} km</span> and{' '}
                <span className="font-bold font-mono text-white">{optimizationAlert.time} mins</span> of transit time.
              </p>
            </div>
          </div>
          <button onClick={() => setOptimizationAlert(null)} className="text-emerald-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Main Grid: Route List (Left) + Selected Route Stop Sequence & Optimizer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Route Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Delivery Corridors</h3>
          
          {routes.map(r => {
            const isSelected = r.id === selectedRouteId;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/30' 
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 font-bold">{r.id}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{r.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Courier: <span className="text-slate-200 font-medium">{r.driverName}</span> ({r.vehicleReg})
                    </p>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    r.status === 'OPTIMIZED' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    r.status === 'IN_PROGRESS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{r.stops.length} Delivery Stops</span>
                  <span>{r.totalDistanceKm} km · ~{r.estimatedDurationMin} min</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Stop Sequence & Visual Route Plan */}
        <div className="lg:col-span-7 space-y-4">
          {selectedRoute && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs">
              
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block">ROUTE SEQUENCE MANIFEST</span>
                  <h3 className="text-base font-bold text-white">{selectedRoute.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>Depot: {selectedRoute.startLocation.name}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-300">{selectedRoute.totalDistanceKm} km total</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOptimize(selectedRoute.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Optimize Sequence</span>
                  </button>

                  {selectedRoute.status !== 'IN_PROGRESS' && (
                    <button
                      onClick={() => startRoute(selectedRoute.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Route</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stops Sequence Timeline */}
              <div className="mt-5 space-y-3">
                {/* Depot Start */}
                <div className="flex items-center gap-3 text-xs p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    WH
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-white">Start: {selectedRoute.startLocation.name}</span>
                    <p className="text-[11px] text-slate-500">Departure origin staging dock</p>
                  </div>
                </div>

                {/* Delivery Stops */}
                {selectedRoute.stops.map((st, idx) => (
                  <div
                    key={st.id}
                    className="relative flex items-start gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      st.status === 'COMPLETED' ? 'bg-emerald-500 text-slate-950' :
                      st.status === 'FAILED' ? 'bg-rose-500 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {st.sequence}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white truncate">{st.recipientName}</h4>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                          st.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                          st.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400' :
                          'text-slate-400'
                        }`}>
                          {st.status}
                        </span>
                      </div>

                      <p className="text-slate-300 text-xs mt-1 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="truncate">{st.address}</span>
                      </p>

                      <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-slate-400">
                        <span className="text-blue-400 font-semibold">{st.trackingNumber}</span>
                        <span>·</span>
                        <span>{st.packageType}</span>
                        <span>·</span>
                        <span>{st.weightKg} kg</span>
                        <span>·</span>
                        <span>ETA: {new Date(st.estimatedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Depot Return */}
                <div className="flex items-center gap-3 text-xs p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px]">
                    WH
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-white">End: Return to Depot ({selectedRoute.endLocation.name})</span>
                    <p className="text-[11px] text-slate-500">Post-trip inspection & POD audit closeout</p>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>

      {/* MODAL: Create New Route */}
      {isNewRouteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Create & Stage Delivery Route</h3>
            
            <form onSubmit={handleCreateRouteSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Route Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Aerocity Express Run"
                  value={newRouteName}
                  onChange={e => setNewRouteName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Assign Driver</label>
                  <select
                    value={newDriverId}
                    onChange={e => setNewDriverId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Dispatch Depot</label>
                  <select
                    value={newWarehouseId}
                    onChange={e => setNewWarehouseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Select Shipments for this Route ({selectedShipmentIds.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-800 rounded-lg p-2 bg-slate-950">
                  {shipments.map(s => (
                    <label key={s.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-800 rounded text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedShipmentIds.includes(s.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedShipmentIds(prev => [...prev, s.id]);
                          } else {
                            setSelectedShipmentIds(prev => prev.filter(id => id !== s.id));
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span className="font-mono text-blue-400 font-bold">{s.trackingNumber}</span>
                      <span className="text-white truncate">{s.customerName}</span>
                      <span className="text-slate-500 text-[10px]">({s.weightKg}kg)</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewRouteModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-xs"
                >
                  Build Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
