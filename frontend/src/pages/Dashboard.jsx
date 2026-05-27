import {
  useEffect,
  useRef,
  useState,
} from 'react';

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

import { exportKpiCsv } from '../utils/exportCsv';

const Dashboard = () => {
  const dashboardRef = useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState('');

  const [kpis, setKpis] = useState([]);

  const [revenueTrend, setRevenueTrend] =
    useState([]);

  const [topProducts, setTopProducts] =
    useState([]);

  const [regionalBreakdown,
    setRegionalBreakdown] = useState([]);

  const [monthlyComparison,
    setMonthlyComparison] = useState([]);

  const [narrative, setNarrative] =
    useState('');

  useEffect(() => {
    const fetchDashboardData =
      async () => {
        try {
          setLoading(true);

          const BASE_URL =
            'http://127.0.0.1:8000/api';

          const [
            dashboardRes,
            salesRes,
            profitRes,
            regionRes,
            productRes,
          ] = await Promise.all([
            fetch(
              `${BASE_URL}/analytics/dashboard/`
            ),

            fetch(
              `${BASE_URL}/analytics/sales/`
            ),

            fetch(
              `${BASE_URL}/analytics/profit/`
            ),

            fetch(
              `${BASE_URL}/analytics/regions/`
            ),

            fetch(
              `${BASE_URL}/analytics/products/`
            ),
          ]);

          if (
            !dashboardRes.ok ||
            !salesRes.ok ||
            !profitRes.ok ||
            !regionRes.ok ||
            !productRes.ok
          ) {
            throw new Error(
              'Failed to fetch analytics data.'
            );
          }

          const dashboardData =
            await dashboardRes.json();

          const salesData =
            await salesRes.json();

          const profitData =
            await profitRes.json();

          const regionData =
            await regionRes.json();

          const productData =
            await productRes.json();

          setKpis(
            dashboardData.kpis || []
          );

          setNarrative(
            dashboardData.narrative ||
              ''
          );

          setRevenueTrend(salesData);

          setMonthlyComparison(
            profitData
          );

          setRegionalBreakdown(
            regionData
          );

          setTopProducts(productData);
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
          Loading Dashboard...
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
            Backend Connection Failed
          </h2>

          <p className="mt-4 text-white/55">
            {error}
          </p>
        </div>
      </div>
    );
  }

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
 