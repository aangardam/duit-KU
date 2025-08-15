// utils/buildQueryBody.ts
export function buildQueryBody({
    search,
    sorting,
    skip,
    limit,
  }: {
    search: string;
    sorting: { id: string; desc: boolean }[];
    skip: number;
    limit: number;
  }) {
    return {
      search,
      sorting,
      skip,
      limit,
    };
  }
  