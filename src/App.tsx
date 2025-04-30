import "./styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getMean, getVariance } from "./funx";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function App() {
  const maxZ = 1;

  const uvColor = "#82ca9d";
  const uvProps = getChartProps(data.map((item) => item.uv));

  const pvColor = "#8884d8";
  const pvProps = getChartProps(data.map((item) => item.pv));

  function getChartProps(dataArray: number[]) {
    const mean = getMean(dataArray);
    const variance = getVariance(dataArray, mean);
    const deviation = variance ** 0.5;

    const max = Math.max(...dataArray);
    const min = Math.min(...dataArray);

    const upperLimit = mean + maxZ * deviation;
    const lowerLimit = mean - maxZ * deviation;

    const upperRelativeLimit = (upperLimit - min) / (max - min);
    const lowerRelativeLimit = (lowerLimit - min) / (max - min);

    return {
      mean,
      deviation,
      upperRelativeLimit,
      lowerRelativeLimit,
    };
  }

  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <defs>
        <linearGradient id="pvColor" y1="100%" y2="0%" x1="0%" x2="0%">
          <stop offset={"0%"} stopColor="red" />
          <stop offset={pvProps.lowerRelativeLimit} stopColor="red" />
          <stop offset={pvProps.lowerRelativeLimit} stopColor={pvColor} />
          <stop offset={pvProps.upperRelativeLimit} stopColor={pvColor} />
          <stop offset={pvProps.upperRelativeLimit} stopColor="red" />
          <stop offset={"100%"} stopColor="red" />
        </linearGradient>

        <linearGradient id="uvColor" y1="100%" y2="0%" x1="0%" x2="0%">
          <stop offset="0%" stopColor="red" />
          <stop offset={uvProps.lowerRelativeLimit} stopColor="red" />
          <stop offset={uvProps.lowerRelativeLimit} stopColor={uvColor} />
          <stop offset={uvProps.upperRelativeLimit} stopColor={uvColor} />
          <stop offset={uvProps.upperRelativeLimit} stopColor="red" />
          <stop offset="100%" stopColor="red" />
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Line
        type="monotone"
        dataKey="pv"
        stroke="url(#pvColor)"
        strokeWidth={2}
        dot={<CustomDot color={pvColor} chartProps={pvProps} maxZ={maxZ} />}
        activeDot={
          <CustomDot color={pvColor} chartProps={pvProps} maxZ={maxZ} active />
        }
      />

      <Line
        type="monotone"
        dataKey="uv"
        stroke="url(#uvColor)"
        strokeWidth={2}
        dot={<CustomDot color={uvColor} chartProps={uvProps} maxZ={maxZ} />}
        activeDot={
          <CustomDot color={uvColor} chartProps={uvProps} maxZ={maxZ} active />
        }
      />
    </LineChart>
  );
}

const CustomDot = ({
  value = 0,
  cx,
  cy,
  color,
  chartProps,
  maxZ,
  active,
}: {
  value?: number;
  cx?: number;
  cy?: number;
  color: string;
  chartProps: { mean: number; deviation: number };
  maxZ: number;
  active?: boolean;
}) => {
  const { mean, deviation } = chartProps;

  const Z = (value - mean) / deviation;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={active ? 8 : 4}
      fill={Math.abs(Z) < maxZ ? color : "red"}
    />
  );
};
