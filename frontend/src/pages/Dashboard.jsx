

import { useEffect, useRef, useState } from 'react';

import {
  AlertTriangle,
  Download,
  FileDown,
  Loader2,
  Sparkles,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Activity,
} from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

const API_BASE =
  'http://127.0.0.1:8000/api';

const Dashboard = () => {
  const dashboardRef =
    useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [dashboardData,
    setDashboardData] =
    useState(null);

  const [summary, setSummary] =
    useState('');

  const [summaryLoading,
    setSummaryLoading] =
    useState(true);

  /*
    FETCH JSON HELPER
  */

  const fetchJson =
    async (url) => {
      const response =
        await fetch(url);

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.detail ||
            'API request failed.'
        );
      }

      return data;
    };

  /*
    LOAD DASHBOARD
  */

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData =
    async () => {
      try {
        setLoading(true);

        setError('');

        /*
          FETCH ALL ANALYTICS APIs
        */

        const [
          dashboardRes,
          salesRes,
          profitRes,
          regionsRes,
          productsRes,
        ] = await Promise.all([
          fetchJson(
            `${API_BASE}/analytics/dashboard/`
          ),

          fetchJson(
            `${API_BASE}/analytics/sales/`
          ),

          fetchJson(
            `${API_BASE}/analytics/profit/`
          ),

          fetchJson(
            `${API_BASE}/analytics/regions/`
          ),

          fetchJson(
            `${API_BASE}/analytics/products/`
          ),
        ]);

        /*
          GEMINI SUMMARY ENDPOINT
        */

        let aiSummary =
          '';

        try {
          const summaryRes =
            await fetchJson(
              `${API_BASE}/analytics/summary/`
            );

          aiSummary =
            summaryRes.summary ||
            '';
        } catch (summaryError) {
          console.error(
            'Summary Error:',
            summaryError
          );

          aiSummary =
            'AI summary unavailable.';
        }

        /*
          NORMALIZE BACKEND DATA
        */

        const normalized =
          {
            kpis:
              dashboardRes?.kpis ||
              {},

            sales:
              Array.isArray(
                salesRes
              )
                ? salesRes
                : salesRes?.data ||
                  salesRes?.results ||
                  [],

            profit:
              Array.isArray(
                profitRes
              )
                ? profitRes
                : profitRes?.data ||
                  profitRes?.results ||
                  [],

            regions:
              Array.isArray(
                regionsRes
              )
                ? regionsRes
                : regionsRes?.data ||
                  regionsRes?.results ||
                  [],

            products:
              Array.isArray(
                productsRes
              )
                ? productsRes
                : productsRes?.data ||
                  productsRes?.results ||
                  [],

            summary:
              aiSummary,
          };

        setDashboardData(
          normalized
        );

        setSummary(aiSummary);
      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            'Dashboard fetch failed.'
        );
      } finally {
        setLoading(false);

        setSummaryLoading(
          false
        );
      }
    };

  /*
    EXPORT PDF
  */

  const exportPdf =
    async () => {
      if (!dashboardRef.current)
        return;

      const canvas =
        await html2canvas(
          dashboardRef.current,
          {
            scale: 2,
            useCORS: true,
            backgroundColor:
              '#020617',
          }
        );

      const imgData =
        canvas.toDataURL(
          'image/png'
        );

      const pdf = new jsPDF(
        'p',
        'mm',
        'a4'
      );

      /*
        COVER PAGE
      */

      pdf.setFillColor(
        2,
        6,
        23
      );

      pdf.rect(
        0,
        0,
        210,
        297,
        'F'
      );

      pdf.setTextColor(
        255,
        255,
        255
      );

      pdf.setFontSize(30);

      pdf.text(
        'Sales Lens Report',
        20,
        40
      );

      pdf.setFontSize(14);

      pdf.text(
        'AI-Powered Sales Analytics',
        20,
        58
      );

      pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        20,
        72
      );

      /*
        AI SUMMARY PAGE
      */

      pdf.addPage();

      pdf.setFillColor(
        2,
        6,
        23
      );

      pdf.rect(
        0,
        0,
        210,
        297,
        'F'
      );

      pdf.setTextColor(
        255,
        255,
        255
      );

      pdf.setFontSize(22);

      pdf.text(
        'AI Executive Summary',
        20,
        30
      );

      pdf.setFontSize(12);

      const summaryLines =
        pdf.splitTextToSize(
          summary,
          170
        );

      pdf.text(
        summaryLines,
        20,
        50
      );

      /*
        DASHBOARD PAGE
      */

      pdf.addPage();

      pdf.setFillColor(
        2,
        6,
        23
      );

      pdf.rect(
        0,
        0,
        210,
        297,
        'F'
      );

      pdf.addImage(
        imgData,
        'PNG',
        8,
        8,
        194,
        281
      );

      pdf.save(
        'sales-lens-report.pdf'
      );
    };

  /*
    EXPORT KPI CSV
  */

  const exportCsv =
    () => {
      if (!dashboardData)
        return;

      const rows = [
        ['Metric', 'Value'],

        [
          'Total Revenue',
          dashboardData.kpis
            ?.total_revenue,
        ],

        [
          'Total Profit',
          dashboardData.kpis
            ?.total_profit,
        ],

        [
          'Orders',
          dashboardData.kpis
            ?.orders,
        ],

        [
          'Profit Margin',
          dashboardData.kpis
            ?.profit_margin,
        ],
      ];

      const csv =
        rows
          .map((row) =>
            row.join(',')
          )
          .join('\n');

      const blob =
        new Blob([csv], {
          type: 'text/csv;charset=utf-8;',
        });

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          'a'
        );

      link.href = url;

      link.download =
        'sales-kpis.csv';

      link.click();

      URL.revokeObjectURL(
        url
      );
    };

  /*
    LOADING STATE
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
        <div className="flex items-center gap-3 text-lg">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />

          Loading dashboard...
        </div>
      </div>
    );
  }

  /*
    ERROR STATE
  */

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#020617] px-6 text-center text-white">
        <AlertTriangle className="h-14 w-14 text-red-400" />

        <h2 className="text-3xl font-semibold">
          Dashboard Error
        </h2>

        <p className="max-w-xl text-white/60">
          {error}
        </p>
      </div>
    );
  }

  /*
    NO DATA
  */

  if (!dashboardData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white/50">
        No analytics data
        available.
      </div>
    );
  }

  const {
    kpis,
    sales,
    profit,
    regions,
    products,
  } = dashboardData;

  const pieColors = [
    '#22d3ee',
    '#06b6d4',
    '#0ea5e9',
    '#0891b2',
    '#155e75',
  ];

  return (
    <section className="min-h-screen bg-[#020617] px-6 py-24 text-white">
      <div
        ref={dashboardRef}
        className="mx-auto max-w-7xl"
      >
        {/* HEADER */}

        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-retro text-cyan-300">
              SALES ANALYTICS
            </p>

            <h1 className="mt-3 font-hero text-5xl md:text-6xl">
              Dashboard
            </h1>

            <p className="mt-5 max-w-2xl text-white/50">
              AI-powered business
              intelligence dashboard
              built using Django,
              Snowflake, AWS S3,
              Gemini AI, and
              Recharts.
            </p>
          </div>

          {/* EXPORT BUTTONS */}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={exportPdf}
              className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-[#020617] transition hover:scale-[1.03]"
            >
              <Download className="h-4 w-4" />

              Export PDF
            </button>

            <button
              onClick={exportCsv}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              <FileDown className="h-4 w-4" />

              Export CSV
            </button>
          </div>
        </div>

        {/* KPI SECTION */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">
                  Total Revenue
                </p>

                <h2 className="mt-4 text-4xl font-bold text-cyan-300">
                  $
                  {kpis.total_revenue ??
                    0}
                </h2>
              </div>

              <DollarSign className="h-11 w-11 text-cyan-300" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">
                  Total Profit
                </p>

                <h2 className="mt-4 text-4xl font-bold text-cyan-300">
                  $
                  {kpis.total_profit ??
                    0}
                </h2>
              </div>

              <TrendingUp className="h-11 w-11 text-cyan-300" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">
                  Orders
                </p>

                <h2 className="mt-4 text-4xl font-bold text-cyan-300">
                  {kpis.orders ??
                    0}
                </h2>
              </div>

              <ShoppingCart className="h-11 w-11 text-cyan-300" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/45">
                  Profit Margin
                </p>

                <h2 className="mt-4 text-4xl font-bold text-cyan-300">
                  {kpis.profit_margin ??
                    0}
                  %
                </h2>
              </div>

              <Activity className="h-11 w-11 text-cyan-300" />
            </div>
          </div>
        </div>

        {/* CHARTS */}

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          {/* SALES */}

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
            <h2 className="mb-6 text-2xl font-semibold">
              Revenue Trend
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <LineChart
                data={sales}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PRODUCTS */}

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
            <h2 className="mb-6 text-2xl font-semibold">
              Top Products
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <BarChart
                data={products}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="product" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="sales"
                  fill="#22d3ee"
                  radius={[
                    10,
                    10,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECOND ROW */}

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          {/* REGIONS */}

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
            <h2 className="mb-6 text-2xl font-semibold">
              Regional Breakdown
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <PieChart>
                <Pie
                  data={regions}
                  dataKey="sales"
                  nameKey="region"
                  outerRadius={110}
                  label
                >
                  {regions.map(
                    (
                      item,
                      index
                    ) => (
                      <Cell
                        key={
                          index
                        }
                        fill={
                          pieColors[
                            index %
                              pieColors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* PROFIT */}

          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
            <h2 className="mb-6 text-2xl font-semibold">
              Profit Comparison
            </h2>

            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <LineChart
                data={profit}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#22d3ee"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#14b8a6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI SUMMARY */}

        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl">
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
              <Sparkles className="h-7 w-7 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                AI Executive Summary
              </h2>

              <p className="text-sm text-white/45">
                Gemini AI generated
                report insights
              </p>
            </div>
          </div>

          {summaryLoading ? (
            <div className="flex items-center gap-3 text-white/60">
              <Loader2 className="h-5 w-5 animate-spin" />

              Generating AI
              summary...
            </div>
          ) : (
            <p className="leading-relaxed text-white/70">
              {summary}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;