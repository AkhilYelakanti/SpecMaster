import React, { useState } from 'react';
import { Plus, Trash2, Columns, Settings2, X, GripVertical } from 'lucide-react';
import { TableMetaData, TableRow } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface TableEditorProps {
  data: TableMetaData;
  onChange: (data: TableMetaData) => void;
}

const TableEditor: React.FC<TableEditorProps> = ({ data, onChange }) => {
  const [showColManager, setShowColManager] = useState(false);

  const addColumn = () => {
    let name = 'New Column';
    let counter = 1;
    while (data.columns.includes(name)) {
      name = `New Column ${counter++}`;
    }
    
    onChange({
      ...data,
      columns: [...data.columns, name],
      rows: data.rows.map(r => ({ ...r, [name]: '' }))
    });
    setShowColManager(true);
  };

  const addRow = () => {
    const newRow: TableRow = { id: crypto.randomUUID() };
    data.columns.forEach(col => newRow[col] = '');
    onChange({
      ...data,
      rows: [...data.rows, newRow]
    });
  };

  const updateCell = (rowId: string, col: string, value: string) => {
    onChange({
      ...data,
      rows: data.rows.map(r => r.id === rowId ? { ...r, [col]: value } : r)
    });
  };

  const removeRow = (id: string) => {
    onChange({
      ...data,
      rows: data.rows.filter(r => r.id !== id)
    });
  };

  const removeColumn = (colName: string) => {
    if (confirm(`Remove column "${colName}"?`)) {
      onChange({
        columns: data.columns.filter(c => c !== colName),
        rows: data.rows.map(r => {
          const newRow = { ...r };
          delete newRow[colName];
          return newRow;
        })
      });
    }
  };

  const handleColumnRename = (oldName: string, newName: string) => {
    if (newName === oldName) return;
    if (!newName.trim()) return;
    
    // Prevent duplicates
    if (data.columns.includes(newName)) return;

    onChange({
      columns: data.columns.map(c => c === oldName ? newName : c),
      rows: data.rows.map(r => {
        const newRow = { ...r, [newName]: r[oldName] || '' };
        delete newRow[oldName];
        return newRow;
      })
    });
  };

  if (!data.columns || data.columns.length === 0) {
    return (
      <div className="p-12 border-2 border-dashed border-slate-200 dark:border-dark-border rounded-[2rem] text-center bg-slate-50/50 dark:bg-dark-bg/20">
        <div className="w-16 h-16 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border flex items-center justify-center mx-auto mb-6">
          <Columns className="text-slate-300" size={32} />
        </div>
        <h5 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Empty Structure</h5>
        <p className="text-slate-400 dark:text-dark-muted text-xs mb-6 max-w-xs mx-auto">Define your table schema by adding the first column header.</p>
        <button 
          onClick={addColumn}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          Initialize Columns
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowColManager(!showColManager)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border",
              showColManager 
                ? "bg-slate-900 text-white border-slate-900 dark:bg-brand-cyan dark:text-brand-dark dark:border-brand-cyan" 
                : "bg-white dark:bg-dark-surface text-slate-500 border-slate-200 dark:border-dark-border hover:border-slate-300"
            )}
          >
            <Columns size={12}/> Manage Columns
          </button>
        </div>
        <button 
          onClick={addRow} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:translate-y-0.5"
        >
          <Plus size={14}/> Add Row
        </button>
      </div>

      <AnimatePresence>
        {showColManager && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-50 dark:bg-dark-bg/50 border border-slate-200 dark:border-dark-border rounded-2xl mb-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-dark-border pb-2">
                <span className="text-[10px] font-black text-slate-400 dark:text-dark-muted uppercase tracking-widest">Active Columns ({data.columns.length})</span>
                <button onClick={() => setShowColManager(false)} className="text-slate-400 hover:text-slate-600"><X size={14}/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.columns.map((col, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border pl-3 pr-1 py-1 rounded-lg shadow-sm group/col transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <input 
                      type="text"
                      value={col}
                      onChange={(e) => handleColumnRename(col, e.target.value)}
                      placeholder="Column name"
                      className="text-xs font-bold dark:text-white bg-transparent border-none outline-none p-0 w-24 mr-1 focus:ring-0 placeholder:text-slate-300"
                    />
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/col:opacity-100 transition-opacity">
                      <button onClick={() => removeColumn(col)} className="p-1 text-slate-400 hover:text-red-500" title="Delete"><Trash2 size={12}/></button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={addColumn}
                  className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-brand-cyan/10 text-blue-600 dark:text-brand-cyan border border-dashed border-blue-200 dark:border-brand-cyan/30 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Plus size={12}/> New Column
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto rounded-[2rem] border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-900 dark:bg-dark-surface text-white">
              {data.columns.map(col => (
                <th key={col} className="p-4 text-left font-black uppercase tracking-widest text-[10px] first:pl-8">
                  {col}
                </th>
              ))}
              <th className="w-12 pr-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
            {data.rows.map((row, rIdx) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/row">
                {data.columns.map(col => (
                  <td key={col} className="p-1 first:pl-6">
                    <input 
                      value={row[col] || ''} 
                      onChange={e => updateCell(row.id, col, e.target.value)}
                      className="w-full p-3 border-none bg-transparent focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none dark:text-white transition-all font-medium placeholder:text-slate-300 dark:placeholder:text-dark-muted"
                      placeholder={`Enter ${col}...`}
                    />
                  </td>
                ))}
                <td className="p-1 pr-6 text-center">
                  <button 
                    onClick={() => removeRow(row.id)} 
                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    title="Remove Row"
                  >
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
            {data.rows.length === 0 && (
              <tr>
                <td colSpan={data.columns.length + 1} className="p-12 text-center text-slate-400 dark:text-dark-muted italic">
                  No records found. Initialize with "Add Row".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableEditor;
