'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  PenSquare,
  Play,
  BarChart,
  Trash,
  MoreVertical,
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { QuestionnaireWithCounts } from '@/types/questionnaire';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface QuestionnaireCardProps {
  questionnaire: QuestionnaireWithCounts;
  onDelete: (id: string) => Promise<void>;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

function QuestionnaireCardComponent({
  questionnaire,
  onDelete,
  index = 0,
}: QuestionnaireCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(questionnaire.id);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const MotionCard = motion.create(Card);
  const MotionDialogContent = motion.create(DialogContent);

  return (
    <>
      <MotionCard
        className="h-full flex flex-col"
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={cardVariants}
        custom={index}
        layout
      >
        <CardHeader>
          <CardTitle className="flex justify-between items-start">
            <span className="line-clamp-1">{questionnaire.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/questionnaires/${questionnaire.id}/edit`}
                    className="cursor-pointer flex items-center"
                  >
                    <PenSquare className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/questionnaires/${questionnaire.id}/run`}
                    className="cursor-pointer flex items-center"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Run
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/questionnaires/${questionnaire.id}/stats`}
                    className="cursor-pointer flex items-center"
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Statistics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {questionnaire.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="grid grid-cols-2 gap-4">
            <motion.div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Questions</span>
              <span className="font-medium flex items-center">
                <ClipboardList className="mr-1 h-4 w-4 text-primary" />
                {questionnaire._count.questions}
              </span>
            </motion.div>
            <motion.div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Responses</span>
              <span className="font-medium flex items-center">
                <BarChart className="mr-1 h-4 w-4 text-primary" />
                {questionnaire._count.responses}
              </span>
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Created {format(new Date(questionnaire.createdAt), 'MMM d, yyyy')}
            </span>
            <div className="flex space-x-2">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/questionnaires/${questionnaire.id}/run`}>
                    <Play className="mr-1 h-3 w-3" />
                    Run
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button asChild size="sm">
                  <Link href={`/questionnaires/${questionnaire.id}/edit`}>
                    <PenSquare className="mr-1 h-3 w-3" />
                    Edit
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </CardFooter>
      </MotionCard>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <MotionDialogContent
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <DialogTitle>Delete Questionnaire</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{questionnaire.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </motion.div>
          </DialogFooter>
        </MotionDialogContent>
      </Dialog>
    </>
  );
}

export const QuestionnaireCard = memo(
  QuestionnaireCardComponent,
  (prevProps, nextProps) =>
    prevProps.questionnaire.id === nextProps.questionnaire.id
);
