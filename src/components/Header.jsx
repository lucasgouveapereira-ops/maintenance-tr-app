import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Truck, 
  FileText, 
  AlertTriangle, 
  Plus, 
  Search, 
  Sun, 
  Moon, 
  Trash2,
  Database,
  Cloud,
  Bell,
  Smartphone,
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
  theme,
  toggleTheme,
  onOpenNewEquipment,
  onOpenNewMaintenance,
  onClearAllData,
  onLoadDemoData,
  onOpenFirebaseConfig
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    notificationService.getPermissionStatus() === 'granted'
  );

  const isCloudActive = isFirebaseConfigured();

  // Listen for PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('Para instalar no iOS/Android, abra o menu do navegador no celular e selecione "Adicionar à Tela Inicial".');
    }
  };

  const handleToggleNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
  };

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '16px 24px', sticky: 'top', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--gradient-amber)',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-amber)'
          }}>
            <Wrench size={24} color="#0f172a" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              TR Heavy Ops
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', background: isCloudActive ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: isCloudActive ? 'var(--color-success)' : 'var(--color-amber)', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Cloud size={12} /> {isCloudActive ? 'NUVEM REAL-TIME' : 'NUVEM DISPONÍVEL'}
              </span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Sincronização em Tempo Real | PWA Mobile & Notificações
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: '1 1 220px', maxWidth: '340px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
            placeholder="Buscar por tag, número de série, marca ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Action Buttons & Cloud Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenNewMaintenance} style={{ height: '40px' }}>
            <Plus size={18} />
            <span>Nova OS</span>
          </button>
          
          <button className="btn btn-secondary" onClick={onOpenNewEquipment} style={{ height: '40px' }}>
            <Plus size={18} />
            <span>Novo Equipamento</span>
          </button>

          {/* Firebase Cloud Config Button */}
          <button 
            className={`btn btn-secondary btn-icon`} 
            title="Configuração da Nuvem Firebase" 
            onClick={onOpenFirebaseConfig}
            style={{ height: '40px', width: '40px', color: isCloudActive ? 'var(--color-success)' : 'var(--color-warning)' }}
          >
            <Cloud size={18} />
          </button>

          {/* Push Notifications Toggle */}
          <button 
            className="btn btn-secondary btn-icon" 
            title={notificationsEnabled ? "Notificações no Celular Ativadas" : "Ativar Notificações no Celular"} 
            onClick={handleToggleNotifications}
            style={{ height: '40px', width: '40px', color: notificationsEnabled ? 'var(--color-amber)' : 'inherit' }}
          >
            <Bell size={18} />
          </button>

          {/* PWA Mobile Install Button */}
          <button 
            className="btn btn-secondary btn-icon" 
            title="Instalar como App de Celular (PWA)" 
            onClick={handleInstallPWA}
            style={{ height: '40px', width: '40px' }}
          >
            <Smartphone size={18} />
          </button>

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary btn-icon" 
            title="Alternar Tema Claro/Escuro" 
            onClick={toggleTheme}
            style={{ height: '40px', width: '40px' }}
          >
            {theme === 'dark' ? <Sun size={18} color="var(--color-amber)" /> : <Moon size={18} />}
          </button>

          {/* Clear & Demo Controls */}
          <button 
            className="btn btn-secondary btn-icon" 
            title="Zerar memória do sistema (Limpar tudo)" 
            onClick={onClearAllData}
            style={{ height: '40px', width: '40px', color: 'var(--color-danger)' }}
          >
            <Trash2 size={18} />
          </button>

          <button 
            className="btn btn-secondary btn-icon" 
            title="Carregar dados de exemplo demonstrativos" 
            onClick={onLoadDemoData}
            style={{ height: '40px', width: '40px' }}
          >
            <Database size={18} />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', overflowX: 'auto' }}>
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <BarChart2 size={16} />
          <span>Dashboard & KPIs</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'equipments' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipments')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Truck size={16} />
          <span>Frota de Equipamentos</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'maintenances' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenances')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Wrench size={16} />
          <span>Ordens de Serviço (OS)</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'preventive' ? 'active' : ''}`}
          onClick={() => setActiveTab('preventive')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
        >
          <AlertTriangle size={16} color={activeAlertsCount > 0 ? 'var(--color-warning)' : 'currentColor'} />
          <span>Manutenção Preventiva</span>
          {activeAlertsCount > 0 && (
            <span style={{
              background: 'var(--color-danger)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '999px'
            }}>
              {activeAlertsCount}
            </span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FileText size={16} />
          <span>Relatórios & Exportação</span>
        </button>
      </nav>
    </header>
  );
}
