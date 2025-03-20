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
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionType } from '@prisma/client';
import { useMediaQuery } from '@/hooks/use-media-query';

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 1285px)');

  if (data.length === 0 || data.every((item) => item.value === 0)) {
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

  const tooltipFormatter = (value: number) => [
    `${value} responses`,
    'Responses',
  ];

  const useBarChart = questionType === QuestionType.TEXT || data.length > 5;

  const getBarChartHeight = () => {
    const baseHeight = 256;
    const heightPerItem = 40;
    return Math.max(baseHeight, data.length * heightPerItem);
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base truncate" title={questionText}>
          {questionText}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={useBarChart && data.length > 6 ? 'h-auto' : 'h-64 md:h-80'}
      >
        {useBarChart ? (
          <div
            style={{ height: getBarChartHeight() + 'px', minHeight: '256px' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedData}
                layout="vertical"
                margin={
                  isMobile
                    ? { top: 10, right: 10, bottom: 20, left: 20 }
                    : { top: 20, right: 30, bottom: 20, left: 30 }
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isMobile ? 100 : 150}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => {
                    const maxLength = isMobile ? 15 : 25;
                    if (value.length <= maxLength) return value;
                    return value.substring(0, maxLength - 3) + '...';
                  }}
                />
                <Tooltip
                  formatter={tooltipFormatter}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
                fill="#8884d8"
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={tooltipFormatter}
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
