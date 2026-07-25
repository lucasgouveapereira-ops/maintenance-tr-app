import React, { useState } from 'react';
import { X, Cloud, Save, ShieldCheck, Database, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { getStoredFirebaseConfig, saveStoredFirebaseConfig, isFirebaseConfigured } from '../services/firebase';
import { cloudSyncService } from '../services/cloudSyncService';

export default function FirebaseConfigModal({ isOpen, onClose }) {
  const [config, setConfig] = useState(getStoredFirebaseConfig());
  const [syncing, setSyncing] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredFirebaseConfig(config);
  };

  const handleSyncToCloud = async () => {
    if (!isFirebaseConfigured()) {
      alert('Por favor, salve primeiro as chaves do seu projeto Firebase.');
      return;
    }
    setSyncing(true);
    try {
      // Reload current local data to cloud
      const localEqs = JSON.parse(localStorage.getItem('tr_maintenance_equipments_v1') || '[]');
      const localMnts = JSON.parse(localStorage.getItem('tr_maintenance_records_v1') || '[]');

      for (const eq of localEqs) {
        await cloudSyncService.addOrUpdateEquipment(eq);
      }
      for (const mn of localMnts) {
        await cloudSyncService.addOrUpdateMaintenance(mn);
      }
      alert('Sincronização concluída! Todos os equipamentos e manutenções locais estão agora na nuvem em tempo real.');
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar dados para a nuvem. Verifique suas regras do Firestore.');
    } finally {
      setSyncing(false);
    }
  };

  const active = isFirebaseConfigured();

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '700px' }}>
        
        {/* Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cloud color="var(--color-amber)" />
            Configuração da Nuvem Firebase (Sincronização em Tempo Real)
          </h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Status Banner */}
            <div style={{ 
              padding: '16px', 
              borderRadius: 'var(--radius-md)', 
              background: active ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
              border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: active ? 'var(--color-success)' : 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {active ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {active ? 'Conectado à Nuvem Firebase (Sincronização em Tempo Real Ativa)' : 'Modo de Armazenamento Local (Aguardando Chaves do Firebase)'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {active 
                    ? 'Qualquer atualização efetuada em um celular ou computador é refletida instantaneamente em todos os outros aparelhos.'
                    : 'Cole as credenciais do seu projeto Firebase Console abaixo para ativar o banco de dados Firestore em tempo real.'
                  }
                </p>
              </div>

              {active && (
                <button type="button" className="btn btn-secondary" onClick={handleSyncToCloud} disabled={syncing} style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                  <Database size={14} /> {syncing ? 'Enviando...' : 'Enviar Dados à Nuvem'}
                </button>
              )}
            </div>

            {/* Instruction Link */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Crie um projeto gratuito em 1 minuto no <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-amber)', fontWeight: 600 }}>Firebase Console <ExternalLink size={12} /></a> e copie as chaves abaixo (em Configurações do Projeto {'>'} Seus Apps {'>'} Configuração da web).
            </div>

            {/* Form Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">API Key *</label>
                <input className="form-input" name="apiKey" value={config.apiKey} onChange={handleChange} placeholder="AIzaSy..." required />
              </div>

              <div className="form-group">
                <label className="form-label">Project ID *</label>
                <input className="form-input" name="projectId" value={config.projectId} onChange={handleChange} placeholder="meu-projeto-123" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Auth Domain</label>
                <input className="form-input" name="authDomain" value={config.authDomain} onChange={handleChange} placeholder="meu-projeto.firebaseapp.com" />
              </div>

              <div className="form-group">
                <label className="form-label">Storage Bucket</label>
                <input className="form-input" name="storageBucket" value={config.storageBucket} onChange={handleChange} placeholder="meu-projeto.appspot.com" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">App ID</label>
                <input className="form-input" name="appId" value={config.appId} onChange={handleChange} placeholder="1:123456789:web:abcdef..." />
              </div>

              <div className="form-group">
                <label className="form-label">Messaging Sender ID</label>
                <input className="form-input" name="messagingSenderId" value={config.messagingSenderId} onChange={handleChange} placeholder="123456789" />
              </div>
            </div>

          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>Salvar & Conectar Nuvem</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
