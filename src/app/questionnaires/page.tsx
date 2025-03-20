'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  SlidersHorizontal,
  Loader2,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionnaireCard } from '@/components/questionnaire/questionnaire-card';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useQuestionnaires } from '@/hooks/use-questionnaires';
import { SORT_OPTIONS } from '@/types/questionnaire';

export default function QuestionnairesPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollTriggerDistance = 1000;

  const {
    questionnaires,
    isLoading,
    error,
    hasMore,
    sortValue,
    loadMore,
    changeSort,
    deleteQuestionnaire,
  } = useQuestionnaires();

  useEffect(() => {
    if (!isLoading && initialLoading) {
      setInitialLoading(false);
    }
  }, [isLoading, initialLoading]);

  const handleScroll = useCallback(() => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      if (isLoading || !hasMore) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop - clientHeight < scrollTriggerDistance) {
        console.log('Scroll near bottom detected, loading more...');
        loadMore();
      }
    }, 100);
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const lastQuestionnaireRef = useCallback(
    (node: HTMLDivElement) => {
      if (!node || isLoading || !hasMore) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoading) {
            console.log(
              'Intersection detected, loading more questionnaires...'
            );
            loadMore();
          }
        },
        {
          rootMargin: '1000px',
          threshold: 0.1,
        }
      );

      observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore]
  );

  const currentSortOption = SORT_OPTIONS.find(
    (option) => option.value === sortValue
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Questionnaires</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Sort: {currentSortOption?.label || 'Newest'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={sortValue}
                onValueChange={changeSort}
              >
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild className="w-full sm:w-auto">
            <Link href="/questionnaires/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Questionnaire
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {!initialLoading &&
        !isLoading &&
        questionnaires.length === 0 &&
        !error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium">No questionnaires found</h2>
            <p className="text-muted-foreground mt-1 mb-4">
              Get started by creating your first questionnaire.
            </p>
            <Button asChild>
              <Link href="/questionnaires/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Questionnaire
              </Link>
            </Button>
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionnaires.map((questionnaire, index) => (
          <div key={questionnaire.id}>
            <QuestionnaireCard
              questionnaire={questionnaire}
              onDelete={deleteQuestionnaire}
              index={index}
            />
          </div>
        ))}
      </div>

      {/* Fixed height container for loading states and pagination indicators */}
      <div className="h-20 relative mt-4">
        {/* Sentinel element for intersection observer */}
        {hasMore && !isLoading && questionnaires.length > 0 && (
          <div
            ref={lastQuestionnaireRef}
            className="absolute inset-0 flex justify-center"
            aria-hidden="true"
          />
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* End of results message */}
        {!hasMore && questionnaires.length > 0 && !isLoading && (
          <div className="absolute inset-0 flex justify-center items-center text-muted-foreground">
            That&apos;s all for now
          </div>
        )}
      </div>
    </div>
  );
}
