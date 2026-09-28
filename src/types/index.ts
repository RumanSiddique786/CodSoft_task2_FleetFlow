export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'DISPATCHER' 
  | 'WAREHOUSE_MANAGER' 
  | 'DRIVER' 
  | 'CUSTOMER';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  profileImage?: string;
  lastLogin: string;
  createdAt: string;
}

export type ShipmentStatus = 
  | 'CREATED'
  | 'PICKUP_SCHEDULED'
  | 'PICKED_UP'
  | 'AT_WAREHOUSE'
  | 'PROCESSING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'RESCHEDULED'
  | 'CANCELLED';

export interface StatusHistoryEntry {
  status: ShipmentStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
  location?: string;
}

export interface ProofOfDeliveryData {
  signatureBase64?: string;
  photoUrl?: string;
  otpVerified: boolean;
  otpCode?: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  recipientName: string;
  notes?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  customerId: string;
  customerName: string;
  customerCompany?: string;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  pickupCoords: { lat: number; lng: number };
  deliveryAddress: string;
  deliveryCoords: { lat: number; lng: number };
  packageType: 'Document' | 'Standard Box' | 'Fragile Parcel' | 'Heavy Cargo' | 'Pallet' | 'Temperature Controlled';
  weightKg: number;
  dimensions: string;
  priority: 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'CRITICAL';
  expectedDeliveryDate: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedVehicleId?: string;
  assignedVehicleReg?: string;
  warehouseId: string;
  warehouseName: string;
  status: ShipmentStatus;
  statusHistory: StatusHistoryEntry[];
  proofOfDelivery?: ProofOfDeliveryData;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type DriverStatus = 'AVAILABLE' | 'ON_DELIVERY' | 'OFF_DUTY' | 'ON_LEAVE' | 'SUSPENDED';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  experienceYears: number;
  status: DriverStatus;
  assignedVehicleId?: string;
  currentLocation: {
    lat: number;
    lng: number;
    speedKmH: number;
    headingDeg: number;
    timestamp: string;
  };
  metrics: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    onTimeRate: number;
    customerRating: number;
    distanceTravelledKm: number;
  };
  currentRouteId?: string;
  assignedShipmentsCount: number;
}

export type VehicleType = 'Bike' | 'Van' | 'Truck' | 'Mini Truck' | 'Container' | 'Electric Vehicle';
export type VehicleStatus = 'AVAILABLE' | 'ASSIGNED' | 'ON_TRIP' | 'MAINTENANCE' | 'INACTIVE';
export type FuelType = 'Electric' | 'Diesel' | 'Petrol' | 'CNG';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  vehicleType: VehicleType;
  model: string;
  manufacturer: string;
  year: number;
  fuelType: FuelType;
  capacityKg: number;
  status: VehicleStatus;
  currentLocation: {
    lat: number;
    lng: number;
  };
  mileageKm: number;
  fuelOrBatteryPercent: number;
  insuranceExpiry: string;
  fitnessExpiry: string;
  pucExpiry: string;
  assignedDriverId?: string;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  serviceType: 'Scheduled Service' | 'Brake Replacement' | 'Engine Overhaul' | 'Tire Rotation' | 'Battery Health Check' | 'Routine Inspection';
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  invoiceNumber?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
  notes: string;
  nextServiceDate: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  coordinates: { lat: number; lng: number };
  capacityTons: number;
  currentOccupancyTons: number;
  baysCount: number;
  activeShipmentsCount: number;
  managerName: string;
  phone: string;
}

export interface RouteStop {
  id: string;
  shipmentId: string;
  trackingNumber: string;
  recipientName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  sequence: number;
  estimatedArrival: string;
  actualArrival?: string;
  status: 'PENDING' | 'ARRIVED' | 'COMPLETED' | 'SKIPPED' | 'FAILED';
  packageType: string;
  weightKg: number;
}

export interface DeliveryRoute {
  id: string;
  name: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleReg: string;
  startLocation: { name: string; lat: number; lng: number };
  endLocation: { name: string; lat: number; lng: number };
  stops: RouteStop[];
  status: 'DRAFT' | 'OPTIMIZED' | 'IN_PROGRESS' | 'COMPLETED';
  totalDistanceKm: number;
  estimatedDurationMin: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorEmail: string;
  role: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
  ipAddress: string;
  oldValue?: string;
  newValue?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'SHIPMENT' | 'FLEET' | 'MAINTENANCE' | 'DRIVER' | 'SYSTEM';
  severity: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  read: boolean;
  linkAction?: string;
}
