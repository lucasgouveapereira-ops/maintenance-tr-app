import React, { useState } from 'react';
import { Shield, Wrench, KeyRound, X, Check, Lock } from 'lucide-react';
import { authService, USER_ROLES } from '../services/authService';

export default function RoleSelectionModal({ isOpen, onClose, onRoleChanged }) {
  const currentRole = authService.getCurrentRole();
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPinChange, setShowPinChange] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError('');
    setPin('');
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setError('');

    if (selectedRole === USER_ROLES.ADMIN) {
      const result = authService.setRole(USER_ROLES.ADMIN, pin);
      if (!result.success) {
        setError(result.error);
        return;
      }
    } else {
      authService.setRole(USER_ROLES.MECHANIC);
    }

    onRoleChanged(selectedRole);
    onClose();
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    setError('');
    setPinSuccess('');

    const res = authService.setAdminPin(oldPin, newPin);
    if (!res.success) {
      setError(res.error);
    } else {
      setPinSuccess('Senha de Administrador alterada com sucesso!');
      setOldPin('');
      setNewPin('');
      setShowPinChange(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '100%' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} color="var(--color-amber)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Seleção de Perfil de Acesso</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Selecione a conta correspondente à sua função no sistema:
          </p>

          {/* Role Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>

            {/* Admin Option */}
            <div
              onClick={() => handleSelectRole(USER_ROLES.ADMIN)}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: selectedRole === USER_ROLES.ADMIN ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-tertiary)',
                border: `2px solid ${selectedRole === USER_ROLES.ADMIN ? 'var(--color-amber)' : 'var(--border-color)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-sm)', color: 'var(--color-amber)' }}>
                  <Shield size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    👨‍💼 Administrador / Proprietário
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Acesso total: KPIs, preços, custos, relatórios e gestão.
                  </p>
                </div>
              </div>
              {selectedRole === USER_ROLES.ADMIN && <Check size={20} color="var(--color-amber)" />}
            </div>

            {/* Mechanic Option */}
            <div
              onClick={() => handleSelectRole(USER_ROLES.MECHANIC)}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: selectedRole === USER_ROLES.MECHANIC ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg-tertiary)',
                border: `2px solid ${selectedRole === USER_ROLES.MECHANIC ? '#3b82f6' : 'var(--border-color)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-sm)', color: '#3b82f6' }}>
                  <Wrench size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    🔧 Mecânico / Operador
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Interface operacional: Abertura e registro de OS (sem valores).
                  </p>
                </div>
              </div>
              {selectedRole === USER_ROLES.MECHANIC && <Check size={20} color="#3b82f6" />}
            </div>

          </div>

          {/* Form Confirmation */}
          <form onSubmit={handleConfirm}>
            {selectedRole === USER_ROLES.ADMIN && (
              <div style={{ marginBottom: '16px', background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  <Lock size={14} color="var(--color-amber)" />
                  Senha / PIN de Administrador *
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Digite a senha (padrão: 1234)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  style={{ height: '40px', fontSize: '16px' }}
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Senha inicial de fábrica: <strong>1234</strong>
                </span>
              </div>
            )}

            {error && (
              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-danger-bg)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-danger)', fontSize: '0.8rem', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            {pinSuccess && (
              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--color-success-bg)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--color-success)', fontSize: '0.8rem', marginBottom: '16px' }}>
                {pinSuccess}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
                Entrar no Perfil
              </button>
            </div>
          </form>

          {/* Change Admin PIN Accordion */}
          {currentRole === USER_ROLES.ADMIN && (
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '4px 8px', width: '100%', justifyContent: 'center' }}
                onClick={() => setShowPinChange(!showPinChange)}
              >
                <KeyRound size={14} />
                <span>{showPinChange ? 'Ocultar Alteração de Senha' : 'Alterar Senha do Administrador'}</span>
              </button>

              {showPinChange && (
                <form onSubmit={handleChangePin} style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Senha Atual</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Ex: 1234"
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value)}
                      style={{ height: '36px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600 }}>Nova Senha</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Mínimo 4 caracteres"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      style={{ height: '36px' }}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ height: '34px', fontSize: '0.78rem' }}>
                    Salvar Nova Senha
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
