import React, { useState } from 'react';
import { 
  Wrench, 
  Truck, 
  FileText, 
  AlertTriangle, 
  Plus, 
  Trash2,
  Database,
  Cloud,
  Bell,
  BarChart2,
  Settings,
  X
} from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';
import { notificationService } from '../services/notificationService';

export default function Header({
  activeTab,
  setActiveTab,
  activeAlertsCount,
  onOpenNewMaintenance,
  onClearAllData,
  onLoadDemoData,
  onOpenFirebaseConfig
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
          
          {/* Brand & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
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
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
              TR Heavy Ops
            </h1>
          </div>

          {/* "+ Nova OS" Button expanding full lateral width */}
          <button 
            className="btn btn-primary" 
            onClick={onOpenNewMaintenance} 
            style={{ 
              flex: 1, 
              height: '42px', 
              fontSize: '0.92rem', 
              fontWeight: 800,
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-amber)'
            }}
          >
            <Plus size={20} />
            <span>+ Nova OS</span>
          </button>

          {/* Settings Gear Button */}
          <button 
            className="btn btn-secondary btn-icon" 
            title="Configurações do Sistema" 
            onClick={() => setIsSettingsOpen(true)}
            style={{ height: '42px', width: '42px', minWidth: '42px', flexShrink: 0 }}
          >
            <Settings size={20} />
          </button>
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

      {/* Settings Modal (Engrenagem) */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div 
            className="modal-content glass-panel" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '440px', width: '100%', padding: '24px' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} color="var(--color-amber)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Configurações do Sistema</h3>
              </div>
              <button 
                className="btn btn-secondary btn-icon" 
                onClick={() => setIsSettingsOpen(false)}
                style={{ width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Actions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Option 1: Cloud Sync Firebase */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Cloud size={18} color={isCloudActive ? 'var(--color-success)' : 'var(--color-warning)'} />
                    Sincronização na Nuvem
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    {isCloudActive ? 'Conectado em tempo real ao Firebase' : 'Configurar chave do Firebase'}
                  </p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onOpenFirebaseConfig();
                  }}
                >
                  Configurar
                </button>
              </div>

              {/* Option 2: Mobile Push Notifications */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Bell size={18} color={notificationsEnabled ? 'var(--color-amber)' : 'var(--text-muted)'} />
                    Notificações no Celular
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    {notificationsEnabled ? 'Alertas push ativados' : 'Receber alertas de preventiva'}
                  </p>
                </div>
                <button 
                  className={`btn ${notificationsEnabled ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={handleToggleNotifications}
                >
                  {notificationsEnabled ? 'Ativado' : 'Ativar'}
                </button>
              </div>

              {/* Option 3: Load Demo Data */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Database size={18} color="#3b82f6" />
                    Base Exemplo
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Carregar dados demonstrativos
                  </p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onLoadDemoData();
                  }}
                >
                  Carregar
                </button>
              </div>

              {/* Option 4: Clear Base Data */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--color-danger-bg)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-danger)' }}>
                    <Trash2 size={18} color="var(--color-danger)" />
                    Zerar Memória
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Excluir todos os registros da nuvem
                  </p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '6px 12px', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.4)' }}
                  onClick={() => {
                    setIsSettingsOpen(false);
                    onClearAllData();
                  }}
                >
                  Zerar Tudo
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

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
