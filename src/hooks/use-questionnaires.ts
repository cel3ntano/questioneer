'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  QuestionnaireWithCounts,
  QuestionnaireApiResponse,
  SORT_OPTIONS,
} from '@/types/questionnaire';
import { toast } from 'sonner';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

interface UseQuestionnairesProps {
  initialSortValue?: string;
  initialLimit?: number;
}

export function useQuestionnaires({
  initialSortValue = 'createdAt-desc',
  initialLimit = DEFAULT_PAGE_SIZE,
}: UseQuestionnairesProps = {}) {
  const [questionnaires, setQuestionnaires] = useState<
    QuestionnaireWithCounts[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortValue, setSortValue] = useState(initialSortValue);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [limit] = useState(initialLimit);

  const isFetchingRef = useRef(false);

  const getSortParams = useCallback((sortVal: string) => {
    const sortOption = SORT_OPTIONS.find((option) => option.value === sortVal);
    if (!sortOption) {
      return { sortBy: 'createdAt', sortOrder: 'desc' };
    }

    const [sortBy, sortOrder] = sortVal.split('-');
    return { sortBy, sortOrder };
  }, []);

  const fetchQuestionnaires = useCallback(
    async (reset = false) => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsLoading(true);
        setError(null);

        if (reset) {
          setQuestionnaires([]);
          setNextCursor(null);
        }

        if (!reset && !hasMore) {
          setIsLoading(false);
          isFetchingRef.current = false;
          return;
        }

        const { sortBy, sortOrder } = getSortParams(sortValue);

        const params = new URLSearchParams({
          limit: limit.toString(),
          sortBy,
          sortOrder,
        });

        if (nextCursor && !reset) {
          params.append('cursor', nextCursor);
        }

        params.append('_t', Date.now().toString());

        const response = await fetch(
          `/api/questionnaires?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch questionnaires');
        }

        const data: QuestionnaireApiResponse = await response.json();

        if (!Array.isArray(data.questionnaires)) {
          throw new Error('Invalid response format');
        }

        if (!reset) {
          setQuestionnaires((prev) => {
            const newItems = data.questionnaires.filter(
              (newItem) =>
                !prev.some((existingItem) => existingItem.id === newItem.id)
            );

            if (newItems.length === 0) {
              return prev;
            }

            return [...prev, ...newItems];
          });
        } else {
          setQuestionnaires(data.questionnaires);
        }

        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor && data.hasMore);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        console.error('Error fetching questionnaires:', err);
        setError(errorMessage);
        toast.error('Failed to load questionnaires');
        setHasMore(false);
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          isFetchingRef.current = false;
        }, 300);
      }
    },
    [sortValue, nextCursor, limit, hasMore, getSortParams]
  );

  useEffect(() => {
    fetchQuestionnaires(true);
  }, [sortValue, fetchQuestionnaires]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !isFetchingRef.current) {
      console.log('Loading more questionnaires from hook');
      fetchQuestionnaires(false);
    }
  }, [fetchQuestionnaires, isLoading, hasMore]);

  const changeSort = useCallback(
    (newSortValue: string) => {
      if (newSortValue !== sortValue) {
        setSortValue(newSortValue);
      }
    },
    [sortValue]
  );

  const deleteQuestionnaire = useCallback(async (id: string) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/questionnaires/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete questionnaire');
      }

      setQuestionnaires((prev) => prev.filter((q) => q.id !== id));
      toast.success('Questionnaire deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to delete questionnaire');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    questionnaires,
    isLoading,
    error,
    hasMore,
    sortValue,
    loadMore,
    changeSort,
    deleteQuestionnaire,
    refreshQuestionnaires: () => fetchQuestionnaires(true),
  };
}
