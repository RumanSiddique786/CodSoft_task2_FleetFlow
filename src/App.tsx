import React, { useState } from 'react';
import { FleetProvider, useFleet } from './store/fleetStore';
import { Navbar } from './components/layout/Navbar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ShipmentsList } from './components/shipments/ShipmentsList';
import { LiveFleetMap } from './components/map/LiveFleetMap';
import { RouteManagement } from './components/routes/RouteManagement';
import { WarehouseManagement } from './components/warehouses/WarehouseManagement';
import { VehicleManagement } from './components/vehicles/VehicleManagement';
import { DriverManagement } from './components/drivers/DriverManagement';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { DriverPortal } from './components/driver/DriverPortal';
import { CustomerTrackingView } from './components/customer/CustomerTrackingView';
import { PackageScannerModal } from './components/scanner/PackageScannerModal';
import { ApiDocsModal } from './components/docs/ApiDocsModal';
import { ProjectSetupGuideModal } from './components/docs/ProjectSetupGuideModal';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const FleetFlowApp: React.FC = () => {
  const { currentUserRole, resetToDemoData } = useFleet();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Global Modals
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Bar Navigation (3-Zone Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            setActiveTab={setActiveTab}
            onOpenScanner={() => setIsScannerOpen(true)}
          />
        )}

        {activeTab === 'shipments' && <ShipmentsList />}

        {activeTab === 'map' && <LiveFleetMap />}

        {activeTab === 'routes' && <RouteManagement />}

        {activeTab === 'warehouses' && (
          <WarehouseManagement onOpenScanner={() => setIsScannerOpen(true)} />
        )}

        {activeTab === 'vehicles' && <VehicleManagement />}

        {activeTab === 'drivers' && <DriverManagement />}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'audit' && <AuditLogsView />}

        {activeTab === 'driver-portal' && <DriverPortal />}

        {activeTab === 'customer-portal' && <CustomerTrackingView />}
      </main>

      {/* Global Modals */}
      <PackageScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      <ProjectSetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />

      {/* Clean Footer adhering to anti-slop rules */}
      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">FleetFlow Enterprise</span>
            <span>·</span>
            <span>Logistics & Real-Time Fleet Platform</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-slate-500">v1.0 Production Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('Reset all demo shipments, telemetry, and vehicles back to initial seed data?')) {
                  resetToDemoData();
                }
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Seed</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSetupGuideOpen(true)}
              className="text-blue-400 hover:underline"
            >
              Run & Deploy Guide
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <FleetProvider>
      <FleetFlowApp />
    </FleetProvider>
  );
}
