/**
 * Service to calculate KPIs, metrics, and alerts for equipment maintenance.
 */

export function calculateEquipmentMetrics(equipment, maintenances) {
  const eqMaintenances = maintenances.filter(m => m.equipamentoId === equipment.id);
  
  const totalCost = eqMaintenances.reduce((acc, m) => acc + (Number(m.custoTotal) || 0), 0);
  const totalDowntime = eqMaintenances.reduce((acc, m) => acc + (Number(m.downtimeHoras) || 0), 0);
  
  const correctiveMaintenances = eqMaintenances.filter(m => m.tipo === 'Corretiva');
  const failureCount = correctiveMaintenances.length;
  
  // MTBF = (Total Horimeter - Total Downtime) / Number of Failures
  const totalHorimeter = equipment.horimetroAtual || 0;
  const mtbf = failureCount > 0 ? Math.round((totalHorimeter - totalDowntime) / failureCount) : totalHorimeter;
  
  // MTTR = Total Repair Downtime / Number of Repairs
  const mttr = failureCount > 0 ? (totalDowntime / failureCount).toFixed(1) : (totalDowntime > 0 ? totalDowntime : 0);
  
  // Get latest maintenance & next scheduled
  const sortedByDate = [...eqMaintenances].sort((a, b) => new Date(b.dataRevisao) - new Date(a.dataRevisao));
  const latestMaintenance = sortedByDate[0] || null;
  
  // Alert status
  let alert = { status: 'OK', message: 'Manutenções em dia', badge: 'success' };
  
  if (latestMaintenance) {
    const nextHorimeter = Number(latestMaintenance.proximoHorimetroManutencao) || 0;
    const currentHorimeter = Number(equipment.horimetroAtual) || 0;
    const hoursRemaining = nextHorimeter - currentHorimeter;
    
    const today = new Date();
    const nextDate = latestMaintenance.proximaDataManutencao ? new Date(latestMaintenance.proximaDataManutencao) : null;
    const daysRemaining = nextDate ? Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24)) : 999;
    
    if ((nextHorimeter > 0 && hoursRemaining <= 0) || (nextDate && daysRemaining <= 0)) {
      alert = { 
        status: 'CRITICAL', 
        message: hoursRemaining <= 0 
          ? `Preventiva VENCIDA (Horímetro ultrapassado em ${Math.abs(hoursRemaining)}h)`
          : `Preventiva VENCIDA (Data limite excedida)`, 
        badge: 'danger' 
      };
    } else if ((nextHorimeter > 0 && hoursRemaining <= 50) || (nextDate && daysRemaining <= 7)) {
      alert = { 
        status: 'WARNING', 
        message: hoursRemaining <= 50 
          ? `Preventiva Próxima (Faltam ${hoursRemaining}h)` 
          : `Preventiva Próxima (Faltam ${daysRemaining} dias)`, 
        badge: 'warning' 
      };
    }
  }

  return {
    equipmentId: equipment.id,
    totalCost,
    totalDowntime,
    maintenanceCount: eqMaintenances.length,
    failureCount,
    mtbf,
    mttr: Number(mttr),
    latestMaintenance,
    alert
  };
}

export function calculateGlobalKPIs(equipments, maintenances) {
  const totalEquipments = equipments.length;
  const operationalCount = equipments.filter(e => e.status === 'Operacional').length;
  const maintenanceCount = equipments.filter(e => e.status === 'Em Manutenção').length;
  const stoppedCount = equipments.filter(e => e.status === 'Parado / Avariado').length;
  const decommissionedCount = equipments.filter(e => e.status === 'Baixado').length;
  
  const totalCost = maintenances.reduce((acc, m) => acc + (Number(m.custoTotal) || 0), 0);
  const totalDowntime = maintenances.reduce((acc, m) => acc + (Number(m.downtimeHoras) || 0), 0);
  
  const correctiveCount = maintenances.filter(m => m.tipo === 'Corretiva').length;
  const preventiveCount = maintenances.filter(m => m.tipo === 'Preventiva').length;
  
  // Calculate average MTBF and MTTR across equipments
  const eqMetricsList = equipments.map(eq => calculateEquipmentMetrics(eq, maintenances));
  
  const totalMTBF = eqMetricsList.reduce((acc, item) => acc + item.mtbf, 0);
  const globalMTBF = totalEquipments > 0 ? Math.round(totalMTBF / totalEquipments) : 0;
  
  const totalMTTR = eqMetricsList.reduce((acc, item) => acc + item.mttr, 0);
  const globalMTTR = totalEquipments > 0 ? (totalMTTR / totalEquipments).toFixed(1) : 0;
  
  // Ranking of equipments by failures
  const breakdownRanking = [...eqMetricsList]
    .sort((a, b) => b.failureCount - a.failureCount || b.totalDowntime - a.totalDowntime)
    .map(item => {
      const eq = equipments.find(e => e.id === item.equipmentId);
      return {
        ...item,
        equipamentoNome: eq ? `${eq.marca} ${eq.modelo} (${eq.numeroInventario})` : 'Desconhecido',
        tipo: eq ? eq.tipo : ''
      };
    });

  // Collect active alerts
  const activeAlerts = eqMetricsList
    .filter(item => item.alert.status !== 'OK')
    .map(item => {
      const eq = equipments.find(e => e.id === item.equipmentId);
      return {
        equipment: eq,
        alert: item.alert,
        latestMaintenance: item.latestMaintenance
      };
    });

  return {
    totalEquipments,
    operationalCount,
    maintenanceCount,
    stoppedCount,
    decommissionedCount,
    totalCost,
    totalDowntime,
    correctiveCount,
    preventiveCount,
    globalMTBF,
    globalMTTR: Number(globalMTTR),
    breakdownRanking,
    activeAlerts
  };
}
