import React, { useState } from 'react';
import { AlertItem } from '../types';
import { getSeverityInfo, formatTimestamp } from '../utils/formatters';
import { X, CheckCircle, Save, Download, Terminal, Shield, FileText } from 'lucide-react';

interface AlertDetailsModalProps {
  alert: AlertItem | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({ alert, onClose, onUpdate }) => {
  if (!alert) return null;

  const [notes, setNotes] = useState<string>(alert?.notes || '');
  const [isInvestigated, setIsInvestigated] = useState<boolean>(!!alert?.is_investigated);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  React.useEffect(() => {
    if (alert) {
      setNotes(alert.notes || '');
      setIsInvestigated(!!alert.is_investigated);
      setMessage('');
    }
  }, [alert]);

  const sev = getSeverityInfo(alert.severity);

  const handleSaveInvestigation = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/alerts/${alert.id}/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_investigated: isInvestigated,
          notes: notes
        })
      });
      if (res.ok) {
        setMessage('Investigation saved successfully');
        setTimeout(() => setMessage(''), 3000);
        onUpdate();
      }
    } catch (err) {
      console.error('Failed to save investigation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alert, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel-alert-${alert.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    const headers = ["id", "timestamp", "severity", "source_ip", "source_port", "destination_ip", "destination_port", "protocol", "attack_type", "signature"];
    const row = [
      alert.id,
      alert.timestamp,
      alert.severity,
      alert.source_ip,
      alert.source_port,
      alert.destination_ip,
      alert.destination_port,
      alert.protocol,
      `"${(alert.attack_type || '').replace(/"/g, '""')}"`,
      `"${(alert.signature || '').replace(/"/g, '""')}"`
    ].join(",");
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), row].join("\n");
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `sentinel-alert-${alert.id}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-950 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-borderMuted flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                ALERT DETAILED INVESTIGATION #{alert.id}
              </h3>
              <p className="text-xs text-slate-400">{alert.attack_type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 font-mono text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-medium">Severity</span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded border text-[10px] font-bold ${sev.badge}`}>
                {sev.label} ({alert.severity})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-medium">Timestamp</span>
              <span className="text-slate-200 mt-1 block">{formatTimestamp(alert.timestamp)}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-medium">Engine</span>
              <span className="text-slate-200 mt-1 block">{alert.detection_engine}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-medium">Protocol</span>
              <span className="text-slate-200 mt-1 block">{alert.protocol}</span>
            </div>
          </div>

          {/* Network Connection Flow */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-3">Network Flow Tuple</h4>
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 font-mono text-sm">
              <div className="text-center bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 w-full sm:w-auto">
                <span className="text-[10px] text-slate-500 block uppercase">Source Endpoint</span>
                <span className="text-emerald-400 font-bold">{alert.source_ip}:{alert.source_port}</span>
              </div>
              <span className="text-slate-500 font-bold">➔</span>
              <div className="text-center bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800 w-full sm:w-auto">
                <span className="text-[10px] text-slate-500 block uppercase">Destination Target</span>
                <span className="text-blue-400 font-bold">{alert.destination_ip}:{alert.destination_port}</span>
              </div>
            </div>
          </div>

          {/* Signature & Category */}
          <div className="space-y-2 font-mono text-xs">
            <div>
              <span className="text-slate-500 uppercase font-medium block">Alert Signature</span>
              <p className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-slate-200 mt-1 font-mono text-xs">
                {alert.signature}
              </p>
            </div>
          </div>

          {/* Investigation Notes & Checkbox */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              SOC Analyst Notes & Investigation State
            </h4>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-mono">
              <input
                type="checkbox"
                checked={isInvestigated}
                onChange={(e) => setIsInvestigated(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              Mark as Investigated / Resolved
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add investigation details, triage findings, or remediation steps..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            ></textarea>

            <div className="flex items-center justify-between">
              {message ? <span className="text-xs text-emerald-400 font-mono">{message}</span> : <span />}
              <button
                onClick={handleSaveInvestigation}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>

          {/* Raw Event JSON */}
          {alert.raw_event && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Raw Suricata EVE Event Reference
              </h4>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-400/90 overflow-x-auto max-h-48">
                {JSON.stringify(alert.raw_event, null, 2)}
              </pre>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-borderMuted bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
