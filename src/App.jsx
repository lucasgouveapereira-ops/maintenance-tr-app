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

import { storageService } from './services/storageService';
import { calculateGlobalKPIs } from './services/kpiCalculator';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('equipments'); // Default to equipments view when starting fresh
  const [searchTerm, setSearchTerm] = useState('');

  // Main State
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

  // Load initial data (cleared or saved)
  useEffect(() => {
    const eqList = storageService.getEquipments();
    const maintList = storageService.getMaintenances();
    setEquipments(eqList);
    setMaintenances(maintList);
  }, []);

  // Sync theme attribute with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleClearAllData = () => {
    if (window.confirm('Deseja zerar a memória do sistema (excluir todos os equipamentos e manutenções cadastrados)?')) {
      const { equipments: newEqs, maintenances: newMaints } = storageService.clearAllData();
      setEquipments([...newEqs]);
      setMaintenances([...newMaints]);
    }
  };

  const handleLoadDemoData = () => {
    if (window.confirm('Deseja carregar os dados de exemplo demonstrativos?')) {
      const { equipments: newEqs, maintenances: newMaints } = storageService.loadDemoData();
      setEquipments([...newEqs]);
      setMaintenances([...newMaints]);
    }
  };

  // KPI calculations
  const kpis = calculateGlobalKPIs(equipments, maintenances);

  // Handlers for Equipment CRUD
  const handleSaveEquipment = (data) => {
    if (data.id) {
      const updated = storageService.updateEquipment(data);
      if (updated) {
        setEquipments(prev => prev.map(e => e.id === updated.id ? updated : e));
      }
    } else {
      const created = storageService.addEquipment(data);
      setEquipments(prev => [created, ...prev]);
    }
  };

  const handleDeleteEquipment = (id) => {
    storageService.deleteEquipment(id);
    setEquipments(prev => prev.filter(e => e.id !== id));
    setMaintenances(prev => prev.filter(m => m.equipamentoId !== id));
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

  // Handlers for Maintenance CRUD
  const handleSaveMaintenance = (data) => {
    if (data.id) {
      const updated = storageService.updateMaintenance(data);
      if (updated) {
        setMaintenances(prev => prev.map(m => m.id === updated.id ? updated : m));
      }
    } else {
      const created = storageService.addMaintenance(data);
      setMaintenances(prev => [created, ...prev]);
    }
    // Refresh equipments in case horimeter was updated
    setEquipments(storageService.getEquipments());
  };

  const handleDeleteMaintenance = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta Ordem de Serviço?')) {
      storageService.deleteMaintenance(id);
      setMaintenances(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleUpdateOSStatus = (id, newStatus) => {
    const maint = maintenances.find(m => m.id === id);
    if (maint) {
      const updated = { ...maint, statusOS: newStatus };
      storageService.updateMaintenance(updated);
      setMaintenances(prev => prev.map(m => m.id === id ? updated : m));
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
        TR Heavy Ops — Sistema Integrado de Gestão de Manutenção de Máquinas Pesadas | NR-12 & NR-19 Compliant
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

    </div>
  );
}
