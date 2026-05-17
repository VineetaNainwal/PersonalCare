import { useState, useEffect, useMemo } from 'react';
import { Plus, Download, Filter, Search, Stethoscope, RefreshCcw, LayoutGrid, Home as HomeIcon } from 'lucide-react';
import MedicalReportForm from './components/MedicalReportForm';
import MedicalReportGrid from './components/MedicalReportGrid';
import Home from './components/Home';
import { MedicalRecord, MedicalRecordFormData, ReportType } from './types';
import { exportToCSV, exportToPDF } from './lib/exportUtils';
import { motion } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'dashboard'>('home');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ReportType | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof MedicalRecord; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSave = async (formData: MedicalRecordFormData) => {
    try {
      const url = editingRecord ? `/api/reports/${editingRecord.id}` : '/api/reports';
      const method = editingRecord ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsFormOpen(false);
        setEditingRecord(undefined);
        fetchRecords();
      }
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const response = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchRecords();
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleEdit = (record: MedicalRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleSort = (key: keyof MedicalRecord) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const filteredAndSortedRecords = useMemo(() => {
    return records
      .filter((r) => {
        const matchesSearch = (r.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || r.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [records, searchTerm, filterType, sortConfig]);

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text font-sans selection:bg-natural-sage/20 flex flex-col">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-natural-border z-40 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-natural-sage rounded-lg flex items-center justify-center text-white shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight text-natural-title">Vineeta's Care Journal</h1>
            <p className="hidden md:block text-[10px] uppercase tracking-widest font-bold text-natural-sage">Health Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <nav className="flex gap-4 md:gap-6 text-sm font-medium text-natural-muted">
            <button 
              onClick={() => setCurrentPage('home')}
              className={`pb-1 transition-all ${currentPage === 'home' ? 'text-natural-sage border-b-2 border-natural-sage font-bold' : 'hover:text-natural-sage'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className={`pb-1 transition-all ${currentPage === 'dashboard' ? 'text-natural-sage border-b-2 border-natural-sage font-bold' : 'hover:text-natural-sage'}`}
            >
              Dashboard
            </button>
          </nav>
          
          <div className="flex items-center gap-3 pl-6 md:border-l border-natural-border">
            <button 
              onClick={() => {
                setEditingRecord(undefined);
                setIsFormOpen(true);
              }}
              className="hidden md:flex items-center gap-2 bg-natural-sage hover:bg-natural-sage-dark text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {currentPage === 'home' ? (
          <Home onNavigate={() => setCurrentPage('dashboard')} />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <h2 className="text-2xl font-bold text-natural-title">Medical History</h2>
              <p className="text-sm text-natural-muted">Monitoring stability post-transplant care journal.</p>
            </motion.div>

            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => exportToCSV(filteredAndSortedRecords)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-natural-border text-natural-muted rounded-lg hover:bg-natural-bg transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button 
                onClick={() => exportToPDF(filteredAndSortedRecords)}
                className="flex items-center gap-2 px-4 py-2 bg-natural-brown hover:bg-natural-brown-dark text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
              >
                <LayoutGrid className="w-4 h-4" />
                PDF Report
              </button>
              <button 
                onClick={fetchRecords}
                className="p-2 bg-white border border-natural-border text-natural-muted rounded-lg hover:text-natural-sage transition-colors"
                title="Refresh Records"
              >
                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-natural-border grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-label" />
              <input 
                type="text"
                placeholder="Search in notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-natural-bg border border-natural-border rounded-lg focus:ring-1 focus:ring-natural-sage outline-none transition-all text-sm"
              />
            </div>
            
            <div className="md:col-span-4 relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-label" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 bg-natural-bg border border-natural-border rounded-lg focus:ring-1 focus:ring-natural-sage outline-none appearance-none transition-all text-sm font-medium text-natural-muted"
              >
                <option value="all">All Records</option>
                <option value="lab">Lab Results</option>
                <option value="vitals">Vitals (BP/Weight)</option>
                <option value="medication">Medication Log</option>
                <option value="notes">Doctor Notes</option>
              </select>
            </div>
          </div>

          {/* Records Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-natural-border overflow-hidden flex flex-col"
          >
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-natural-label">
                <RefreshCcw className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Updating journal records...</p>
              </div>
            ) : (
              <MedicalReportGrid 
                records={filteredAndSortedRecords}
                onEdit={handleEdit}
                onDelete={handleDelete}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            )}
            
            {/* Health Snapshot Status Bar at the bottom of the grid or as a separate section */}
            <div className="px-6 py-3 bg-natural-bg border-t border-natural-border flex justify-between items-center text-[11px] font-bold text-natural-label uppercase tracking-widest">
              <span>Total records: {records.length}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span>Database Sync Active</span>
              </div>
            </div>
          </motion.div>
        </div>
        )}
      </main>

      <footer className="mt-auto h-10 bg-natural-sage text-white text-[10px] flex items-center px-8 justify-between opacity-90">
      </footer>

      <MedicalReportForm 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRecord(undefined);
        }}
        onSave={handleSave}
        initialData={editingRecord}
      />

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={() => {
          setEditingRecord(undefined);
          setIsFormOpen(true);
        }}
        className="fixed md:hidden bottom-12 right-6 w-14 h-14 bg-natural-sage text-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 z-50"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
