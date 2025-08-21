// app/(features)/menu/page.tsx
'use client'


import { columns } from './columns';
import { TCategoryResponse } from '../interfaces/category';
import { useTableData } from '@/shared/hooks/use-table-data';
import { DataTable } from '@/shared/components/ui/data-table';
import { useState } from 'react';
import DialogAdd from '@/shared/components/ui/dialog-add';
import FormCategory from './form-category';
import { useUserStore } from '@/shared/store/user.store';

export default function Client() {
  const { user } = useUserStore();
  const {
    data,
    isPending,
    onPaginationChange,
    onSortingChange,
    handleFilter,
    pagination,
    sorting,
    pageCount,
    totalData,
    totalFilteredData,
  } = useTableData<TCategoryResponse>({
    table: 'category',
    searchFields: ['name', 'type'],
    filters: { user_id: user },
    relations: 'budgeting(name)',
  });
  

  const [open, setOpen] = useState(false)
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isPending}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
        pagination={pagination}
        sorting={sorting}
        onSortingChange={onSortingChange}
        filter={handleFilter}
        totalData={totalData}
        totalFilteredData={totalFilteredData}
        nameAddButton="Add"
        onClickAdd={() => setOpen(true)}
      />

        <DialogAdd
            open={open}
            onOpenChange={setOpen}
            title="Category"
        >
            <FormCategory onClose={() => setOpen(false)} />
        </DialogAdd>
    </div>
  );
}
