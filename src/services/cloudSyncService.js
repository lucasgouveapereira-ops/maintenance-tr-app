import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { storageService } from './storageService';

export const cloudSyncService = {
  /**
   * Subscribe to real-time updates for Equipments collection.
   * Calls callback(equipmentsArray) whenever data changes on ANY connected device.
   */
  subscribeEquipments(onUpdate) {
    if (!isFirebaseConfigured() || !db) {
      // Fallback to local storage if Firebase credentials not set
      onUpdate(storageService.getEquipments());
      return () => {};
    }

    try {
      const q = query(collection(db, 'equipments'));
      return onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        
        // Also update local cache
        storageService.saveEquipments(list);
        onUpdate(list);
      }, (err) => {
        console.error('Firestore Equipments listener error:', err);
        onUpdate(storageService.getEquipments());
      });
    } catch (e) {
      console.error('Error subscribing to equipments', e);
      onUpdate(storageService.getEquipments());
      return () => {};
    }
  },

  /**
   * Subscribe to real-time updates for Maintenances collection.
   * Calls callback(maintenancesArray) whenever OS data changes on ANY device.
   */
  subscribeMaintenances(onUpdate) {
    if (!isFirebaseConfigured() || !db) {
      onUpdate(storageService.getMaintenances());
      return () => {};
    }

    try {
      const q = query(collection(db, 'maintenances'));
      return onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        
        storageService.saveMaintenances(list);
        onUpdate(list);
      }, (err) => {
        console.error('Firestore Maintenances listener error:', err);
        onUpdate(storageService.getMaintenances());
      });
    } catch (e) {
      console.error('Error subscribing to maintenances', e);
      onUpdate(storageService.getMaintenances());
      return () => {};
    }
  },

  // Save / Add Equipment to Cloud
  async addOrUpdateEquipment(equipment) {
    const eqId = equipment.id || `eq-${Date.now()}`;
    const payload = { ...equipment, id: eqId };

    if (isFirebaseConfigured() && db) {
      await setDoc(doc(db, 'equipments', eqId), payload, { merge: true });
    } else {
      if (equipment.id) {
        storageService.updateEquipment(payload);
      } else {
        storageService.addEquipment(payload);
      }
    }
    return payload;
  },

  // Delete Equipment from Cloud
  async deleteEquipment(id) {
    if (isFirebaseConfigured() && db) {
      await deleteDoc(doc(db, 'equipments', id));
    } else {
      storageService.deleteEquipment(id);
    }
  },

  // Save / Add Maintenance to Cloud
  async addOrUpdateMaintenance(maintenance) {
    const mId = maintenance.id || `mn-${Date.now()}`;
    const payload = { ...maintenance, id: mId };

    if (isFirebaseConfigured() && db) {
      await setDoc(doc(db, 'maintenances', mId), payload, { merge: true });

      // Automatically update equipment horimeter in Cloud if maintenance horimeter is higher
      if (payload.equipamentoId && payload.horimetro) {
        const eqRef = doc(db, 'equipments', payload.equipamentoId);
        await setDoc(eqRef, { horimetroAtual: Number(payload.horimetro) }, { merge: true });
      }
    } else {
      if (maintenance.id) {
        storageService.updateMaintenance(payload);
      } else {
        storageService.addMaintenance(payload);
      }
    }
    return payload;
  },

  // Delete Maintenance OS from Cloud
  async deleteMaintenance(id) {
    if (isFirebaseConfigured() && db) {
      await deleteDoc(doc(db, 'maintenances', id));
    } else {
      storageService.deleteMaintenance(id);
    }
  },

  // Clear all cloud data
  async clearAllCloudData() {
    if (isFirebaseConfigured() && db) {
      const eqSnap = await getDocs(collection(db, 'equipments'));
      const batch = writeBatch(db);
      eqSnap.forEach(d => batch.delete(d.ref));

      const mnSnap = await getDocs(collection(db, 'maintenances'));
      mnSnap.forEach(d => batch.delete(d.ref));

      await batch.commit();
    }
    storageService.clearAllData();
  }
};
