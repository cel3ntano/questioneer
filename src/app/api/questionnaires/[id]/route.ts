import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { QuestionInput, OptionInput } from '@/types/questionnaire';

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
            options: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            responses: true,
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

    return NextResponse.json(questionnaire);
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questionnaire' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const existingQuestionnaire = await prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!existingQuestionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      );
    }

    await prisma.questionnaire.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    if (Array.isArray(body.questions)) {
      await prisma.question.deleteMany({
        where: { questionnaireId: id },
      });

      await Promise.all(
        body.questions.map(async (question: QuestionInput, index: number) => {
          const newQuestion = await prisma.question.create({
            data: {
              questionText: question.questionText,
              questionType: question.questionType,
              order: index,
              image: question.image,
              questionnaire: {
                connect: { id },
              },
            },
          });

          if (
            (question.questionType === 'SINGLE_CHOICE' ||
              question.questionType === 'MULTIPLE_CHOICE') &&
            Array.isArray(question.options)
          ) {
            await Promise.all(
              question.options.map((option: OptionInput, optIndex: number) => {
                return prisma.option.create({
                  data: {
                    text: option.text,
                    order: optIndex,
                    question: {
                      connect: { id: newQuestion.id },
                    },
                  },
                });
              })
            );
          }

          return newQuestion;
        })
      );
    }

    const fullUpdatedQuestionnaire = await prisma.questionnaire.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(fullUpdatedQuestionnaire);
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to update questionnaire' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const existingQuestionnaire = await prisma.questionnaire.findUnique({
      where: { id },
    });

    if (!existingQuestionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found' },
        { status: 404 }
      );
    }

    await prisma.questionnaire.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting questionnaire:', error);
    return NextResponse.json(
      { error: 'Failed to delete questionnaire' },
      { status: 500 }
    );
  }
}
