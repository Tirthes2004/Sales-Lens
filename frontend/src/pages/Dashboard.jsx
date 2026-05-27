import { useEffect, useRef, useState } from 'react';

import {
  Loader2,
  Sparkles,
} from 'lucide-react';

import KPISection from '../components/dashboard/KPISection';

import RevenueChart from '../components/dashboard/RevenueChart';

import ProductChart from '../components/dashboard/ProductChart';
import RegionalChart from '../components/dashboard/RegionalChart';

import MonthlyComparisonChart from '../components/dashboard/MonthlyComparisonChart';

import NarrativeSection from '../components/dashboard/NarrativeSection';

import ExportButtons from '../components/dashboard/ExportButtons';

import { exportDashboardPdf } from '../utils/exportPdf';

import { exportKpiCsv } from '../utils/exportCSV';

const Dashboard = () => {
  const dashboardRef = useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [dashboardData, setDashboardData] =
    useState(null);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData =
      async () => {
        try {
          setLoading(true);

          const storedData =
            sessionStorage.getItem(
              'uploadedFileData'
            );

          const fileName =
            sessionStorage.getItem(
              'uploadedFileName'
            );

            if (!storedData) {
            throw new Error(
              'No uploaded file found.'
            );
          }

          const parsedData =
            JSON.parse(storedData);

          const response = await fetch(
            'VITE_API_URL',
            {
              method: 'POST',

               headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({
                fileName,
                data: parsedData,
              }),
            }
          );

           if (!response.ok) {
            throw new Error(
              'Backend request failed.'
            );
          }

          const result =
            await response.json();

          setDashboardData(result);
        } catch (err) {
          console.error(err);

          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] text-white">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-300" />
        </div>

        <h2 className="mt-8 text-3xl font-bold">
          Processing Analytics...
        </h2>

        <p className="mt-4 text-white/55">
          Waiting for backend response.
        </p>
      </div>
      );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-400">
            Something went wrong
          </h2>

          <p className="mt-4 text-white/55">
            {error}
          </p>
        </div>
      </div>
    );
    }

  if (!dashboardData) return null;

  const {
    kpis,
    revenueTrend,
    topProducts,
    regionalBreakdown,
    monthlyComparison,
    narrative,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <header className="border-b border-white/10 bg-[#081120]/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold">
              Analytics Dashboard
            </h1>

            <p className="text-sm text-white/45">
              AI Generated Insights
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            <Sparkles className="h-4 w-4" />
            Live Analytics
          </div>
        </div>
      </header>

      <main
        ref={dashboardRef}
        className="mx-auto max-w-7xl space-y-8 px-6 py-10"
      >
        <ExportButtons
          onExportPdf={() =>
            exportDashboardPdf(
              dashboardRef,
              narrative,
              kpis
            )
          }
          onExportCsv={() =>
            exportKpiCsv(kpis)
          }
        />

        <KPISection kpis={kpis} />

        <RevenueChart
          data={revenueTrend}
        />

        <div className="grid gap-8 xl:grid-cols-2">
          <ProductChart
            data={topProducts}
          />

          <RegionalChart
            data={regionalBreakdown}
          />
        </div>

        <MonthlyComparisonChart
          data={monthlyComparison}
        />


        <NarrativeSection
          narrative={narrative}
        />
      </main>
    </div>
  );
};

export default Dashboard;