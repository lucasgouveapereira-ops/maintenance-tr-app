import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Filter, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign,
  FileText
} from 'lucide-react';
import { MAINTENANCE_TYPES, OS_STATUS } from '../types';

export default function MaintenanceList({
  maintenances,
  equipments,
  searchTerm,
  setSearchTerm,
  onOpenNewOS,
  onEditOS,
  onDeleteOS,
  onUpdateOSStatus
}) {
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('ALL');

  // Filtered Maintenances
  const filteredMaintenances = maintenances.filter(m => {
    const eq = equipments.find(e => e.id === m.equipamentoId);
    const eqText = eq ? `${eq.marca} ${eq.modelo} ${eq.numeroInventario}` : '';
    
    const matchesSearch = 
      !searchTerm ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.itensServicos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mecanicoResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eqText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'ALL' || m.tipo === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || m.statusOS === selectedStatus;
    const matchesEq = selectedEquipmentId === 'ALL' || m.equipamentoId === selectedEquipmentId;

    return matchesSearch && matchesType && matchesStatus && matchesEq;
  });

  const totalCost = filteredMaintenances.reduce((acc, m) => acc + (Number(m.custoTotal) || 0), 0);
  const totalDowntime = filteredMaintenances.reduce((acc, m) => acc + (Number(m.downtimeHoras) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Filter Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench color="var(--color-amber)" />
              Central de Ordens de Serviço (OS) ({filteredMaintenances.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Registro de revisões preventivas, reparações corretivas, peças e disponibilidade operacional.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => onOpenNewOS()}>
            <Plus size={18} />
            <span>Nova Ordem de Serviço</span>
          </button>
        </div>

        {/* KPI Mini Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Custo Filtrado</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-amber)' }}>
              R$ {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Downtime Filtrado</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>
              {totalDowntime} horas
            </div>
          </div>

          <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>OS Abertas / Em Andamento</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
              {maintenances.filter(m => m.statusOS !== 'Concluída').length} OS
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '16px' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Tipo de Manutenção</label>
            <select className="form-select" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="ALL">Todos os Tipos</option>
              <option value="Preventiva">Preventiva</option>
              <option value="Corretiva">Corretiva</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Status da OS</label>
            <select className="form-select" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
              <option value="ALL">Todos os Status</option>
              <option value="Aberta">Aberta</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Equipamento</label>
            <select className="form-select" value={selectedEquipmentId} onChange={e => setSelectedEquipmentId(e.target.value)}>
              <option value="ALL">Todos os Equipamentos</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.marca} {eq.modelo} ({eq.numeroInventario})</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Maintenances Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        {filteredMaintenances.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <h3>Nenhuma ordem de serviço encontrada.</h3>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px' }}>Cód. OS / Data</th>
                <th style={{ padding: '14px' }}>Equipamento</th>
                <th style={{ padding: '14px' }}>Tipo</th>
                <th style={{ padding: '14px' }}>Horímetro</th>
                <th style={{ padding: '14px' }}>Serviços Realizados</th>
                <th style={{ padding: '14px' }}>Mecânico / Oficina</th>
                <th style={{ padding: '14px' }}>Downtime</th>
                <th style={{ padding: '14px' }}>Custo Total</th>
                <th style={{ padding: '14px' }}>Status</th>
                <th style={{ padding: '14px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaintenances.map(m => {
                const eq = equipments.find(e => e.id === m.equipamentoId);

                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}>
                    
                    {/* OS Code & Date */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-amber)' }}>#{m.id}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.dataRevisao}</div>
                    </td>

                    {/* Equipment Tag & Model */}
                    <td style={{ padding: '14px' }}>
                      {eq ? (
                        <>
                          <div style={{ fontWeight: 700 }}>{eq.marca} {eq.modelo}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tag: {eq.numeroInventario}</div>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Removido</span>
                      )}
                    </td>

                    {/* Type Badge */}
                    <td style={{ padding: '14px' }}>
                      <span className={`badge ${m.tipo === 'Preventiva' ? 'badge-success' : 'badge-danger'}`}>
                        {m.tipo}
                      </span>
                    </td>

                    {/* Horimeter */}
                    <td style={{ padding: '14px', fontWeight: 600 }}>{m.horimetro} h</td>

                    {/* Services Summary */}
                    <td style={{ padding: '14px', maxWidth: '240px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={m.itensServicos}>
                        {m.itensServicos}
                      </div>
                      {m.tipo === 'Corretiva' && m.causaFalhaDiagnostico && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          Diag: {m.causaFalhaDiagnostico}
                        </div>
                      )}
                    </td>

                    {/* Mechanic & Workshop */}
                    <td style={{ padding: '14px' }}>
                      <div>{m.mecanicoResponsavel}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {m.oficinaTipo === 'terceirizada' ? `${m.oficinaNome} (Terceirizada)` : 'Oficina Interna'}
                      </div>
                    </td>

                    {/* Downtime */}
                    <td style={{ padding: '14px', fontWeight: 600, color: m.downtimeHoras > 12 ? '#ef4444' : 'inherit' }}>
                      {m.downtimeHoras} h
                    </td>

                    {/* Cost */}
                    <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-amber)' }}>
                      R$ {Number(m.custoTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>

                    {/* OS Status Select / Badge */}
                    <td style={{ padding: '14px' }}>
                      <select 
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px', width: 'auto' }}
                        value={m.statusOS}
                        onChange={(e) => onUpdateOSStatus(m.id, e.target.value)}
                      >
                        <option value="Aberta">Aberta</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluída">Concluída</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-icon" onClick={() => onEditOS(m)} title="Editar OS">
                          <Edit3 size={14} />
                        </button>
                        <button className="btn btn-secondary btn-icon" style={{ color: 'var(--color-danger)' }} onClick={() => onDeleteOS(m.id)} title="Excluir OS">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
