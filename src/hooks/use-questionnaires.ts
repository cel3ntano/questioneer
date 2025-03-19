'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuestionnaireWithCounts, QuestionnaireApiResponse, SORT_OPTIONS } from '@/types/questionnaire';
import { toast } from 'sonner';

interface UseQuestionnairesProps {
  initialSortValue?: string;
  initialLimit?: number;
}

export function useQuestionnaires({ 
  initialSortValue = 'createdAt-desc', 
  initialLimit = 10 
}: UseQuestionnairesProps = {}) {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortValue, setSortValue] = useState(initialSortValue);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [limit] = useState(initialLimit);

  const getSortParams = useCallback((sortVal: string) => {
    const sortOption = SORT_OPTIONS.find(option => option.value === sortVal);
    if (!sortOption) {
      return { sortBy: 'createdAt', sortOrder: 'desc' };
    }
    
    const [sortBy, sortOrder] = sortVal.split('-');
    return { sortBy, sortOrder };
  }, []);

  const fetchQuestionnaires = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (reset) {
        setQuestionnaires([]);
        setNextCursor(null);
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
      
      const response = await fetch(`/api/questionnaires?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questionnaires');
      }
      
      const data: QuestionnaireApiResponse = await response.json();
      
      setQuestionnaires(prev => 
        reset ? data.questionnaires : [...prev, ...data.questionnaires]
      );
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load questionnaires');
    } finally {
      setIsLoading(false);
    }
  }, [sortValue, nextCursor, limit, getSortParams]);

  useEffect(() => {
    fetchQuestionnaires(true);
  }, [sortValue, fetchQuestionnaires]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchQuestionnaires();
    }
  }, [fetchQuestionnaires, isLoading, hasMore]);

  const changeSort = useCallback((newSortValue: string) => {
    if (newSortValue !== sortValue) {
      setSortValue(newSortValue);
    }
  }, [sortValue]);

  const deleteQuestionnaire = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/questionnaires/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete questionnaire');
      }
      
      setQuestionnaires(prev => prev.filter(q => q.id !== id));
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