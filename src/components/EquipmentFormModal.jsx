import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, ShieldCheck, Truck, UserCheck } from 'lucide-react';
import { EQUIPMENT_TYPES, EQUIPMENT_STATUS, NR12_STATUS, NR19_STATUS } from '../types';

export default function EquipmentFormModal({ equipment, isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('identificacao');
  
  const [formData, setFormData] = useState({
    tipo: EQUIPMENT_TYPES[0],
    marca: '',
    modelo: '',
    numeroSerie: '',
    numeroInventario: '',
    anoFabricacao: new Date().getFullYear(),
    dataAquisicao: new Date().toISOString().split('T')[0],
    valorCompra: '',
    fornecedor: '',
    localizacao: 'Canteiro Central',
    status: 'Operacional',
    vidaUtilEstimada: '15.000 horas',
    prazoGarantia: '',
    fotoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    horimetroAtual: 0,
    nr12Status: 'Adequado / Conforme',
    nr12DataUltimaInspecao: '',
    nr12DataProximaInspecao: '',
    nr19Aplicavel: false,
    nr19Status: 'Não Aplicável',
    operadoresHabilitados: []
  });

  const [novoOperadorNome, setNovoOperadorNome] = useState('');
  const [novoOperadorMatricula, setNovoOperadorMatricula] = useState('');

  useEffect(() => {
    if (equipment) {
      setFormData({
        ...equipment,
        operadoresHabilitados: equipment.operadoresHabilitados || []
      });
    } else {
      setFormData({
        tipo: EQUIPMENT_TYPES[0],
        marca: '',
        modelo: '',
        numeroSerie: '',
        numeroInventario: `EQ-${Math.floor(10 + Math.random() * 90)}`,
        anoFabricacao: new Date().getFullYear(),
        dataAquisicao: new Date().toISOString().split('T')[0],
        valorCompra: '',
        fornecedor: '',
        localizacao: 'Mina Norte',
        status: 'Operacional',
        vidaUtilEstimada: '15.000 horas',
        prazoGarantia: '',
        fotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
        horimetroAtual: 0,
        nr12Status: 'Adequado / Conforme',
        nr12DataUltimaInspecao: new Date().toISOString().split('T')[0],
        nr12DataProximaInspecao: '',
        nr19Aplicavel: false,
        nr19Status: 'Não Aplicável',
        operadoresHabilitados: []
      });
    }
  }, [equipment, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddOperador = () => {
    if (!novoOperadorNome.trim()) return;
    const item = {
      nome: novoOperadorNome.trim(),
      matricula: novoOperadorMatricula.trim() || `OP-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setFormData(prev => ({
      ...prev,
      operadoresHabilitados: [...prev.operadoresHabilitados, item]
    }));
    setNovoOperadorNome('');
    setNovoOperadorMatricula('');
  };

  const handleRemoveOperador = (index) => {
    setFormData(prev => ({
      ...prev,
      operadoresHabilitados: prev.operadoresHabilitados.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.marca || !formData.modelo || !formData.numeroInventario) {
      alert('Por favor, preencha os campos obrigatórios: Marca, Modelo e N° de Inventário.');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '800px' }}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck color="var(--color-amber)" />
            {equipment ? 'Editar Cadastro de Equipamento' : 'Cadastrar Novo Equipamento'}
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-body">
            
            {/* Tabs Header */}
            <div className="tabs-header">
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'identificacao' ? 'active' : ''}`}
                onClick={() => setActiveTab('identificacao')}
              >
                1. Identificação & Aquisição
              </button>
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'operacao' ? 'active' : ''}`}
                onClick={() => setActiveTab('operacao')}
              >
                2. Operação & Alocação
              </button>
              <button 
                type="button" 
                className={`tab-btn ${activeTab === 'seguranca' ? 'active' : ''}`}
                onClick={() => setActiveTab('seguranca')}
              >
                3. Segurança (NR-12 / NR-19)
              </button>
            </div>

            {/* TAB 1: Identificação e Aquisição */}
            {activeTab === 'identificacao' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tipo de Equipamento *</label>
                    <select className="form-select" name="tipo" value={formData.tipo} onChange={handleChange} required>
                      {EQUIPMENT_TYPES.map((t, i) => (
                        <option key={i} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Número de Inventário / Tag Interna *</label>
                    <input className="form-input" name="numeroInventario" value={formData.numeroInventario} onChange={handleChange} placeholder="Ex: PRF-01" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Marca *</label>
                    <input className="form-input" name="marca" value={formData.marca} onChange={handleChange} placeholder="Ex: Sandvik / Caterpillar" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Modelo *</label>
                    <input className="form-input" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Ex: DP1500i" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Número de Série</label>
                    <input className="form-input" name="numeroSerie" value={formData.numeroSerie} onChange={handleChange} placeholder="Ex: SN-88491" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Ano de Fabricação</label>
                    <input className="form-input" type="number" name="anoFabricacao" value={formData.anoFabricacao} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Data de Aquisição</label>
                    <input className="form-input" type="date" name="dataAquisicao" value={formData.dataAquisicao} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Valor de Compra (R$)</label>
                    <input className="form-input" type="number" step="0.01" name="valorCompra" value={formData.valorCompra} onChange={handleChange} placeholder="0.00" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fornecedor / Revenda</label>
                    <input className="form-input" name="fornecedor" value={formData.fornecedor} onChange={handleChange} placeholder="Nome da concessionária/revenda" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prazo de Garantia</label>
                    <input className="form-input" name="prazoGarantia" value={formData.prazoGarantia} onChange={handleChange} placeholder="Ex: 24 meses ou até 2026-12" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Vida Útil Estimada</label>
                    <input className="form-input" name="vidaUtilEstimada" value={formData.vidaUtilEstimada} onChange={handleChange} placeholder="Ex: 15.000 horas" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">URL da Foto do Equipamento</label>
                  <input className="form-input" name="fotoUrl" value={formData.fotoUrl} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>
            )}

            {/* TAB 2: Operação & Alocação */}
            {activeTab === 'operacao' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Localização Atual / Obra / Frente de Trabalho *</label>
                    <input className="form-input" name="localizacao" value={formData.localizacao} onChange={handleChange} placeholder="Ex: Mina Norte - Frente 02" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status Atual</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                      {Object.values(EQUIPMENT_STATUS).map((s, i) => (
                        <option key={i} value={s.label}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Horímetro Atual (Horas de Operação) *</label>
                  <input className="form-input" type="number" name="horimetroAtual" value={formData.horimetroAtual} onChange={handleChange} placeholder="Ex: 4850" required />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    O horímetro é atualizado automaticamente sempre que uma nova manutenção for registrada com horímetro superior.
                  </span>
                </div>
              </div>
            )}

            {/* TAB 3: Segurança (NR-12 e NR-19) & Operadores */}
            {activeTab === 'seguranca' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* NR-12 Section */}
                <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="var(--color-amber)" />
                    Adequação à NR-12 (Segurança no Trabalho em Máquinas e Equipamentos)
                  </h4>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Status de Inspeção NR-12</label>
                      <select className="form-select" name="nr12Status" value={formData.nr12Status} onChange={handleChange}>
                        {Object.values(NR12_STATUS).map((st, idx) => (
                          <option key={idx} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Data da Última Inspeção NR-12</label>
                      <input className="form-input" type="date" name="nr12DataUltimaInspecao" value={formData.nr12DataUltimaInspecao} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Próxima Inspeção NR-12</label>
                      <input className="form-input" type="date" name="nr12DataProximaInspecao" value={formData.nr12DataProximaInspecao} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {/* NR-19 Section */}
                <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <input type="checkbox" id="nr19Check" name="nr19Aplicavel" checked={formData.nr19Aplicavel} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                    <label htmlFor="nr19Check" style={{ fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                      Aplicar Conformidade com a NR-19 (Segurança com Explosivos e Detonação)
                    </label>
                  </div>

                  {formData.nr19Aplicavel && (
                    <div className="form-group">
                      <label className="form-label">Status NR-19</label>
                      <select className="form-select" name="nr19Status" value={formData.nr19Status} onChange={handleChange}>
                        {Object.values(NR19_STATUS).map((st, idx) => (
                          <option key={idx} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Certified Operators Section */}
                <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={18} color="#3b82f6" />
                    Operadores e Mecânicos Certificados/Habilitados
                  </h4>

                  <div className="form-row" style={{ alignItems: 'flex-end', marginBottom: '12px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Nome do Operador</label>
                      <input className="form-input" value={novoOperadorNome} onChange={e => setNovoOperadorNome(e.target.value)} placeholder="Ex: Carlos Silva" />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Matrícula / Registro</label>
                      <input className="form-input" value={novoOperadorMatricula} onChange={e => setNovoOperadorMatricula(e.target.value)} placeholder="Ex: OP-4091" />
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={handleAddOperador} style={{ height: '40px' }}>
                      <Plus size={16} /> Adicionar
                    </button>
                  </div>

                  {formData.operadoresHabilitados.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nenhum operador habilitado registrado para esta máquina.</p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {formData.operadoresHabilitados.map((op, idx) => (
                        <div key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                          <span><strong>{op.nome}</strong> ({op.matricula})</span>
                          <button type="button" onClick={() => handleRemoveOperador(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Modal Actions Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>Salvar Equipamento</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
