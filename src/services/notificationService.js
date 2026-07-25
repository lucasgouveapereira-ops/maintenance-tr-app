/**
 * Notification Service for Mobile & Web Push Notifications
 */

export const notificationService = {
  isSupported() {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  getPermissionStatus() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission; // 'granted' | 'denied' | 'default'
  },

  async requestPermission() {
    if (!this.isSupported()) {
      alert('Seu navegador ou dispositivo não suporta notificações nativas.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.sendNotification('Notificações Ativadas! 🔔', {
          body: 'Você receberá alertas automáticos de manutenção preventiva e quebras de equipamentos no seu smartphone.',
          icon: '/favicon.svg'
        });
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error requesting notification permission', e);
      return false;
    }
  },

  sendNotification(title, options = {}) {
    if (!this.isSupported() || Notification.permission !== 'granted') return;

    try {
      const defaultOptions = {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        ...options
      };

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, defaultOptions);
        });
      } else {
        new Notification(title, defaultOptions);
      }
    } catch (e) {
      console.error('Failed to trigger notification', e);
    }
  },

  triggerPreventiveAlert(equipmentName, alertMessage) {
    this.sendNotification(`🚨 ALERTA PREVENTIVA: ${equipmentName}`, {
      body: alertMessage,
      tag: `preventive-${equipmentName}`
    });
  }
};
