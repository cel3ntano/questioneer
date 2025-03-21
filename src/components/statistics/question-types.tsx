'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType } from '@prisma/client';
import { useMediaQuery } from '@/hooks/use-media-query';

interface QuestionTypeData {
  type: QuestionType;
  count: number;
}

interface QuestionTypesProps {
  data: QuestionTypeData[];
}

export default function QuestionTypes({ data }: QuestionTypesProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 1285px)');

  const typeLabels: Record<QuestionType, string> = {
    [QuestionType.TEXT]: 'Text',
    [QuestionType.SINGLE_CHOICE]: 'Single Choice',
    [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
    [QuestionType.IMAGE]: 'Image',
  };

  const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];

  const formattedData = data.map((item, index) => ({
    name: typeLabels[item.type] || item.type,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  const getPieChartDimensions = () => {
    if (isMobile) {
      return {
        outerRadius: formattedData.length > 3 ? 45 : 60,
        innerRadius: formattedData.length > 5 ? 20 : 0,
      };
    }

    return {
      outerRadius: formattedData.length > 3 ? 70 : 80,
      innerRadius: formattedData.length > 5 ? 30 : 0,
    };
  };

  const { outerRadius, innerRadius } = getPieChartDimensions();

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Question Types Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-64 md:h-80">
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No questions created yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart
              margin={
                isMobile
                  ? { top: 5, right: 5, bottom: 40, left: 5 }
                  : { top: 10, right: 10, bottom: 30, left: 10 }
              }
            >
              <Pie
                data={formattedData}
                cx="50%"
                cy={isMobile ? '40%' : '50%'}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                dataKey="value"
                labelLine={false}
                label={
                  formattedData.length <= 5 && !isMobile
                    ? ({ percent }) => `${(percent * 100).toFixed(0)}%`
                    : undefined
                }
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} questions`, 'Count']}
                labelFormatter={(name) =>
                  `${name} (${
                    formattedData.find((item) => item.name === name)?.value || 0
                  })`
                }
              />
              <Legend
                layout={isMobile || isSmallScreen ? 'vertical' : 'horizontal'}
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  paddingTop: 10,
                  fontSize: isMobile ? '10px' : '12px',
                  width: '100%',
                  maxHeight: isMobile ? '80px' : 'auto',
                  overflowY: isMobile ? 'auto' : 'visible',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
