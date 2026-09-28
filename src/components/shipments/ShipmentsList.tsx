import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { Shipment, ShipmentStatus } from '../../types';
import { generateBarcodeSvg, generateQrMatrix } from '../../utils/qrBarcode';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  QrCode, 
  Printer, 
  UserCheck, 
  Eye, 
  Calendar, 
  Package, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const ShipmentsList: React.FC = () => {
  const { 
    shipments, 
    drivers, 
    vehicles, 
    warehouses, 
    createShipment, 
    updateShipmentStatus, 
    assignShipmentDriver,
    rescheduleShipment 
  } = useFleet();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  
  // Modals & Drawers state
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isNewShipmentOpen, setIsNewShipmentOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerCompany, setNewCustomerCompany] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newPickupAddress, setNewPickupAddress] = useState('Sector 62, Metro North Central Hub, Noida');
  const [newDeliveryAddress, setNewDeliveryAddress] = useState('');
  const [newPackageType, setNewPackageType] = useState<Shipment['packageType']>('Standard Box');
  const [newWeightKg, setNewWeightKg] = useState('5.0');
  const [newDimensions, setNewDimensions] = useState('30x20x15 cm');
  const [newPriority, setNewPriority] = useState<Shipment['priority']>('EXPRESS');
  const [newWarehouseId, setNewWarehouseId] = useState(warehouses[0]?.id || 'WH-01');
  const [newExpectedDate, setNewExpectedDate] = useState('2026-09-24T18:00');

  // Assignment modal state
  const [assignDriverId, setAssignDriverId] = useState('');
  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('2026-09-25T11:00');
  // Status transition state
  const [transitionStatus, setTransitionStatus] = useState<ShipmentStatus>('PROCESSING');
  const [transitionNote, setTransitionNote] = useState('');

  // Filtered shipments
  const filteredShipments = shipments.filter(shp => {
    const matchesSearch = 
      shp.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shp.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shp.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || shp.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || shp.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="text-blue-400 font-semibold text-xs flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Out for Delivery</span>;
      case 'PROCESSING':
        return <span className="text-amber-400 font-semibold text-xs flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Processing</span>;
      case 'AT_WAREHOUSE':
        return <span className="text-purple-400 font-semibold text-xs flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> At Warehouse</span>;
      case 'PICKED_UP':
        return <span className="text-indigo-400 font-semibold text-xs flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Picked Up</span>;
      case 'PICKUP_SCHEDULED':
        return <span className="text-sky-400 font-semibold text-xs flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Pickup Scheduled</span>;
      case 'CREATED':
        return <span className="text-slate-400 font-semibold text-xs flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Created</span>;
      case 'DELIVERY_FAILED':
        return <span className="text-rose-400 font-semibold text-xs flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Failed</span>;
      case 'RESCHEDULED':
        return <span className="text-orange-400 font-semibold text-xs flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5" /> Rescheduled</span>;
      case 'CANCELLED':
        return <span className="text-slate-500 font-semibold text-xs flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newDeliveryAddress.trim()) {
      setFormError('Please fill in required fields: Customer Name and Delivery Address.');
      return;
    }
    setFormError(null);

    const warehouse = warehouses.find(w => w.id === newWarehouseId);
    const nextIndex = shipments.reduce((max, s) => {
      const match = s.trackingNumber.match(/\d{4}$/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0) + 1;
    const trackingNumber = `FF20260924${nextIndex.toString().padStart(4, '0')}`;

    createShipment({
      trackingNumber,
      customerId: `CUST-${(nextIndex + 10).toString()}`,
      customerName: newCustomerName.trim(),
      customerCompany: newCustomerCompany.trim() || undefined,
      customerEmail: newCustomerEmail.trim() || 'customer@example.com',
      customerPhone: newCustomerPhone.trim() || '+91 98000 00000',
      pickupAddress: newPickupAddress,
      pickupCoords: warehouse?.coordinates || { lat: 28.6280, lng: 77.3649 },
      deliveryAddress: newDeliveryAddress.trim(),
      deliveryCoords: { 
        lat: Number((28.50 + Math.random() * 0.18).toFixed(4)), 
        lng: Number((77.10 + Math.random() * 0.25).toFixed(4)) 
      },
      packageType: newPackageType,
      weightKg: parseFloat(newWeightKg) || 2.5,
      dimensions: newDimensions,
      priority: newPriority,
      expectedDeliveryDate: new Date(newExpectedDate).toISOString(),
      warehouseId: warehouse?.id || 'WH-01',
      warehouseName: warehouse?.name || 'Metro North Central Hub',
      status: 'CREATED',
    });

    setIsNewShipmentOpen(false);
    // Reset form
    setNewCustomerName('');
    setNewCustomerCompany('');
    setNewDeliveryAddress('');
    setFormError(null);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment || !assignDriverId) return;
    assignShipmentDriver(selectedShipment.trackingNumber, assignDriverId);
    setIsAssignModalOpen(false);
    setSelectedShipment(null);
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    updateShipmentStatus(selectedShipment.trackingNumber, transitionStatus, transitionNote);
    setIsStatusModalOpen(false);
    setSelectedShipment(null);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    rescheduleShipment(selectedShipment.trackingNumber, new Date(rescheduleDate).toISOString());
    setIsRescheduleModalOpen(false);
    setSelectedShipment(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Header with Search, Filter & + New Shipment */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tracking #, customer or address..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="CREATED">Created</option>
            <option value="PICKUP_SCHEDULED">Pickup Scheduled</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="AT_WAREHOUSE">At Warehouse</option>
            <option value="PROCESSING">Processing</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="DELIVERY_FAILED">Delivery Failed</option>
            <option value="RESCHEDULED">Rescheduled</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="STANDARD">Standard</option>
            <option value="EXPRESS">Express</option>
            <option value="SAME_DAY">Same Day</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsNewShipmentOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Shipment</span>
        </button>
      </div>

      {/* Shipments Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Tracking Number</th>
                <th className="py-3 px-4">Customer & Company</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Priority / Type</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Driver & Vehicle</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No shipments found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredShipments.map(shp => (
                  <tr key={shp.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Tracking # */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-400">
                      <button 
                        onClick={() => setSelectedShipment(shp)}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <span>{shp.trackingNumber}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </button>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{shp.customerName}</div>
                      {shp.customerCompany && (
                        <div className="text-[11px] text-slate-400">{shp.customerCompany}</div>
                      )}
                    </td>

                    {/* Destination */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="truncate text-slate-300" title={shp.deliveryAddress}>
                        {shp.deliveryAddress}
                      </p>
                    </td>

                    {/* Priority & Package */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          shp.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          shp.priority === 'SAME_DAY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          shp.priority === 'EXPRESS' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {shp.priority}
                        </span>
                        <span className="text-[11px] text-slate-400">{shp.packageType}</span>
                      </div>
                    </td>

                    {/* Current Status */}
                    <td className="py-3 px-4">
                      {getStatusBadge(shp.status)}
                    </td>

                    {/* Driver & Vehicle */}
                    <td className="py-3 px-4">
                      {shp.assignedDriverName ? (
                        <div>
                          <span className="font-medium text-slate-200">{shp.assignedDriverName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{shp.assignedVehicleReg || 'No Vehicle'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedShipment(shp);
                            setIsLabelModalOpen(true);
                          }}
                          title="Print QR Shipping Label"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-400" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedShipment(shp);
                            setAssignDriverId(shp.assignedDriverId || drivers[0].id);
                            setIsAssignModalOpen(true);
                          }}
                          title="Assign Driver"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedShipment(shp);
                            setTransitionStatus(shp.status);
                            setIsStatusModalOpen(true);
                          }}
                          title="Update Status Lifecycle"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                        </button>

                        {shp.status === 'DELIVERY_FAILED' && (
                          <button
                            onClick={() => {
                              setSelectedShipment(shp);
                              setIsRescheduleModalOpen(true);
                            }}
                            title="Reschedule Failed Delivery"
                            className="p-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: New Shipment Form */}
      {isNewShipmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <span>Create New Shipment</span>
              </h3>
              <button onClick={() => setIsNewShipmentOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Customer Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={e => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Aarav Patel"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    value={newCustomerCompany}
                    onChange={e => setNewCustomerCompany(e.target.value)}
                    placeholder="e.g. Apex Biotech Solutions"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={newCustomerEmail}
                    onChange={e => setNewCustomerEmail(e.target.value)}
                    placeholder="customer@domain.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Customer Phone</label>
                  <input
                    type="text"
                    value={newCustomerPhone}
                    onChange={e => setNewCustomerPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-300 font-medium block mb-1">Pickup Facility / Warehouse</label>
                  <select
                    value={newWarehouseId}
                    onChange={e => setNewWarehouseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-300 font-medium block mb-1">Delivery Destination Address *</label>
                  <input
                    type="text"
                    required
                    value={newDeliveryAddress}
                    onChange={e => setNewDeliveryAddress(e.target.value)}
                    placeholder="Full street address, building, city"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Package Type</label>
                  <select
                    value={newPackageType}
                    onChange={e => setNewPackageType(e.target.value as Shipment['packageType'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Standard Box">Standard Box</option>
                    <option value="Document">Document</option>
                    <option value="Fragile Parcel">Fragile Parcel</option>
                    <option value="Heavy Cargo">Heavy Cargo</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Temperature Controlled">Temperature Controlled</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newWeightKg}
                    onChange={e => setNewWeightKg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Priority SLA</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as Shipment['priority'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="EXPRESS">Express</option>
                    <option value="SAME_DAY">Same Day</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Expected Delivery Slot</label>
                  <input
                    type="datetime-local"
                    value={newExpectedDate}
                    onChange={e => setNewExpectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewShipmentOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs"
                >
                  Create & Generate Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Printable Shipping Label & QR Barcode Viewer */}
      {isLabelModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-400" />
                <span>Shipping Label & QR Tag</span>
              </h3>
              <button onClick={() => setIsLabelModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Printable Label Box */}
            <div className="mt-4 p-4 bg-white text-slate-900 rounded-lg border-2 border-slate-900 font-sans shadow-md">
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2">
                <div>
                  <span className="text-lg font-black tracking-wider uppercase">FLEETFLOW LOGISTICS</span>
                  <p className="text-[10px] text-slate-600 font-mono">PRIORITY: {selectedShipment.priority}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                    {selectedShipment.warehouseName.slice(0, 12)}
                  </span>
                </div>
              </div>

              {/* Barcode SVG */}
              <div className="my-3 flex flex-col items-center">
                <div 
                  className="w-full h-12"
                  dangerouslySetInnerHTML={{ __html: generateBarcodeSvg(selectedShipment.trackingNumber, 280, 48) }}
                />
                <span className="text-xs font-mono font-bold tracking-widest mt-1">
                  *{selectedShipment.trackingNumber}*
                </span>
              </div>

              {/* Destination & Specs */}
              <div className="border-t border-slate-300 pt-2 grid grid-cols-3 gap-2 text-left">
                <div className="col-span-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Deliver To:</span>
                  <p className="text-xs font-bold leading-tight">{selectedShipment.customerName}</p>
                  {selectedShipment.customerCompany && (
                    <p className="text-[10px] text-slate-700">{selectedShipment.customerCompany}</p>
                  )}
                  <p className="text-[10px] text-slate-800 leading-normal mt-0.5">{selectedShipment.deliveryAddress}</p>
                  <p className="text-[10px] text-slate-600 font-mono mt-0.5">{selectedShipment.customerPhone}</p>
                </div>

                {/* QR Code vector canvas */}
                <div className="flex flex-col items-center justify-center p-1 bg-slate-100 rounded border border-slate-200">
                  <svg className="w-16 h-16" viewBox="0 0 21 21">
                    {generateQrMatrix(selectedShipment.trackingNumber).map((row, r) => 
                      row.map((cell, c) => cell ? (
                        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0f172a" />
                      ) : null)
                    )}
                  </svg>
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">SCAN ME</span>
                </div>
              </div>

              <div className="border-t border-slate-300 mt-2 pt-2 flex justify-between text-[10px] font-mono text-slate-600">
                <span>Weight: {selectedShipment.weightKg} kg</span>
                <span>Type: {selectedShipment.packageType}</span>
                <span>SLA: {new Date(selectedShipment.expectedDeliveryDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-slate-400">Ready for thermal or standard label printer</span>
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Assign Driver & Vehicle */}
      {isAssignModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Assign Courier Driver</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Assign shipment <span className="font-mono text-blue-400">{selectedShipment.trackingNumber}</span> to an available fleet driver.
            </p>

            <form onSubmit={handleAssignSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Select Driver</label>
                <select
                  value={assignDriverId}
                  onChange={e => setAssignDriverId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {drivers.map(d => {
                    const veh = vehicles.find(v => v.id === d.assignedVehicleId);
                    return (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.status}) - {veh?.registrationNumber || 'No vehicle'}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Status Transition State Machine */}
      {isStatusModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>Update Shipment Status</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Current state: <span className="font-semibold text-white">{selectedShipment.status}</span>
            </p>

            <form onSubmit={handleStatusSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Next Lifecycle Stage</label>
                <select
                  value={transitionStatus}
                  onChange={e => setTransitionStatus(e.target.value as ShipmentStatus)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="CREATED">CREATED</option>
                  <option value="PICKUP_SCHEDULED">PICKUP_SCHEDULED</option>
                  <option value="PICKED_UP">PICKED_UP</option>
                  <option value="AT_WAREHOUSE">AT_WAREHOUSE</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="DELIVERY_FAILED">DELIVERY_FAILED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Operational Note</label>
                <input
                  type="text"
                  placeholder="e.g. Scanned at gate dock bay 3"
                  value={transitionNote}
                  onChange={e => setTransitionNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded text-xs"
                >
                  Apply Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Reschedule Shipment */}
      {isRescheduleModalOpen && selectedShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Reschedule Delivery Attempt</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Previous failure reason: <span className="text-rose-400">{selectedShipment.failureReason || 'Customer unavailable'}</span>
            </p>

            <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">New Delivery Window</label>
                <input
                  type="datetime-local"
                  required
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded text-xs"
                >
                  Reschedule Delivery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRAWER / DETAILS MODAL: Full Historical Lifecycle Timeline */}
      {selectedShipment && !isLabelModalOpen && !isAssignModalOpen && !isStatusModalOpen && !isRescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{selectedShipment.trackingNumber}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedShipment.customerName}</h3>
                <p className="text-xs text-slate-400">{selectedShipment.deliveryAddress}</p>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Proof of Delivery Card if Delivered */}
            {selectedShipment.status === 'DELIVERED' && selectedShipment.proofOfDelivery && (
              <div className="mt-4 p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Proof of Delivery (POD)</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Recipient</span>
                    <span className="font-semibold text-white">{selectedShipment.proofOfDelivery.recipientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Customer OTP</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {selectedShipment.proofOfDelivery.otpVerified ? `Verified (Code: ${selectedShipment.proofOfDelivery.otpCode || '****'})` : 'Bypassed'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 text-[10px] block">GPS Geostamp</span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {selectedShipment.proofOfDelivery.coordinates?.lat.toFixed(4)}° N, {selectedShipment.proofOfDelivery.coordinates?.lng.toFixed(4)}° E
                    </span>
                  </div>
                  {selectedShipment.proofOfDelivery.notes && (
                    <div className="col-span-2 text-slate-400 italic text-[11px]">
                      Notes: {selectedShipment.proofOfDelivery.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lifecycle Timeline */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Lifecycle Audit Trail
              </h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-slate-800">
                {selectedShipment.statusHistory.map((hist, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{hist.status}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(hist.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      {hist.note && (
                        <p className="text-xs text-slate-400 mt-0.5">{hist.note}</p>
                      )}
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Updated by: <span className="text-slate-400">{hist.updatedBy}</span>
                        {hist.location && <span> · {hist.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedShipment(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
