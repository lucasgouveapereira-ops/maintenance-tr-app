import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EquipmentList from './components/EquipmentList';
import EquipmentFormModal from './components/EquipmentFormModal';
import EquipmentDetailModal from './components/EquipmentDetailModal';
import MaintenanceList from './components/MaintenanceList';
import MaintenanceFormModal from './components/MaintenanceFormModal';
import PreventiveAlertsView from './components/PreventiveAlertsView';
import ReportsView from './components/ReportsView';
import FirebaseConfigModal from './components/FirebaseConfigModal';

import { cloudSyncService } from './services/cloudSyncService';
import { storageService } from './services/storageService';
import { calculateGlobalKPIs } from './services/kpiCalculator';
import { notificationService } from './services/notificationService';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('equipments');
  const [searchTerm, setSearchTerm] = useState('');

  // Main Real-Time Cloud State
  const [equipments, setEquipments] = useState([]);
  const [maintenances, setMaintenances] = useState([]);

  // Modals state
  const [isEquipmentFormOpen, setIsEquipmentFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  const [selectedEquipmentForDetail, setSelectedEquipmentForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isMaintenanceFormOpen, setIsMaintenanceFormOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [defaultEquipmentIdForOS, setDefaultEquipmentIdForOS] = useState('');

  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState(false);

  // Subscribe to Real-Time Cloud Listeners (Firestore onSnapshot)
  useEffect(() => {
    const unsubscribeEq = cloudSyncService.subscribeEquipments((data) => {
      setEquipments([...data]);
    });

    const unsubscribeMaint = cloudSyncService.subscribeMaintenances((data) => {
      setMaintenances([...data]);
    });

    return () => {
      unsubscribeEq();
      unsubscribeMaint();
    };
  }, []);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleClearAllData = async () => {
    if (window.confirm('Deseja zerar a base de dados (excluir todos os equipamentos e manutenções na nuvem e localmente)?')) {
      await cloudSyncService.clearAllCloudData();
      setEquipments([]);
      setMaintenances([]);
    }
  };

  const handleLoadDemoData = async () => {
    if (window.confirm('Deseja carregar os dados de exemplo demonstrativos na nuvem?')) {
      const { equipments: demoEqs, maintenances: demoMaints } = storageService.loadDemoData();
      for (const eq of demoEqs) {
        await cloudSyncService.addOrUpdateEquipment(eq);
      }
      for (const mn of demoMaints) {
        await cloudSyncService.addOrUpdateMaintenance(mn);
      }
    }
  };

  // KPI calculations
  const kpis = calculateGlobalKPIs(equipments, maintenances);

  // Check for critical alerts and notify via Push
  useEffect(() => {
    if (kpis.activeAlerts.length > 0) {
      const firstCritical = kpis.activeAlerts.find(a => a.alert.status === 'CRITICAL');
      if (firstCritical) {
        notificationService.triggerPreventiveAlert(
          `${firstCritical.equipment.marca} ${firstCritical.equipment.modelo}`,
          firstCritical.alert.message
        );
      }
    }
  }, [kpis.activeAlerts.length]);

  // Real-Time Handlers for Equipment CRUD
  const handleSaveEquipment = async (data) => {
    await cloudSyncService.addOrUpdateEquipment(data);
  };

  const handleDeleteEquipment = async (id) => {
    await cloudSyncService.deleteEquipment(id);
  };

  const handleOpenEditEquipment = (eq) => {
    setEditingEquipment(eq);
    setIsEquipmentFormOpen(true);
  };

  const handleOpenNewEquipment = () => {
    setEditingEquipment(null);
    setIsEquipmentFormOpen(true);
  };

  const handleSelectEquipment = (eq) => {
    setSelectedEquipmentForDetail(eq);
    setIsDetailModalOpen(true);
  };

  // Real-Time Handlers for Maintenance CRUD
  const handleSaveMaintenance = async (data) => {
    await cloudSyncService.addOrUpdateMaintenance(data);
  };

  const handleDeleteMaintenance = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta Ordem de Serviço da nuvem?')) {
      await cloudSyncService.deleteMaintenance(id);
    }
  };

  const handleUpdateOSStatus = async (id, newStatus) => {
    const maint = maintenances.find(m => m.id === id);
    if (maint) {
      await cloudSyncService.addOrUpdateMaintenance({ ...maint, statusOS: newStatus });
    }
  };

  const handleOpenNewOS = (equipmentId = '') => {
    setEditingMaintenance(null);
    setDefaultEquipmentIdForOS(equipmentId);
    setIsMaintenanceFormOpen(true);
  };

  const handleOpenEditOS = (maint) => {
    setEditingMaintenance(maint);
    setIsMaintenanceFormOpen(true);
  };

  return (
    <div className="app-container">
      
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeAlertsCount={kpis.activeAlerts.length}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenNewEquipment={handleOpenNewEquipment}
        onOpenNewMaintenance={() => handleOpenNewOS()}
        onClearAllData={handleClearAllData}
        onLoadDemoData={handleLoadDemoData}
        onOpenFirebaseConfig={() => setIsFirebaseConfigOpen(true)}
      />

      {/* Main View Area */}
      <main className="main-content">
        
        {activeTab === 'dashboard' && (
          <Dashboard
            kpis={kpis}
            equipments={equipments}
            maintenances={maintenances}
            onSelectEquipment={handleSelectEquipment}
            onNavigateToPreventive={() => setActiveTab('preventive')}
            onOpenNewOS={handleOpenNewOS}
          />
        )}

        {activeTab === 'equipments' && (
          <EquipmentList
            equipments={equipments}
            maintenances={maintenances}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenNewEquipment={handleOpenNewEquipment}
            onEditEquipment={handleOpenEditEquipment}
            onDeleteEquipment={handleDeleteEquipment}
            onSelectEquipment={handleSelectEquipment}
            onOpenNewOS={handleOpenNewOS}
          />
        )}

        {activeTab === 'maintenances' && (
          <MaintenanceList
            maintenances={maintenances}
            equipments={equipments}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenNewOS={handleOpenNewOS}
            onEditOS={handleOpenEditOS}
            onDeleteOS={handleDeleteMaintenance}
            onUpdateOSStatus={handleUpdateOSStatus}
          />
        )}

        {activeTab === 'preventive' && (
          <PreventiveAlertsView
            equipments={equipments}
            maintenances={maintenances}
            onOpenNewOS={handleOpenNewOS}
            onSelectEquipment={handleSelectEquipment}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            equipments={equipments}
            maintenances={maintenances}
          />
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '16px 24px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        TR Heavy Ops — Sistema Integrado de Gestão de Manutenção em Nuvem Real-Time | PWA Mobile & NR-12/19 Compliant
      </footer>

      {/* Modals */}
      <EquipmentFormModal
        equipment={editingEquipment}
        isOpen={isEquipmentFormOpen}
        onClose={() => setIsEquipmentFormOpen(false)}
        onSave={handleSaveEquipment}
      />

      <EquipmentDetailModal
        equipment={selectedEquipmentForDetail}
        maintenances={maintenances}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenNewOS={handleOpenNewOS}
      />

      <MaintenanceFormModal
        maintenance={editingMaintenance}
        equipments={equipments}
        defaultEquipmentId={defaultEquipmentIdForOS}
        isOpen={isMaintenanceFormOpen}
        onClose={() => setIsMaintenanceFormOpen(false)}
        onSave={handleSaveMaintenance}
      />

      <FirebaseConfigModal
        isOpen={isFirebaseConfigOpen}
        onClose={() => setIsFirebaseConfigOpen(false)}
      />

    </div>
  );
}
