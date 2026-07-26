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
  X,
  Shield,
  UserCheck
} from 'lucide-react';
import { isFirebaseConfigured } from '../services/firebase';
import { notificationService } from '../services/notificationService';
import { authService, USER_ROLES } from '../services/authService';
import RoleSelectionModal from './RoleSelectionModal';

export default function Header({
  activeTab,
  setActiveTab,
  activeAlertsCount,
  onOpenNewMaintenance,
  onClearAllData,
  onLoadDemoData,
  onOpenFirebaseConfig,
  currentRole,
  onRoleChanged
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    notificationService.getPermissionStatus() === 'granted'
  );

  const isCloudActive = isFirebaseConfigured();
  const isAdmin = currentRole === USER_ROLES.ADMIN;

  const handleToggleNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
  };

  return (
    <>
      <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
          
          {/* Brand & Active Role Badge */}
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
              <Wrench size={20} color="#0f172a" />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, whiteSpace: 'nowrap', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                TR Heavy Ops
              </h1>

              {/* Role Badge Trigger */}
              <button
                onClick={() => setIsRoleModalOpen(true)}
                style={{
                  background: isAdmin ? 'rgba(245,158,11,0.18)' : 'rgba(59,130,246,0.18)',
                  border: `1px solid ${isAdmin ? 'rgba(245,158,11,0.4)' : 'rgba(59,130,246,0.4)'}`,
                  color: isAdmin ? 'var(--color-amber)' : '#3b82f6',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  marginTop: '2px',
                  width: 'fit-content'
                }}
                title="Clique para alternar o perfil de conta"
              >
                {isAdmin ? <Shield size={10} /> : <Wrench size={10} />}
                <span>{isAdmin ? '👨‍💼 Admin' : '🔧 Mecânico'}</span>
                <span style={{ opacity: 0.6, fontSize: '0.6rem' }}>(Trocar)</span>
              </button>
            </div>
          </div>

          {/* Right actions: Nova OS button + Settings Gear */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn btn-primary" 
              onClick={onOpenNewMaintenance} 
              style={{ 
                height: '38px', 
                padding: '0 14px', 
                fontSize: '0.85rem', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-amber)'
              }}
            >
              <Plus size={16} />
              <span>Nova OS</span>
            </button>

            <button 
              className="btn btn-secondary btn-icon" 
              title="Configurações do Sistema" 
              onClick={() => setIsSettingsOpen(true)}
              style={{ height: '38px', width: '38px', minWidth: '38px' }}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal (Engrenagem) */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div 
            className="modal-content glass-panel" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '460px', width: '100%' }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={22} color="var(--color-amber)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Configurações do Sistema</h3>
              </div>
              <button 
                className="btn btn-secondary btn-icon" 
                onClick={() => setIsSettingsOpen(false)}
                style={{ width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Option 0: Profile Selector */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                    <UserCheck size={18} color="var(--color-amber)" />
                    Perfil da Conta
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Perfil Ativo: <strong>{isAdmin ? 'Administrador' : 'Mecânico'}</strong>
                  </p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  onClick={() => {
                    setIsSettingsOpen(false);
                    setIsRoleModalOpen(true);
                  }}
                >
                  Alternar
                </button>
              </div>

              {/* Option 1: Mobile Push Notifications (Always visible) */}
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

              {/* Admin-Only Settings Options */}
              {isAdmin && (
                <>
                  {/* Option 2: Cloud Sync Firebase */}
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                        <Cloud size={18} color={isCloudActive ? 'var(--color-success)' : 'var(--color-warning)'} />
                        Sincronização na Nuvem
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        {isCloudActive ? 'Conectado ao Firebase' : 'Configurar chaves'}
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
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Role Switcher Modal */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onRoleChanged={onRoleChanged}
      />

      {/* Sticky Bottom Navigation Bar (Filtered by Role) */}
      <div className="mobile-bottom-bar">
        {isAdmin && (
          <button 
            className={`mobile-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart2 size={20} />
            <span>KPIs</span>
          </button>
        )}

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

        {isAdmin && (
          <button 
            className={`mobile-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileText size={20} />
            <span>Relatórios</span>
          </button>
        )}
      </div>
    </>
  );
}
