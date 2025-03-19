'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType } from '@prisma/client';

interface QuestionTypeData {
  type: QuestionType;
  count: number;
}

interface QuestionTypesProps {
  data: QuestionTypeData[];
}

export default function QuestionTypes({ data }: QuestionTypesProps) {
  const typeLabels: Record<QuestionType, string> = {
    [QuestionType.TEXT]: 'Text',
    [QuestionType.SINGLE_CHOICE]: 'Single Choice',
    [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
    [QuestionType.IMAGE]: 'Image',
  };

  const formattedData = data.map((item) => ({
    name: typeLabels[item.type] || item.type,
    value: item.count,
  }));

  const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
  ];

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle>Question Types Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No questions created yet
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {formattedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} questions`, 'Count']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}