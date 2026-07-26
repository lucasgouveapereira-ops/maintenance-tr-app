const ROLE_KEY = 'tr_user_role_v1';
const ADMIN_PIN_KEY = 'tr_admin_pin_v1';

export const USER_ROLES = {
  ADMIN: 'admin',
  MECHANIC: 'mechanic'
};

export const authService = {
  /**
   * Get current active user role ('admin' or 'mechanic').
   * Defaults to 'admin' if not set.
   */
  getCurrentRole() {
    try {
      const stored = localStorage.getItem(ROLE_KEY);
      return stored === USER_ROLES.MECHANIC ? USER_ROLES.MECHANIC : USER_ROLES.ADMIN;
    } catch (e) {
      return USER_ROLES.ADMIN;
    }
  },

  /**
   * Set user role. If switching to Admin, verify PIN.
   */
  setRole(role, inputPin = '') {
    if (role === USER_ROLES.ADMIN) {
      const currentPin = this.getAdminPin();
      if (inputPin !== currentPin) {
        return { success: false, error: 'Senha incorreta do Administrador!' };
      }
    }

    try {
      localStorage.setItem(ROLE_KEY, role);
      return { success: true, role };
    } catch (e) {
      console.error('Error setting role', e);
      return { success: false, error: 'Erro ao salvar perfil no dispositivo.' };
    }
  },

  /**
   * Get configured Admin PIN (Defaults to '1234').
   */
  getAdminPin() {
    try {
      return localStorage.getItem(ADMIN_PIN_KEY) || '1234';
    } catch (e) {
      return '1234';
    }
  },

  /**
   * Update Admin PIN.
   */
  setAdminPin(currentPin, newPin) {
    if (currentPin !== this.getAdminPin()) {
      return { success: false, error: 'Senha atual incorreta!' };
    }
    if (!newPin || newPin.length < 4) {
      return { success: false, error: 'A nova senha deve ter pelo menos 4 caracteres.' };
    }

    try {
      localStorage.setItem(ADMIN_PIN_KEY, newPin);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Erro ao atualizar senha.' };
    }
  },

  /**
   * Check if current profile is Admin.
   */
  isAdmin() {
    return this.getCurrentRole() === USER_ROLES.ADMIN;
  },

  /**
   * Check if current profile is Mechanic.
   */
  isMechanic() {
    return this.getCurrentRole() === USER_ROLES.MECHANIC;
  }
};
