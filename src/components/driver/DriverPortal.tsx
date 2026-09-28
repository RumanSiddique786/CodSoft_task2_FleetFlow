import React, { useState, useRef } from 'react';
import { useFleet } from '../../store/fleetStore';
import { RouteStop, Shipment } from '../../types';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Smartphone, 
  PenTool, 
  Camera, 
  KeyRound, 
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const DriverPortal: React.FC = () => {
  const { 
    currentUser, 
    drivers, 
    shipments, 
    routes, 
    vehicles,
    recordProofOfDelivery, 
    recordFailedDelivery,
    isGpsSimulating, 
    toggleGpsSimulation 
  } = useFleet();

  // Pick the active driver (default Rajesh Sharma or match current user)
  const driver = drivers.find(d => d.email === currentUser.email) || drivers[0];
  const assignedVehicle = vehicles.find(v => v.id === driver?.assignedVehicleId);
  const activeRoute = routes.find(r => r.driverId === driver?.id && (r.status === 'IN_PROGRESS' || r.status === 'OPTIMIZED'));

  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(activeRoute?.stops[0] || null);
  
  // Modals for POD and Failed Delivery
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);

  // POD Form state
  const [recipientName, setRecipientName] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [podNotes, setPodNotes] = useState('');
  const [hasSignature, setHasSignature] = useState(false);
  const [photoSnapped, setPhotoSnapped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Failed delivery form state
  const [failureReason, setFailureReason] = useState('Customer unavailable');
  const [failureNotes, setFailureNotes] = useState('');

  // Canvas drawing functions for signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handlePodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStop) return;

    recordProofOfDelivery(selectedStop.trackingNumber, {
      recipientName: recipientName || selectedStop.recipientName,
      otpVerified: otpInput.length >= 4,
      otpCode: otpInput || '8492',
      timestamp: new Date().toISOString(),
      coordinates: driver.currentLocation,
      notes: podNotes,
      photoUrl: photoSnapped ? 'captured_pod_photo.jpg' : undefined,
    });

    setIsPodModalOpen(false);
    setRecipientName('');
    setOtpInput('');
    setPodNotes('');
    setHasSignature(false);
    setPhotoSnapped(false);
  };

  const handleFailedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStop) return;

    recordFailedDelivery(selectedStop.trackingNumber, failureReason, failureNotes);
    setIsFailedModalOpen(false);
    setFailureNotes('');
  };

  // The actual mobile interface component
  const DriverMobileView = (
    <div className="bg-slate-950 text-white min-h-[640px] flex flex-col justify-between rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      
      {/* Top Mobile App Bar */}
      <div className="bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              {driver.name.split(' ')[0][0]}
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">{driver.name}</h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-mono text-slate-300">{assignedVehicle?.registrationNumber}</span>
                <span>·</span>
                <span className="text-amber-400 font-bold font-mono">★ {driver.metrics.customerRating}</span>
              </div>
            </div>
          </div>

          {/* GPS Live Sharing indicator */}
          <button
            onClick={toggleGpsSimulation}
            className={`px-2 py-1 rounded-full text-[10px] font-mono flex items-center gap-1.5 border ${
              isGpsSimulating 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isGpsSimulating ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>{isGpsSimulating ? 'GPS LIVE' : 'PAUSED'}</span>
          </button>
        </div>

        {/* Shift stats */}
        <div className="mt-3 grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Stops Left</span>
            <span className="font-bold text-white font-mono">
              {activeRoute?.stops.filter(s => s.status === 'PENDING').length || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Delivered</span>
            <span className="font-bold text-emerald-400 font-mono">
              {activeRoute?.stops.filter(s => s.status === 'COMPLETED').length || 0}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Speed</span>
            <span className="font-bold text-blue-400 font-mono">
              {driver.currentLocation.speedKmH} <span className="text-[10px] text-slate-500">km/h</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {/* Next / Active Stop Highlight Card */}
        {selectedStop && (
          <div className="bg-slate-900 border-2 border-blue-500/50 rounded-xl p-4 shadow-lg relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  CURRENT STOP #{selectedStop.sequence}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedStop.recipientName}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-normal flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{selectedStop.address}</span>
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                selectedStop.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' :
                selectedStop.status === 'FAILED' ? 'bg-rose-500/20 text-rose-300' :
                'bg-blue-600 text-white'
              }`}>
                {selectedStop.status}
              </span>
            </div>

            <div className="mt-3 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-blue-400 font-bold">{selectedStop.trackingNumber}</span>
              <span>{selectedStop.packageType} ({selectedStop.weightKg} kg)</span>
            </div>

            {/* Quick Action Buttons for Driver */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedStop.address)}`, '_blank');
                }}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-400" />
                <span>Navigate</span>
              </button>

              <button
                onClick={() => {
                  setIsPodModalOpen(true);
                  setRecipientName(selectedStop.recipientName.split('(')[0].trim());
                }}
                disabled={selectedStop.status === 'COMPLETED'}
                className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Complete (POD)</span>
              </button>

              <button
                onClick={() => setIsFailedModalOpen(true)}
                disabled={selectedStop.status === 'COMPLETED'}
                className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 disabled:opacity-40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-rose-500/30 col-span-2"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Failed Attempt</span>
              </button>
            </div>
          </div>
        )}

        {/* Today's Stops Route Sequence */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Today's Route Schedule
          </h4>
          <div className="space-y-2">
            {activeRoute?.stops.map(st => (
              <div
                key={st.id}
                onClick={() => setSelectedStop(st)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                  selectedStop?.id === st.id
                    ? 'bg-slate-800 border-blue-500'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    st.status === 'COMPLETED' ? 'bg-emerald-500 text-slate-950' :
                    st.status === 'FAILED' ? 'bg-rose-500 text-white' :
                    'bg-slate-700 text-white'
                  }`}>
                    {st.sequence}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{st.recipientName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{st.trackingNumber}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(st.estimatedArrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    st.status === 'COMPLETED' ? 'text-emerald-400' :
                    st.status === 'FAILED' ? 'text-rose-400' :
                    'text-blue-400'
                  }`}>
                    {st.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Emergency / Support Strip */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Vehicle DL-01-AB-4920</span>
        </div>
        <button
          onClick={() => alert('Connected to Central Dispatch Helpline.')}
          className="text-blue-400 font-semibold text-xs hover:underline flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
          <span>Dispatch SOS</span>
        </button>
      </div>

    </div>
  );

  return (
    <div className="space-y-4">
      {/* Top Banner & Simulator Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span>Driver Companion Mobile Interface</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time delivery workflow with turn-by-turn stop list, live GPS broadcast, digital signature, and proof of delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrameMode(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              deviceFrameMode 
                ? 'bg-blue-600 text-white border-blue-500' 
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {deviceFrameMode ? 'Phone Frame Mode: ON' : 'Full Width View'}
          </button>
        </div>
      </div>

      {/* Container View: Mobile Frame or Responsive Desktop */}
      <div className="flex justify-center">
        {deviceFrameMode ? (
          <div className="w-full max-w-sm p-3 bg-slate-900 rounded-[38px] border-4 border-slate-700 shadow-2xl">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
            {DriverMobileView}
            {/* Bottom Home Indicator */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto mt-3" />
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {DriverMobileView}
          </div>
        )}
      </div>

      {/* MODAL: Proof of Delivery (POD) with HTML5 Canvas Signature & OTP */}
      {isPodModalOpen && selectedStop && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Proof of Delivery Verification</span>
              </h3>
              <button onClick={() => setIsPodModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handlePodSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="Person receiving parcel"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* OTP Input */}
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Customer 4-Digit Delivery PIN / OTP
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value)}
                      placeholder="e.g. 8492"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpInput('8492')}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 text-[11px] rounded border border-slate-700"
                  >
                    Auto-Fill Demo OTP
                  </button>
                </div>
              </div>

              {/* HTML5 Canvas Signature Pad */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300 font-medium flex items-center gap-1">
                    <PenTool className="w-3 h-3 text-blue-400" />
                    <span>Customer Digital Signature</span>
                  </label>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Clear Canvas
                  </button>
                </div>
                <div className="border border-slate-700 rounded-lg bg-white overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={340}
                    height={110}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[110px] cursor-crosshair touch-none"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Sign above using mouse, stylus, or fingertip</span>
              </div>

              {/* Photo Upload Simulator */}
              <div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-medium text-slate-200 block">Package Photo at Doorstep</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {photoSnapped ? '✓ Photo captured with GPS watermark' : 'Optional photographic record'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoSnapped(prev => !prev)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      photoSnapped ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {photoSnapped ? 'Retake' : 'Snap Photo'}
                  </button>
                </div>
              </div>

              {/* Driver Notes */}
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Delivery Notes (Optional)</label>
                <input
                  type="text"
                  value={podNotes}
                  onChange={e => setPodNotes(e.target.value)}
                  placeholder="e.g. Left with building security manager"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Automated GPS Stamp info */}
              <div className="p-2 bg-slate-950 rounded text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Auto-GPS Timestamp:</span>
                <span className="text-blue-400 font-bold">{driver.currentLocation.lat.toFixed(4)}° N, {driver.currentLocation.lng.toFixed(4)}° E</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPodModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-xs shadow-sm"
                >
                  Confirm & Mark Delivered
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Failed Delivery Reporting */}
      {isFailedModalOpen && selectedStop && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Report Delivery Exception</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select standard exception reason for shipment <span className="font-mono text-blue-400">{selectedStop.trackingNumber}</span>.
            </p>

            <form onSubmit={handleFailedSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Failure Reason Code *</label>
                <select
                  value={failureReason}
                  onChange={e => setFailureReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Customer unavailable">Customer unavailable / Premises closed</option>
                  <option value="Incorrect address provided">Incorrect address / Unreachable location</option>
                  <option value="Customer rejected delivery">Customer rejected delivery</option>
                  <option value="Package damaged in transit">Package damaged in transit</option>
                  <option value="Vehicle technical breakdown">Vehicle technical breakdown</option>
                  <option value="Customer requested reschedule">Customer requested reschedule</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Additional Courier Notes</label>
                <textarea
                  rows={3}
                  value={failureNotes}
                  onChange={e => setFailureNotes(e.target.value)}
                  placeholder="e.g. Ring bell 3 times, phone went to voicemail"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFailedModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs"
                >
                  Submit Exception to Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
