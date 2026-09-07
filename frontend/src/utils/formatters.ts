export function maskIp(ip: string, enableMask: boolean = false): string {
  if (!enableMask || !ip) return ip;
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  return ip.replace(/:[^:]+$/, ':xxxx');
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (!bytes || isNaN(bytes) || bytes <= 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getSeverityInfo(severity: number) {
  switch (severity) {
    case 1:
      return { label: 'CRITICAL', color: 'text-red-400 border-red-950 bg-red-950/40', badge: 'bg-red-500/10 text-red-400 border-red-500/30' };
    case 2:
      return { label: 'HIGH', color: 'text-orange-400 border-orange-950 bg-orange-950/40', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
    case 3:
      return { label: 'MEDIUM', color: 'text-yellow-400 border-yellow-950 bg-yellow-950/40', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
    case 4:
    default:
      return { label: 'LOW', color: 'text-zinc-400 border-zinc-800 bg-zinc-900', badge: 'bg-zinc-800 text-zinc-300 border-zinc-700' };
  }
}

export function formatTimestamp(ts: string): string {
  if (!ts) return 'N/A';
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}
