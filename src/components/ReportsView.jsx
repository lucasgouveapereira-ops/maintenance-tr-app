import React, { useState } from 'react';
import { FileText, Download, Printer, Filter, Calendar, Truck, ShieldCheck, DollarSign } from 'lucide-react';
import { exportToCSV, printElement } from '../services/pdfExporter';
import { calculateEquipmentMetrics } from '../services/kpiCalculator';

export default function ReportsView({ equipments, maintenances }) {
  const [reportType, setReportType] = useState('maintenances'); // 'maintenances' | 'kpis' | 'compliance'
  const [selectedEquipmentId, setSelectedEquipmentId] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter Maintenances for Reports
  const filteredMaintenances = maintenances.filter(m => {
    const matchesEq = selectedEquipmentId === 'ALL' || m.equipamentoId === selectedEquipmentId;
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(m.dataRevisao) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate = matchesDate && new Date(m.dataRevisao) <= new Date(endDate);
    }

    return matchesEq && matchesDate;
  });

  const handleExportCSV = () => {
    if (reportType === 'maintenances') {
      const rows = filteredMaintenances.map(m => {
        const eq = equipments.find(e => e.id === m.equipamentoId);
        return {
          'Código OS': m.id,
          'Data Revisão': m.dataRevisao,
          'Equipamento Tag': eq ? eq.numeroInventario : '',
          'Marca/Modelo': eq ? `${eq.marca} ${eq.modelo}` : '',
          'Tipo Manutenção': m.tipo,
          'Horímetro (h)': m.horimetro,
          'Serviços Realizados': m.itensServicos,
          'Custo Peças (R$)': m.custoPecas,
          'Custo Mão Obra (R$)': m.custoMaoDeObra,
          'Custo Total (R$)': m.custoTotal,
          'Downtime (h)': m.downtimeHoras,
          'Mecânico': m.mecanicoResponsavel,
          'Oficina': m.oficinaTipo === 'terceirizada' ? m.oficinaNome : 'Interna',
          'Status OS': m.statusOS
        };
      });
      exportToCSV(`Relatorio_Manutencoes_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (reportType === 'kpis') {
      const rows = equipments.map(eq => {
        const metrics = calculateEquipmentMetrics(eq, maintenances);
        return {
          'Tag Inventário': eq.numeroInventario,
          'Equipamento': `${eq.marca} ${eq.modelo}`,
          'Tipo': eq.tipo,
          'Localização': eq.localizacao,
          'Horímetro Atual (h)': eq.horimetroAtual,
          'Custo Acumulado (R$)': metrics.totalCost,
          'Downtime Total (h)': metrics.totalDowntime,
          'Qtd Manutenções': metrics.maintenanceCount,
          'Quebras Corretivas': metrics.failureCount,
          'MTBF (h)': metrics.mtbf,
          'MTTR (h)': metrics.mttr
        };
      });
      exportToCSV(`Relatorio_Indicadores_KPI_${new Date().toISOString().split('T')[0]}`, rows);
    } else if (reportType === 'compliance') {
      const rows = equipments.map(eq => ({
        'Tag Inventário': eq.numeroInventario,
        'Equipamento': `${eq.marca} ${eq.modelo}`,
        'Status Operacional': eq.status,
        'Conformidade NR-12': eq.nr12Status,
        'Última Inspeção NR-12': eq.nr12DataUltimaInspecao || 'N/A',
        'Próxima Inspeção NR-12': eq.nr12DataProximaInspecao || 'N/A',
        'NR-19 Aplicável': eq.nr19Aplicavel ? 'Sim' : 'Não',
        'Status NR-19': eq.nr19Status,
        'Qtd Operadores Certificados': eq.operadoresHabilitados ? eq.operadoresHabilitados.length : 0
      }));
      exportToCSV(`Relatorio_Conformidade_NR_${new Date().toISOString().split('T')[0]}`, rows);
    }
  };

  const handlePrint = () => {
    printElement('printable-report-area', 'Relatório Gerencial de Manutenção');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Filters & Actions Panel */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText color="var(--color-amber)" />
              Central de Relatórios & Exportação
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Geração de relatórios consolidados para auditoria, controle financeiro e planejamento técnico.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={handleExportCSV}>
              <Download size={16} /> Exportar CSV
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={16} /> Imprimir / Gerar PDF
            </button>
          </div>
        </div>

        {/* Report Options Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Tipo de Relatório</label>
            <select className="form-select" value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="maintenances">1. Histórico de Manutenções & Ordens de Serviço</option>
              <option value="kpis">2. Indicadores de Confiabilidade (MTBF, MTTR, Custos)</option>
              <option value="compliance">3. Conformidade Regulamentar (NR-12 e NR-19)</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Filtrar por Equipamento</label>
            <select className="form-select" value={selectedEquipmentId} onChange={e => setSelectedEquipmentId(e.target.value)}>
              <option value="ALL">Todos os Equipamentos</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.marca} {eq.modelo} ({eq.numeroInventario})</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Data Inicial</label>
            <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Data Final</label>
            <input className="form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>

        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="glass-panel" style={{ padding: '24px' }} id="printable-report-area">
        
        {/* Document Header */}
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'var(--color-amber)', fontSize: '1.4rem', fontWeight: 800 }}>
              {reportType === 'maintenances' && 'Relatório de Ordens de Serviço e Manutenção'}
              {reportType === 'kpis' && 'Relatório de Confiabilidade e Indicadores de Frota (MTBF / MTTR)'}
              {reportType === 'compliance' && 'Relatório de Conformidade NR-12 e NR-19'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Emissão: {new Date().toLocaleDateString('pt-BR')} | Total de registros: {
                reportType === 'maintenances' ? filteredMaintenances.length : equipments.length
              }
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>TR Heavy Ops System</strong><br />
            Gestão de Máquinas Pesadas
          </div>
        </div>

        {/* REPORT TYPE 1: Maintenances */}
        {reportType === 'maintenances' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Código OS</th>
                <th style={{ padding: '10px' }}>Data</th>
                <th style={{ padding: '10px' }}>Equipamento</th>
                <th style={{ padding: '10px' }}>Tipo</th>
                <th style={{ padding: '10px' }}>Horímetro</th>
                <th style={{ padding: '10px' }}>Serviços Realizados</th>
                <th style={{ padding: '10px' }}>Downtime</th>
                <th style={{ padding: '10px' }}>Custo Total</th>
                <th style={{ padding: '10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMaintenances.map(m => {
                const eq = equipments.find(e => e.id === m.equipamentoId);
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>#{m.id}</td>
                    <td style={{ padding: '10px' }}>{m.dataRevisao}</td>
                    <td style={{ padding: '10px' }}>{eq ? `${eq.marca} ${eq.modelo} (${eq.numeroInventario})` : 'N/A'}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge ${m.tipo === 'Preventiva' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.68rem' }}>
                        {m.tipo}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{m.horimetro} h</td>
                    <td style={{ padding: '10px', maxWidth: '200px' }}>{m.itensServicos}</td>
                    <td style={{ padding: '10px' }}>{m.downtimeHoras} h</td>
                    <td style={{ padding: '10px', fontWeight: 700, color: 'var(--color-amber)' }}>
                      R$ {Number(m.custoTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '10px' }}>{m.statusOS}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* REPORT TYPE 2: KPIs & Reliability */}
        {reportType === 'kpis' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Tag / Inventário</th>
                <th style={{ padding: '10px' }}>Equipamento</th>
                <th style={{ padding: '10px' }}>Localização</th>
                <th style={{ padding: '10px' }}>Horímetro</th>
                <th style={{ padding: '10px' }}>Custo Acumulado</th>
                <th style={{ padding: '10px' }}>Downtime</th>
                <th style={{ padding: '10px' }}>Quebras (Corretivas)</th>
                <th style={{ padding: '10px' }}>MTBF</th>
                <th style={{ padding: '10px' }}>MTTR</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map(eq => {
                const metrics = calculateEquipmentMetrics(eq, maintenances);
                return (
                  <tr key={eq.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: 'var(--color-amber)' }}>{eq.numeroInventario}</td>
                    <td style={{ padding: '10px' }}>{eq.marca} {eq.modelo}</td>
                    <td style={{ padding: '10px' }}>{eq.localizacao}</td>
                    <td style={{ padding: '10px' }}>{eq.horimetroAtual} h</td>
                    <td style={{ padding: '10px', fontWeight: 700 }}>R$ {metrics.totalCost.toLocaleString('pt-BR')}</td>
                    <td style={{ padding: '10px', color: '#ef4444' }}>{metrics.totalDowntime} h</td>
                    <td style={{ padding: '10px' }}>{metrics.failureCount}</td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#10b981' }}>{metrics.mtbf} h</td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#06b6d4' }}>{metrics.mttr} h</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* REPORT TYPE 3: Compliance NR-12 & NR-19 */}
        {reportType === 'compliance' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Tag / Inventário</th>
                <th style={{ padding: '10px' }}>Equipamento</th>
                <th style={{ padding: '10px' }}>Status Operacional</th>
                <th style={{ padding: '10px' }}>Status NR-12</th>
                <th style={{ padding: '10px' }}>Última Inspeção</th>
                <th style={{ padding: '10px' }}>Próxima Inspeção</th>
                <th style={{ padding: '10px' }}>NR-19 Explosivos</th>
                <th style={{ padding: '10px' }}>Operadores Certificados</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map(eq => (
                <tr key={eq.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: 'var(--color-amber)' }}>{eq.numeroInventario}</td>
                  <td style={{ padding: '10px' }}>{eq.marca} {eq.modelo}</td>
                  <td style={{ padding: '10px' }}>{eq.status}</td>
                  <td style={{ padding: '10px' }}>
                    <span className={`badge ${eq.nr12Status.includes('Adequado') ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                      {eq.nr12Status}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>{eq.nr12DataUltimaInspecao || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{eq.nr12DataProximaInspecao || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{eq.nr19Aplicavel ? eq.nr19Status : 'Não Aplicável'}</td>
                  <td style={{ padding: '10px' }}>
                    {eq.operadoresHabilitados && eq.operadoresHabilitados.length > 0 
                      ? eq.operadoresHabilitados.map(o => o.nome).join(', ')
                      : 'Nenhum'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}
