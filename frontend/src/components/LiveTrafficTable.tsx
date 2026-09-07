import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Network, CheckCircle, AlertTriangle, Flame, ShieldAlert, FileText } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

interface LiveTrafficRow {
  id: string;
  time: string;
  source: string;
  sourcePort: number;
  destination: string;
  destinationPort: number;
  protocol: string;
  traffic: string;
  trafficBytes: number;
  status: 'Normal' | 'Suspicious' | 'Attack';
  details?: string;
  flags?: string;
}

export const LiveTrafficTable: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<'time' | 'trafficBytes' | 'protocol'>('time');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const initialRows: LiveTrafficRow[] = [
    {
      id: 'flow-101',
      time: '08:21:14',
      source: '192.168.1.12',
      sourcePort: 54120,
      destination: '10.0.0.4',
      destinationPort: 443,
      protocol: 'TCP',
      traffic: '245 KB',
      trafficBytes: 250880,
      status: 'Normal',
      flags: 'ACK PSH',
      details: 'Encrypted TLS 1.3 session exchange with authorized web gateway.'
    },
    {
      id: 'flow-102',
      time: '08:21:18',
      source: '172.16.2.44',
      sourcePort: 49811,
      destination: '10.0.0.8',
      destinationPort: 8080,
      protocol: 'UDP',
      traffic: '1.2 MB',
      trafficBytes: 1258291,
      status: 'Suspicious',
      flags: 'NONE',
      details: 'High-frequency UDP datagram burst outside standard operating schedule.'
    },
    {
      id: 'flow-103',
      time: '08:21:23',
      source: '192.168.5.21',
      sourcePort: 61200,
      destination: '10.0.0.7',
      destinationPort: 80,
      protocol: 'TCP',
      traffic: '890 KB',
      trafficBytes: 911360,
      status: 'Attack',
      flags: 'SYN',
      details: 'Repetitive incomplete TCP SYN flood targeting port 80 HTTP listener.'
    },
    {
      id: 'flow-104',
      time: '08:21:29',
      source: '192.168.1.105',
      sourcePort: 52140,
      destination: '10.0.0.1',
      destinationPort: 53,
      protocol: 'UDP',
      traffic: '32 KB',
      trafficBytes: 32768,
      status: 'Normal',
      flags: 'NONE',
      details: 'Standard recursive DNS resolution query to internal nameserver.'
    },
    {
      id: 'flow-105',
      time: '08:21:35',
      source: '10.45.2.89',
      sourcePort: 33890,
      destination: '10.0.0.12',
      destinationPort: 22,
      protocol: 'TCP',
      traffic: '4.8 MB',
      trafficBytes: 5033164,
      status: 'Attack',
      flags: 'SYN PSH',
      details: 'Automated brute-force password spraying observed against SSH service.'
    },
    {
      id: 'flow-106',
      time: '08:21:42',
      source: '192.168.1.55',
      sourcePort: 48900,
      destination: '10.0.0.2',
      destinationPort: 443,
      protocol: 'TCP',
      traffic: '512 KB',
      trafficBytes: 524288,
      status: 'Normal',
      flags: 'ACK',
      details: 'Authenticated API telemetry push to cloud synchronization endpoint.'
    },
    {
      id: 'flow-107',
      time: '08:21:49',
      source: '172.16.5.12',
      sourcePort: 58200,
      destination: '10.0.0.15',
      destinationPort: 445,
      protocol: 'TCP',
      traffic: '1.8 MB',
      trafficBytes: 1887436,
      status: 'Suspicious',
      flags: 'SYN ACK',
      details: 'Lateral SMB pipe enumeration detected between internal workstation VLANs.'
    },
    {
      id: 'flow-108',
      time: '08:21:55',
      source: '192.168.1.200',
      sourcePort: 51000,
      destination: '10.0.0.20',
      destinationPort: 123,
      protocol: 'UDP',
      traffic: '12 KB',
      trafficBytes: 12288,
      status: 'Normal',
      flags: 'NONE',
      details: 'NTP network time synchronization beacon.'
    }
  ];

  // Filtering and Sorting
  const filteredRows = useMemo(() => {
    return initialRows
      .filter(row => {
        if (statusFilter !== 'All' && row.status !== statusFilter) return false;
        if (search) {
          const s = search.toLowerCase();
          return (
            row.source.toLowerCase().includes(s) ||
            row.destination.toLowerCase().includes(s) ||
            row.protocol.toLowerCase().includes(s) ||
            row.status.toLowerCase().includes(s)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'trafficBytes') {
          return sortAsc ? a.trafficBytes - b.trafficBytes : b.trafficBytes - a.trafficBytes;
        }
        if (sortField === 'protocol') {
          return sortAsc ? a.protocol.localeCompare(b.protocol) : b.protocol.localeCompare(a.protocol);
        }
        return sortAsc ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time);
      });
  }, [search, statusFilter, sortField, sortAsc]);

  const pageSize = 5;
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const pagedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: LiveTrafficRow['status']) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 flex items-center gap-1 w-max">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            Normal
          </span>
        );
      case 'Suspicious':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/80 flex items-center gap-1 w-max">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Suspicious
          </span>
        );
      case 'Attack':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-700/80 flex items-center gap-1 w-max">
            <Flame className="w-3 h-3 text-rose-400" />
            Attack
          </span>
        );
    }
  };

  return (
    <div className="soc-card overflow-hidden">
      
      {/* Header bar */}
      <div className="p-4 border-b border-borderMuted bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono tracking-wider uppercase text-white">
              Live Network Traffic Activity Stream
            </h3>
            <p className="text-[11px] text-slate-400">
              Packet flows, connection metadata & threat labels
            </p>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search IP / Protocol..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-52"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs font-mono">
            {['All', 'Normal', 'Suspicious', 'Attack'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  statusFilter === st
                    ? 'bg-slate-800 text-cyan-300 font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left soc-table border-collapse">
          <thead>
            <tr>
              <th
                onClick={() => {
                  setSortField('time');
                  setSortAsc(!sortAsc);
                }}
                className="cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Time</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Source (Endpoint)</th>
              <th>Destination (Target)</th>
              <th
                onClick={() => {
                  setSortField('protocol');
                  setSortAsc(!sortAsc);
                }}
                className="cursor-pointer hover:text-white"
              >
                <div className="flex items-center gap-1">
                  <span>Protocol</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th
                onClick={() => {
                  setSortField('trafficBytes');
                  setSortAsc(!sortAsc);
                }}
                className="cursor-pointer hover:text-white text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-500 font-mono text-xs">
                  No network traffic matching criteria.
                </td>
              </tr>
            ) : (
              pagedRows.map((row) => {
                const isExpanded = expandedId === row.id;
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      onClick={() => setExpandedId(isExpanded ? null : row.id)}
                      className={`cursor-pointer transition-colors font-mono text-xs ${
                        isExpanded ? 'bg-slate-900/80' : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="text-slate-300 font-bold whitespace-nowrap">{row.time}</td>
                      <td className="text-emerald-400 font-semibold whitespace-nowrap">
                        {row.source}:{row.sourcePort}
                      </td>
                      <td className="text-blue-400 font-semibold whitespace-nowrap">
                        {row.destination}:{row.destinationPort}
                      </td>
                      <td className="text-slate-200 font-bold">{row.protocol}</td>
                      <td className="text-right text-slate-300 font-bold whitespace-nowrap">{row.traffic}</td>
                      <td>{getStatusBadge(row.status)}</td>
                      <td className="text-right">
                        <button className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[10px] font-mono border border-slate-800">
                          {isExpanded ? 'Hide' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-950/80 border-b border-cyan-900/40">
                        <td colSpan={7} className="p-4 text-xs font-sans text-slate-300 pl-8">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                              <span className="text-[10px] text-slate-500 block">TCP/IP Socket Flags</span>
                              <span className="text-cyan-300 font-bold">{row.flags}</span>
                            </div>
                            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Calculated Bytes</span>
                              <span className="text-purple-300 font-bold">{row.trafficBytes.toLocaleString()} B</span>
                            </div>
                            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Classification Risk</span>
                              <span className="text-white font-bold">{row.status === 'Attack' ? 'HIGH RISK' : 'LOW RISK'}</span>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-slate-400 font-sans">
                            <strong>Diagnostic Notes:</strong> {row.details}
                          </p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs font-mono text-slate-400">
        <div>
          Showing {filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} traffic flows
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 text-white font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 disabled:opacity-40 hover:bg-slate-800 text-slate-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
