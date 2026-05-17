import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Activity, Beaker, FileText, Pill } from 'lucide-react';
import { MedicalRecord, ReportType, MedicalRecordFormData } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MedicalRecordFormData) => void;
  initialData?: MedicalRecord;
}

const reportTypes: { value: ReportType; label: string; icon: any }[] = [
  { value: 'lab', label: 'Lab Results', icon: Beaker },
  { value: 'vitals', label: 'Vitals', icon: Activity },
  { value: 'medication', label: 'Medication', icon: Pill },
  { value: 'notes', label: 'Doctor Notes', icon: FileText },
];

interface InputFieldProps {
  label: string;
  name: keyof MedicalRecordFormData;
  placeholder?: string;
  step?: string;
  type?: string;
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
}

const InputField = React.memo(({ label, name, placeholder, step = "0.01", type = "number", required = false, value, onChange, id }: InputFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-[10px] font-bold text-natural-label uppercase tracking-widest mb-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      id={id}
      type={type}
      step={step}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-1.5 bg-natural-bg border border-natural-border rounded-lg focus:ring-1 focus:ring-natural-sage focus:bg-white outline-none text-sm transition-all shadow-sm"
    />
  </div>
));

export default function MedicalReportForm({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    date: new Date().toISOString().split('T')[0],
    type: 'lab',
    weight: '',
    notes: '',
    rur_protein: '',
    rur_creatinine: '',
    rur_pc_ratio: '',
    rur_ac_ratio: '',
    rhm_hb: '',
    rhm_wbc: '',
    rhm_platelets: '',
    rhm_hematocrit: '',
    rhm_rbc: '',
    rch_urea: '',
    rch_creatinine: '',
    rst_tac_level: '',
    bp_sys: '',
    bp_dia: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        type: initialData.type,
        weight: initialData.weight || '',
        notes: initialData.notes || '',
        rur_protein: initialData.rur_protein ?? '',
        rur_creatinine: initialData.rur_creatinine ?? '',
        rur_pc_ratio: initialData.rur_pc_ratio ?? '',
        rur_ac_ratio: initialData.rur_ac_ratio ?? '',
        rhm_hb: initialData.rhm_hb ?? '',
        rhm_wbc: initialData.rhm_wbc ?? '',
        rhm_platelets: initialData.rhm_platelets ?? '',
        rhm_hematocrit: initialData.rhm_hematocrit ?? '',
        rhm_rbc: initialData.rhm_rbc ?? '',
        rch_urea: initialData.rch_urea ?? '',
        rch_creatinine: initialData.rch_creatinine ?? '',
        rst_tac_level: initialData.rst_tac_level ?? '',
        bp_sys: initialData.bp_sys ?? '',
        bp_dia: initialData.bp_dia ?? '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'lab',
        weight: '',
        notes: '',
        rur_protein: '',
        rur_creatinine: '',
        rur_pc_ratio: '',
        rur_ac_ratio: '',
        rhm_hb: '',
        rhm_wbc: '',
        rhm_platelets: '',
        rhm_hematocrit: '',
        rhm_rbc: '',
        rch_urea: '',
        rch_creatinine: '',
        rst_tac_level: '',
        bp_sys: '',
        bp_dia: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      alert('Failed to save record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-natural-border flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-natural-border bg-natural-bg/30">
            <h2 className="text-lg font-bold text-natural-title flex items-center gap-2">
              <Beaker className="w-5 h-5 text-natural-sage" />
              {initialData ? 'Update Lab Results' : 'Post-Transplant Clinical Entry'}
            </h2>
            <button onClick={onClose} className="p-1.5 hover:bg-natural-bg rounded-lg transition-colors text-natural-label hover:text-natural-sage">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-6 space-y-8 flex-1">
              {/* Header Group */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="appt-date" className="block text-[11px] font-bold text-natural-muted uppercase tracking-widest mb-1.5">
                    Appointment Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-label" />
                    <input
                      id="appt-date"
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 bg-natural-bg border border-natural-border rounded-lg focus:ring-1 focus:ring-natural-sage focus:bg-white outline-none text-sm transition-all shadow-sm"
                    />
                  </div>
                </div>
                <InputField 
                  id="clinical-weight"
                  label="Weight (kg)" 
                  name="weight" 
                  placeholder="Ex: 74.5" 
                  step="0.1" 
                  value={formData.weight} 
                  onChange={handleChange} 
                />
                <InputField
                  id="rst-tac"
                  label="TAC LEVEL (RST)"
                  name="rst_tac_level"
                  placeholder="ng/mL"
                  step="0.1"
                  value={formData.rst_tac_level}
                  onChange={handleChange}
                />
              </div>

              {/* Lab Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* RUR */}
                <div className="p-4 bg-natural-bg/50 rounded-xl border border-natural-border space-y-4">
                  <h3 className="text-[12px] font-bold text-natural-muted flex items-center gap-2 border-b border-natural-border pb-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div> RUR (Urine Analysis)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField id="rur-prot" label="Protein" name="rur_protein" value={formData.rur_protein} onChange={handleChange} />
                    <InputField id="rur-cr" label="Creatinine" name="rur_creatinine" value={formData.rur_creatinine} onChange={handleChange} />
                    <InputField id="rur-pc" label="P/C Ratio" name="rur_pc_ratio" value={formData.rur_pc_ratio} onChange={handleChange} />
                    <InputField id="rur-ac" label="A/C Ratio" name="rur_ac_ratio" value={formData.rur_ac_ratio} onChange={handleChange} />
                  </div>
                </div>

                {/* RCH */}
                <div className="p-4 bg-natural-bg/50 rounded-xl border border-natural-border space-y-4">
                  <h3 className="text-[12px] font-bold text-natural-muted flex items-center gap-2 border-b border-natural-border pb-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div> RCH (KFT / Urea)
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField id="rch-urea" label="Urea" name="rch_urea" value={formData.rch_urea} onChange={handleChange} />
                    <InputField id="rch-cr" label="Creatinine" name="rch_creatinine" required value={formData.rch_creatinine} onChange={handleChange} />
                  </div>
                </div>

                {/* RHM */}
                <div className="p-4 bg-natural-bg/50 rounded-xl border border-natural-border lg:col-span-2 space-y-4">
                  <h3 className="text-[12px] font-bold text-natural-muted flex items-center gap-2 border-b border-natural-border pb-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-rose-400"></div> RHM (Complete Blood Count)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <InputField id="rhm-hb" label="HB" name="rhm_hb" value={formData.rhm_hb} onChange={handleChange} />
                    <InputField id="rhm-wbc" label="WBC" name="rhm_wbc" value={formData.rhm_wbc} onChange={handleChange} />
                    <InputField id="rhm-plt" label="Platelets" name="rhm_platelets" value={formData.rhm_platelets} onChange={handleChange} />
                    <InputField id="rhm-hct" label="Hematocrit" name="rhm_hematocrit" value={formData.rhm_hematocrit} onChange={handleChange} />
                    <InputField id="rhm-rbc" label="RBC Count" name="rhm_rbc" value={formData.rhm_rbc} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="clinical-notes" className="block text-[11px] font-bold text-natural-muted uppercase tracking-widest mb-1.5">Clinical Observations & Symptoms</label>
                <textarea
                  id="clinical-notes"
                  name="notes"
                  rows={3}
                  placeholder="Describe physical status, any edema, or changes in medications..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-natural-bg border border-natural-border rounded-lg focus:ring-1 focus:ring-natural-sage focus:bg-white outline-none resize-none text-sm leading-relaxed transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Sticky Footer inside the Form */}
            <div className="p-6 border-t border-natural-border bg-natural-bg/30 flex gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-lg border border-natural-border font-bold text-natural-muted hover:bg-natural-bg transition-colors text-sm shadow-sm disabled:opacity-50"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-3 px-4 rounded-lg bg-natural-sage font-bold text-white hover:bg-natural-sage-dark transition-all flex items-center justify-center gap-2 text-sm shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {initialData ? (isSubmitting ? 'Updating...' : 'Update Record') : (isSubmitting ? 'Adding...' : 'Add Record')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
