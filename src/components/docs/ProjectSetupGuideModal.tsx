import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Database, 
  Radio, 
  Server, 
  ShieldCheck, 
  Cloud, 
  Copy, 
  Check, 
  ChevronRight,
  Layers
} from 'lucide-react';

interface ProjectSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectSetupGuideModal: React.FC<ProjectSetupGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'QUICKSTART' | 'DOCKER' | 'PRISMA' | 'ENV' | 'WEBSOCKET'>('QUICKSTART');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">FleetFlow – Setup & Initialization Guide</h3>
              <p className="text-xs text-slate-400">Complete SRS architectural instructions & local deployment</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
          {[
            { id: 'QUICKSTART', label: '1. Quickstart Run', icon: Terminal },
            { id: 'DOCKER', label: '2. Docker Compose', icon: Layers },
            { id: 'PRISMA', label: '3. PostgreSQL & Prisma', icon: Database },
            { id: 'ENV', label: '4. Environment Variables', icon: Server },
            { id: 'WEBSOCKET', label: '5. WebSockets & Redis', icon: Radio },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 pr-1">
          
          {/* TAB 1: QUICKSTART */}
          {activeSection === 'QUICKSTART' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">How to Run Locally in 3 Steps</h4>
              <p className="text-slate-400 leading-relaxed">
                FleetFlow is structured as a full-stack platform with a React / Next.js frontend, an Express API with WebSocket telemetry, and PostgreSQL + Redis for persistence and real-time pub/sub caching.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white">Step 1: Install Dependencies</span>
                    <button
                      onClick={() => copyCode('npm install', 'q1')}
                      className="text-[10px] text-blue-400 flex items-center gap-1"
                    >
                      {copiedKey === 'q1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'q1' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-emerald-400 text-xs">npm install</pre>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white">Step 2: Configure Environment & Database</span>
                    <button
                      onClick={() => copyCode('cp .env.example .env\nnpx prisma migrate dev --name init\nnpx prisma db seed', 'q2')}
                      className="text-[10px] text-blue-400 flex items-center gap-1"
                    >
                      {copiedKey === 'q2' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'q2' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-emerald-400 text-xs">
                    {`npm install -D prisma\nnpm install @prisma/client\nnpx prisma migrate dev --name init`}
                  </pre>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white">Step 3: Start Development Server</span>
                    <button
                      onClick={() => copyCode('npm run dev', 'q3')}
                      className="text-[10px] text-blue-400 flex items-center gap-1"
                    >
                      {copiedKey === 'q3' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'q3' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-emerald-400 text-xs">npm run dev</pre>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Open <span className="text-blue-400 font-mono">http://localhost:3000</span> to access the FleetFlow dashboard and driver portal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCKER COMPOSE */}
          {activeSection === 'DOCKER' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Docker Compose Single-Command Orchestration</h4>
              <p className="text-slate-400">
                To run FleetFlow with containerized PostgreSQL and Redis out of the box, use the following <span className="font-mono text-white">docker-compose.yml</span>:
              </p>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400">docker-compose.yml</span>
                  <button
                    onClick={() => copyCode(`version: '3.8'\nservices:\n  postgres:\n    image: postgres:15-alpine\n    ports:\n      - "5432:5432"\n    environment:\n      POSTGRES_USER: fleetflow\n      POSTGRES_PASSWORD: fleetpassword123\n      POSTGRES_DB: fleetflow_db\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n\nvolumes:\n  pgdata:`, 'd1')}
                    className="text-[10px] text-blue-400 flex items-center gap-1"
                  >
                    {copiedKey === 'd1' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'd1' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="font-mono text-blue-300 text-[11px] overflow-x-auto">
{`version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: fleetflow
      POSTGRES_PASSWORD: fleetpassword123
      POSTGRES_DB: fleetflow_db
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">Launch Services:</span>
                <code className="text-emerald-400 font-mono">docker compose up -d</code>
              </div>
            </div>
          )}

          {/* TAB 3: PRISMA & POSTGRES */}
          {activeSection === 'PRISMA' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Prisma Schema & Relational Models</h4>
              <p className="text-slate-400">
                FleetFlow utilizes Prisma ORM with PostgreSQL. The schema strictly enforces foreign-key relationships between Users, Drivers, Vehicles, Shipments, Routes, and Maintenance records.
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white">Migration Commands (Uses local project Prisma, ignores global CLI):</span>
                <div className="space-y-1 font-mono text-[11px] text-emerald-400">
                  <p># 1. Generate Prisma Client (via npm script or direct node path)</p>
                  <p className="text-white">npm run prisma:generate</p>
                  <p className="text-slate-500 text-[10px]"># Direct alternative: node ./node_modules/prisma/build/index.js generate</p>
                  
                  <p className="mt-2 text-emerald-400"># 2. Run migrations to provision PostgreSQL tables</p>
                  <p className="text-white">npm run prisma:migrate</p>
                  <p className="text-slate-500 text-[10px]"># Direct alternative: node ./node_modules/prisma/build/index.js migrate dev --name init</p>
                  
                  <p className="mt-2 text-emerald-400"># 3. Seed realistic logistics demo records</p>
                  <p className="text-white">node ./node_modules/prisma/build/index.js db seed</p>
                  
                  <p className="mt-2 text-emerald-400"># 4. Inspect database in visual GUI</p>
                  <p className="text-white">npm run prisma:studio</p>
                  <p className="text-slate-500 text-[10px]"># Direct alternative: node ./node_modules/prisma/build/index.js studio</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENVIRONMENT VARIABLES */}
          {activeSection === 'ENV' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Environment Configuration (.env.example)</h4>
              <p className="text-slate-400">
                Create a <span className="font-mono text-white">.env</span> file in the root directory before running in production:
              </p>

              <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-blue-300 text-[11px] overflow-x-auto">
{`# PostgreSQL Connection
DATABASE_URL="postgresql://fleetflow:fleetpassword123@localhost:5432/fleetflow_db?schema=public"

# Redis Cache & Real-time Pub/Sub
REDIS_URL="redis://localhost:6379"

# JWT Authentication Secrets
JWT_SECRET="super-secret-fleetflow-jwt-access-key-2026"
JWT_REFRESH_SECRET="super-secret-fleetflow-jwt-refresh-key-2026"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"`}
              </pre>
            </div>
          )}

          {/* TAB 5: WEBSOCKET & REDIS */}
          {activeSection === 'WEBSOCKET' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">WebSocket Events & Redis Pub/Sub Flow</h4>
              <p className="text-slate-400">
                The real-time engine coordinates location streaming between drivers and admin dispatch maps via Socket.IO backed by Redis channels.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-blue-400 font-bold block mb-1">driver:location:update</span>
                  <span className="text-slate-400 text-[11px]">Transmits driver GPS coords, speed, heading, and battery SoC.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">shipment:status:update</span>
                  <span className="text-slate-400 text-[11px]">Emitted on state transitions (PICKED_UP, DELIVERED, etc.).</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-purple-400 font-bold block mb-1">route:stop:completed</span>
                  <span className="text-slate-400 text-[11px]">Updates active route sequence and triggers proof of delivery.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">alert:operational</span>
                  <span className="text-slate-400 text-[11px]">Dispatches alerts for failed drops, maintenance, or cert expiry.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
