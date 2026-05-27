import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ProductChart = ({ data }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Top Products / Categories
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              label={{
                value: 'Products',
                position: 'insideBottom',
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: 'Sales',
                angle: -90,
                position: 'insideLeft',
              }}
            />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="sales"
              fill="#8b5cf6"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductChart;