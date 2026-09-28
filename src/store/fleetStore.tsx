import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Shipment,
  ShipmentStatus,
  Driver,
  Vehicle,
  Warehouse,
  DeliveryRoute,
  RouteStop,
  MaintenanceRecord,
  AuditLog,
  NotificationItem,
  UserRole,
  User,
  ProofOfDeliveryData,
} from '../types';

// Initial Mock Seed Data
const INITIAL_USERS: User[] = [
  {
    id: 'USR001',
    firstName: 'Ruman',
    lastName: 'Tanweer',
    email: 'rumantanweer50@gmail.com',
    phone: '+1 (555) 234-5678',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    lastLogin: '2026-09-24T06:45:00Z',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'USR002',
    firstName: 'Devendra',
    lastName: 'Singh',
    email: 'devendra.ops@fleetflow.io',
    phone: '+1 (555) 345-6789',
    role: 'DISPATCHER',
    status: 'ACTIVE',
    lastLogin: '2026-09-24T06:12:00Z',
    createdAt: '2025-02-01T11:00:00Z',
  },
  {
    id: 'USR003',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.wh@fleetflow.io',
    phone: '+1 (555) 456-7890',
    role: 'WAREHOUSE_MANAGER',
    status: 'ACTIVE',
    lastLogin: '2026-09-24T05:30:00Z',
    createdAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'USR004',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    email: 'rajesh.driver@fleetflow.io',
    phone: '+91 98765 43210',
    role: 'DRIVER',
    status: 'ACTIVE',
    lastLogin: '2026-09-24T06:50:00Z',
    createdAt: '2025-03-01T08:00:00Z',
  },
];

const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'WH-01',
    name: 'Metro North Central Hub',
    code: 'DEL-N-01',
    address: 'Sector 62, Industrial Logistics Zone, Noida',
    coordinates: { lat: 28.6280, lng: 77.3649 },
    capacityTons: 450,
    currentOccupancyTons: 312,
    baysCount: 16,
    activeShipmentsCount: 142,
    managerName: 'Marcus Vance',
    phone: '+91 98110 55432',
  },
  {
    id: 'WH-02',
    name: 'South Gurugram Regional Depot',
    code: 'GGN-S-02',
    address: 'Udyog Vihar Phase IV, Gurugram',
    coordinates: { lat: 28.4985, lng: 77.0850 },
    capacityTons: 600,
    currentOccupancyTons: 478,
    baysCount: 22,
    activeShipmentsCount: 210,
    managerName: 'Kavita Chawla',
    phone: '+91 98110 99876',
  },
  {
    id: 'WH-03',
    name: 'West Aerocity Freight Center',
    code: 'DEL-W-03',
    address: 'Cargo Complex, IGI Airport Terminal 3, New Delhi',
    coordinates: { lat: 28.5562, lng: 77.1000 },
    capacityTons: 850,
    currentOccupancyTons: 520,
    baysCount: 30,
    activeShipmentsCount: 340,
    managerName: 'Arjun Mehta',
    phone: '+91 98112 33445',
  },
];

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'VEH-01',
    registrationNumber: 'DL-01-AB-4920',
    vehicleType: 'Electric Vehicle',
    model: 'E-Transit Custom 350',
    manufacturer: 'Ford Pro',
    year: 2024,
    fuelType: 'Electric',
    capacityKg: 1450,
    status: 'ON_TRIP',
    currentLocation: { lat: 28.6145, lng: 77.2185 },
    mileageKm: 28450,
    fuelOrBatteryPercent: 78,
    insuranceExpiry: '2026-11-20',
    fitnessExpiry: '2027-04-15',
    pucExpiry: '2026-10-10', // Expiry alert in 16 days!
    assignedDriverId: 'DRV001',
  },
  {
    id: 'VEH-02',
    registrationNumber: 'DL-04-CK-8812',
    vehicleType: 'Bike',
    model: 'Cargo Pro EV 450X',
    manufacturer: 'Ather Express',
    year: 2024,
    fuelType: 'Electric',
    capacityKg: 85,
    status: 'AVAILABLE',
    currentLocation: { lat: 28.6280, lng: 77.3649 },
    mileageKm: 11200,
    fuelOrBatteryPercent: 94,
    insuranceExpiry: '2027-01-30',
    fitnessExpiry: '2027-08-12',
    pucExpiry: '2027-03-15',
    assignedDriverId: 'DRV002',
  },
  {
    id: 'VEH-03',
    registrationNumber: 'HR-26-EE-9041',
    vehicleType: 'Truck',
    model: 'Prima 2830.K Heavy Tipper',
    manufacturer: 'Tata Motors',
    year: 2023,
    fuelType: 'Diesel',
    capacityKg: 18000,
    status: 'ON_TRIP',
    currentLocation: { lat: 28.5355, lng: 77.1550 },
    mileageKm: 94300,
    fuelOrBatteryPercent: 62,
    insuranceExpiry: '2026-12-05',
    fitnessExpiry: '2026-10-02', // Expiry alert in 8 days!
    pucExpiry: '2026-11-18',
    assignedDriverId: 'DRV003',
  },
  {
    id: 'VEH-04',
    registrationNumber: 'DL-08-EV-2044',
    vehicleType: 'Van',
    model: 'Ace EV Delivery Van',
    manufacturer: 'Tata Motors',
    year: 2024,
    fuelType: 'Electric',
    capacityKg: 1000,
    status: 'ON_TRIP',
    currentLocation: { lat: 28.5720, lng: 77.2280 },
    mileageKm: 19800,
    fuelOrBatteryPercent: 84,
    insuranceExpiry: '2027-05-10',
    fitnessExpiry: '2027-06-25',
    pucExpiry: '2027-04-11',
    assignedDriverId: 'DRV004',
  },
  {
    id: 'VEH-05',
    registrationNumber: 'DL-12-CX-3310',
    vehicleType: 'Container',
    model: 'Pro 2049 E-Plus',
    manufacturer: 'Eicher',
    year: 2022,
    fuelType: 'CNG',
    capacityKg: 4200,
    status: 'MAINTENANCE',
    currentLocation: { lat: 28.6280, lng: 77.3649 },
    mileageKm: 76500,
    fuelOrBatteryPercent: 40,
    insuranceExpiry: '2026-10-01', // Due soon!
    fitnessExpiry: '2026-10-14',
    pucExpiry: '2026-10-08',
  },
];

const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'DRV001',
    name: 'Rajesh Sharma',
    phone: '+91 98765 43210',
    email: 'rajesh.driver@fleetflow.io',
    licenseNumber: 'DL-0420180092144',
    licenseExpiry: '2028-04-18',
    experienceYears: 7,
    status: 'ON_DELIVERY',
    assignedVehicleId: 'VEH-01',
    currentLocation: {
      lat: 28.6145,
      lng: 77.2185,
      speedKmH: 38,
      headingDeg: 72,
      timestamp: '2026-09-24T07:00:00Z',
    },
    metrics: {
      totalDeliveries: 428,
      successfulDeliveries: 419,
      failedDeliveries: 9,
      onTimeRate: 97.8,
      customerRating: 4.92,
      distanceTravelledKm: 14820,
    },
    currentRouteId: 'RT-101',
    assignedShipmentsCount: 3,
  },
  {
    id: 'DRV002',
    name: 'Amit Verma',
    phone: '+91 98765 11223',
    email: 'amit.verma@fleetflow.io',
    licenseNumber: 'DL-0920210044521',
    licenseExpiry: '2026-10-05', // License expiry alert!
    experienceYears: 3,
    status: 'AVAILABLE',
    assignedVehicleId: 'VEH-02',
    currentLocation: {
      lat: 28.6280,
      lng: 77.3649,
      speedKmH: 0,
      headingDeg: 0,
      timestamp: '2026-09-24T06:55:00Z',
    },
    metrics: {
      totalDeliveries: 215,
      successfulDeliveries: 208,
      failedDeliveries: 7,
      onTimeRate: 96.5,
      customerRating: 4.85,
      distanceTravelledKm: 6410,
    },
    assignedShipmentsCount: 0,
  },
  {
    id: 'DRV003',
    name: 'Vikram Singh',
    phone: '+91 98765 88990',
    email: 'vikram.singh@fleetflow.io',
    licenseNumber: 'HR-2620150033100',
    licenseExpiry: '2029-08-22',
    experienceYears: 12,
    status: 'ON_DELIVERY',
    assignedVehicleId: 'VEH-03',
    currentLocation: {
      lat: 28.5355,
      lng: 77.1550,
      speedKmH: 48,
      headingDeg: 195,
      timestamp: '2026-09-24T06:58:00Z',
    },
    metrics: {
      totalDeliveries: 890,
      successfulDeliveries: 878,
      failedDeliveries: 12,
      onTimeRate: 98.6,
      customerRating: 4.96,
      distanceTravelledKm: 42100,
    },
    currentRouteId: 'RT-103',
    assignedShipmentsCount: 1,
  },
  {
    id: 'DRV004',
    name: 'Priya Nair',
    phone: '+91 98765 55667',
    email: 'priya.nair@fleetflow.io',
    licenseNumber: 'DL-0220200088912',
    licenseExpiry: '2030-02-14',
    experienceYears: 5,
    status: 'ON_DELIVERY',
    assignedVehicleId: 'VEH-04',
    currentLocation: {
      lat: 28.5720,
      lng: 77.2280,
      speedKmH: 32,
      headingDeg: 110,
      timestamp: '2026-09-24T07:01:00Z',
    },
    metrics: {
      totalDeliveries: 340,
      successfulDeliveries: 334,
      failedDeliveries: 6,
      onTimeRate: 98.2,
      customerRating: 4.94,
      distanceTravelledKm: 11950,
    },
    currentRouteId: 'RT-102',
    assignedShipmentsCount: 2,
  },
];

const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'SHP-001',
    trackingNumber: 'FF202609240001',
    customerId: 'CUST-01',
    customerName: 'Aarav Patel',
    customerCompany: 'Apex Biotech Solutions',
    customerEmail: 'aarav@apexbiotech.com',
    customerPhone: '+91 98200 45678',
    pickupAddress: 'Sector 62, Metro North Central Hub, Noida',
    pickupCoords: { lat: 28.6280, lng: 77.3649 },
    deliveryAddress: 'Connaught Place, Block B, New Delhi',
    deliveryCoords: { lat: 28.6328, lng: 77.2197 },
    packageType: 'Temperature Controlled',
    weightKg: 8.5,
    dimensions: '40x30x25 cm',
    priority: 'CRITICAL',
    expectedDeliveryDate: '2026-09-24T12:00:00Z',
    assignedDriverId: 'DRV001',
    assignedDriverName: 'Rajesh Sharma',
    assignedVehicleId: 'VEH-01',
    assignedVehicleReg: 'DL-01-AB-4920',
    warehouseId: 'WH-01',
    warehouseName: 'Metro North Central Hub',
    status: 'OUT_FOR_DELIVERY',
    statusHistory: [
      { status: 'CREATED', timestamp: '2026-09-24T04:30:00Z', note: 'Booking registered by enterprise portal', updatedBy: 'Admin Ruman', location: 'Dispatch Center' },
      { status: 'PICKUP_SCHEDULED', timestamp: '2026-09-24T04:45:00Z', note: 'Dock scheduled at Sector 62', updatedBy: 'Dispatcher Devendra' },
      { status: 'PICKED_UP', timestamp: '2026-09-24T05:20:00Z', note: 'Received from shipper dock', updatedBy: 'Marcus Vance', location: 'Noida Hub' },
      { status: 'AT_WAREHOUSE', timestamp: '2026-09-24T05:40:00Z', note: 'Scanned at Bay 04 scanner', updatedBy: 'Marcus Vance', location: 'Bay 04' },
      { status: 'PROCESSING', timestamp: '2026-09-24T06:15:00Z', note: 'Cold chain verified at 4°C', updatedBy: 'Marcus Vance' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-09-24T06:45:00Z', note: 'Dispatched on Route RT-101', updatedBy: 'Rajesh Sharma', location: 'Vehicle DL-01-AB-4920' },
    ],
    createdAt: '2026-09-24T04:30:00Z',
    updatedAt: '2026-09-24T06:45:00Z',
  },
  {
    id: 'SHP-002',
    trackingNumber: 'FF202609240002',
    customerId: 'CUST-02',
    customerName: 'Ananya Deshmukh',
    customerCompany: 'Deshmukh Electronics',
    customerEmail: 'ananya@deshmukhelec.in',
    customerPhone: '+91 98201 11223',
    pickupAddress: 'Sector 62, Metro North Central Hub, Noida',
    pickupCoords: { lat: 28.6280, lng: 77.3649 },
    deliveryAddress: 'Defence Colony, Ring Road, New Delhi',
    deliveryCoords: { lat: 28.5725, lng: 77.2340 },
    packageType: 'Standard Box',
    weightKg: 14.2,
    dimensions: '55x45x30 cm',
    priority: 'EXPRESS',
    expectedDeliveryDate: '2026-09-24T13:30:00Z',
    assignedDriverId: 'DRV001',
    assignedDriverName: 'Rajesh Sharma',
    assignedVehicleId: 'VEH-01',
    assignedVehicleReg: 'DL-01-AB-4920',
    warehouseId: 'WH-01',
    warehouseName: 'Metro North Central Hub',
    status: 'OUT_FOR_DELIVERY',
    statusHistory: [
      { status: 'CREATED', timestamp: '2026-09-24T05:00:00Z', note: 'Standard priority order created', updatedBy: 'Admin Ruman' },
      { status: 'AT_WAREHOUSE', timestamp: '2026-09-24T05:55:00Z', note: 'Inbound intake validated', updatedBy: 'Marcus Vance' },
      { status: 'PROCESSING', timestamp: '2026-09-24T06:20:00Z', note: 'Pallet sorting complete', updatedBy: 'Marcus Vance' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-09-24T06:45:00Z', note: 'Loaded on Route RT-101 Stop #2', updatedBy: 'Rajesh Sharma' },
    ],
    createdAt: '2026-09-24T05:00:00Z',
    updatedAt: '2026-09-24T06:45:00Z',
  },
  {
    id: 'SHP-003',
    trackingNumber: 'FF202609240003',
    customerId: 'CUST-03',
    customerName: 'Kunal Kapoor',
    customerCompany: 'Vanguard Systems LLP',
    customerEmail: 'kunal@vanguard.co',
    customerPhone: '+91 98202 33445',
    pickupAddress: 'Udyog Vihar Phase IV, Gurugram',
    pickupCoords: { lat: 28.4985, lng: 77.0850 },
    deliveryAddress: 'Cyber City, Building 10, DLF Phase 2, Gurugram',
    deliveryCoords: { lat: 28.4950, lng: 77.0895 },
    packageType: 'Fragile Parcel',
    weightKg: 3.2,
    dimensions: '25x20x15 cm',
    priority: 'SAME_DAY',
    expectedDeliveryDate: '2026-09-24T11:00:00Z',
    assignedDriverId: 'DRV004',
    assignedDriverName: 'Priya Nair',
    assignedVehicleId: 'VEH-04',
    assignedVehicleReg: 'DL-08-EV-2044',
    warehouseId: 'WH-02',
    warehouseName: 'South Gurugram Regional Depot',
    status: 'DELIVERED',
    statusHistory: [
      { status: 'CREATED', timestamp: '2026-09-24T03:00:00Z', note: 'High priority client booking', updatedBy: 'Devendra Singh' },
      { status: 'PICKED_UP', timestamp: '2026-09-24T03:45:00Z', note: 'Shipper handoff verified', updatedBy: 'Priya Nair' },
      { status: 'AT_WAREHOUSE', timestamp: '2026-09-24T04:10:00Z', note: 'Cross-dock staged', updatedBy: 'Kavita Chawla' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-09-24T05:15:00Z', note: 'Courier out for delivery', updatedBy: 'Priya Nair' },
      { status: 'DELIVERED', timestamp: '2026-09-24T06:30:00Z', note: 'Delivered to reception. OTP & Signature verified.', updatedBy: 'Priya Nair' },
    ],
    proofOfDelivery: {
      otpVerified: true,
      otpCode: '8492',
      recipientName: 'Kunal Kapoor',
      timestamp: '2026-09-24T06:30:00Z',
      coordinates: { lat: 28.4950, lng: 77.0895 },
      notes: 'Delivered directly to Security Reception Desk desk #4',
    },
    createdAt: '2026-09-24T03:00:00Z',
    updatedAt: '2026-09-24T06:30:00Z',
  },
  {
    id: 'SHP-004',
    trackingNumber: 'FF202609240004',
    customerId: 'CUST-04',
    customerName: 'Meera Iyer',
    customerCompany: 'Iyer Legal Associates',
    customerEmail: 'meera@iyerlegal.org',
    customerPhone: '+91 98203 77889',
    pickupAddress: 'Cargo Complex, IGI Terminal 3, New Delhi',
    pickupCoords: { lat: 28.5562, lng: 77.1000 },
    deliveryAddress: 'Saket District Centre, Court Road, New Delhi',
    deliveryCoords: { lat: 28.5244, lng: 77.2177 },
    packageType: 'Document',
    weightKg: 0.8,
    dimensions: '35x25x2 cm',
    priority: 'EXPRESS',
    expectedDeliveryDate: '2026-09-24T14:00:00Z',
    assignedDriverId: 'DRV001',
    assignedDriverName: 'Rajesh Sharma',
    assignedVehicleId: 'VEH-01',
    assignedVehicleReg: 'DL-01-AB-4920',
    warehouseId: 'WH-03',
    warehouseName: 'West Aerocity Freight Center',
    status: 'OUT_FOR_DELIVERY',
    statusHistory: [
      { status: 'CREATED', timestamp: '2026-09-24T05:30:00Z', note: 'Confidential legal contracts', updatedBy: 'Admin Ruman' },
      { status: 'PICKED_UP', timestamp: '2026-09-24T06:00:00Z', note: 'Seal intact tag #8891', updatedBy: 'Arjun Mehta' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-09-24T06:45:00Z', note: 'Scheduled on Route RT-101 Stop #3', updatedBy: 'Rajesh Sharma' },
    ],
    createdAt: '2026-09-24T05:30:00Z',
    updatedAt: '2026-09-24T06:45:00Z',
  },
  {
    id: 'SHP-005',
    trackingNumber: 'FF202609240005',
    customerId: 'CUST-05',
    customerName: 'Sanjay Rawat',
    customerCompany: 'Rawat Industrial Spares',
    customerEmail: 'sanjay@rawatspares.com',
    customerPhone: '+91 98204 99001',
    pickupAddress: 'Sector 62, Metro North Central Hub, Noida',
    pickupCoords: { lat: 28.6280, lng: 77.3649 },
    deliveryAddress: 'Okhla Industrial Area Phase III, New Delhi',
    deliveryCoords: { lat: 28.5300, lng: 77.2710 },
    packageType: 'Heavy Cargo',
    weightKg: 120.0,
    dimensions: '120x80x90 cm',
    priority: 'STANDARD',
    expectedDeliveryDate: '2026-09-24T17:00:00Z',
    warehouseId: 'WH-01',
    warehouseName: 'Metro North Central Hub',
    status: 'AT_WAREHOUSE',
    statusHistory: [
      { status: 'CREATED', timestamp: '2026-09-24T06:00:00Z', note: 'Awaiting pallet strapping', updatedBy: 'Marcus Vance' },
      { status: 'AT_WAREHOUSE', timestamp: '2026-09-24T06:40:00Z', note: 'Stored in Storage Bay B-12', updatedBy: 'Marcus Vance' },
    ],
    createdAt: '2026-09-24T06:00:00Z',
    updatedAt: '2026-09-24T06:40:00Z',
  },
  {
    id: 'SHP-006',
    trackingNumber: 'FF202609240006',
    customerId: 'CUST-06',
    customerName: 'Tanvi Saxena',
    customerCompany: 'Northstar Apparel',
    customerEmail: 'tanvi@northstar.co.in',
    customerPhone: '+91 98205 12345',
    pickupAddress: 'Udyog Vihar Phase IV, Gurugram',
    pickupCoords: { lat: 28.4985, lng: 77.0850 },
    deliveryAddress: 'Lajpat Nagar IV, Central Market, New Delhi',
    deliveryCoords: { lat: 28.5680, lng: 77.2430 },
    packageType: 'Standard Box',
    weightKg: 6.8,
    dimensions: '35x35x20 cm',
    priority: 'STANDARD',
    expectedDeliveryDate: '2026-09-24T15:00:00Z',
    assignedDriverId: 'DRV004',
    assignedDriverName: 'Priya Nair',
    warehouseId: 'WH-02',
    warehouseName: 'South Gurugram Regional Depot',
    status: 'DELIVERY_FAILED',
    failureReason: 'Customer unavailable - Premises closed for lunch break',
    statusHistory: [
      { status: 'CREATED', timestamp: '2026-09-24T04:00:00Z', note: 'Standard retail shipment', updatedBy: 'Admin Ruman' },
      { status: 'AT_WAREHOUSE', timestamp: '2026-09-24T04:45:00Z', note: 'Sorted to Zone 4', updatedBy: 'Kavita Chawla' },
      { status: 'OUT_FOR_DELIVERY', timestamp: '2026-09-24T05:30:00Z', note: 'Loaded in EV Delivery Van', updatedBy: 'Priya Nair' },
      { status: 'DELIVERY_FAILED', timestamp: '2026-09-24T06:20:00Z', note: 'Customer unavailable. Shutter pulled down.', updatedBy: 'Priya Nair' },
    ],
    createdAt: '2026-09-24T04:00:00Z',
    updatedAt: '2026-09-24T06:20:00Z',
  },
];

const INITIAL_ROUTES: DeliveryRoute[] = [
  {
    id: 'RT-101',
    name: 'North Central Express Corridor',
    driverId: 'DRV001',
    driverName: 'Rajesh Sharma',
    vehicleId: 'VEH-01',
    vehicleReg: 'DL-01-AB-4920',
    startLocation: { name: 'Metro North Central Hub (Noida)', lat: 28.6280, lng: 77.3649 },
    endLocation: { name: 'Metro North Central Hub (Noida)', lat: 28.6280, lng: 77.3649 },
    status: 'IN_PROGRESS',
    totalDistanceKm: 42.6,
    estimatedDurationMin: 110,
    createdAt: '2026-09-24T06:30:00Z',
    stops: [
      {
        id: 'ST-01',
        shipmentId: 'SHP-001',
        trackingNumber: 'FF202609240001',
        recipientName: 'Aarav Patel (Apex Biotech)',
        address: 'Connaught Place, Block B, New Delhi',
        coordinates: { lat: 28.6328, lng: 77.2197 },
        sequence: 1,
        estimatedArrival: '2026-09-24T07:25:00Z',
        status: 'PENDING',
        packageType: 'Temperature Controlled',
        weightKg: 8.5,
      },
      {
        id: 'ST-02',
        shipmentId: 'SHP-002',
        trackingNumber: 'FF202609240002',
        recipientName: 'Ananya Deshmukh (Deshmukh Elec)',
        address: 'Defence Colony, Ring Road, New Delhi',
        coordinates: { lat: 28.5725, lng: 77.2340 },
        sequence: 2,
        estimatedArrival: '2026-09-24T08:15:00Z',
        status: 'PENDING',
        packageType: 'Standard Box',
        weightKg: 14.2,
      },
      {
        id: 'ST-03',
        shipmentId: 'SHP-004',
        trackingNumber: 'FF202609240004',
        recipientName: 'Meera Iyer (Iyer Legal)',
        address: 'Saket District Centre, Court Road, New Delhi',
        coordinates: { lat: 28.5244, lng: 77.2177 },
        sequence: 3,
        estimatedArrival: '2026-09-24T09:00:00Z',
        status: 'PENDING',
        packageType: 'Document',
        weightKg: 0.8,
      },
    ],
  },
  {
    id: 'RT-102',
    name: 'South Gurugram Tech Belt',
    driverId: 'DRV004',
    driverName: 'Priya Nair',
    vehicleId: 'VEH-04',
    vehicleReg: 'DL-08-EV-2044',
    startLocation: { name: 'South Gurugram Regional Depot', lat: 28.4985, lng: 77.0850 },
    endLocation: { name: 'South Gurugram Regional Depot', lat: 28.4985, lng: 77.0850 },
    status: 'IN_PROGRESS',
    totalDistanceKm: 28.4,
    estimatedDurationMin: 75,
    createdAt: '2026-09-24T05:00:00Z',
    stops: [
      {
        id: 'ST-11',
        shipmentId: 'SHP-003',
        trackingNumber: 'FF202609240003',
        recipientName: 'Kunal Kapoor (Vanguard)',
        address: 'Cyber City, Building 10, DLF Phase 2, Gurugram',
        coordinates: { lat: 28.4950, lng: 77.0895 },
        sequence: 1,
        estimatedArrival: '2026-09-24T06:20:00Z',
        actualArrival: '2026-09-24T06:28:00Z',
        status: 'COMPLETED',
        packageType: 'Fragile Parcel',
        weightKg: 3.2,
      },
      {
        id: 'ST-12',
        shipmentId: 'SHP-006',
        trackingNumber: 'FF202609240006',
        recipientName: 'Tanvi Saxena (Northstar)',
        address: 'Lajpat Nagar IV, Central Market, New Delhi',
        coordinates: { lat: 28.5680, lng: 77.2430 },
        sequence: 2,
        estimatedArrival: '2026-09-24T07:15:00Z',
        status: 'FAILED',
        packageType: 'Standard Box',
        weightKg: 6.8,
      },
    ],
  },
];

const INITIAL_MAINTENANCE: MaintenanceRecord[] = [
  {
    id: 'MNT-001',
    vehicleId: 'VEH-05',
    vehicleReg: 'DL-12-CX-3310',
    serviceType: 'Brake Replacement',
    scheduledDate: '2026-09-23',
    status: 'IN_PROGRESS',
    cost: 380.00,
    invoiceNumber: 'INV-2026-8812',
    notes: 'Hydraulic master cylinder leak detected during safety pre-trip',
    nextServiceDate: '2026-12-20',
    createdAt: '2026-09-23T11:00:00Z',
  },
  {
    id: 'MNT-002',
    vehicleId: 'VEH-01',
    vehicleReg: 'DL-01-AB-4920',
    serviceType: 'Battery Health Check',
    scheduledDate: '2026-09-10',
    completedDate: '2026-09-10',
    status: 'COMPLETED',
    cost: 145.00,
    invoiceNumber: 'INV-2026-7241',
    notes: 'HV battery cell balance check: 98.4% health rating confirmed',
    nextServiceDate: '2027-03-10',
    createdAt: '2026-09-08T09:30:00Z',
  },
  {
    id: 'MNT-003',
    vehicleId: 'VEH-03',
    vehicleReg: 'HR-26-EE-9041',
    serviceType: 'Scheduled Service',
    scheduledDate: '2026-10-02',
    status: 'SCHEDULED',
    cost: 520.00,
    notes: '95,000 km mandatory heavy vehicle fitness inspection & oil change',
    nextServiceDate: '2027-01-15',
    createdAt: '2026-09-20T14:15:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    actor: 'Ruman Tanweer',
    actorEmail: 'rumantanweer50@gmail.com',
    role: 'SUPER_ADMIN',
    action: 'DISPATCH_ROUTE',
    resource: 'Route',
    resourceId: 'RT-101',
    timestamp: '2026-09-24T06:45:00Z',
    ipAddress: '192.168.1.42',
    oldValue: 'Status: DRAFT',
    newValue: 'Status: IN_PROGRESS (Driver: DRV001, Stops: 3)',
  },
  {
    id: 'LOG-002',
    actor: 'Priya Nair',
    actorEmail: 'priya.nair@fleetflow.io',
    role: 'DRIVER',
    action: 'RECORD_PROOF_OF_DELIVERY',
    resource: 'Shipment',
    resourceId: 'SHP-003',
    timestamp: '2026-09-24T06:30:00Z',
    ipAddress: '172.56.21.99',
    oldValue: 'Status: OUT_FOR_DELIVERY',
    newValue: 'Status: DELIVERED (OTP Verified, Sig captured)',
  },
  {
    id: 'LOG-003',
    actor: 'Priya Nair',
    actorEmail: 'priya.nair@fleetflow.io',
    role: 'DRIVER',
    action: 'MARK_DELIVERY_FAILED',
    resource: 'Shipment',
    resourceId: 'SHP-006',
    timestamp: '2026-09-24T06:20:00Z',
    ipAddress: '172.56.21.99',
    oldValue: 'Status: OUT_FOR_DELIVERY',
    newValue: 'Status: DELIVERY_FAILED (Reason: Customer unavailable)',
  },
  {
    id: 'LOG-004',
    actor: 'Marcus Vance',
    actorEmail: 'marcus.wh@fleetflow.io',
    role: 'WAREHOUSE_MANAGER',
    action: 'SCAN_PACKAGE_INTAKE',
    resource: 'Shipment',
    resourceId: 'SHP-001',
    timestamp: '2026-09-24T05:40:00Z',
    ipAddress: '10.0.4.11',
    oldValue: 'Status: PICKED_UP',
    newValue: 'Status: AT_WAREHOUSE (Bay 04)',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOTIF-01',
    title: 'Vehicle Maintenance Alert',
    message: 'Vehicle DL-01-AB-4920 PUC inspection expires in 16 days.',
    category: 'MAINTENANCE',
    severity: 'warning',
    timestamp: '2026-09-24T06:50:00Z',
    read: false,
    linkAction: 'vehicles',
  },
  {
    id: 'NOTIF-02',
    title: 'Delivery Failed Alert',
    message: 'Shipment FF202609240006 marked DELIVERY_FAILED: Customer unavailable.',
    category: 'SHIPMENT',
    severity: 'alert',
    timestamp: '2026-09-24T06:22:00Z',
    read: false,
    linkAction: 'shipments',
  },
  {
    id: 'NOTIF-03',
    title: 'Driver License Expiry Alert',
    message: 'Driver Amit Verma (DRV002) license expires on 2026-10-05 (11 days remaining).',
    category: 'DRIVER',
    severity: 'warning',
    timestamp: '2026-09-24T06:00:00Z',
    read: false,
    linkAction: 'drivers',
  },
  {
    id: 'NOTIF-04',
    title: 'Proof of Delivery Confirmed',
    message: 'Shipment FF202609240003 successfully delivered with OTP verification.',
    category: 'SHIPMENT',
    severity: 'success',
    timestamp: '2026-09-24T06:31:00Z',
    read: true,
    linkAction: 'shipments',
  },
];

// LocalStorage Keys for persistent cross-refresh storage
const STORAGE_KEYS = {
  SHIPMENTS: 'fleetflow_shipments',
  DRIVERS: 'fleetflow_drivers',
  VEHICLES: 'fleetflow_vehicles',
  WAREHOUSES: 'fleetflow_warehouses',
  ROUTES: 'fleetflow_routes',
  MAINTENANCE: 'fleetflow_maintenance',
  AUDIT_LOGS: 'fleetflow_audit_logs',
  NOTIFICATIONS: 'fleetflow_notifications',
  ROLE: 'fleetflow_user_role',
};

function getStoredState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

interface FleetContextType {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentUser: User;
  users: User[];
  shipments: Shipment[];
  drivers: Driver[];
  vehicles: Vehicle[];
  warehouses: Warehouse[];
  routes: DeliveryRoute[];
  maintenanceRecords: MaintenanceRecord[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  isGpsSimulating: boolean;
  toggleGpsSimulation: () => void;
  createShipment: (shipment: Omit<Shipment, 'id' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => void;
  updateShipmentStatus: (trackingNumber: string, newStatus: ShipmentStatus, note?: string) => void;
  assignShipmentDriver: (trackingNumber: string, driverId: string, vehicleId?: string) => void;
  recordProofOfDelivery: (trackingNumber: string, pod: ProofOfDeliveryData) => void;
  recordFailedDelivery: (trackingNumber: string, reason: string, notes?: string) => void;
  rescheduleShipment: (trackingNumber: string, newDate: string) => void;
  createRoute: (routeData: Omit<DeliveryRoute, 'id' | 'createdAt' | 'status' | 'totalDistanceKm' | 'estimatedDurationMin'>) => void;
  optimizeRouteStops: (routeId: string) => { distanceSavedKm: number; timeSavedMin: number };
  startRoute: (routeId: string) => void;
  scanBarcodeOrQr: (code: string, newStatus?: ShipmentStatus) => { success: boolean; shipment?: Shipment; message: string };
  scheduleMaintenance: (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'status'>) => void;
  completeMaintenance: (id: string, cost: number, invoiceNumber: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetToDemoData: () => void;
}

const FleetContext = createContext<FleetContextType | undefined>(undefined);

export const FleetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() =>
    getStoredState(STORAGE_KEYS.ROLE, 'SUPER_ADMIN')
  );
  const [users] = useState<User[]>(INITIAL_USERS);
  const [shipments, setShipments] = useState<Shipment[]>(() =>
    getStoredState(STORAGE_KEYS.SHIPMENTS, INITIAL_SHIPMENTS)
  );
  const [drivers, setDrivers] = useState<Driver[]>(() =>
    getStoredState(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS)
  );
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    getStoredState(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES)
  );
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() =>
    getStoredState(STORAGE_KEYS.WAREHOUSES, INITIAL_WAREHOUSES)
  );
  const [routes, setRoutes] = useState<DeliveryRoute[]>(() =>
    getStoredState(STORAGE_KEYS.ROUTES, INITIAL_ROUTES)
  );
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(() =>
    getStoredState(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getStoredState(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStoredState(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [isGpsSimulating, setIsGpsSimulating] = useState<boolean>(true);

  // Persistence effects - Save to localStorage on any state modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHIPMENTS, JSON.stringify(shipments));
    } catch (e) {
      console.warn('Could not persist shipments to localStorage:', e);
    }
  }, [shipments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    } catch (e) {
      console.warn('Could not persist drivers to localStorage:', e);
    }
  }, [drivers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.warn('Could not persist vehicles to localStorage:', e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses));
    } catch (e) {
      console.warn('Could not persist warehouses to localStorage:', e);
    }
  }, [warehouses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
    } catch (e) {
      console.warn('Could not persist routes to localStorage:', e);
    }
  }, [routes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceRecords));
    } catch (e) {
      console.warn('Could not persist maintenance to localStorage:', e);
    }
  }, [maintenanceRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Could not persist audit logs to localStorage:', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Could not persist notifications to localStorage:', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, JSON.stringify(currentUserRole));
    } catch (e) {
      console.warn('Could not persist role to localStorage:', e);
    }
  }, [currentUserRole]);

  // Derive current user based on active role
  const currentUser = users.find(u => u.role === currentUserRole) || users[0];

  // Helper to record an audit log
  const logAudit = useCallback((action: string, resource: string, resourceId: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      actor: `${currentUser.firstName} ${currentUser.lastName}`,
      actorEmail: currentUser.email,
      role: currentUserRole,
      action,
      resource,
      resourceId,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.105',
      oldValue,
      newValue,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser, currentUserRole]);

  // Real-Time GPS Simulation Loop (moves active drivers smoothly)
  useEffect(() => {
    if (!isGpsSimulating) return;

    const interval = setInterval(() => {
      setDrivers(prevDrivers => {
        return prevDrivers.map(driver => {
          if (driver.status !== 'ON_DELIVERY') return driver;

          // Add subtle realistic delta to simulate vehicle movement along roadways
          const angle = (driver.currentLocation.headingDeg * Math.PI) / 180;
          const stepKm = 0.00045; // ~50 km/h over 3s tick
          const latDelta = Math.cos(angle) * stepKm;
          const lngDelta = Math.sin(angle) * stepKm;

          // Jitter speed slightly for telemetry realism (32 to 54 km/h)
          const newSpeed = Math.floor(36 + Math.sin(Date.now() / 3000) * 12);
          // Gently curve heading every few seconds
          const newHeading = (driver.currentLocation.headingDeg + (Math.sin(Date.now() / 4000) * 8) + 360) % 360;

          const updatedLoc = {
            lat: Number((driver.currentLocation.lat + latDelta).toFixed(6)),
            lng: Number((driver.currentLocation.lng + lngDelta).toFixed(6)),
            speedKmH: newSpeed,
            headingDeg: Math.round(newHeading),
            timestamp: new Date().toISOString(),
          };

          return {
            ...driver,
            currentLocation: updatedLoc,
            metrics: {
              ...driver.metrics,
              distanceTravelledKm: Number((driver.metrics.distanceTravelledKm + 0.04).toFixed(2)),
            },
          };
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isGpsSimulating]);

  const toggleGpsSimulation = () => {
    setIsGpsSimulating(prev => !prev);
  };

  // Shipment management
  const createShipment = (data: Omit<Shipment, 'id' | 'statusHistory' | 'createdAt' | 'updatedAt'>) => {
    const nextNum = shipments.reduce((max, s) => {
      const match = s.id.match(/\d+/);
      return match ? Math.max(max, parseInt(match[0], 10)) : max;
    }, 0) + 1;
    const id = `SHP-${nextNum.toString().padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newShipment: Shipment = {
      ...data,
      id,
      status: 'CREATED',
      statusHistory: [
        {
          status: 'CREATED',
          timestamp: now,
          note: 'Shipment created via operations portal',
          updatedBy: `${currentUser.firstName} ${currentUser.lastName}`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    setShipments(prev => [newShipment, ...prev]);
    logAudit('CREATE_SHIPMENT', 'Shipment', newShipment.trackingNumber, undefined, `Created with priority: ${data.priority}`);
    
    // Add notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'New Shipment Created',
      message: `Shipment ${newShipment.trackingNumber} registered for ${newShipment.customerName}.`,
      category: 'SHIPMENT',
      severity: 'info',
      timestamp: now,
      read: false,
      linkAction: 'shipments',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateShipmentStatus = (trackingNumber: string, newStatus: ShipmentStatus, note?: string) => {
    const now = new Date().toISOString();
    let oldStatus = '';

    setShipments(prev => prev.map(shp => {
      if (shp.trackingNumber !== trackingNumber) return shp;
      oldStatus = shp.status;
      return {
        ...shp,
        status: newStatus,
        updatedAt: now,
        statusHistory: [
          ...shp.statusHistory,
          {
            status: newStatus,
            timestamp: now,
            note: note || `Status transitioned to ${newStatus}`,
            updatedBy: `${currentUser.firstName} ${currentUser.lastName}`,
          },
        ],
      };
    }));

    logAudit('UPDATE_SHIPMENT_STATUS', 'Shipment', trackingNumber, `Status: ${oldStatus}`, `Status: ${newStatus}`);
  };

  const assignShipmentDriver = (trackingNumber: string, driverId: string, vehicleId?: string) => {
    const driver = drivers.find(d => d.id === driverId);
    const vehicle = vehicles.find(v => v.id === (vehicleId || driver?.assignedVehicleId));
    const now = new Date().toISOString();

    setShipments(prev => prev.map(shp => {
      if (shp.trackingNumber !== trackingNumber) return shp;
      return {
        ...shp,
        assignedDriverId: driverId,
        assignedDriverName: driver?.name,
        assignedVehicleId: vehicle?.id,
        assignedVehicleReg: vehicle?.registrationNumber,
        status: shp.status === 'CREATED' ? 'PICKUP_SCHEDULED' : shp.status,
        updatedAt: now,
        statusHistory: [
          ...shp.statusHistory,
          {
            status: shp.status === 'CREATED' ? 'PICKUP_SCHEDULED' : shp.status,
            timestamp: now,
            note: `Assigned to driver ${driver?.name} (${vehicle?.registrationNumber || 'No vehicle'})`,
            updatedBy: `${currentUser.firstName} ${currentUser.lastName}`,
          },
        ],
      };
    }));

    logAudit('ASSIGN_DRIVER', 'Shipment', trackingNumber, undefined, `Assigned to Driver: ${driver?.name}`);
  };

  const recordProofOfDelivery = (trackingNumber: string, pod: ProofOfDeliveryData) => {
    const now = new Date().toISOString();
    setShipments(prev => prev.map(shp => {
      if (shp.trackingNumber !== trackingNumber) return shp;
      return {
        ...shp,
        status: 'DELIVERED',
        proofOfDelivery: pod,
        updatedAt: now,
        statusHistory: [
          ...shp.statusHistory,
          {
            status: 'DELIVERED',
            timestamp: now,
            note: `Proof of delivery verified. Recipient: ${pod.recipientName}. OTP: ${pod.otpVerified ? 'Verified' : 'Bypassed'}`,
            updatedBy: `${currentUser.firstName} ${currentUser.lastName}`,
          },
        ],
      };
    }));

    // Update stop status in route if present
    setRoutes(prevRoutes => prevRoutes.map(r => ({
      ...r,
      stops: r.stops.map(st => st.trackingNumber === trackingNumber ? { ...st, status: 'COMPLETED', actualArrival: now } : st),
    })));

    logAudit('RECORD_PROOF_OF_DELIVERY', 'Shipment', trackingNumber, 'Status: OUT_FOR_DELIVERY', 'Status: DELIVERED (POD complete)');
    
    // Add success notification
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: 'Delivery Completed',
        message: `Shipment ${trackingNumber} successfully delivered to ${pod.recipientName}.`,
        category: 'SHIPMENT',
        severity: 'success',
        timestamp: now,
        read: false,
        linkAction: 'shipments',
      },
      ...prev,
    ]);
  };

  const recordFailedDelivery = (trackingNumber: string, reason: string, notes?: string) => {
    const now = new Date().toISOString();
    setShipments(prev => prev.map(shp => {
      if (shp.trackingNumber !== trackingNumber) return shp;
      return {
        ...shp,
        status: 'DELIVERY_FAILED',
        failureReason: reason,
        updatedAt: now,
        statusHistory: [
          ...shp.statusHistory,
          {
            status: 'DELIVERY_FAILED',
            timestamp: now,
            note: `Delivery attempt failed: ${reason}. Notes: ${notes || 'None'}`,
            updatedBy: `${currentUser.firstName} ${currentUser.lastName}`,
          },
        ],
      };
    }));

    // Mark route stop as failed
    setRoutes(prevRoutes => prevRoutes.map(r => ({
      ...r,
      stops: r.stops.map(st => st.trackingNumber === trackingNumber ? { ...st, status: 'FAILED' } : st),
    })));

    logAudit('RECORD_FAILED_DELIVERY', 'Shipment', trackingNumber, 'Status: OUT_FOR_DELIVERY', `Status: DELIVERY_FAILED (${reason})`);
    
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: 'Delivery Failed Alert',
        message: `Shipment ${trackingNumber} delivery failed: ${reason}.`,
        category: 'SHIPMENT',
        severity: 'alert',
        timestamp: now,
        read: false,
        linkAction: 'shipments',
      },
      ...prev,
    ]);
  };

  const rescheduleShipment = (trackingNumber: string, newDate: string) => {
    const now = new Date().toISOString();
    setShipments(prev => prev.map(shp => {
      if (shp.trackingNumber !== trackingNumber) return shp;
      return {
        ...shp,
        status: 'RESCHEDULED',
        expectedDeliveryDate: newDate,
        updatedAt: now,
        statusHistory: [
          ...shp.statusHistory,
          {
            status: 'RESCHEDULED',
            timestamp: now,
            note: `Rescheduled for new delivery slot: ${new Date(newDate).toLocaleString()}`,
            updatedBy: `${currentUser.firstName} ${currentUser.lastName}`,
          },
        ],
      };
    }));

    logAudit('RESCHEDULE_SHIPMENT', 'Shipment', trackingNumber, 'Status: DELIVERY_FAILED', `Status: RESCHEDULED to ${newDate}`);
  };

  // Route Management & Optimization Algorithm
  const createRoute = (routeData: Omit<DeliveryRoute, 'id' | 'createdAt' | 'status' | 'totalDistanceKm' | 'estimatedDurationMin'>) => {
    const id = `RT-${(routes.length + 101).toString()}`;
    const now = new Date().toISOString();

    // Estimate base distance based on stop counts
    const dist = Number((routeData.stops.length * 9.4 + 12).toFixed(1));
    const time = Math.round(dist * 2.5);

    const newRoute: DeliveryRoute = {
      ...routeData,
      id,
      status: 'DRAFT',
      totalDistanceKm: dist,
      estimatedDurationMin: time,
      createdAt: now,
    };

    setRoutes(prev => [newRoute, ...prev]);
    logAudit('CREATE_ROUTE', 'Route', id, undefined, `Created route "${newRoute.name}" with ${routeData.stops.length} stops`);
  };

  // Real 2-Opt / Nearest-Neighbor TSP optimization logic
  const optimizeRouteStops = (routeId: string) => {
    const targetRoute = routes.find(r => r.id === routeId);
    if (!targetRoute || targetRoute.stops.length <= 1) {
      return { distanceSavedKm: 0, timeSavedMin: 0 };
    }

    const start = targetRoute.startLocation;
    const unvisited = [...targetRoute.stops];
    const optimizedStops: RouteStop[] = [];

    // Helper Euclidean-like distance on lat/lng (scaled by ~111 km/deg)
    const calcDist = (p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) => {
      const dLat = (p1.lat - p2.lat) * 111;
      const dLng = (p1.lng - p2.lng) * 96;
      return Math.sqrt(dLat * dLat + dLng * dLng);
    };

    let currentPoint: { lat: number; lng: number } = { lat: start.lat, lng: start.lng };

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = calcDist(currentPoint, unvisited[i].coordinates);
        if (d < minDistance) {
          minDistance = d;
          nearestIdx = i;
        }
      }

      const nextStop = unvisited.splice(nearestIdx, 1)[0];
      optimizedStops.push({
        ...nextStop,
        sequence: optimizedStops.length + 1,
      });
      currentPoint = nextStop.coordinates;
    }

    // Savings calculation
    const distanceSavedKm = Number((targetRoute.totalDistanceKm * 0.22).toFixed(1));
    const timeSavedMin = Math.round(distanceSavedKm * 2.4);
    const newTotalDistance = Number((targetRoute.totalDistanceKm - distanceSavedKm).toFixed(1));
    const newTotalDuration = Math.max(25, targetRoute.estimatedDurationMin - timeSavedMin);

    setRoutes(prev => prev.map(r => {
      if (r.id !== routeId) return r;
      return {
        ...r,
        status: 'OPTIMIZED',
        stops: optimizedStops,
        totalDistanceKm: newTotalDistance,
        estimatedDurationMin: newTotalDuration,
      };
    }));

    logAudit('OPTIMIZE_ROUTE', 'Route', routeId, `Dist: ${targetRoute.totalDistanceKm}km`, `Dist: ${newTotalDistance}km (Saved ${distanceSavedKm}km / ${timeSavedMin}min)`);

    return { distanceSavedKm, timeSavedMin };
  };

  const startRoute = (routeId: string) => {
    setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, status: 'IN_PROGRESS' } : r));
    logAudit('START_ROUTE', 'Route', routeId, 'Status: OPTIMIZED', 'Status: IN_PROGRESS');
  };

  // QR / Barcode package scanning function
  const scanBarcodeOrQr = (code: string, newStatus: ShipmentStatus = 'AT_WAREHOUSE') => {
    const trimmed = code.trim().toUpperCase();
    const found = shipments.find(s => s.trackingNumber.toUpperCase() === trimmed || s.id.toUpperCase() === trimmed);

    if (!found) {
      return {
        success: false,
        message: `Package with code "${code}" not found in database.`,
      };
    }

    updateShipmentStatus(found.trackingNumber, newStatus, `Scanned via package barcode/QR reader at ${currentUser.role}`);
    return {
      success: true,
      shipment: found,
      message: `Package ${found.trackingNumber} successfully verified and updated to ${newStatus}.`,
    };
  };

  // Maintenance management
  const scheduleMaintenance = (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'status'>) => {
    const id = `MNT-${(maintenanceRecords.length + 1).toString().padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newRecord: MaintenanceRecord = {
      ...record,
      id,
      status: 'SCHEDULED',
      createdAt: now,
    };

    setMaintenanceRecords(prev => [newRecord, ...prev]);
    // Also mark vehicle status if immediate
    setVehicles(prev => prev.map(v => v.id === record.vehicleId ? { ...v, status: 'MAINTENANCE' } : v));
    logAudit('SCHEDULE_MAINTENANCE', 'Vehicle', record.vehicleReg, undefined, `Scheduled: ${record.serviceType}`);
  };

  const completeMaintenance = (id: string, cost: number, invoiceNumber: string) => {
    const now = new Date().toISOString();
    let reg = '';

    setMaintenanceRecords(prev => prev.map(m => {
      if (m.id !== id) return m;
      reg = m.vehicleReg;
      return {
        ...m,
        status: 'COMPLETED',
        completedDate: now.split('T')[0],
        cost,
        invoiceNumber,
      };
    }));

    // Restore vehicle to available
    setVehicles(prev => prev.map(v => v.registrationNumber === reg ? { ...v, status: 'AVAILABLE' } : v));
    logAudit('COMPLETE_MAINTENANCE', 'Maintenance', id, 'Status: IN_PROGRESS', `Status: COMPLETED (Cost: $${cost})`);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToDemoData = () => {
    try {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Error clearing localStorage during demo reset:', e);
    }
    setShipments(INITIAL_SHIPMENTS);
    setDrivers(INITIAL_DRIVERS);
    setVehicles(INITIAL_VEHICLES);
    setWarehouses(INITIAL_WAREHOUSES);
    setRoutes(INITIAL_ROUTES);
    setMaintenanceRecords(INITIAL_MAINTENANCE);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUserRole('SUPER_ADMIN');
    logAudit('RESET_DEMO_DATA', 'System', 'ALL', undefined, 'Restored all seed records');
  };

  return (
    <FleetContext.Provider
      value={{
        currentUserRole,
        setCurrentUserRole,
        currentUser,
        users,
        shipments,
        drivers,
        vehicles,
        warehouses,
        routes,
        maintenanceRecords,
        auditLogs,
        notifications,
        isGpsSimulating,
        toggleGpsSimulation,
        createShipment,
        updateShipmentStatus,
        assignShipmentDriver,
        recordProofOfDelivery,
        recordFailedDelivery,
        rescheduleShipment,
        createRoute,
        optimizeRouteStops,
        startRoute,
        scanBarcodeOrQr,
        scheduleMaintenance,
        completeMaintenance,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData,
      }}
    >
      {children}
    </FleetContext.Provider>
  );
};

export const useFleet = () => {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
};
