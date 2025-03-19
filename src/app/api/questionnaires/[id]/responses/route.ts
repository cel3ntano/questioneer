import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { AnswerInput } from '@/types/questionnaire';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const questionnaire = await prisma.questionnaire.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!questionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      );
    }

    const response = await prisma.response.create({
      data: {
        questionnaireId: id,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        completionTime: body.completionTime,
        answers: {
          create: body.answers.map((answer: AnswerInput) => {
            const baseAnswer = {
              questionId: answer.questionId,
            };

            if (answer.textAnswer !== undefined) {
              return {
                ...baseAnswer,
                textAnswer: answer.textAnswer,
              };
            }

            if (answer.singleOptionId !== undefined) {
              return {
                ...baseAnswer,
                singleOptionId: answer.singleOptionId,
              };
            }

            if (answer.selectedOptions !== undefined) {
              return {
                ...baseAnswer,
                selectedOptions: answer.selectedOptions,
              };
            }

            if (answer.imageAnswer !== undefined) {
              return {
                ...baseAnswer,
                imageAnswer: answer.imageAnswer,
              };
            }

            return baseAnswer;
          }),
        },
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating response:', error);
    return NextResponse.json(
      { error: 'Failed to submit questionnaire response' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    const responseId = searchParams.get('responseId');

    if (responseId) {
      const response = await prisma.response.findUnique({
        where: { id: responseId },
        include: {
          answers: {
            include: {
              question: true,
            },
          },
          questionnaire: true,
        },
      });

      if (!response) {
        return NextResponse.json(
          { error: 'Response not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(response);
    }

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

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire responses' },
      { status: 500 }
    );
  }
}
