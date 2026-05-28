

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";


const Dashboard = () => {
  const dashboardRef = useRef(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [dashboardData, setDashboardData] =
    useState(null);

  const [salesData, setSalesData] =
    useState(null);

  const [profitData, setProfitData] =
    useState(null);

  const [regionsData, setRegionsData] =
    useState([]);

  const [productsData, setProductsData] =
    useState([]);

  const [aiSummary, setAiSummary] =
    useState("");

  const COLORS = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#eab308",
    "#a855f7",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#06b6d4",
    "#84cc16",
    "#f43f5e",
    "#6366f1",
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [
        dashboardRes,
        salesRes,
        profitRes,
        regionsRes,
        productsRes,
      ] = await Promise.all([
        fetch(
          "http://127.0.0.1:8000/api/analytics/dashboard/"
        ),
        fetch(
          "http://127.0.0.1:8000/api/analytics/sales/"
        ),
        fetch(
          "http://127.0.0.1:8000/api/analytics/profit/"
        ),
        fetch(
          "http://127.0.0.1:8000/api/analytics/regions/"
        ),
        fetch(
          "http://127.0.0.1:8000/api/analytics/products/"
        ),
      ]);

      if (
        !dashboardRes.ok ||
        !salesRes.ok ||
        !profitRes.ok ||
        !regionsRes.ok ||
        !productsRes.ok
      ) {
        throw new Error(
          "Failed to fetch dashboard data"
        );
      }

      const dashboardJson =
        await dashboardRes.json();

      const salesJson =
        await salesRes.json();

      const profitJson =
        await profitRes.json();

      const regionsJson =
        await regionsRes.json();

      const productsJson =
        await productsRes.json();

      setDashboardData(dashboardJson);
      setSalesData(salesJson);
      setProfitData(profitJson);
      setRegionsData(regionsJson);
      setProductsData(productsJson);

      generateAISummary(
        dashboardJson,
        salesJson,
        profitJson
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };
  const GEMINI_API_KEY =
  import.meta.env
    .VITE_GEMINI_API_KEY;

  const generateAISummary = async (
    dashboard,
    sales,
    profit
  ) => {
    try {
      const prompt = `
      Analyze this sales dataset and provide a 200 word business summary.

      Dashboard:
      ${JSON.stringify(dashboard)}

      Sales:
      ${JSON.stringify(sales)}

      Profit:
      ${JSON.stringify(profit)}
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data =
        await response.json();

      const text =
        data?.candidates?.[0]?.content
          ?.parts?.[0]?.text;

      setAiSummary(
        text ||
          "AI summary unavailable."
      );
    } catch (err) {
      console.error(err);

      setAiSummary(
        "Failed to generate AI summary."
      );
    }
  };

 const exportPDF = () => {
  window.print();
};

  const exportCSV = () => {
    const rows = [
      [
        "Total Sales",
        dashboardData?.total_sales,
      ],
      [
        "Total Profit",
        profitData?.total_profit,
      ],
      [
        "Profit Margin",
        profitData?.profit_margin,
      ],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows
        .map((row) => row.join(","))
        .join("\n");

    const encodedUri =
      encodeURI(csvContent);

    const link =
      document.createElement("a");

    link.setAttribute(
      "href",
      encodedUri
    );

    link.setAttribute(
      "download",
      "kpi-summary.csv"
    );

    document.body.appendChild(link);

    link.click();
  };

  const monthlySales = useMemo(
    () =>
      salesData?.monthly_sales || [],
    [salesData]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div
          ref={dashboardRef}
          className="space-y-8"
        >
          {/* HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-handwritten text-4xl font-bold text-white">
                Sales Dashboard
              </h1>

              <p className="font-kpi mt-2 text-white/50">
                Real-time analytics and
                business insights
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={exportPDF}
                className="font-kpi rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                Export PDF
              </button>

              <button
                onClick={exportCSV}
                className="font-kpi rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* KPI */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="font-kpi text-white/50">
                Total Revenue
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white">
                $
                {Number(
                  dashboardData?.total_sales
                ).toLocaleString()}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="font-kpi text-white/50">
                Total Profit
              </p>

              <h2 className="mt-3 text-3xl font-bold text-green-400">
                $
                {Number(
                  profitData?.total_profit
                ).toLocaleString()}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="font-kpi text-white/50">
                Profit Margin
              </p>

              <h2 className="mt-3 text-3xl font-bold text-yellow-400">
                {
                  profitData?.profit_margin
                }
                %
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="font-kpi text-white/50">
                Total Products
              </p>

              <h2 className="mt-3 text-3xl font-bold text-pink-400">
                {productsData.length}
              </h2>
            </div>
          </div>

          {/* AI SUMMARY */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-hero mb-4 text-2xl font-bold text-white">
              AI Business Summary
            </h2>

            <p className="font-kpi leading-8 text-white/70">
              {aiSummary}
            </p>
          </div>

          {/* REVENUE TREND */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-5">
              <h2 className="font-kpi text-xl font-bold text-white">
                Revenue Trend
              </h2>
            </div>

            <div className="overflow-x-auto pb-4">
              <div
                style={{
                  width: `${monthlySales.length * 90}px`,
                  minWidth: "100%",
                  height: "350px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <LineChart
                    data={monthlySales}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff15"
                    />

                    <XAxis
                      dataKey="MONTH"
                      angle={-35}
                      interval={0}
                      textAnchor="end"
                      stroke="#d1d5db"
                    />
                    <XAxis
                      dataKey="MONTH"
                      angle={-45}
                      interval={0}
                      textAnchor="end"
                      height={160}
                      tick={{ fill: "#d1d5db", fontSize: 12 }}
                      stroke="#d1d5db"
                    />
                    <YAxis
                      stroke="#d1d5db"
                    />

                    <Tooltip />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="TOTAL_SALES"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* REGIONS */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-kpi mb-5 text-xl font-bold text-white">
              Regional Breakdown
            </h2>

            <div className="h-[500px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={regionsData}
                    dataKey="TOTAL_SALES"
                    nameKey="REGION"
                    outerRadius={140}
                    label
                  >
                    {regionsData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
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
          </div>

          {/* PRODUCTS */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-kpi mb-5 text-xl font-bold text-white">
              Top Products
            </h2>

            <div className="overflow-x-auto pb-4">
              <div
                style={{
                  width: `${productsData.length * 140}px`,
                  minWidth: "100%",
                  height: "420px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={productsData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff12"
                    />

                    <XAxis
                      dataKey="PRODUCT"
                      angle={-35}
                      interval={0}
                      textAnchor="end"
                      stroke="#d1d5db"
                    />
                    <XAxis
                      dataKey="PRODUCT"
                      angle={-45}
                      interval={0}
                      textAnchor="end"
                      height={160}
                      tick={{ fill: "#d1d5db", fontSize: 12 }}
                      stroke="#d1d5db"
                    />

                    <YAxis
                      stroke="#d1d5db"
                    />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="TOTAL_SALES"
                      radius={[
                        10,
                        10,
                        0,
                        0,
                      ]}
                      barSize={18}
                      fill="#3b82f6"
                    >
                      {productsData.map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* SALES VS PROFIT */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-kpi mb-5 text-xl font-bold text-white">
              Sales vs Profit
            </h2>

            <div className="overflow-x-auto pb-4">
              <div
                style={{
                  width: `${productsData.length * 150}px`,
                  minWidth: "100%",
                  height: "420px",
                }}
              >
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={productsData}
                    
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#ffffff12"
                    />

                    <XAxis
                      dataKey="PRODUCT"
                      angle={-35}
                      interval={0}
                      textAnchor="end"
                      stroke="#d1d5db"
                    />
                    <XAxis
                      dataKey="PRODUCT"
                      angle={-45}
                      interval={0}
                      textAnchor="end"
                      height={160}
                      tick={{ fill: "#d1d5db", fontSize: 12 }}
                      stroke="#d1d5db"
                    />
                    <YAxis
                      stroke="#d1d5db"
                    />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="TOTAL_SALES"
                      fill="#3b82f6"
                      barSize={14}
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                    />

                    <Bar
                      dataKey="TOTAL_PROFIT"
                      fill="#22c55e"
                      barSize={14}
                      radius={[
                        8,
                        8,
                        0,
                        0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;