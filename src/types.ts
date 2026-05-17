export type ReportType = 'lab' | 'vitals' | 'medication' | 'notes';

export interface MedicalRecord {
  id: number;
  date: string;
  type: ReportType;
  weight?: number;
  notes?: string;
  
  // RUR (Urine)
  rur_protein?: number;
  rur_creatinine?: number;
  rur_pc_ratio?: number;
  rur_ac_ratio?: number;
  
  // RHM (CBC)
  rhm_hb?: number;
  rhm_wbc?: number;
  rhm_platelets?: number;
  rhm_hematocrit?: number;
  rhm_rbc?: number;
  
  // RCH (KFT)
  rch_urea?: number;
  rch_creatinine?: number;
  
  // RST
  rst_tac_level?: number;

  // Heritage fields
  creatinine?: number;
  bp_sys?: number;
  bp_dia?: number;
  urine_output?: number;
  
  created_at?: string;
}

export interface MedicalRecordFormData {
  date: string;
  type: ReportType;
  weight: string | number;
  notes: string;
  
  rur_protein: string | number;
  rur_creatinine: string | number;
  rur_pc_ratio: string | number;
  rur_ac_ratio: string | number;
  
  rhm_hb: string | number;
  rhm_wbc: string | number;
  rhm_platelets: string | number;
  rhm_hematocrit: string | number;
  rhm_rbc: string | number;
  
  rch_urea: string | number;
  rch_creatinine: string | number;
  
  rst_tac_level: string | number;

  bp_sys: string | number;
  bp_dia: string | number;
}
