import React, { useState } from 'react';
import { useApp, DocumentItem } from '../../context/AppContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  FileType,
  Layers,
  Box,
  Users
} from 'lucide-react';

export const DocumentsScreen: React.FC = () => {
  const { documents, addDocument, deleteDocument, addAuditLog } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'PDF' | 'CSV' | 'DOCX'>('CSV');
  const [parsedType, setParsedType] = useState<'menu' | 'inventory' | 'staff' | 'suppliers' | 'general'>('menu');
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const ext = file.name.split('.').pop()?.toUpperCase();
    if (ext === 'PDF' || ext === 'CSV' || ext === 'DOCX') {
      setFileType(ext as 'PDF' | 'CSV' | 'DOCX');
    } else {
      setFileType('CSV');
    }

    // Generate mockup parsed preview
    if (ext === 'CSV' || file.name.toLowerCase().includes('menu') || file.name.toLowerCase().includes('item')) {
      setParsedType('menu');
      setPreviewData([
        { id: '1', name: 'Paneer Butter Masala', category: 'Main Course', price: '₹280', tax: '5%', status: 'Valid' },
        { id: '2', name: 'Garlic Naan', category: 'Breads', price: '₹60', tax: '5%', status: 'Valid' },
        { id: '3', name: 'Chicken Biryani Special', category: 'Main Course', price: '₹340', tax: '5%', status: 'Valid' },
        { id: '4', name: 'Fresh Lime Soda', category: 'Drinks', price: '₹90', tax: '5%', status: 'Valid' }
      ]);
    } else {
      setParsedType('inventory');
      setPreviewData([
        { id: '1', item: 'Fresh Chicken Breast', quantity: '25 kg', supplier: 'Metro Wholesalers', unitCost: '₹220', status: 'Valid' },
        { id: '2', item: 'Basmati Rice Premium', quantity: '50 kg', supplier: 'Sri Laxmi Mills', unitCost: '₹95', status: 'Valid' }
      ]);
    }
  };

  const handleConfirmImport = () => {
    if (!selectedFile) return;
    setIsImporting(true);

    setTimeout(() => {
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        fileName: selectedFile.name,
        fileType: fileType,
        fileSize: `${Math.round(selectedFile.size / 1024)} KB`,
        uploadDate: new Date().toISOString().split('T')[0],
        parsedType: parsedType,
        recordsCount: previewData?.length || 1,
        status: 'imported'
      };

      addDocument(newDoc);
      setIsImporting(false);
      setImportSuccess(true);
      setSelectedFile(null);
      setPreviewData(null);

      setTimeout(() => setImportSuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B1F3A] tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[#F97316]" />
            Restaurant Document Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Upload and import structured restaurant menus, inventory sheets, supplier agreements, and SOPs
          </p>
        </div>
      </div>

      {importSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Document parsed and records successfully committed to local database and cloud audit registry.</span>
        </div>
      )}

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black text-[#0B1F3A] mb-1">Upload Document</h2>
            <p className="text-xs text-slate-500 font-medium mb-4">Supported formats: PDF, CSV, DOCX</p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-orange-500 bg-orange-50/50 scale-[0.99]'
                  : 'border-slate-200 hover:border-orange-300 bg-slate-50/60'
              }`}
            >
              <input
                type="file"
                id="docUploadInput"
                accept=".pdf,.csv,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
              <label htmlFor="docUploadInput" className="cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F97316] flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">Drag & drop files here</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">or click to browse from device</span>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs">
                  Browse Files
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              <span>Safe Parsing & Validation Gate</span>
            </div>
            <p>Uploaded documents are parsed into preview data and require admin confirmation before database write.</p>
          </div>
        </div>

        {/* Preview and Confirmation Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <h2 className="text-base font-black text-[#0B1F3A] mb-1">
            {selectedFile ? `File Preview: ${selectedFile.name}` : 'Document Import Queue & Preview'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mb-4">
            {selectedFile ? 'Review extracted structured records before committing' : 'Select or upload a file on the left to inspect parsed rows.'}
          </p>

          {selectedFile && previewData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 border border-orange-200/70 text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#F97316]" />
                  <span className="font-bold text-orange-900">Extracted {previewData.length} records ({parsedType.toUpperCase()})</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-emerald-700 border border-emerald-200">
                  Validation Passed
                </span>
              </div>

              {/* Table Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Item Name / Title</th>
                      <th className="p-3">Details / Category</th>
                      <th className="p-3">Price / Qty</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {previewData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-400">{row.id}</td>
                        <td className="p-3 font-bold text-slate-900">{row.name || row.item}</td>
                        <td className="p-3 text-slate-500">{row.category || row.supplier}</td>
                        <td className="p-3 font-semibold">{row.price || row.quantity}</td>
                        <td className="p-3 text-emerald-600 font-bold">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => { setSelectedFile(null); setPreviewData(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={isImporting}
                  className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2"
                >
                  {isImporting ? 'Importing Data...' : 'Confirm & Import to System'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Document History List */
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                      {doc.fileType === 'CSV' ? <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> : <FileType className="w-4 h-4 text-rose-600" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{doc.fileName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {doc.fileSize} • {doc.uploadDate} • {doc.recordsCount ? `${doc.recordsCount} records` : 'Document'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {doc.status}
                    </span>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
