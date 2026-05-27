{/*in dev*/}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const RevenueChart = ({ data }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Revenue Trend
      </h2>

       <div className="h-[400px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              label={{
                value: 'Month',
                position: 'insideBottom',
                offset: -5,
              }}
            />

            <YAxis
              label={{
                value: 'Revenue',
                angle: -90,
                position: 'insideLeft',
              }}
            />

            <Tooltip />

            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22d3ee"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;