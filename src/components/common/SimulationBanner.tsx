import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { SIMULATION_DISCLAIMER } from '../../lib/constants';

interface SimulationBannerProps {
  compact?: boolean;
}

export const SimulationBanner: React.FC<SimulationBannerProps> = ({ compact = false }) => {
  return (
    <div className={`bg-amber-500 text-slate-950 font-medium px-4 ${compact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'} shadow-sm`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} shrink-0 text-slate-950`} />
          <span className="font-extrabold tracking-wide uppercase">{SIMULATION_DISCLAIMER}</span>
          <span className="hidden md:inline text-slate-900 font-normal">
            — Seluruh data, calon, dan proses suara di platform ini merupakan media edukasi dan uji coba teknis Pekon Rawas.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold bg-amber-600/30 px-2 py-0.5 rounded border border-amber-600/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Lingkungan Uji Coba Terisolasi</span>
        </div>
      </div>
    </div>
  );
};
