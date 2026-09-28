import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Shipment, ShipmentStatus } from '../../types';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Package, 
  Search, 
  Scan,
  Sparkles
} from 'lucide-react';

interface PackageScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PackageScannerModal: React.FC<PackageScannerModalProps> = ({ isOpen, onClose }) => {
  const { shipments, scanBarcodeOrQr } = useFleet();
  const [inputCode, setInputCode] = useState('');
  const [targetStatus, setTargetStatus] = useState<ShipmentStatus>('AT_WAREHOUSE');
  const [scanResult, setScanResult] = useState<{ success: boolean; shipment?: Shipment; message: string } | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(true);

  if (!isOpen) return null;

  const handleScanExecution = (codeToScan: string) => {
    if (!codeToScan.trim()) return;
    const result = scanBarcodeOrQr(codeToScan, targetStatus);
    setScanResult(result);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScanExecution(inputCode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Warehouse Package Scanner</h3>
              <p className="text-xs text-slate-400">Barcode & QR optical intake system</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Target Status Selector */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Scan Action & Target Status Transition
          </label>
          <select
            value={targetStatus}
            onChange={e => setTargetStatus(e.target.value as ShipmentStatus)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="AT_WAREHOUSE">Intake: Receive Package at Warehouse Bay (AT_WAREHOUSE)</option>
            <option value="PROCESSING">Sort: Security Check & Sorting (PROCESSING)</option>
            <option value="OUT_FOR_DELIVERY">Dispatch: Loaded for Out for Delivery (OUT_FOR_DELIVERY)</option>
            <option value="DELIVERED">Customer Drop: Handover (DELIVERED)</option>
          </select>
        </div>

        {/* Optical Camera Viewfinder Simulation */}
        <div className="mt-4 relative bg-slate-950 rounded-xl border-2 border-slate-800 h-52 flex flex-col items-center justify-center overflow-hidden">
          {/* Viewfinder Target Reticle */}
          <div className="w-48 h-36 border-2 border-blue-400/80 rounded-lg relative flex items-center justify-center shadow-lg">
            {/* Corner brackets */}
            <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
            <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-400" />

            {/* Red Laser Sweep Bar */}
            <div className="w-full h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-bounce" />

            <div className="absolute text-[10px] text-blue-300 font-mono bottom-2">
              ALIGN BARCODE OR QR
            </div>
          </div>

          <div className="absolute bottom-2 text-center text-[10px] text-slate-500 font-mono">
            Optical Sensor Active · 60 FPS
          </div>
        </div>

        {/* Quick Demo Scan Buttons */}
        <div className="mt-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Quick-Scan Demo Parcels
          </span>
          <div className="flex flex-wrap gap-1.5">
            {shipments.slice(0, 4).map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setInputCode(s.trackingNumber);
                  handleScanExecution(s.trackingNumber);
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono rounded border border-slate-700 transition-colors flex items-center gap-1"
              >
                <QrCode className="w-3 h-3 text-blue-400" />
                <span>{s.trackingNumber}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Barcode / Tracking input */}
        <form onSubmit={handleManualSubmit} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type or paste tracking number..."
            value={inputCode}
            onChange={e => setInputCode(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
          >
            Process Scan
          </button>
        </form>

        {/* Scan Result Notification */}
        {scanResult && (
          <div className={`mt-4 p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
            scanResult.success 
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300' 
              : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
          }`}>
            {scanResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-bold block">{scanResult.message}</span>
              {scanResult.shipment && (
                <div className="mt-1 text-[11px] text-slate-300 space-y-0.5">
                  <p>Customer: {scanResult.shipment.customerName} ({scanResult.shipment.customerCompany || 'Individual'})</p>
                  <p>Destination: {scanResult.shipment.deliveryAddress}</p>
                  <p className="font-mono text-emerald-400 font-bold">New Status: {scanResult.shipment.status}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
