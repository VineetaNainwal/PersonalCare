import React, { useState, useMemo, useEffect } from 'react';
import { Edit2, Trash2, Beaker, Activity, FileText, Pill, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { MedicalRecord, ReportType } from '../types';
import { format } from 'date-fns';

interface Props {
  records: MedicalRecord[];
  onEdit?: (record: MedicalRecord) => void;
  onDelete?: (id: string | number) => void;
  sortConfig: { key: keyof MedicalRecord; direction: 'asc' | 'desc' };
  onSort: (key: keyof MedicalRecord) => void;
  isReadOnly?: boolean;
}

const typeConfig: Record<ReportType, { icon: any; color: string; label: string }> = {
  lab: { icon: Beaker, color: 'text-purple-600 bg-purple-50', label: 'Lab' },
  vitals: { icon: Activity, color: 'text-rose-600 bg-rose-50', label: 'Vitals' },
  medication: { icon: Pill, color: 'text-amber-600 bg-amber-50', label: 'Meds' },
  notes: { icon: FileText, color: 'text-blue-600 bg-blue-50', label: 'Notes' },
};

export default function MedicalReportGrid({ records, onEdit, onDelete, sortConfig, onSort, isReadOnly = false }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page to 1 whenever records change (such as searching or filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [records]);

  const SortIcon = ({ column }: { column: keyof MedicalRecord }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };

  const getHealthStatus = (record: MedicalRecord) => {
    if (record.creatinine && record.creatinine > 1.5) return 'bg-amber-100 text-amber-800';
    return '';
  };

  const totalItems = records.length;
  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(totalItems / itemsPerPage);

  const paginatedRecords = useMemo(() => {
    if (itemsPerPage === -1) return records;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return records.slice(startIndex, startIndex + itemsPerPage);
  }, [records, currentPage, itemsPerPage]);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = itemsPerPage === -1 ? totalItems : Math.min(totalItems, currentPage * itemsPerPage);

  // Calculate sliding page buttons
  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-natural-bg border-b border-natural-border">
              <th 
                className="px-6 py-3 text-[11px] font-bold text-natural-muted uppercase tracking-widest cursor-pointer hover:text-natural-sage transition-colors"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center">Date <SortIcon column="date" /></div>
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-natural-muted uppercase tracking-widest">TAC (RST)</th>
              <th className="px-6 py-3 text-[11px] font-bold text-natural-muted uppercase tracking-widest">KFT (RCH)</th>
              <th className="px-6 py-3 text-[11px] font-bold text-natural-muted uppercase tracking-widest">CBC (RHM)</th>
              <th className="px-6 py-3 text-[11px] font-bold text-natural-muted uppercase tracking-widest">Urine (RUR)</th>
              <th className="px-6 py-3 text-[11px] font-bold text-natural-muted uppercase tracking-widest">Observations</th>
              {!isReadOnly && <th className="px-6 py-3 text-[11px] font-bold text-natural-muted uppercase tracking-widest text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F2F0]">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={isReadOnly ? 6 : 7} className="px-6 py-12 text-center text-natural-muted italic text-sm">
                  No records found. Your health journey starts with your first lab entry.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => {
                return (
                  <tr key={record.id} className="hover:bg-natural-bg/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-natural-title">
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </span>
                        {record.weight && <span className="text-[10px] text-natural-label uppercase tracking-widest font-bold">Wt: {record.weight} kg</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {record.rst_tac_level ? (
                        <div className="px-3 py-1 bg-[#FDF9F2] border border-[#F5E6CC] rounded-lg inline-block text-center min-w-[60px]">
                          <span className="text-sm font-bold text-natural-brown-dark block leading-none">{record.rst_tac_level}</span>
                          <span className="text-[9px] text-natural-brown opacity-70 uppercase tracking-tighter">TAC Level</span>
                        </div>
                      ) : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[12px] space-y-1">
                        <div className="flex items-center justify-between gap-3 w-28">
                          <span className="text-natural-label font-medium uppercase text-[9px]">Creatinine</span>
                          <span className={`font-bold ${record.rch_creatinine && record.rch_creatinine > 1.2 ? 'text-amber-600' : 'text-natural-sage'}`}>
                            {record.rch_creatinine || '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3 w-28">
                          <span className="text-natural-label font-medium uppercase text-[9px]">Urea</span>
                          <span className="text-natural-muted font-bold">{record.rch_urea || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[12px] space-y-0.5 grid grid-cols-2 gap-x-4 w-40">
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">HB</span>
                          <span className="text-rose-700 font-bold">{record.rhm_hb || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">WBC</span>
                          <span className="text-natural-title font-bold">{record.rhm_wbc || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">PLT</span>
                          <span className="text-natural-muted font-medium">{record.rhm_platelets || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">HCT</span>
                          <span className="text-natural-muted font-medium">{record.rhm_hematocrit || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <span className="text-natural-label font-medium uppercase text-[9px]">RBC</span>
                          <span className="text-natural-muted font-medium">{record.rhm_rbc || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="text-[12px] space-y-0.5 grid grid-cols-2 gap-x-4 w-36">
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">Prot</span>
                          <span className="text-natural-muted font-medium">{record.rur_protein || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">Cr</span>
                          <span className="text-natural-muted font-medium">{record.rur_creatinine || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">P/C</span>
                          <span className="text-blue-700 font-bold">{record.rur_pc_ratio || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-natural-label font-medium uppercase text-[9px]">A/C</span>
                          <span className="text-blue-700 font-bold">{record.rur_ac_ratio || '-'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="text-[11px] text-natural-muted italic line-clamp-2 leading-relaxed">
                        {record.notes || <span className="text-gray-300">No observations</span>}
                      </div>
                    </td>
                    {!isReadOnly && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onEdit?.(record)}
                            className="p-1.5 text-natural-label hover:text-natural-sage hover:bg-natural-bg rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDelete?.(record.id)}
                            className="p-1.5 text-natural-label hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="px-6 py-3.5 bg-white border-t border-natural-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-natural-muted">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-natural-muted uppercase tracking-wider">
              <span>Show</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-natural-bg border border-natural-border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-natural-sage outline-none font-bold text-natural-title text-center transition-all"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={-1}>All</option>
              </select>
              <span>Entries</span>
            </div>

            <span className="text-xs font-semibold text-natural-label uppercase tracking-widest hidden md:inline border-l border-natural-border pl-4">
              Showing <span className="text-natural-title font-bold">{startItem}</span> - <span className="text-natural-title font-bold">{endItem}</span> of <span className="text-natural-title font-bold">{totalItems}</span> records
            </span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-natural-muted hover:text-natural-title hover:bg-natural-bg rounded-lg border border-natural-border disabled:opacity-30 disabled:pointer-events-none transition-all"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {pageNumbers.map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border ${
                    currentPage === page 
                      ? 'bg-natural-sage border-natural-sage text-white shadow-sm' 
                      : 'border-natural-border text-natural-muted hover:text-natural-title hover:bg-natural-bg'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 text-natural-muted hover:text-natural-title hover:bg-natural-bg rounded-lg border border-natural-border disabled:opacity-30 disabled:pointer-events-none transition-all"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
