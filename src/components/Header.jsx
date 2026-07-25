import React from 'react';
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
  BarChart2
} from 'lucide-react';

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
  onLoadDemoData
}) {
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
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', background: 'rgba(245,158,11,0.2)', color: 'var(--color-amber)', borderRadius: '4px' }}>
                MAQUINÁRIO PESADO
              </span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Gestão de Manutenção, NR-12/19 & Indicadores MTBF/MTTR
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div style={{ flex: '1 1 250px', maxWidth: '380px', position: 'relative' }}>
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

        {/* Action Buttons & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn btn-primary" onClick={onOpenNewMaintenance} style={{ height: '40px' }}>
            <Plus size={18} />
            <span>Nova OS</span>
          </button>
          
          <button className="btn btn-secondary" onClick={onOpenNewEquipment} style={{ height: '40px' }}>
            <Plus size={18} />
            <span>Novo Equipamento</span>
          </button>

          <button 
            className="btn btn-secondary btn-icon" 
            title="Alternar Tema Claro/Escuro" 
            onClick={toggleTheme}
            style={{ height: '40px', width: '40px' }}
          >
            {theme === 'dark' ? <Sun size={18} color="var(--color-amber)" /> : <Moon size={18} />}
          </button>

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
      <nav style={{ display: 'flex', gap: '8px', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
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
