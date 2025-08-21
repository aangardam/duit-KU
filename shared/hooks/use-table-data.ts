/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/use-table-data.ts
import { usePagination } from '@/shared/hooks/use-pagination';
import { useSorting } from '@/shared/hooks/use-sorting';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { buildQueryBody } from '../lib/build-query-body';
import { getTableDataSupabase } from '../service/supabase-table.service';


interface UseTableOptions {
  table: string;
  searchFields?: string[]; // kolom yang akan dicari
  filters?: Record<string, any>; // tambahan filter eq
  relations?: string;
  customFilterFn?: (query: any) => any;
  extraKey?: unknown;
}

export function useTableData<T>(options: UseTableOptions) {
  const { limit, onPaginationChange, skip, pagination } = usePagination();
  const { sorting, onSortingChange } = useSorting();
  const [search, setSearch] = useState('');

  const handleFilter = setSearch;

  const body = useMemo(
    () =>
      buildQueryBody({
        search,
        sorting,
        skip,
        limit,
      }),
    [search, sorting, skip, limit]
  );

  const {
    data: result,
    isPending,
  } = useQuery({
    queryKey: [options.table, body, options.filters, options.extraKey],
    queryFn: () =>
      getTableDataSupabase<T>({
        ...body,
        table: options.table,
        searchFields: options.searchFields,
        filters: options.filters,
        relations: options.relations,
        customFilterFn: options.customFilterFn,
      }),
  });

  const pageCount = result?.totalRecord
    ? Math.ceil(result.totalRecord / limit)
    : 0;
  

  return {
    data: result?.data || [],
    isPending,
    onPaginationChange,
    onSortingChange,
    handleFilter,
    pagination,
    sorting,
    pageCount,
    totalData: result?.totalRecord || 0,
    totalFilteredData: result?.filteredRecord || 0,
  };
}
