'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityChartProps {
  data: ActivityData[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const processedData = data.slice().map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd'),
  }));

  const tooltipFormatter = (value: number) => [
    `${value} responses`,
    'Responses',
  ];
  const dateFormatter = (date: string) =>
    format(parseISO(date), 'MMM dd, yyyy');

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Daily Response Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processedData}
              margin={
                isMobile
                  ? { top: 5, right: 10, bottom: 20, left: 5 }
                  : { top: 10, right: 30, bottom: 10, left: 10 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                className="text-xs"
                dataKey="date"
                tickFormatter={(date) =>
                  format(parseISO(date), isMobile ? 'MMM d' : 'MMM dd')
                }
                interval={
                  isMobile
                    ? Math.ceil(data.length / 5)
                    : Math.ceil(data.length / 7)
                }
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={tooltipFormatter}
                labelFormatter={dateFormatter}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
