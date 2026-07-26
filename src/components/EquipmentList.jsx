import React, { useState } from 'react';
import { 
  Truck, 
  Grid, 
  List, 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { EQUIPMENT_TYPES, EQUIPMENT_STATUS } from '../types';
import { calculateEquipmentMetrics } from '../services/kpiCalculator';
import { USER_ROLES } from '../services/authService';

export default function EquipmentList({
  equipments,
  maintenances,
  searchTerm,
  setSearchTerm,
  onOpenNewEquipment,
  onEditEquipment,
  onDeleteEquipment,
  onSelectEquipment,
  onOpenNewOS,
  currentRole
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  const isAdmin = currentRole === USER_ROLES.ADMIN;

  // Filter unique locations
  const locations = Array.from(new Set(equipments.map(e => e.localizacao).filter(Boolean)));

  // Filtered Equipment List
  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch = 
      !searchTerm ||
      eq.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.numeroInventario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.localizacao.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || eq.tipo === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || eq.status === selectedStatus;
    const matchesLocation = selectedLocation === 'ALL' || eq.localizacao === selectedLocation;

    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Page Title & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck color="var(--color-amber)" />
            Catálogo da Frota de Equipamentos ({equipments.length})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Gerenciamento de inventário técnico, localização em obra e conformidade regulatória.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle View Mode */}
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '2px', border: '1px solid var(--border-color)' }}>
            <button 
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setViewMode('grid')}
              style={{ padding: '6px 10px', height: '34px' }}
              title="Visualização em Grid"
            >
              <Grid size={16} />
            </button>
            <button 
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setViewMode('table')}
              style={{ padding: '6px 10px', height: '34px' }}
              title="Visualização em Tabela"
            >
              <List size={16} />
            </button>
          </div>

          {/* "+ Novo Equipamento" Button (Only Admin or Available) */}
          <button className="btn btn-primary" onClick={onOpenNewEquipment} style={{ height: '38px', padding: '0 16px', fontSize: '0.85rem' }}>
            <Plus size={16} />
            <span>Novo Equipamento</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px' }}
            placeholder="Buscar tag, marca, modelo ou série..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Type */}
        <select 
          className="form-select" 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ height: '38px' }}
        >
          <option value="ALL">Todos os Tipos</option>
          {EQUIPMENT_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Filter Status */}
        <select 
          className="form-select" 
          value={selectedStatus} 
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ height: '38px' }}
        >
          <option value="ALL">Todos os Status</option>
          {Object.values(EQUIPMENT_STATUS).map(s => (
            <option key={s.label} value={s.label}>{s.label}</option>
          ))}
        </select>

        {/* Filter Location */}
        <select 
          className="form-select" 
          value={selectedLocation} 
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{ height: '38px' }}
        >
          <option value="ALL">Todas as Localizações</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

      </div>

      {/* Empty State */}
      {filteredEquipments.length === 0 && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Nenhum equipamento encontrado</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Tente ajustar a busca ou limpe os filtros para visualizar a frota.
          </p>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && filteredEquipments.length > 0 && (
        <div className="grid-cards">
          {filteredEquipments.map(eq => {
            const metrics = calculateEquipmentMetrics(eq, maintenances);
            const statusConfig = Object.values(EQUIPMENT_STATUS).find(s => s.label === eq.status) || EQUIPMENT_STATUS.OPERATIONAL;

            return (
              <div key={eq.id} className="glass-panel equipment-card" style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* Image Header with Badge */}
                <div style={{ height: '150px', position: 'relative', background: '#000' }}>
                  <img 
                    src={eq.fotoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'} 
                    alt={eq.modelo} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span className={`badge badge-${statusConfig.color}`}>
                      {eq.status}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Tag: {eq.numeroInventario}
                  </div>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-amber)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {eq.tipo}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0 4px' }}>
                      {eq.marca} {eq.modelo}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Série: <strong>{eq.numeroSerie}</strong> | Ano: {eq.anoFabricacao}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>HORÍMETRO ATUAL</span>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{eq.horimetroAtual} hrs</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>
                        {isAdmin ? 'CUSTO ACUMULADO' : 'MANUTENÇÕES'}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: isAdmin ? 'var(--color-amber)' : '#3b82f6' }}>
                        {isAdmin ? `R$ ${metrics.totalCost.toLocaleString('pt-BR')}` : `${metrics.maintenanceCount} registro(s)`}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--color-amber)" />
                      <span>{eq.localizacao}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="#10b981" />
                      <span>NR-12: <strong>{eq.nr12Status}</strong></span>
                    </div>
                  </div>

                </div>

                {/* Card Actions Footer */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-primary)' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                    onClick={() => onSelectEquipment(eq)}
                  >
                    <Eye size={14} />
                    <span>Ficha 360°</span>
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                      title="Abrir Nova OS para esta máquina"
                      onClick={() => onOpenNewOS(eq.id)}
                    >
                      <Wrench size={14} />
                      <span>Abrir OS</span>
                    </button>
                    <button 
                      className="btn btn-secondary btn-icon" 
                      title="Editar Equipamento"
                      onClick={() => onEditEquipment(eq)}
                    >
                      <Edit3 size={14} />
                    </button>
                    {isAdmin && (
                      <button 
                        className="btn btn-secondary btn-icon" 
                        title="Excluir Equipamento"
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => {
                          if (window.confirm(`Deseja excluir o equipamento ${eq.marca} ${eq.modelo} (${eq.numeroInventario})?`)) {
                            onDeleteEquipment(eq.id);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && filteredEquipments.length > 0 && (
        <div className="glass-panel" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px' }}>Tag / Inv.</th>
                <th style={{ padding: '14px' }}>Equipamento</th>
                <th style={{ padding: '14px' }}>Tipo</th>
                <th style={{ padding: '14px' }}>Localização</th>
                <th style={{ padding: '14px' }}>Horímetro</th>
                <th style={{ padding: '14px' }}>Status</th>
                {isAdmin && <th style={{ padding: '14px' }}>Custo Total</th>}
                <th style={{ padding: '14px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipments.map(eq => {
                const metrics = calculateEquipmentMetrics(eq, maintenances);
                const statusConfig = Object.values(EQUIPMENT_STATUS).find(s => s.label === eq.status) || EQUIPMENT_STATUS.OPERATIONAL;

                return (
                  <tr key={eq.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-amber)' }}>{eq.numeroInventario}</td>
                    <td style={{ padding: '14px' }}>
                      <strong style={{ display: 'block' }}>{eq.marca} {eq.modelo}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Série: {eq.numeroSerie}</span>
                    </td>
                    <td style={{ padding: '14px' }}>{eq.tipo}</td>
                    <td style={{ padding: '14px' }}>{eq.localizacao}</td>
                    <td style={{ padding: '14px', fontWeight: 700 }}>{eq.horimetroAtual} hrs</td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge badge-${statusConfig.color}`}>{eq.status}</span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-amber)' }}>
                        R$ {metrics.totalCost.toLocaleString('pt-BR')}
                      </td>
                    )}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => onSelectEquipment(eq)}>
                          Ficha
                        </button>
                        <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => onOpenNewOS(eq.id)}>
                          OS
                        </button>
                        <button className="btn btn-secondary btn-icon" onClick={() => onEditEquipment(eq)}>
                          <Edit3 size={14} />
                        </button>
                        {isAdmin && (
                          <button className="btn btn-secondary btn-icon" style={{ color: 'var(--color-danger)' }} onClick={() => onDeleteEquipment(eq.id)}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
