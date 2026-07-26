import React from 'react';
import { 
  X, 
  Wrench, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Plus, 
  MapPin, 
  Calendar,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { calculateEquipmentMetrics } from '../services/kpiCalculator';
import { USER_ROLES } from '../services/authService';

export default function EquipmentDetailModal({ equipment, maintenances, isOpen, onClose, onOpenNewOS, currentRole }) {
  if (!isOpen || !equipment) return null;

  const isAdmin = currentRole === USER_ROLES.ADMIN;
  const metrics = calculateEquipmentMetrics(equipment, maintenances);
  const eqMaintenances = maintenances.filter(m => m.equipamentoId === equipment.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="badge badge-warning" style={{ marginBottom: '4px' }}>
              Tag: {equipment.numeroInventario}
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Ficha Técnica 360° — {equipment.marca} {equipment.modelo}
            </h3>
          </div>

          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Info Header Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Image */}
            <div style={{ height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
              <img 
                src={equipment.fotoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'} 
                alt={equipment.modelo}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Specifications List */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-warning" style={{ marginBottom: '8px' }}>
                  {equipment.tipo}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0' }}>
                  {equipment.marca} {equipment.modelo}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Alocado em: <strong>{equipment.localizacao}</strong>
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', marginTop: '12px' }}>
                <div><strong>Ano Fabricação:</strong> {equipment.anoFabricacao}</div>
                <div><strong>Horímetro Atual:</strong> {equipment.horimetroAtual} hrs</div>
                <div><strong>Nº de Série:</strong> {equipment.numeroSerie}</div>
                {isAdmin && (
                  <>
                    <div><strong>Data Aquisição:</strong> {equipment.dataAquisicao || 'N/A'}</div>
                    <div><strong>Valor Compra:</strong> R$ {equipment.valorCompra ? Number(equipment.valorCompra).toLocaleString('pt-BR') : 'N/A'}</div>
                    <div><strong>Fornecedor:</strong> {equipment.fornecedor || 'N/A'}</div>
                  </>
                )}
                <div><strong>Garantia:</strong> {equipment.prazoGarantia || 'N/A'}</div>
              </div>
            </div>

          </div>

          {/* Individual Equipment KPI Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            
            {isAdmin && (
              <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CUSTO ACUMULADO</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-amber)', marginTop: '4px' }}>
                  R$ {metrics.totalCost.toLocaleString('pt-BR')}
                </div>
              </div>
            )}

            <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DOWNTIME TOTAL</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
                {metrics.totalDowntime} hrs
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MTBF DA MÁQUINA</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {metrics.mtbf} hrs
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MTTR DA MÁQUINA</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
                {metrics.mttr} hrs
              </div>
            </div>

          </div>

          {/* Safety & Compliance (NR-12 & NR-19) */}
          <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--color-amber)" />
              Conformidade Regulamentar (NR-12 & NR-19)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', fontSize: '0.85rem' }}>
              <div>
                <p><strong>Inspeção NR-12:</strong> <span className={`badge ${equipment.nr12Status.includes('Adequado') ? 'badge-success' : 'badge-warning'}`}>{equipment.nr12Status}</span></p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Última: {equipment.nr12DataUltimaInspecao || 'N/A'} | Próxima: {equipment.nr12DataProximaInspecao || 'N/A'}
                </p>
              </div>

              <div>
                <p><strong>Conformidade NR-19 (Explosivos):</strong> {equipment.nr19Aplicavel ? <span className="badge badge-info">{equipment.nr19Status}</span> : <span className="badge badge-muted">Não Aplicável</span>}</p>
              </div>
            </div>

            {/* Operadores Certificados */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                Operadores / Mecânicos Habilitados para esta Máquina:
              </h5>
              {!equipment.operadoresHabilitados || equipment.operadoresHabilitados.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nenhum operador cadastrado.</span>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {equipment.operadoresHabilitados.map((op, i) => (
                    <span key={i} className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                      <UserCheck size={12} /> {op.nome} ({op.matricula})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Maintenance History Timeline */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wrench size={18} color="var(--color-amber)" />
              Histórico de Manutenções Vinculadas ({eqMaintenances.length})
            </h4>

            {eqMaintenances.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                Nenhum registro de manutenção para este equipamento até o momento.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {eqMaintenances.map(m => (
                  <div 
                    key={m.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`badge ${m.tipo === 'Preventiva' ? 'badge-success' : 'badge-danger'}`}>
                          {m.tipo}
                        </span>
                        <strong style={{ fontSize: '0.9rem' }}>Data: {m.dataRevisao}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({m.horimetro} hrs)</span>
                      </div>

                      {isAdmin && (
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-amber)' }}>
                          R$ {Number(m.custoTotal || 0).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Serviços:</strong> {m.itensServicos}
                    </p>

                    {m.causaFalhaDiagnostico && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '6px 10px', borderRadius: '4px' }}>
                        <strong>Causa / Diagnóstico:</strong> {m.causaFalhaDiagnostico}
                      </p>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px dashed var(--border-color)' }}>
                      <span>Mecânico: <strong>{m.mecanicoResponsavel || 'Não especificado'}</strong></span>
                      <span>Oficina: {m.oficinaNome}</span>
                      <span>Parada: {m.downtimeHoras}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <button className="btn btn-primary" onClick={() => { onClose(); onOpenNewOS(equipment.id); }}>
            <Plus size={16} />
            <span>Abrir Nova OS para esta Máquina</span>
          </button>
        </div>

      </div>
    </div>
  );
}
