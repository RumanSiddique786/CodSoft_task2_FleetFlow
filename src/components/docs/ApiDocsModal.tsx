import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Code2, Play, CheckCircle2, Copy, Send, Sparkles } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EndpointDef {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  category: string;
  description: string;
  sampleRequest?: object;
  handler: (fleet: any) => object;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const fleet = useFleet();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const endpoints: EndpointDef[] = [
    {
      method: 'GET',
      path: '/api/v1/shipments',
      category: 'Shipments',
      description: 'Fetch list of all shipments with status, customer, and driver assignments.',
      handler: f => ({
        success: true,
        count: f.shipments.length,
        data: f.shipments.slice(0, 3),
      }),
    },
    {
      method: 'GET',
      path: '/api/v1/tracking/FF202609240001',
      category: 'Public Tracking',
      description: 'Public endpoint to query shipment timeline and courier location by tracking ID.',
      handler: f => {
        const s = f.shipments[0];
        return {
          success: true,
          trackingNumber: s.trackingNumber,
          status: s.status,
          expectedArrival: s.expectedDeliveryDate,
          deliveryAddress: s.deliveryAddress,
          assignedCourier: s.assignedDriverName,
          milestones: s.statusHistory,
        };
      },
    },
    {
      method: 'GET',
      path: '/api/v1/drivers/DRV001/location',
      category: 'Telemetry',
      description: 'Real-time GPS coordinates, velocity, heading and battery telemetry of driver vehicle.',
      handler: f => {
        const d = f.drivers[0];
        return {
          success: true,
          driverId: d.id,
          name: d.name,
          status: d.status,
          telemetry: {
            latitude: d.currentLocation.lat,
            longitude: d.currentLocation.lng,
            speedKmH: d.currentLocation.speedKmH,
            headingDegrees: d.currentLocation.headingDeg,
            timestamp: d.currentLocation.timestamp,
          },
        };
      },
    },
    {
      method: 'POST',
      path: '/api/v1/routes/RT-101/optimize',
      category: 'Routes & Dispatch',
      description: 'Executes Traveling Salesperson algorithm to order stop sequence minimizing total kilometers.',
      sampleRequest: {
        routeId: 'RT-101',
        algorithm: 'NEAREST_NEIGHBOR_2OPT',
      },
      handler: () => ({
        success: true,
        message: 'Route sequence successfully optimized',
        routeId: 'RT-101',
        metrics: {
          distanceSavedKm: 9.4,
          transitMinutesSaved: 22,
          optimizedStopSequence: ['ST-01', 'ST-02', 'ST-03'],
        },
      }),
    },
    {
      method: 'POST',
      path: '/api/v1/shipments/FF202609240001/proof-of-delivery',
      category: 'Deliveries',
      description: 'Submits recipient digital signature, OTP verification, and GPS stamp upon handover.',
      sampleRequest: {
        trackingNumber: 'FF202609240001',
        recipientName: 'Aarav Patel',
        otpCode: '8492',
        signatureBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUh...',
        coordinates: { lat: 28.6328, lng: 77.2197 },
      },
      handler: () => ({
        success: true,
        message: 'Proof of Delivery verified and archived',
        newStatus: 'DELIVERED',
        timestamp: new Date().toISOString(),
      }),
    },
    {
      method: 'GET',
      path: '/api/v1/vehicles/compliance-alerts',
      category: 'Vehicles',
      description: 'Returns fleet vehicles with PUC, Fitness, or Insurance expiring within 30 days.',
      handler: f => ({
        success: true,
        alertsCount: 2,
        expiringVehicles: f.vehicles.slice(0, 2).map((v: any) => ({
          registrationNumber: v.registrationNumber,
          model: v.model,
          pucExpiry: v.pucExpiry,
          insuranceExpiry: v.insuranceExpiry,
        })),
      }),
    },
  ];

  const currentEndpoint = endpoints[selectedIdx];

  const runTester = () => {
    const res = currentEndpoint.handler(fleet);
    setTestOutput(JSON.stringify(res, null, 2));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">FleetFlow OpenAPI / Swagger Explorer</h3>
              <p className="text-xs text-slate-400">Interactive REST API documentation & sandbox</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Content Area */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
          
          {/* Endpoint Selector (Left 4 cols) */}
          <div className="md:col-span-4 space-y-1.5 overflow-y-auto pr-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Endpoints
            </span>
            {endpoints.map((ep, idx) => (
              <button
                key={ep.path}
                onClick={() => {
                  setSelectedIdx(idx);
                  setTestOutput(null);
                }}
                className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                  selectedIdx === idx
                    ? 'bg-slate-800 border-blue-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                    ep.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-[11px] truncate">{ep.path}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Endpoint Details & Live Sandbox (Right 8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  currentEndpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                  currentEndpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-amber-500/20 text-amber-400'
                }`}>
                  {currentEndpoint.method}
                </span>
                <span className="font-mono font-bold text-sm text-white">{currentEndpoint.path}</span>
              </div>
              <p className="text-xs text-slate-300">{currentEndpoint.description}</p>

              {currentEndpoint.sampleRequest && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    Sample JSON Request Body
                  </span>
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-blue-300 overflow-x-auto">
                    {JSON.stringify(currentEndpoint.sampleRequest, null, 2)}
                  </pre>
                </div>
              )}

              {/* Try It Out Button */}
              <div className="pt-2">
                <button
                  onClick={runTester}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request (Live Sandbox)</span>
                </button>
              </div>

              {/* Live Response Box */}
              {testOutput && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                        HTTP 200 OK
                      </span>
                      <span className="text-slate-400 text-[11px] font-mono">Response Time: 12ms</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(testOutput)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 max-h-56 overflow-y-auto">
                    {testOutput}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Base URL: <span className="text-slate-400">https://api.fleetflow.io/v1</span> · JWT Bearer Token Auth
            </div>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
};
