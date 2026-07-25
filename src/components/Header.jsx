import React, { useState } from 'react';
import { 
  Wrench, 
  Truck, 
  FileText, 
  AlertTriangle, 
  Plus, 
  Search, 
  Trash2,
  Database,
  Cloud,
  Bell,
  BarChart2
} from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';
import { notificationService } from '../services/notificationService';

export default function Header({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  activeAlertsCount,
  onOpenNewMaintenance,
  onClearAllData,
  onLoadDemoData,
  onOpenFirebaseConfig
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    notificationService.getPermissionStatus() === 'granted'
  );

  const isCloudActive = isFirebaseConfigured();

  const handleToggleNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
  };

  return (
    <>
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Brand & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'var(--gradient-amber)',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-amber)'
            }}>
              <Wrench size={22} color="#0f172a" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                TR Heavy Ops
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', background: isCloudActive ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: isCloudActive ? 'var(--color-success)' : 'var(--color-amber)', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Cloud size={10} /> {isCloudActive ? 'NUVEM REAL-TIME' : 'NUVEM DISPONÍVEL'}
                </span>
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Manutenção em Tempo Real | iOS & PWA Mobile
              </p>
            </div>
          </div>

          {/* Action Buttons & Cloud Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Nova OS Button */}
            <button className="btn btn-primary" onClick={onOpenNewMaintenance} style={{ height: '38px', padding: '0 14px', fontSize: '0.85rem' }}>
              <Plus size={16} />
              <span>Nova OS</span>
            </button>

            {/* Firebase Cloud Config Button */}
            <button 
              className="btn btn-secondary btn-icon" 
              title="Configuração da Nuvem Firebase" 
              onClick={onOpenFirebaseConfig}
              style={{ height: '38px', width: '38px', minWidth: '38px', color: isCloudActive ? 'var(--color-success)' : 'var(--color-warning)' }}
            >
              <Cloud size={16} />
            </button>

            {/* Push Notifications Toggle */}
            <button 
              className="btn btn-secondary btn-icon" 
              title={notificationsEnabled ? "Notificações no Celular Ativadas" : "Ativar Notificações no Celular"} 
              onClick={handleToggleNotifications}
              style={{ height: '38px', width: '38px', minWidth: '38px', color: notificationsEnabled ? 'var(--color-amber)' : 'inherit' }}
            >
              <Bell size={16} />
            </button>

            {/* Clear & Demo Controls */}
            <button 
              className="btn btn-secondary btn-icon" 
              title="Zerar memória do sistema" 
              onClick={onClearAllData}
              style={{ height: '38px', width: '38px', minWidth: '38px', color: 'var(--color-danger)' }}
            >
              <Trash2 size={16} />
            </button>

            <button 
              className="btn btn-secondary btn-icon" 
              title="Carregar dados de exemplo" 
              onClick={onLoadDemoData}
              style={{ height: '38px', width: '38px', minWidth: '38px' }}
            >
              <Database size={16} />
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ marginTop: '12px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px', fontSize: '16px' }}
            placeholder="Buscar por tag, número de série, marca ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Main Desktop Tab Navigation */}
        <nav style={{ display: 'flex', gap: '6px', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', overflowX: 'auto' }}>
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BarChart2 size={15} />
            <span>Dashboard & KPIs</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'equipments' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipments')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Truck size={15} />
            <span>Frota de Equipamentos</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'maintenances' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenances')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Wrench size={15} />
            <span>Ordens de Serviço (OS)</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'preventive' ? 'active' : ''}`}
            onClick={() => setActiveTab('preventive')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}
          >
            <AlertTriangle size={15} color={activeAlertsCount > 0 ? 'var(--color-warning)' : 'currentColor'} />
            <span>Manutenção Preventiva</span>
            {activeAlertsCount > 0 && (
              <span style={{
                background: 'var(--color-danger)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '999px'
              }}>
                {activeAlertsCount}
              </span>
            )}
          </button>

          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={15} />
            <span>Relatórios & Exportação</span>
          </button>
        </nav>
      </header>

      {/* iOS Sticky Mobile Bottom Bar for 1-Thumb Navigation on Smartphones */}
      <div className="mobile-bottom-bar">
        <button 
          className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart2 size={20} />
          <span>KPIs</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'equipments' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipments')}
        >
          <Truck size={20} />
          <span>Frota</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'maintenances' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenances')}
        >
          <Wrench size={20} />
          <span>OS</span>
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'preventive' ? 'active' : ''}`}
          onClick={() => setActiveTab('preventive')}
          style={{ position: 'relative' }}
        >
          <AlertTriangle size={20} color={activeAlertsCount > 0 ? 'var(--color-warning)' : 'currentColor'} />
          <span>Alertas</span>
          {activeAlertsCount > 0 && (
            <span style={{ position: 'absolute', top: '4px', right: '12px', background: 'var(--color-danger)', color: '#fff', fontSize: '0.6rem', padding: '0 4px', borderRadius: '999px' }}>
              {activeAlertsCount}
            </span>
          )}
        </button>

        <button 
          className={`mobile-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={20} />
          <span>Relatórios</span>
        </button>
      </div>
    </>
  );
}
