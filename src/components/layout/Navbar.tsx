import React, { useState } from 'react';
import { useFleet } from '../../store/fleetStore';
import { UserRole } from '../../types';
import { 
  Truck, 
  Bell, 
  BookOpen, 
  Code2, 
  Radio, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  QrCode,
  Shield,
  Smartphone,
  Search,
  RotateCcw,
  HardDrive
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenScanner: () => void;
  onOpenApiDocs: () => void;
  onOpenSetupGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
  onOpenApiDocs,
  onOpenSetupGuide,
}) => {
  const { 
    currentUserRole, 
    setCurrentUserRole, 
    currentUser, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    isGpsSimulating, 
    toggleGpsSimulation,
    resetToDemoData
  } = useFleet();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleOptions: { role: UserRole; label: string; desc: string; icon: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full system privileges & config', icon: '👑' },
    { role: 'DISPATCHER', label: 'Dispatcher', desc: 'Active routing & vehicle control', icon: '📡' },
    { role: 'WAREHOUSE_MANAGER', label: 'Warehouse Manager', desc: 'Package scanning & bay inventory', icon: '🏭' },
    { role: 'DRIVER', label: 'Driver (Mobile App)', desc: 'Mobile delivery & POD interface', icon: '🚚' },
    { role: 'CUSTOMER', label: 'Customer Portal', desc: 'Public live package tracking', icon: '📦' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* ZONE 1: Brand Wordmark with Live Pulse */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 text-left focus-visible:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                  FleetFlow
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${isGpsSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isGpsSimulating ? 'Live Telemetry' : 'Telemetry Paused'}</span>
                </div>
              </div>
            </button>
          </div>

          {/* ZONE 2: Clean Typography Navigation (Hidden in Driver & Customer View for Focused UX) */}
          {currentUserRole !== 'DRIVER' && currentUserRole !== 'CUSTOMER' ? (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium">
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'shipments', label: 'Shipments' },
                { id: 'map', label: 'Live Fleet Map' },
                { id: 'routes', label: 'Routes' },
                { id: 'warehouses', label: 'Warehouses' },
                { id: 'vehicles', label: 'Vehicles & Maintenance' },
                { id: 'drivers', label: 'Drivers' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'audit', label: 'Audit Logs' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-700/60">
              <span className="font-semibold text-slate-200">
                {currentUserRole === 'DRIVER' ? '📱 Mobile Driver Interface Mode' : '🔎 Customer Tracking Portal Mode'}
              </span>
              <span>·</span>
              <span>Switch roles using the top-right menu anytime</span>
            </div>
          )}

          {/* ZONE 3: Primary Actions & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Package Scanner Button */}
            <button
              onClick={onOpenScanner}
              title="Open Barcode & QR Package Scanner"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Scan Package</span>
            </button>

            {/* Swagger / REST API Docs */}
            <button
              onClick={onOpenApiDocs}
              title="Interactive API Documentation / Swagger Explorer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">API Explorer</span>
            </button>

            {/* Architecture & Run Guide */}
            <button
              onClick={onOpenSetupGuide}
              title="Project SRS, Architecture & Local Run Guide"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Run Guide</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(prev => !prev)}
                className="relative p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Operational Alerts ({notifications.length})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-blue-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No alerts at this time.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.linkAction) setActiveTab(notif.linkAction);
                            setShowNotifications(false);
                          }}
                          className={`p-3 hover:bg-slate-800/80 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-slate-800/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {notif.severity === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                            {notif.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                            {notif.severity === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                            {notif.severity === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-200">{notif.title}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{notif.message}</p>
                              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(prev => !prev)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  {currentUser.firstName[0]}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-medium leading-tight text-white">{currentUser.firstName}</div>
                  <div className="text-[10px] text-slate-400 leading-none">{currentUserRole.replace('_', ' ')}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden p-1">
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Simulate User Role
                  </div>
                  {roleOptions.map(opt => (
                    <button
                      key={opt.role}
                      onClick={() => {
                        setCurrentUserRole(opt.role);
                        setShowRoleDropdown(false);
                        if (opt.role === 'DRIVER') {
                          setActiveTab('driver-portal');
                        } else if (opt.role === 'CUSTOMER') {
                          setActiveTab('customer-portal');
                        } else if (activeTab === 'driver-portal' || activeTab === 'customer-portal') {
                          setActiveTab('dashboard');
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2.5 transition-colors ${
                        currentUserRole === opt.role ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base">{opt.icon}</span>
                      <div className="flex-1">
                        <div className="text-xs font-semibold leading-tight">{opt.label}</div>
                        <div className={`text-[10px] ${currentUserRole === opt.role ? 'text-blue-100' : 'text-slate-400'}`}>
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  ))}

                  <div className="mt-1 pt-1 border-t border-slate-800">
                    <div className="px-3 py-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                      <HardDrive className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Saved in Local Storage</span>
                    </div>
                    {showResetConfirm ? (
                      <div className="p-2 bg-rose-950/40 rounded border border-rose-800/50 mt-1">
                        <p className="text-[11px] text-rose-300 mb-2 leading-tight">
                          Reset all shipments, routes, and logs back to default seed data?
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              resetToDemoData();
                              setShowResetConfirm(false);
                              setShowRoleDropdown(false);
                            }}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold rounded"
                          >
                            Yes, Reset
                          </button>
                          <button
                            onClick={() => setShowResetConfirm(false)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 rounded flex items-center gap-2 transition-colors mt-0.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Initial Demo Data</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
