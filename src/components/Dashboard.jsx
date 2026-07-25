import React from 'react';
import { 
  Truck, 
  Wrench, 
  DollarSign, 
  Clock, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ kpis, equipments, maintenances, onSelectEquipment, onNavigateToPreventive, onOpenNewOS }) {
  // Chart 1 Data: Breakdown Ranking (Most Breaked / Highest Downtime)
  const rankingData = {
    labels: kpis.breakdownRanking.slice(0, 5).map(item => item.equipamentoNome),
    datasets: [
      {
        label: 'Falhas Corretivas',
        data: kpis.breakdownRanking.slice(0, 5).map(item => item.failureCount),
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: 'Horas Parado (Downtime)',
        data: kpis.breakdownRanking.slice(0, 5).map(item => item.totalDowntime),
        backgroundColor: 'rgba(245, 158, 11, 0.75)',
        borderColor: '#f59e0b',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  // Chart 2 Data: Status Distribution
  const statusDistData = {
    labels: ['Operacional', 'Em Manutenção', 'Parado / Avariado', 'Baixado'],
    datasets: [
      {
        data: [
          kpis.operationalCount,
          kpis.maintenanceCount,
          kpis.stoppedCount,
          kpis.decommissionedCount
        ],
        backgroundColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#64748b'
        ],
        borderWidth: 0
      }
    ]
  };

  // Chart 3 Data: Cost Type Breakdown (Preventive vs Corrective)
  const costBreakdownData = {
    labels: ['Preventiva', 'Corretiva'],
    datasets: [
      {
        label: 'Custo Total (R$)',
        data: [
          maintenances.filter(m => m.tipo === 'Preventiva').reduce((acc, m) => acc + (Number(m.custoTotal) || 0), 0),
          maintenances.filter(m => m.tipo === 'Corretiva').reduce((acc, m) => acc + (Number(m.custoTotal) || 0), 0)
        ],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Title Header */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Visão Geral da Frota & Indicadores Operacionais</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Monitoramento em tempo real de confiabilidade, custos de manutenção e conformidade técnica.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-kpi">
        
        {/* Card 1: Total Equipamentos */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FROTA TOTAL</span>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: 'var(--radius-sm)', color: '#3b82f6' }}>
              <Truck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {kpis.totalEquipments} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>máquinas</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-success">{kpis.operationalCount} Operacionais</span>
            {kpis.maintenanceCount > 0 && <span className="badge badge-warning">{kpis.maintenanceCount} Em Manut.</span>}
            {kpis.stoppedCount > 0 && <span className="badge badge-danger">{kpis.stoppedCount} Parados</span>}
          </div>
        </div>

        {/* Card 2: Custo Acumulado */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>CUSTO DE MANUTENÇÃO</span>
            <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-sm)', color: 'var(--color-amber)' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            R$ {kpis.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Total de peças + mão de obra acumulados nas OS
          </p>
        </div>

        {/* Card 3: Downtime Acumulado */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>DOWNTIME</span>
            <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: 'var(--radius-sm)', color: '#ef4444' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {kpis.totalDowntime} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>horas</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Tempo total de paralisação por reparos
          </p>
        </div>

        {/* Card 4: MTBF (Tempo Médio Entre Falhas) */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MTBF MÉDIO GLOBAL</span>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-sm)', color: '#10b981' }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {kpis.globalMTBF} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>horas</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Tempo médio de operação entre quebras
          </p>
        </div>

        {/* Card 5: MTTR (Tempo Médio de Reparo) */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MTTR MÉDIO GLOBAL</span>
            <div style={{ padding: '8px', background: 'rgba(6, 182, 212, 0.15)', borderRadius: 'var(--radius-sm)', color: '#06b6d4' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {kpis.globalMTTR} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>horas</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Tempo médio gasto para concluir um reparo
          </p>
        </div>

      </div>

      {/* Analytics Section: Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* Chart 1: Ranking de Quebras & Downtime */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={16} color="var(--color-amber)" />
            Ranking Críticos (Quebras vs Downtime)
          </h3>
          <div style={{ height: '200px', position: 'relative' }}>
            <Bar data={rankingData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 2: Custos por Tipo (Preventiva vs Corretiva) */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <DollarSign size={16} color="#10b981" />
            Custos (Preventiva vs Corretiva)
          </h3>
          <div style={{ height: '200px', position: 'relative' }}>
            <Bar data={costBreakdownData} options={chartOptions} />
          </div>
        </div>

      </div>

      {/* Active Alerts & Critical Machinery List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Preventive Maintenance Alert Panel */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--color-amber)" />
              Alertas de Revisão Preventiva
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {kpis.activeAlerts.length} alerta(s) ativo(s)
            </span>
          </div>

          {kpis.activeAlerts.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <p>Todas as manutenções preventivas estão em dia!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {kpis.activeAlerts.map((alertItem, idx) => (
                <div 
                  key={idx} 
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    background: alertItem.alert.badge === 'danger' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                    border: `1px solid ${alertItem.alert.badge === 'danger' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      {alertItem.equipment.marca} {alertItem.equipment.modelo} ({alertItem.equipment.numeroInventario})
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {alertItem.alert.message}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Horímetro Atual: <strong>{alertItem.equipment.horimetroAtual}h</strong> | Obra: {alertItem.equipment.localizacao}
                    </p>
                  </div>

                  <button 
                    className="btn btn-primary" 
                    style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                    onClick={() => onOpenNewOS(alertItem.equipment.id)}
                  >
                    Abrir OS
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fleet Availability & Quick Access */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#3b82f6" />
            Conformidade & Habilitação de Operadores
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Status de adequação às normas regulamentadoras de segurança e operadores autorizados por máquina.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {equipments.slice(0, 4).map(eq => (
              <div 
                key={eq.id}
                onClick={() => onSelectEquipment(eq)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                className="equipment-quick-item"
              >
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    {eq.marca} {eq.modelo} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>[{eq.numeroInventario}]</span>
                  </h4>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span className={`badge ${eq.nr12Status.includes('Adequado') ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                      NR-12: {eq.nr12Status}
                    </span>
                    {eq.nr19Aplicavel && (
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                        NR-19 Explosivos
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {eq.operadoresHabilitados ? eq.operadoresHabilitados.length : 0} op.
                  </span>
                  <ChevronRight size={16} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
