// Constants and Types for Equipment Maintenance System

export const EQUIPMENT_TYPES = [
  'Perfuratriz Hidráulica',
  'Escavadeira Hidráulica',
  'Compressor de Ar',
  'Gerador Silenciado',
  'Pá Carregadeira',
  'Caminhão Basculante',
  'Trator de Esteira',
  'Motoniveladora',
  'Outros'
];

export const EQUIPMENT_STATUS = {
  OPERATIONAL: { label: 'Operacional', color: 'success', bg: 'var(--color-success-bg)' },
  IN_MAINTENANCE: { label: 'Em Manutenção', color: 'warning', bg: 'var(--color-warning-bg)' },
  STOPPED: { label: 'Parado / Avariado', color: 'danger', bg: 'var(--color-danger-bg)' },
  DECOMMISSIONED: { label: 'Baixado', color: 'muted', bg: 'var(--color-muted-bg)' }
};

export const MAINTENANCE_TYPES = {
  PREVENTIVE: 'Preventiva',
  CORRECTIVE: 'Corretiva'
};

export const OS_STATUS = {
  OPEN: { label: 'Aberta', key: 'aberta', color: 'info' },
  IN_PROGRESS: { label: 'Em Andamento', key: 'em_andamento', color: 'warning' },
  COMPLETED: { label: 'Concluída', key: 'concluida', color: 'success' }
};

export const NR12_STATUS = {
  COMPLIANT: 'Adequado / Conforme',
  PENDING: 'Pendente de Inspeção',
  NON_COMPLIANT: 'Não Conforme',
  NOT_APPLICABLE: 'Não Aplicável'
};

export const NR19_STATUS = {
  APPLICABLE_OK: 'Conforme (Explosivos / Detonação)',
  PENDING: 'Pendente de Vistoria',
  NOT_APPLICABLE: 'Não Aplicável'
};
