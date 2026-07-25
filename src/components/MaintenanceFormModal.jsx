import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Wrench, DollarSign, Clock } from 'lucide-react';
import { MAINTENANCE_TYPES, OS_STATUS } from '../types';

export default function MaintenanceFormModal({ maintenance, equipments, defaultEquipmentId, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    equipamentoId: '',
    dataRevisao: new Date().toISOString().split('T')[0],
    horimetro: 0,
    tipo: 'Preventiva',
    itensServicos: '',
    pecas: [],
    custoPecas: 0,
    custoMaoDeObra: 0,
    custoTotal: 0,
    downtimeHoras: 0,
    mecanicoResponsavel: '',
    oficinaTipo: 'interna',
    oficinaNome: '',
    causaFalhaDiagnostico: '',
    statusOS: 'Concluída',
    proximaDataManutencao: '',
    proximoHorimetroManutencao: ''
  });

  const [pecaNome, setPecaNome] = useState('');
  const [pecaQtd, setPecaQtd] = useState(1);
  const [pecaValorUnit, setPecaValorUnit] = useState('');

  useEffect(() => {
    if (maintenance) {
      setFormData({
        ...maintenance,
        pecas: maintenance.pecas || []
      });
    } else {
      const selectedEqId = defaultEquipmentId || (equipments.length > 0 ? equipments[0].id : '');
      const selectedEq = equipments.find(e => e.id === selectedEqId);
      const currentHorimeter = selectedEq ? Number(selectedEq.horimetroAtual || 0) : 0;

      setFormData({
        equipamentoId: selectedEqId,
        dataRevisao: new Date().toISOString().split('T')[0],
        horimetro: currentHorimeter,
        tipo: 'Preventiva',
        itensServicos: '',
        pecas: [],
        custoPecas: 0,
        custoMaoDeObra: 0,
        custoTotal: 0,
        downtimeHoras: 4,
        mecanicoResponsavel: 'Mecânico Chefe',
        oficinaTipo: 'interna',
        oficinaNome: 'Oficina Central da Mina',
        causaFalhaDiagnostico: '',
        statusOS: 'Em Andamento',
        proximaDataManutencao: '',
        proximoHorimetroManutencao: currentHorimeter > 0 ? currentHorimeter + 250 : ''
      });
    }
  }, [maintenance, defaultEquipmentId, equipments, isOpen]);

  // Recalculate totals whenever parts or labor cost change
  useEffect(() => {
    const totalPecas = formData.pecas.reduce((acc, p) => acc + (Number(p.valorTotal) || 0), 0);
    const maoDeObra = Number(formData.custoMaoDeObra) || 0;
    setFormData(prev => ({
      ...prev,
      custoPecas: totalPecas,
      custoTotal: totalPecas + maoDeObra
    }));
  }, [formData.pecas, formData.custoMaoDeObra]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto update horimeter when equipment changes
    if (name === 'equipamentoId') {
      const targetEq = equipments.find(eq => eq.id === value);
      const currentH = targetEq ? Number(targetEq.horimetroAtual || 0) : 0;
      setFormData(prev => ({
        ...prev,
        equipamentoId: value,
        horimetro: currentH,
        proximoHorimetroManutencao: currentH > 0 ? currentH + 250 : ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPeca = () => {
    if (!pecaNome.trim() || Number(pecaValorUnit) <= 0) {
      alert('Informe o nome da peça e um valor unitário válido.');
      return;
    }
    const qtd = Number(pecaQtd) || 1;
    const unitVal = Number(pecaValorUnit) || 0;
    const item = {
      id: `p-${Date.now()}`,
      nome: pecaNome.trim(),
      quantidade: qtd,
      valorUnitario: unitVal,
      valorTotal: qtd * unitVal
    };

    setFormData(prev => ({
      ...prev,
      pecas: [...prev.pecas, item]
    }));

    setPecaNome('');
    setPecaQtd(1);
    setPecaValorUnit('');
  };

  const handleRemovePeca = (id) => {
    setFormData(prev => ({
      ...prev,
      pecas: prev.pecas.filter(p => p.id !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.equipamentoId || !formData.itensServicos.trim()) {
      alert('Selecione o equipamento e descreva os itens/serviços realizados.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '850px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench color="var(--color-amber)" />
            {maintenance ? `Editar Ordem de Serviço #${maintenance.id}` : 'Registrar Nova Ordem de Serviço (OS)'}
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Equipment Selection & Basic Details */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Equipamento Vinculado *</label>
                <select className="form-select" name="equipamentoId" value={formData.equipamentoId} onChange={handleChange} required>
                  <option value="">Selecione a máquina...</option>
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.marca} {eq.modelo} ({eq.numeroInventario}) - Horímetro: {eq.horimetroAtual}h
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Manutenção *</label>
                <select className="form-select" name="tipo" value={formData.tipo} onChange={handleChange}>
                  <option value="Preventiva">Preventiva</option>
                  <option value="Corretiva">Corretiva</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status da OS</label>
                <select className="form-select" name="statusOS" value={formData.statusOS} onChange={handleChange}>
                  <option value="Aberta">Aberta</option>
                  <option value="Em Andamento">Em Andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Data da Revisão *</label>
                <input className="form-input" type="date" name="dataRevisao" value={formData.dataRevisao} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Horímetro no Momento da Manutenção *</label>
                <input className="form-input" type="number" name="horimetro" value={formData.horimetro} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Tempo de Parada / Downtime (Horas) *</label>
                <input className="form-input" type="number" step="0.5" name="downtimeHoras" value={formData.downtimeHoras} onChange={handleChange} required />
              </div>
            </div>

            {/* Services Performed */}
            <div className="form-group">
              <label className="form-label">Itens & Serviços Realizados *</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                name="itensServicos" 
                value={formData.itensServicos} 
                onChange={handleChange} 
                placeholder="Descreva detalhadamente a intervenção técnica realizada..."
                required 
              />
            </div>

            {/* Diagnosis / Root Cause (Mandatory for Corrective) */}
            {formData.tipo === 'Corretiva' && (
              <div className="form-group" style={{ background: 'var(--color-warning-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245,158,11,0.3)' }}>
                <label className="form-label" style={{ color: 'var(--color-warning)' }}>Causa da Falha & Diagnóstico Técnico (Corretiva)</label>
                <textarea 
                  className="form-textarea" 
                  rows="2" 
                  name="causaFalhaDiagnostico" 
                  value={formData.causaFalhaDiagnostico} 
                  onChange={handleChange} 
                  placeholder="Relate o motivo da avaria, componente que falhou ou erro operacional..." 
                  required
                />
              </div>
            )}

            {/* Parts Replaced Dynamic Table */}
            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="var(--color-amber)" />
                Peças & Componentes Substituídos
              </h4>

              <div className="form-row" style={{ alignItems: 'flex-end', marginBottom: '12px' }}>
                <div className="form-group" style={{ margin: 0, flex: 2 }}>
                  <label className="form-label">Descrição da Peça</label>
                  <input className="form-input" value={pecaNome} onChange={e => setPecaNome(e.target.value)} placeholder="Ex: Filtro de Óleo / Mangote" />
                </div>
                <div className="form-group" style={{ margin: 0, flex: 1 }}>
                  <label className="form-label">Qtd</label>
                  <input className="form-input" type="number" min="1" value={pecaQtd} onChange={e => setPecaQtd(e.target.value)} />
                </div>
                <div className="form-group" style={{ margin: 0, flex: 1 }}>
                  <label className="form-label">Valor Unit. (R$)</label>
                  <input className="form-input" type="number" step="0.01" value={pecaValorUnit} onChange={e => setPecaValorUnit(e.target.value)} placeholder="0.00" />
                </div>
                <button type="button" className="btn btn-secondary" onClick={handleAddPeca} style={{ height: '40px' }}>
                  <Plus size={16} /> Adicionar
                </button>
              </div>

              {formData.pecas.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginTop: '8px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '6px 10px' }}>Peça / Componente</th>
                      <th style={{ padding: '6px 10px' }}>Qtd</th>
                      <th style={{ padding: '6px 10px' }}>Valor Unit.</th>
                      <th style={{ padding: '6px 10px' }}>Subtotal</th>
                      <th style={{ padding: '6px 10px', textAlign: 'right' }}>Remover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.pecas.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '6px 10px' }}>{p.nome}</td>
                        <td style={{ padding: '6px 10px' }}>{p.quantidade}</td>
                        <td style={{ padding: '6px 10px' }}>R$ {Number(p.valorUnitario).toFixed(2)}</td>
                        <td style={{ padding: '6px 10px', fontWeight: 700 }}>R$ {Number(p.valorTotal).toFixed(2)}</td>
                        <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                          <button type="button" onClick={() => handleRemovePeca(p.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Financial & Responsibility Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Custo Mão de Obra (R$)</label>
                <input className="form-input" type="number" step="0.01" name="custoMaoDeObra" value={formData.custoMaoDeObra} onChange={handleChange} placeholder="0.00" />
              </div>

              <div className="form-group">
                <label className="form-label">Custo Total Calculado (Peças + M.O.)</label>
                <input className="form-input" style={{ fontWeight: 800, color: 'var(--color-amber)', background: 'var(--bg-secondary)' }} value={`R$ ${formData.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} readOnly />
              </div>

              <div className="form-group">
                <label className="form-label">Mecânico Responsável</label>
                <input className="form-input" name="mecanicoResponsavel" value={formData.mecanicoResponsavel} onChange={handleChange} placeholder="Nome do técnico/mecânico" />
              </div>
            </div>

            {/* Workshop & Location */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Oficina de Atendimento</label>
                <select className="form-select" name="oficinaTipo" value={formData.oficinaTipo} onChange={handleChange}>
                  <option value="interna">Oficina Interna da Empresa</option>
                  <option value="terceirizada">Oficina Terceirizada / Concessionária</option>
                </select>
              </div>

              {formData.oficinaTipo === 'terceirizada' && (
                <div className="form-group">
                  <label className="form-label">Nome da Oficina Terceirizada</label>
                  <input className="form-input" name="oficinaNome" value={formData.oficinaNome} onChange={handleChange} placeholder="Ex: Sotreq Caterpillar / Sandvik Service" required />
                </div>
              )}
            </div>

            {/* Next Preventive Schedule */}
            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#3b82f6" />
                Agendamento da Próxima Manutenção Preventiva
              </h4>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Próxima Data Prevista</label>
                  <input className="form-input" type="date" name="proximaDataManutencao" value={formData.proximaDataManutencao} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Horímetro Limite para Próxima Revisão</label>
                  <input className="form-input" type="number" name="proximoHorimetroManutencao" value={formData.proximoHorimetroManutencao} onChange={handleChange} placeholder="Ex: Horímetro atual + 250h" />
                </div>
              </div>
            </div>

          </div>

          {/* Actions Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>Salvar Ordem de Serviço</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
