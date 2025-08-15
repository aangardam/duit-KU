import { supabase } from "../lib/supabase-client";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface GetTableOptions {
  table: string;
  search?: string;
  searchFields?: string[];
  skip: number;
  limit: number;
  sorting: { id: string; desc: boolean }[];
  filters?: Record<string, any>;
  relations?: string; // NEW: untuk join
}

function mapColumnKey(key: string) {
  return key.replace(/_/g, '.'); // ubah semua "_" jadi "."
}

export async function getTableDataSupabase<T>({
  table,
  search,
  searchFields = [],
  skip,
  limit,
  sorting,
  filters = {},
  relations,
}: GetTableOptions) {
  let selectString = '*';
  if (relations) {
    selectString += `, ${relations}`;
  }
  // console.log(searchFields)
  let query = supabase.from(table).select(selectString, { count: 'exact' });
  
  // Search
  if (search && searchFields.length) {
    const orClause = searchFields
      .map((field) => `${field}.ilike.%${search}%`)
      .join(',');
    query = query.or(orClause);
  }

  // Sorting
  sorting.forEach((sortItem) => {
    query = query.order(sortItem.id, { ascending: !sortItem.desc });
  });

  // Filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key, value);
    }
  });

  // Pagination
  query = query.range(skip, skip + limit - 1);

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    data: data as T[],
    totalRecord: count || 0,
    filteredRecord: data?.length || 0,
  };
}
