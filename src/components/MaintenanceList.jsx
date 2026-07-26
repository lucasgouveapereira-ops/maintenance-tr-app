import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Edit3, 
  Trash2, 
  AlertCircle,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';
import { OS_STATUS } from '../types';
import { USER_ROLES } from '../services/authService';

export default function MaintenanceList({
  maintenances,
  equipments,
  searchTerm,
  setSearchTerm,
  onOpenNewOS,
  onEditOS,
  onDeleteOS,
  onUpdateOSStatus,
  currentRole
}) {
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const isAdmin = currentRole === USER_ROLES.ADMIN;

  // Filtered Maintenances
  const filteredMaintenances = maintenances.filter(m => {
    const eq = equipments.find(e => e.id === m.equipamentoId);
    const eqName = eq ? `${eq.marca} ${eq.modelo} ${eq.numeroInventario}` : '';

    const matchesSearch = 
      !searchTerm ||
      eqName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.itensServicos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.mecanicoResponsavel && m.mecanicoResponsavel.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.causaFalhaDiagnostico && m.causaFalhaDiagnostico.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'ALL' || m.tipo === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || m.statusOS === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench color="var(--color-amber)" />
            Ordens de Serviço (OS) ({maintenances.length})
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Registro técnico de intervenções preventivas, corretivas e paralisações da frota.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => onOpenNewOS()} style={{ height: '38px', padding: '0 16px', fontSize: '0.85rem' }}>
          <Plus size={16} />
          <span>Nova Ordem de Serviço</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', height: '38px' }}
            placeholder="Buscar por equipamento, serviço ou mecânico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Type */}
        <select className="form-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={{ height: '38px' }}>
          <option value="ALL">Todos os Tipos (Preventiva / Corretiva)</option>
          <option value="Preventiva">Preventiva</option>
          <option value="Corretiva">Corretiva</option>
        </select>

        {/* Filter Status */}
        <select className="form-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} style={{ height: '38px' }}>
          <option value="ALL">Todos os Status da OS</option>
          <option value="Aberta">Aberta</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluída">Concluída</option>
        </select>

      </div>

      {/* Empty State */}
      {filteredMaintenances.length === 0 && (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Nenhuma Ordem de Serviço encontrada</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Clique no botão "+ Nova Ordem de Serviço" acima para registrar uma manutenção.
          </p>
        </div>
      )}

      {/* Maintenance Table List */}
      {filteredMaintenances.length > 0 && (
        <div className="glass-panel" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px' }}>Data / Horímetro</th>
                <th style={{ padding: '14px' }}>Equipamento Vinculado</th>
                <th style={{ padding: '14px' }}>Tipo & Status OS</th>
                <th style={{ padding: '14px' }}>Serviços Realizados</th>
                <th style={{ padding: '14px' }}>Parada (Downtime)</th>
                {isAdmin && <th style={{ padding: '14px' }}>Custo Total</th>}
                <th style={{ padding: '14px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaintenances.map(m => {
                const eq = equipments.find(e => e.id === m.equipamentoId);

                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    
                    {/* Date & Horimeter */}
                    <td style={{ padding: '14px' }}>
                      <strong style={{ display: 'block' }}>{m.dataRevisao}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.horimetro} hrs</span>
                    </td>

                    {/* Equipment */}
                    <td style={{ padding: '14px' }}>
                      {eq ? (
                        <>
                          <strong style={{ display: 'block', color: 'var(--text-primary)' }}>
                            {eq.marca} {eq.modelo}
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-amber)', fontWeight: 700 }}>
                            Tag: {eq.numeroInventario}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Desconhecido</span>
                      )}
                    </td>

                    {/* Type & Status */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <span className={`badge ${m.tipo === 'Preventiva' ? 'badge-success' : 'badge-danger'}`}>
                          {m.tipo}
                        </span>

                        {/* Status Select */}
                        <select
                          className="form-select"
                          value={m.statusOS || 'Aberta'}
                          onChange={(e) => onUpdateOSStatus(m.id, e.target.value)}
                          style={{
                            height: '28px',
                            padding: '2px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            borderRadius: '4px',
                            background: m.statusOS === 'Concluída' ? 'var(--color-success-bg)' : m.statusOS === 'Em Andamento' ? 'var(--color-warning-bg)' : 'var(--color-info-bg)',
                            color: m.statusOS === 'Concluída' ? 'var(--color-success)' : m.statusOS === 'Em Andamento' ? 'var(--color-warning)' : 'var(--color-info)',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <option value="Aberta">OS Aberta</option>
                          <option value="Em Andamento">Em Andamento</option>
                          <option value="Concluída">Concluída</option>
                        </select>
                      </div>
                    </td>

                    {/* Services */}
                    <td style={{ padding: '14px', maxWidth: '300px' }}>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {m.itensServicos}
                      </p>
                      {m.mecanicoResponsavel && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                          Mecânico: <strong>{m.mecanicoResponsavel}</strong>
                        </span>
                      )}
                    </td>

                    {/* Downtime */}
                    <td style={{ padding: '14px', fontWeight: 700, color: '#ef4444' }}>
                      {m.downtimeHoras || 0} hrs
                    </td>

                    {/* Total Cost (Admin Only) */}
                    {isAdmin && (
                      <td style={{ padding: '14px', fontWeight: 800, color: 'var(--color-amber)' }}>
                        R$ {Number(m.custoTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    )}

                    {/* Actions */}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-icon" title="Editar OS" onClick={() => onEditOS(m)}>
                          <Edit3 size={14} />
                        </button>
                        {isAdmin && (
                          <button className="btn btn-secondary btn-icon" title="Excluir OS" style={{ color: 'var(--color-danger)' }} onClick={() => onDeleteOS(m.id)}>
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
