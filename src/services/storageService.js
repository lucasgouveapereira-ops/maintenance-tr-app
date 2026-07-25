import { INITIAL_EQUIPMENT, INITIAL_MAINTENANCE } from './mockData';

const STORAGE_KEYS = {
  EQUIPMENT: 'tr_maintenance_equipments_v1',
  MAINTENANCE: 'tr_maintenance_records_v1'
};

export const storageService = {
  getEquipments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
      if (data === null) {
        // Default to empty array for user to start fresh
        this.saveEquipments([]);
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading equipments from storage', e);
      return [];
    }
  },

  saveEquipments(equipments) {
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipments));
  },

  addEquipment(equipment) {
    const list = this.getEquipments();
    const newEq = {
      ...equipment,
      id: `eq-${Date.now()}`
    };
    list.unshift(newEq);
    this.saveEquipments(list);
    return newEq;
  },

  updateEquipment(equipment) {
    const list = this.getEquipments();
    const index = list.findIndex(e => e.id === equipment.id);
    if (index !== -1) {
      list[index] = { ...equipment };
      this.saveEquipments(list);
      return list[index];
    }
    return null;
  },

  deleteEquipment(id) {
    const list = this.getEquipments().filter(e => e.id !== id);
    this.saveEquipments(list);
    
    // Also remove related maintenance records
    const maintenances = this.getMaintenances().filter(m => m.equipamentoId !== id);
    this.saveMaintenances(maintenances);
  },

  getMaintenances() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MAINTENANCE);
      if (data === null) {
        this.saveMaintenances([]);
        return [];
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading maintenance records from storage', e);
      return [];
    }
  },

  saveMaintenances(maintenances) {
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenances));
  },

  addMaintenance(maintenance) {
    const list = this.getMaintenances();
    const newMaint = {
      ...maintenance,
      id: `mn-${Date.now()}`
    };
    list.unshift(newMaint);
    this.saveMaintenances(list);

    // Automatically update equipment horimeter if maintenance horimeter is higher
    if (newMaint.equipamentoId && newMaint.horimetro) {
      const equipments = this.getEquipments();
      const eq = equipments.find(e => e.id === newMaint.equipamentoId);
      if (eq && Number(newMaint.horimetro) > Number(eq.horimetroAtual || 0)) {
        eq.horimetroAtual = Number(newMaint.horimetro);
        this.updateEquipment(eq);
      }
    }

    return newMaint;
  },

  updateMaintenance(maintenance) {
    const list = this.getMaintenances();
    const index = list.findIndex(m => m.id === maintenance.id);
    if (index !== -1) {
      list[index] = { ...maintenance };
      this.saveMaintenances(list);

      // Update horimeter if higher
      if (maintenance.equipamentoId && maintenance.horimetro) {
        const equipments = this.getEquipments();
        const eq = equipments.find(e => e.id === maintenance.equipamentoId);
        if (eq && Number(maintenance.horimetro) > Number(eq.horimetroAtual || 0)) {
          eq.horimetroAtual = Number(maintenance.horimetro);
          this.updateEquipment(eq);
        }
      }

      return list[index];
    }
    return null;
  },

  deleteMaintenance(id) {
    const list = this.getMaintenances().filter(m => m.id !== id);
    this.saveMaintenances(list);
  },

  clearAllData() {
    this.saveEquipments([]);
    this.saveMaintenances([]);
    return {
      equipments: [],
      maintenances: []
    };
  },

  loadDemoData() {
    this.saveEquipments(INITIAL_EQUIPMENT);
    this.saveMaintenances(INITIAL_MAINTENANCE);
    return {
      equipments: INITIAL_EQUIPMENT,
      maintenances: INITIAL_MAINTENANCE
    };
  }
};
