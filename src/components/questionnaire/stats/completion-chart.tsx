'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import { useMediaQuery } from '@/hooks/use-media-query';

interface CompletionData {
  date?: string;
  week?: string;
  month?: string;
  count: number;
}

interface CompletionChartProps {
  dailyData: CompletionData[];
  weeklyData: CompletionData[];
  monthlyData: CompletionData[];
}

export default function CompletionChart({
  dailyData,
  weeklyData,
  monthlyData,
}: CompletionChartProps) {
  const [activeTab, setActiveTab] = useState('daily');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const processedDailyData = dailyData
    .slice()
    .sort((a, b) => parseISO(a.date!).getTime() - parseISO(b.date!).getTime())
    .map((item) => ({
      ...item,
      date: format(parseISO(item.date!), isMobile ? 'MMM d' : 'MMM dd'),
    }));

  const processedWeeklyData = weeklyData
    .slice()
    .sort((a, b) => parseISO(a.week!).getTime() - parseISO(b.week!).getTime())
    .map((item) => ({
      ...item,
      week: `Week of ${format(
        parseISO(item.week!),
        isMobile ? 'MMM d' : 'MMM dd'
      )}`,
    }));

  const processedMonthlyData = monthlyData
    .slice()
    .sort((a, b) => a.month!.localeCompare(b.month!))
    .map((item) => ({
      ...item,
      month: format(
        parseISO(`${item.month!}-01`),
        isMobile ? 'MMM yyyy' : 'MMMM yyyy'
      ),
    }));

  const tooltipFormatter = (value: number) => [
    `${value} completions`,
    'Completions',
  ];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Questionnaire Completions</CardTitle>
        <Tabs
          defaultValue="daily"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="h-full">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={processedDailyData}
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
                    tickFormatter={(tick) => tick}
                    interval={isMobile ? 4 : 2}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 60 : 30}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={{ r: isMobile ? 3 : 4 }}
                    activeDot={{ r: isMobile ? 5 : 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="h-full">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processedWeeklyData}
                  margin={
                    isMobile
                      ? { top: 5, right: 10, bottom: 20, left: 5 }
                      : { top: 10, right: 30, bottom: 10, left: 10 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    className="text-xs"
                    dataKey="week"
                    tickFormatter={(tick) => tick.replace('Week of ', '')}
                    interval={isMobile ? 1 : 0}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 60 : 30}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-2)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="h-full">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processedMonthlyData}
                  margin={
                    isMobile
                      ? { top: 5, right: 10, bottom: 20, left: 5 }
                      : { top: 10, right: 30, bottom: 10, left: 10 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    className="text-xs"
                    dataKey="month"
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 60 : 30}
                    interval={0}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={tooltipFormatter} />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-3)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
