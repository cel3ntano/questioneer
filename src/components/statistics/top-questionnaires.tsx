'use client';

import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/use-media-query';

interface TopQuestionnaire {
  id: string;
  name: string;
  responseCount: number;
}

interface TopQuestionnairesProps {
  questionnaires: TopQuestionnaire[];
}

export default function TopQuestionnaires({
  questionnaires,
}: TopQuestionnairesProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const formatData = questionnaires
    .map((q) => ({
      id: q.id,
      name:
        q.name.length > (isMobile ? 15 : 20)
          ? q.name.substring(0, isMobile ? 15 : 20) + '...'
          : q.name,
      fullName: q.name,
      count: q.responseCount,
    }))
    .sort((a, b) => b.count - a.count);

  const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Most Active Questionnaires</CardTitle>
      </CardHeader>
      <CardContent>
        {questionnaires.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No questionnaire responses yet
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={formatData}
                margin={
                  isMobile
                    ? { top: 5, right: 10, left: 20, bottom: 5 }
                    : { top: 5, right: 30, left: 30, bottom: 5 }
                }
              >
                <XAxis type="number" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isMobile ? 100 : 120}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} responses`,
                    'Responses',
                  ]}
                  labelFormatter={(label) => {
                    const item = formatData.find((d) => d.name === label);
                    return item ? item.fullName : label;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {formatData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      cursor="pointer"
                      onClick={() => {
                        window.location.href = `/questionnaires/${entry.id}/stats`;
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Top Questionnaires</h4>
          <ul className="space-y-1">
            {questionnaires.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                No questionnaires available
              </li>
            ) : (
              questionnaires.slice(0, isMobile ? 3 : 5).map((questionnaire) => (
                <li key={questionnaire.id} className="text-sm">
                  <Link
                    href={`/questionnaires/${questionnaire.id}/stats`}
                    className="text-primary hover:underline"
                  >
                    {questionnaire.name}
                  </Link>
                  <span className="text-muted-foreground ml-1">
                    ({questionnaire.responseCount} responses)
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
