import React, { useState, useEffect } from 'react';
import { X, Wrench, Calendar, Clock, DollarSign, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { USER_ROLES } from '../services/authService';

export default function MaintenanceFormModal({ maintenance, equipments, defaultEquipmentId, isOpen, onClose, onSave, currentRole }) {
  const isAdmin = currentRole === USER_ROLES.ADMIN;

  const [formData, setFormData] = useState({
    id: '',
    equipamentoId: defaultEquipmentId || '',
    dataRevisao: new Date().toISOString().split('T')[0],
    horimetro: 0,
    tipo: 'Preventiva',
    itensServicos: '',
    causaFalhaDiagnostico: '',
    pecas: [],
    custoPecas: 0,
    custoMaoDeObra: 0,
    custoTotal: 0,
    downtimeHoras: 0,
    mecanicoResponsavel: '',
    oficinaTipo: 'interna',
    oficinaNome: 'Oficina Interna',
    statusOS: 'Aberta',
    proximaDataManutencao: '',
    proximoHorimetroManutencao: ''
  });

  // Dynamic part form input
  const [pecaNome, setPecaNome] = useState('');
  const [pecaQtd, setPecaQtd] = useState(1);
  const [pecaValorUnit, setPecaValorUnit] = useState(0);

  useEffect(() => {
    if (maintenance) {
      setFormData({
        ...maintenance,
        pecas: maintenance.pecas || []
      });
    } else {
      const selectedEq = equipments.find(e => e.id === defaultEquipmentId);
      setFormData({
        id: '',
        equipamentoId: defaultEquipmentId || (equipments[0] ? equipments[0].id : ''),
        dataRevisao: new Date().toISOString().split('T')[0],
        horimetro: selectedEq ? Number(selectedEq.horimetroAtual || 0) : 0,
        tipo: 'Preventiva',
        itensServicos: '',
        causaFalhaDiagnostico: '',
        pecas: [],
        custoPecas: 0,
        custoMaoDeObra: 0,
        custoTotal: 0,
        downtimeHoras: 0,
        mecanicoResponsavel: '',
        oficinaTipo: 'interna',
        oficinaNome: 'Oficina Interna',
        statusOS: 'Aberta',
        proximaDataManutencao: '',
        proximoHorimetroManutencao: ''
      });
    }
  }, [maintenance, defaultEquipmentId, isOpen, equipments]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      if (name === 'equipamentoId') {
        const eq = equipments.find(e => e.id === value);
        if (eq && (!prev.horimetro || prev.horimetro === 0)) {
          updated.horimetro = Number(eq.horimetroAtual || 0);
        }
      }

      if (name === 'custoMaoDeObra') {
        const mo = Number(value) || 0;
        updated.custoTotal = Number(prev.custoPecas || 0) + mo;
      }

      return updated;
    });
  };

  const handleAddPeca = () => {
    if (!pecaNome.trim()) return;

    const qtd = Number(pecaQtd) || 1;
    const vUnit = Number(pecaValorUnit) || 0;
    const vTotal = qtd * vUnit;

    const newPeca = {
      id: `p-${Date.now()}`,
      nome: pecaNome.trim(),
      quantidade: qtd,
      valorUnitario: vUnit,
      valorTotal: vTotal
    };

    const updatedPecas = [...formData.pecas, newPeca];
    const totalPecasCost = updatedPecas.reduce((acc, p) => acc + p.valorTotal, 0);

    setFormData(prev => ({
      ...prev,
      pecas: updatedPecas,
      custoPecas: totalPecasCost,
      custoTotal: totalPecasCost + Number(prev.custoMaoDeObra || 0)
    }));

    setPecaNome('');
    setPecaQtd(1);
    setPecaValorUnit(0);
  };

  const handleRemovePeca = (id) => {
    const updatedPecas = formData.pecas.filter(p => p.id !== id);
    const totalPecasCost = updatedPecas.reduce((acc, p) => acc + p.valorTotal, 0);

    setFormData(prev => ({
      ...prev,
      pecas: updatedPecas,
      custoPecas: totalPecasCost,
      custoTotal: totalPecasCost + Number(prev.custoMaoDeObra || 0)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.equipamentoId) {
      alert('Por favor, selecione um equipamento.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-content glass-panel" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench color="var(--color-amber)" />
            {formData.id ? 'Editar Ordem de Serviço (OS)' : 'Nova Ordem de Serviço (OS)'}
          </h3>
          <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
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
                <Wrench size={18} color="var(--color-amber)" />
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
                {isAdmin && (
                  <div className="form-group" style={{ margin: 0, flex: 1 }}>
                    <label className="form-label">Valor Unit. (R$)</label>
                    <input className="form-input" type="number" step="0.01" value={pecaValorUnit} onChange={e => setPecaValorUnit(e.target.value)} placeholder="0.00" />
                  </div>
                )}
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
                      {isAdmin && <th style={{ padding: '6px 10px' }}>Valor Unit.</th>}
                      {isAdmin && <th style={{ padding: '6px 10px' }}>Subtotal</th>}
                      <th style={{ padding: '6px 10px', textAlign: 'right' }}>Remover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.pecas.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '6px 10px' }}>{p.nome}</td>
                        <td style={{ padding: '6px 10px' }}>{p.quantidade}</td>
                        {isAdmin && <td style={{ padding: '6px 10px' }}>R$ {Number(p.valorUnitario).toFixed(2)}</td>}
                        {isAdmin && <td style={{ padding: '6px 10px', fontWeight: 700 }}>R$ {Number(p.valorTotal).toFixed(2)}</td>}
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

            {/* Responsibility & Workshop Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mecânico Responsável *</label>
                <input className="form-input" name="mecanicoResponsavel" value={formData.mecanicoResponsavel} onChange={handleChange} placeholder="Nome do técnico/mecânico" required />
              </div>

              {isAdmin && (
                <>
                  <div className="form-group">
                    <label className="form-label">Custo Mão de Obra (R$)</label>
                    <input className="form-input" type="number" step="0.01" name="custoMaoDeObra" value={formData.custoMaoDeObra} onChange={handleChange} placeholder="0.00" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Custo Total Calculado</label>
                    <input className="form-input" style={{ fontWeight: 800, color: 'var(--color-amber)', background: 'var(--bg-secondary)' }} value={`R$ ${formData.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} readOnly />
                  </div>
                </>
              )}
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

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
              {formData.id ? 'Salvar Alterações' : 'Salvar e Registrar OS'}
            </button>
          </div>

      </form>
    </div>
  );
}
