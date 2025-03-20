import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { QuestionInput, OptionInput } from '@/types/questionnaire';

type SortOrder = 'asc' | 'desc';

type OrderByType =
  | {
      [key: string]: SortOrder;
    }
  | {
      questions: {
        _count: SortOrder;
      };
    }
  | {
      responses: {
        _count: SortOrder;
      };
    };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    if (isNaN(limit) || limit <= 0 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid limit parameter' },
        { status: 400 }
      );
    }

    let orderBy: OrderByType = {};

    if (sortBy === 'questionCount') {
      orderBy = {
        questions: {
          _count: sortOrder as 'asc' | 'desc',
        },
      };
    } else if (sortBy === 'responseCount') {
      orderBy = {
        responses: {
          _count: sortOrder as 'asc' | 'desc',
        },
      };
    } else {
      orderBy[sortBy] = sortOrder as 'asc' | 'desc';
    }


    const questionnaires = await prisma.questionnaire.findMany({
      ...(cursor ? { cursor: { id: cursor } } : {}),
      take: limit + 1,
      orderBy,
      include: {
        _count: {
          select: {
            questions: true,
            responses: true,
          },
        },
      },
    });

    const hasMore = questionnaires.length > limit;

    const resultsToReturn = hasMore
      ? questionnaires.slice(0, limit)
      : questionnaires;


    const nextCursor =
      hasMore && resultsToReturn.length > 0
        ? resultsToReturn[resultsToReturn.length - 1].id
        : null;

    return NextResponse.json({
      questionnaires: resultsToReturn,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaires' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const questionnaire = await prisma.questionnaire.create({
      data: {
        name: body.name,
        description: body.description,
        questions: {
          create: Array.isArray(body.questions)
            ? body.questions.map((question: QuestionInput, index: number) => ({
                questionText: question.questionText,
                questionType: question.questionType,
                order: index,
                options: question.options
                  ? {
                      create: question.options.map(
                        (option: OptionInput, optIndex: number) => ({
                          text: option.text,
                          order: optIndex,
                        })
                      ),
                    }
                  : undefined,
                image: question.image,
              }))
            : [],
        },
      },
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

    return NextResponse.json(questionnaire, { status: 201 });
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to create questionnaire' },
      { status: 500 }
    );
  }
}
