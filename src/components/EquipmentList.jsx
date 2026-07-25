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

export default function EquipmentList({
  equipments,
  maintenances,
  searchTerm,
  setSearchTerm,
  onOpenNewEquipment,
  onEditEquipment,
  onDeleteEquipment,
  onSelectEquipment,
  onOpenNewOS
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

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
      
      {/* Top Action & Filter Bar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck color="var(--color-amber)" />
              Catálogo da Frota de Equipamentos ({filteredEquipments.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Gerenciamento de inventário técnico, localização em obra, horímetro e conformidade regulatória.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '3px' }}>
              <button 
                className={`btn btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Visualização em Cards"
                style={{ padding: '6px 12px' }}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`btn btn-icon ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setViewMode('table')}
                title="Visualização em Tabela"
                style={{ padding: '6px 12px' }}
              >
                <List size={18} />
              </button>
            </div>

            <button className="btn btn-primary" onClick={onOpenNewEquipment}>
              <Plus size={18} />
              <span>Novo Equipamento</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Tipo de Equipamento</label>
            <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="ALL">Todos os Tipos</option>
              {EQUIPMENT_TYPES.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Status Operacional</label>
            <select className="form-select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="ALL">Todos os Status</option>
              {Object.values(EQUIPMENT_STATUS).map((s, idx) => (
                <option key={idx} value={s.label}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Obra / Frente de Trabalho</label>
            <select className="form-select" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
              <option value="ALL">Todas as Localizações</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Equipment List View */}
      {filteredEquipments.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <h3>Nenhum equipamento encontrado com os filtros selecionados.</h3>
          <p style={{ marginTop: '6px' }}>Tente ajustar a busca ou limpe os filtros para visualizar a frota.</p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID VIEW */
        <div className="grid-cards">
          {filteredEquipments.map(eq => {
            const metrics = calculateEquipmentMetrics(eq, maintenances);
            const statusConfig = Object.values(EQUIPMENT_STATUS).find(s => s.label === eq.status) || EQUIPMENT_STATUS.OPERATIONAL;

            return (
              <div 
                key={eq.id} 
                className="glass-panel"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Equipment Image & Badge Overlay */}
                <div style={{ position: 'relative', height: '180px', background: 'var(--bg-tertiary)' }}>
                  <img 
                    src={eq.fotoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'} 
                    alt={eq.modelo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${statusConfig.color}`}>
                      {eq.status}
                    </span>
                    {metrics.alert.status !== 'OK' && (
                      <span className={`badge badge-${metrics.alert.badge}`}>
                        {metrics.alert.status === 'CRITICAL' ? 'Preventiva Vencida' : 'Preventiva Próxima'}
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Tag: {eq.numeroInventario}
                  </div>
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-amber)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {eq.tipo}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 4px' }}>
                      {eq.marca} {eq.modelo}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Série: <strong>{eq.numeroSerie}</strong> | Ano: {eq.anoFabricacao}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>HORÍMETRO ATUAL</span>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{eq.horimetroAtual} hrs</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>CUSTO ACUMULADO</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-amber)' }}>
                        R$ {metrics.totalCost.toLocaleString('pt-BR')}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-primary)' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    onClick={() => onSelectEquipment(eq)}
                  >
                    <Eye size={14} />
                    <span>Ficha 360°</span>
                  </button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                      title="Abrir Nova OS para esta máquina"
                      onClick={() => onOpenNewOS(eq.id)}
                    >
                      <Wrench size={14} />
                    </button>
                    <button 
                      className="btn btn-secondary btn-icon" 
                      title="Editar Equipamento"
                      onClick={() => onEditEquipment(eq)}
                    >
                      <Edit3 size={14} />
                    </button>
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
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      ) : (

        /* TABLE VIEW */
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px' }}>Tag / Inventário</th>
                <th style={{ padding: '14px' }}>Equipamento</th>
                <th style={{ padding: '14px' }}>Localização / Obra</th>
                <th style={{ padding: '14px' }}>Horímetro</th>
                <th style={{ padding: '14px' }}>Status</th>
                <th style={{ padding: '14px' }}>NR-12 / NR-19</th>
                <th style={{ padding: '14px' }}>Custo Acum.</th>
                <th style={{ padding: '14px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipments.map(eq => {
                const metrics = calculateEquipmentMetrics(eq, maintenances);
                const statusConfig = Object.values(EQUIPMENT_STATUS).find(s => s.label === eq.status) || EQUIPMENT_STATUS.OPERATIONAL;

                return (
                  <tr key={eq.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-amber)' }}>
                      {eq.numeroInventario}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700 }}>{eq.marca} {eq.modelo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Série: {eq.numeroSerie} ({eq.tipo})</div>
                    </td>
                    <td style={{ padding: '14px' }}>{eq.localizacao}</td>
                    <td style={{ padding: '14px', fontWeight: 600 }}>{eq.horimetroAtual} h</td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge badge-${statusConfig.color}`}>{eq.status}</span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${eq.nr12Status.includes('Adequado') ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                        NR-12: {eq.nr12Status}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-amber)' }}>
                      R$ {metrics.totalCost.toLocaleString('pt-BR')}
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-icon" onClick={() => onSelectEquipment(eq)} title="Ficha 360°">
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-primary btn-icon" onClick={() => onOpenNewOS(eq.id)} title="Nova OS">
                          <Wrench size={14} />
                        </button>
                        <button className="btn btn-secondary btn-icon" onClick={() => onEditEquipment(eq)} title="Editar">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-secondary btn-icon" style={{ color: 'var(--color-danger)' }} onClick={() => onDeleteEquipment(eq.id)} title="Excluir">
                          <Trash2 size={14} />
                        </button>
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
