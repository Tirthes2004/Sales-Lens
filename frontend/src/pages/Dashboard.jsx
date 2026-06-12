
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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

  const [filteredRegionsData, setRegionsData] =
    useState([]);

  const [productsData, setProductsData] =
    useState([]);

  const [aiSummary, setAiSummary] =
    useState("");

  const [summaryLoading, setSummaryLoading] = useState(false);  

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
    fetchAISummary();
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

      const filteredRegionsData = regionsJson.filter(
        (regionJson) =>
          regionJson.REGION &&
          regionJson.REGION.trim().toLowerCase() !==
            "Unknown"
      );  

      setDashboardData(dashboardJson);
      setSalesData(salesJson);
      setProfitData(profitJson);
      setRegionsData(filteredRegionsData);
      setProductsData(productsJson);

      
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  {/*no api_key through frontend this is refactored via backend . here /ai-summary only example for now .*/}
  const fetchAISummary = async () => {
  try {
    setSummaryLoading(true);

    const response = await fetch(
      "http://127.0.0.1:8000/api/analytics/ai-summary/"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch AI summary");
    }

    const data = await response.json();

    setAiSummary(
      data.summary ||
      data.ai_summary ||
      data.message ||
      ""
    );
  } catch (error) {
    console.error(error);
    setAiSummary("Unable to generate AI summary.");
  } finally {
    setSummaryLoading(false);
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
          {/* header of dashboard */}

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

          {/* kpi cards */}

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

          {/* ai summary which will be in future */}

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="font-hero mb-4 text-2xl font-bold text-white">
              AI Business Summary
            </h2>

            <p className="font-kpi leading-8 text-white/70">
              {aiSummary}
            </p>
          </div>

          {/* revenue trend chart */}

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

          {/* regional breakdown pie chart */}

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
                    data={filteredRegionsData}
                    dataKey="TOTAL_SALES"
                    nameKey="REGION"
                    outerRadius={140}
                    label
                  >
                    {filteredRegionsData.map(
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

          {/* top products bar charts */}

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

          {/* sales vs profit barchart */}

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
      <div className="mt-10 flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-semibold text-cyan-300 backdrop-blur-xl transition hover:scale-105 hover:bg-cyan-400/20"
          >
             Go Back
          </button>
        </div>
    </div>
  );
};
{/*all charts are made using recharts*/}

export default Dashboard;