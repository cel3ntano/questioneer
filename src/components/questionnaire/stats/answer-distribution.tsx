'use client';

import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip, 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType } from '@prisma/client';

interface DistributionData {
  label: string;
  value: number;
}

interface AnswerDistributionProps {
  questionText: string;
  questionType: string;
  data: DistributionData[];
}

export default function AnswerDistribution({
  questionText,
  questionType,
  data,
}: AnswerDistributionProps) {
  if (data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{questionText}</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            No answer data available for this question yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];

  const formattedData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    color: COLORS[index % COLORS.length],
  }));

  const tooltipFormatter = (value: number) => [`${value} responses`, 'Responses'];

  const useBarChart = questionType === QuestionType.TEXT || data.length > 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base truncate" title={questionText}>
          {questionText}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        {useBarChart ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedData}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={120}
                tickFormatter={(value) => 
                  value.length > 20 ? value.substring(0, 20) + '...' : value
                }
              />
              <Tooltip formatter={tooltipFormatter} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}