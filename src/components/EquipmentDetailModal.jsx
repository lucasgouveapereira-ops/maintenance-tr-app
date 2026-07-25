import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Activity, 
  MapPin, 
  UserCheck, 
  Plus, 
  FileText,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { calculateEquipmentMetrics } from '../services/kpiCalculator';
import { printElement } from '../services/pdfExporter';

export default function EquipmentDetailModal({ equipment, maintenances, isOpen, onClose, onOpenNewOS }) {
  if (!isOpen || !equipment) return null;

  const metrics = calculateEquipmentMetrics(equipment, maintenances);
  const eqMaintenances = maintenances
    .filter(m => m.equipamentoId === equipment.id)
    .sort((a, b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));

  const handlePrint = () => {
    printElement('equipment-detail-print-area', `Ficha Técnica - ${equipment.marca} ${equipment.modelo} (${equipment.numeroInventario})`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '950px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: 'var(--color-amber)', borderRadius: 'var(--radius-md)', color: '#0f172a' }}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Ficha Técnica 360° — {equipment.marca} {equipment.modelo}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Tag Interna: <strong>{equipment.numeroInventario}</strong> | Série: {equipment.numeroSerie}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handlePrint} style={{ height: '36px', fontSize: '0.8rem' }}>
              <Printer size={16} /> Impressão / PDF
            </button>
            <button className="btn btn-primary" onClick={() => onOpenNewOS(equipment.id)} style={{ height: '36px', fontSize: '0.8rem' }}>
              <Plus size={16} /> Nova OS
            </button>
            <button className="btn btn-secondary btn-icon" onClick={onClose} style={{ height: '36px', width: '36px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable & Visible Body */}
        <div className="modal-body" id="equipment-detail-print-area" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Banner: Equipment Photo & Main Technical Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            
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
                <div><strong>Data Aquisição:</strong> {equipment.dataAquisicao || 'N/A'}</div>
                <div><strong>Valor Compra:</strong> R$ {equipment.valorCompra ? Number(equipment.valorCompra).toLocaleString('pt-BR') : 'N/A'}</div>
                <div><strong>Fornecedor:</strong> {equipment.fornecedor || 'N/A'}</div>
                <div><strong>Garantia:</strong> {equipment.prazoGarantia || 'N/A'}</div>
              </div>
            </div>

          </div>

          {/* Individual Equipment KPI Metrics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            
            <div style={{ padding: '14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CUSTO ACUMULADO</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-amber)', marginTop: '4px' }}>
                R$ {metrics.totalCost.toLocaleString('pt-BR')}
              </div>
            </div>

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
                        <span className="badge badge-info">{m.statusOS}</span>
                        <strong style={{ fontSize: '0.9rem' }}>OS #{m.id} — {m.dataRevisao}</strong>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--color-amber)', fontWeight: 700 }}>
                        Custo Total: R$ {Number(m.custoTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      <strong>Serviços:</strong> {m.itensServicos}
                    </div>

                    {m.tipo === 'Corretiva' && m.causaFalhaDiagnostico && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '6px 10px', borderRadius: '4px' }}>
                        <strong>Causa da Falha / Diagnóstico:</strong> {m.causaFalhaDiagnostico}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>Horímetro na OS: <strong>{m.horimetro} h</strong></span>
                      <span>Downtime: <strong>{m.downtimeHoras} h</strong></span>
                      <span>Mecânico: <strong>{m.mecanicoResponsavel}</strong></span>
                      <span>Oficina: <strong>{m.oficinaTipo === 'terceirizada' ? `${m.oficinaNome} (Terceirizada)` : 'Interna'}</strong></span>
                    </div>

                    {m.pecas && m.pecas.length > 0 && (
                      <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed var(--border-color)', fontSize: '0.78rem' }}>
                        <strong>Peças Substituídas:</strong> {m.pecas.map(p => `${p.nome} (${p.quantidade}x R$ ${p.valorUnitario})`).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
