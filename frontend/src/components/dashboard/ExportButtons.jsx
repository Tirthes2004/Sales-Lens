{/*in dev*/}
import {
  Download,
  FileText,
} from 'lucide-react';

const ExportButtons = ({
  onExportPdf,
  onExportCsv,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={onExportPdf}
        className="flex items-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-[#020617]"
      >
        <FileText className="h-5 w-5" />
        Export PDF Report
      </button>

      <button
        onClick={onExportCsv}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold"
      >
        <Download className="h-5 w-5" />
        Export KPI CSV
      </button>
    </div>
  );
};

export default ExportButtons;