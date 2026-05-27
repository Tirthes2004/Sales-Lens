
{/* icon logo with lucide-react and we are storing the featurs card data and metric card data in this landingData.js file.*/}
import {
  Database,
  LineChart,
  ScanSearch,
  UploadCloud,
} from 'lucide-react';

export const features = [
  {
    icon: UploadCloud,
    title: 'Lightning Uploads',
    description:
      'Smooth drag-and-drop support for CSV and Excel files.',
  },
  {
    icon: ScanSearch,
    title: 'Instant Analysis',
    description:
      'Connect your backend pipeline to a premium frontend.',
  },
  {
    icon: LineChart,
    title: 'Visual Dashboards',
    description:
      'Modern charts, tables and insight components.',
  },
  {
    icon: Database,
    title: 'Enterprise Feel',
    description:
      'Dark futuristic SaaS experience.',
  },
];

export const metrics = [
  {
    label: 'Files Processed',
    value: '120K+',
  },
  {
    label: 'Upload Speed',
    value: '0.9s',
  },
  {
    label: 'Dashboard Widgets',
    value: '32+',
  },
];