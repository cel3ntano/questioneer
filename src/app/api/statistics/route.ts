import {  NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { subDays, format, parseISO } from 'date-fns';

export async function GET() {
  try {
    const totalQuestionnaires = await prisma.questionnaire.count();
    const totalResponses = await prisma.response.count();
    const totalQuestions = await prisma.question.count();

    const completionTimeResult = await prisma.response.aggregate({
      where: {
        completionTime: {
          not: null,
        },
      },
      _avg: {
        completionTime: true,
      },
    });

    const averageCompletionTime = completionTimeResult._avg.completionTime || 0;

    const topQuestionnaires = await prisma.questionnaire.findMany({
      take: 5,
      orderBy: {
        responses: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    const questionTypes = await prisma.question.groupBy({
      by: ['questionType'],
      _count: true,
    });

    const thirtyDaysAgo = subDays(new Date(), 30);

    const recentResponses = await prisma.response.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const dailyActivityMap: Record<string, number> = {};

    for (let i = 0; i < 30; i++) {
      const date = subDays(new Date(), i);
      const dateString = format(date, 'yyyy-MM-dd');
      dailyActivityMap[dateString] = 0;
    }

    recentResponses.forEach((response) => {
      const dateString = format(new Date(response.createdAt), 'yyyy-MM-dd');
      if (dailyActivityMap[dateString] !== undefined) {
        dailyActivityMap[dateString]++;
      }
    });

    const dailyActivity = Object.entries(dailyActivityMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

    const latestResponses = await prisma.response.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        questionnaire: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      totalQuestionnaires,
      totalResponses,
      totalQuestions,
      averageCompletionTime,
      topQuestionnaires: topQuestionnaires.map((q) => ({
        id: q.id,
        name: q.name,
        responseCount: q._count.responses,
      })),
      questionTypeDistribution: questionTypes.map((qt) => ({
        type: qt.questionType,
        count: qt._count,
      })),
      dailyActivity,
      latestResponses: latestResponses.map((r) => ({
        id: r.id,
        questionnaireId: r.questionnaireId,
        questionnaireName: r.questionnaire.name,
        completionTime: r.completionTime,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error generating global statistics:', error);
    return NextResponse.json(
      { error: 'Failed to generate global statistics' },
      { status: 500 }
    );
  }
}
