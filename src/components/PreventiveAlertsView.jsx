import React, { useState } from 'react';
import { AlertTriangle, Clock, ShieldCheck, CheckCircle2, Plus, Wrench, Calendar, ChevronRight } from 'lucide-react';
import { calculateEquipmentMetrics } from '../services/kpiCalculator';

export default function PreventiveAlertsView({ equipments, maintenances, onOpenNewOS, onSelectEquipment }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'WARNING' | 'OK'

  const alertItems = equipments.map(eq => {
    const metrics = calculateEquipmentMetrics(eq, maintenances);
    return {
      equipment: eq,
      metrics,
      alert: metrics.alert
    };
  });

  const filteredItems = alertItems.filter(item => {
    if (filterSeverity === 'ALL') return true;
    return item.alert.status === filterSeverity;
  });

  const criticalCount = alertItems.filter(i => i.alert.status === 'CRITICAL').length;
  const warningCount = alertItems.filter(i => i.alert.status === 'WARNING').length;
  const okCount = alertItems.filter(i => i.alert.status === 'OK').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle color="var(--color-amber)" />
              Central de Manutenção Preventiva & Monitoramento de Vencimentos
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Alertas automáticos baseados no limite de horímetro acumulado (ciclos de 250h/500h) e datas limite de revisão.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className={`btn ${filterSeverity === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterSeverity('ALL')}
            >
              Todos ({alertItems.length})
            </button>
            <button 
              className={`btn ${filterSeverity === 'CRITICAL' ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setFilterSeverity('CRITICAL')}
            >
              Vencidos ({criticalCount})
            </button>
            <button 
              className={`btn ${filterSeverity === 'WARNING' ? 'btn-primary' : 'btn-secondary'}`}
              style={filterSeverity === 'WARNING' ? { background: 'var(--color-warning)', color: '#0f172a' } : {}}
              onClick={() => setFilterSeverity('WARNING')}
            >
              Próximos ({warningCount})
            </button>
            <button 
              className={`btn ${filterSeverity === 'OK' ? 'btn-secondary' : 'btn-secondary'}`}
              onClick={() => setFilterSeverity('OK')}
            >
              Em Dia ({okCount})
            </button>
          </div>
        </div>
      </div>

      {/* Alert Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredItems.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
            <h3>Nenhum alerta encontrado para o filtro selecionado.</h3>
          </div>
        ) : (
          filteredItems.map(({ equipment: eq, metrics, alert }) => {
            const latestMaint = metrics.latestMaintenance;
            const nextHorimeter = latestMaint ? Number(latestMaint.proximoHorimetroManutencao || 0) : 0;
            const currentHorimeter = Number(eq.horimetroAtual || 0);

            // Horimeter progress calculation
            let progressPercent = 0;
            if (nextHorimeter > 0) {
              progressPercent = Math.min(100, Math.round((currentHorimeter / nextHorimeter) * 100));
            }

            return (
              <div 
                key={eq.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderLeft: `6px solid ${
                    alert.status === 'CRITICAL' ? 'var(--color-danger)' :
                    alert.status === 'WARNING' ? 'var(--color-warning)' : 'var(--color-success)'
                  }`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  
                  {/* Machine Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img 
                      src={eq.fotoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'}
                      alt={eq.modelo}
                      style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                          {eq.marca} {eq.modelo}
                        </h3>
                        <span className="badge badge-muted">Tag: {eq.numeroInventario}</span>
                        <span className={`badge badge-${alert.badge}`}>
                          {alert.status === 'CRITICAL' ? 'CRÍTICO / VENCIDO' : alert.status === 'WARNING' ? 'ATENÇÃO' : 'EM DIA'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Tipo: {eq.tipo} | Obra: <strong>{eq.localizacao}</strong> | Status Máquina: {eq.status}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" onClick={() => onSelectEquipment(eq)} style={{ fontSize: '0.8rem' }}>
                      Ver Ficha 360°
                    </button>
                    <button className="btn btn-primary" onClick={() => onOpenNewOS(eq.id)} style={{ fontSize: '0.8rem' }}>
                      <Wrench size={16} /> Abrir OS Preventiva
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Schedule Details */}
                <div style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'center' }}>
                  
                  {/* Horimeter Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span>Ciclo de Horímetro</span>
                      <strong>{currentHorimeter}h / {nextHorimeter > 0 ? `${nextHorimeter}h` : 'Não definido'}</strong>
                    </div>
                    <div style={{ width: '100%', height: '10px', background: 'var(--bg-primary)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${progressPercent}%`, 
                          height: '100%', 
                          background: alert.status === 'CRITICAL' ? 'var(--color-danger)' : alert.status === 'WARNING' ? 'var(--color-warning)' : 'var(--color-success)',
                          transition: 'width 0.3s ease'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>
                      <strong>Diagnóstico do Alerta:</strong> <span style={{ color: alert.status === 'CRITICAL' ? 'var(--color-danger)' : alert.status === 'WARNING' ? 'var(--color-warning)' : 'inherit' }}>{alert.message}</span>
                    </div>
                    <div>
                      Próxima Data Prevista: <strong>{latestMaint && latestMaint.proximaDataManutencao ? latestMaint.proximaDataManutencao : 'Não agendada'}</strong>
                    </div>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
