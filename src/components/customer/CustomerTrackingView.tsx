import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Shipment, ShipmentStatus } from '../../types';
import { 
  Search, 
  Package, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Calendar,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const CustomerTrackingView: React.FC = () => {
  const { shipments, drivers } = useFleet();
  const [trackingInput, setTrackingInput] = useState('FF202609240001');
  const [activeTrackingNumber, setActiveTrackingNumber] = useState('FF202609240001');

  const shipment = shipments.find(
    s => s.trackingNumber.toUpperCase() === activeTrackingNumber.trim().toUpperCase()
  );

  const assignedDriver = drivers.find(d => d.id === shipment?.assignedDriverId);

  const sampleTrackingNumbers = [
    { num: 'FF202609240001', desc: 'Out for Delivery (Critical)' },
    { num: 'FF202609240003', desc: 'Delivered (OTP Verified)' },
    { num: 'FF202609240005', desc: 'At Warehouse Hub' },
    { num: 'FF202609240006', desc: 'Delivery Exception' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      setActiveTrackingNumber(trackingInput.trim());
    }
  };

  const stepsOrder: ShipmentStatus[] = [
    'CREATED',
    'PICKED_UP',
    'AT_WAREHOUSE',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];

  const getStepIndex = (status: ShipmentStatus) => {
    if (status === 'PICKUP_SCHEDULED') return 0;
    if (status === 'PROCESSING') return 2;
    if (status === 'DELIVERY_FAILED' || status === 'RESCHEDULED') return 3;
    return stepsOrder.indexOf(status);
  };

  const currentStepIdx = shipment ? getStepIndex(shipment.status) : -1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-xl">
        <span className="text-xs uppercase font-bold tracking-wider text-blue-400 block mb-2">
          FleetFlow Public Tracking Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Track Your Shipment in Real-Time
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2">
          Enter your unique FleetFlow tracking ID to monitor package location, milestones, courier dispatch, and live delivery ETA.
        </p>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="mt-6 max-w-xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trackingInput}
              onChange={e => setTrackingInput(e.target.value)}
              placeholder="e.g. FF202609240001"
              className="w-full bg-slate-950 border-2 border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-md transition-colors whitespace-nowrap"
          >
            Track Order
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500">Try demo samples:</span>
          {sampleTrackingNumbers.map(sample => (
            <button
              key={sample.num}
              onClick={() => {
                setTrackingInput(sample.num);
                setActiveTrackingNumber(sample.num);
              }}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-mono text-[11px] rounded-md border border-slate-700 transition-colors"
            >
              {sample.num} <span className="text-slate-400 font-sans">({sample.desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Result Details */}
      {shipment ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          
          {/* Top Status Banner */}
          <div className="p-6 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-blue-400">{shipment.trackingNumber}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  shipment.status === 'DELIVERED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  shipment.status === 'DELIVERY_FAILED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                }`}>
                  {shipment.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Destination: {shipment.deliveryAddress}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Expected Arrival Window</span>
              <span className="text-sm font-bold text-white font-mono">
                {new Date(shipment.expectedDeliveryDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-6 sm:p-8">
            <div className="relative">
              
              {/* Connecting progress line */}
              <div className="hidden sm:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2" />
              <div
                className="hidden sm:block absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStepIdx / (stepsOrder.length - 1)) * 100))}%`,
                }}
              />

              {/* Steps icons */}
              <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[
                  { title: 'Order Booked', icon: Package, statusKey: 'CREATED' },
                  { title: 'Picked Up', icon: Truck, statusKey: 'PICKED_UP' },
                  { title: 'In Fulfillment Hub', icon: MapPin, statusKey: 'AT_WAREHOUSE' },
                  { title: 'Out for Delivery', icon: Truck, statusKey: 'OUT_FOR_DELIVERY' },
                  { title: 'Delivered', icon: CheckCircle2, statusKey: 'DELIVERED' },
                ].map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.title} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-center sm:text-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isDone 
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/30' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isDone ? 'text-white' : 'text-slate-500'}`}>
                          {step.title}
                        </p>
                        {isCurrent && (
                          <span className="text-[10px] text-blue-400 font-mono font-medium block">
                            Current Stage
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Out for Delivery Live Approach Simulator Widget */}
          {shipment.status === 'OUT_FOR_DELIVERY' && assignedDriver && (
            <div className="mx-6 sm:mx-8 mb-6 p-4 bg-blue-950/30 border border-blue-800/40 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Courier is on the way!</h3>
                    <p className="text-xs text-slate-300">
                      Driver <span className="font-semibold text-white">{assignedDriver.name}</span> in vehicle{' '}
                      <span className="font-mono text-blue-400">{shipment.assignedVehicleReg}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">Estimated Drop-off</span>
                  <span className="text-base font-bold font-mono text-emerald-400">~ 20 - 35 mins</span>
                </div>
              </div>
            </div>
          )}

          {/* Verified Proof of Delivery Stamp if Delivered */}
          {shipment.status === 'DELIVERED' && shipment.proofOfDelivery && (
            <div className="mx-6 sm:mx-8 mb-6 p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Handover Signature & Security PIN</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Handed to <span className="font-bold text-white">{shipment.proofOfDelivery.recipientName}</span>. Customer OTP confirmation verified at {new Date(shipment.proofOfDelivery.timestamp).toLocaleTimeString()}.
              </p>
            </div>
          )}

          {/* Detailed Specifications & History Timeline */}
          <div className="p-6 sm:p-8 bg-slate-950/40 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Package Details */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Package Specifications</h4>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <dt className="text-slate-500">Package Type</dt>
                  <dd className="font-semibold text-white mt-0.5">{shipment.packageType}</dd>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <dt className="text-slate-500">Weight</dt>
                  <dd className="font-semibold text-white mt-0.5">{shipment.weightKg} kg</dd>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <dt className="text-slate-500">Dimensions</dt>
                  <dd className="font-semibold text-white mt-0.5">{shipment.dimensions}</dd>
                </div>
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <dt className="text-slate-500">Service Level</dt>
                  <dd className="font-semibold text-blue-400 mt-0.5">{shipment.priority} Priority</dd>
                </div>
              </dl>
            </div>

            {/* Event Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Milestone Activity</h4>
              <div className="space-y-3">
                {shipment.statusHistory.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{item.status.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {item.note && <p className="text-slate-400 text-[11px] mt-0.5">{item.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Shipment Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Tracking code <span className="font-mono text-rose-400">{activeTrackingNumber}</span> does not match any current records.
          </p>
        </div>
      )}

    </div>
  );
};
