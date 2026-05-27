{/*in dev*/}
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const MonthlyComparisonChart = ({ data }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Month-over-Month Comparison
      </h2>

      <div className="h-[400px]">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Area
              type="monotone"
              dataKey="current"
              stroke="#22d3ee"
              fill="#22d3ee33"
            />

            <Area
              type="monotone"
              dataKey="previous"
              stroke="#8b5cf6"
              fill="#8b5cf633"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;