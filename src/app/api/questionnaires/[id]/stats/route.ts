import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  subMonths,
  format,
} from 'date-fns';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      );
    }

    const completionTimeResult = await prisma.response.aggregate({
      where: {
        questionnaireId: id,
        completionTime: {
          not: null,
        },
      },
      _avg: {
        completionTime: true,
      },
      _count: true,
    });

    const averageCompletionTime = completionTimeResult._avg.completionTime || 0;
    const totalResponses = completionTimeResult._count || 0;

    const responses = await prisma.response.findMany({
      where: {
        questionnaireId: id,
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const now = new Date();
    const monthsAgo = subMonths(now, 3);

    const responsesByDate = responses.filter(
      (r) => new Date(r.createdAt) >= monthsAgo
    );

    const dailyCompletions = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = startOfDay(date);

      const count = responsesByDate.filter((r) => {
        const responseDate = new Date(r.createdAt);
        return (
          responseDate >= dayStart &&
          responseDate < new Date(dayStart.getTime() + 86400000)
        );
      }).length;

      dailyCompletions.push({
        date: format(dayStart, 'yyyy-MM-dd'),
        count,
      });
    }

    const weeklyCompletions = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      const weekStart = startOfWeek(date);

      const count = responsesByDate.filter((r) => {
        const responseDate = new Date(r.createdAt);
        return (
          responseDate >= weekStart &&
          responseDate < new Date(weekStart.getTime() + 7 * 86400000)
        );
      }).length;

      weeklyCompletions.push({
        week: format(weekStart, 'yyyy-MM-dd'),
        count,
      });
    }

    const monthlyCompletions = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = startOfMonth(date);

      const count = responsesByDate.filter((r) => {
        const responseDate = new Date(r.createdAt);
        return (
          responseDate.getMonth() === monthStart.getMonth() &&
          responseDate.getFullYear() === monthStart.getFullYear()
        );
      }).length;

      monthlyCompletions.push({
        month: format(monthStart, 'yyyy-MM'),
        count,
      });
    }

    const questionStats = await Promise.all(
      questionnaire.questions.map(async (question) => {
        let answerDistribution = [];

        switch (question.questionType) {
          case 'SINGLE_CHOICE': {
            const optionCounts = await prisma.answer.groupBy({
              by: ['singleOptionId'],
              where: {
                questionId: question.id,
                singleOptionId: {
                  not: null,
                },
              },
              _count: true,
            });

            answerDistribution = question.options.map((option) => {
              const count =
                optionCounts.find((oc) => oc.singleOptionId === option.id)
                  ?._count || 0;
              return {
                label: option.text,
                value: count,
              };
            });
            break;
          }

          case 'MULTIPLE_CHOICE': {
            answerDistribution = await Promise.all(
              question.options.map(async (option) => {
                const count = await prisma.answer.count({
                  where: {
                    questionId: question.id,
                    selectedOptions: {
                      has: option.id,
                    },
                  },
                });

                return {
                  label: option.text,
                  value: count,
                };
              })
            );
            break;
          }

          case 'TEXT': {
            const textAnswers = await prisma.answer.findMany({
              where: {
                questionId: question.id,
                textAnswer: {
                  not: null,
                },
              },
              select: {
                textAnswer: true,
              },
            });

            const answerFrequency = textAnswers.reduce((acc, curr) => {
              const answer = curr.textAnswer?.trim().toLowerCase() || '';
              if (answer) {
                acc[answer] = (acc[answer] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>);

            answerDistribution = Object.entries(answerFrequency)
              .filter(([, count]) => count > 1)
              .map(([text, count]) => ({
                label: text,
                value: count,
              }))
              .sort((a, b) => b.value - a.value)
              .slice(0, 10);
            break;
          }

          case 'IMAGE': {
            const imageCount = await prisma.answer.count({
              where: {
                questionId: question.id,
                imageAnswer: {
                  not: null,
                },
              },
            });

            answerDistribution = [
              {
                label: 'Images submitted',
                value: imageCount,
              },
              {
                label: 'No image',
                value: totalResponses - imageCount,
              },
            ];
            break;
          }
        }

        return {
          questionId: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          answerDistribution,
        };
      })
    );

    return NextResponse.json({
      totalResponses,
      averageCompletionTime,
      dailyCompletions,
      weeklyCompletions,
      monthlyCompletions,
      questionStats,
    });
  } catch (error) {
    console.error('Error generating statistics:', error);
    return NextResponse.json(
      { error: 'Failed to generate statistics' },
      { status: 500 }
    );
  }
}
