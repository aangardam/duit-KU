// app/(features)/menu/page.tsx
'use client'


import { columns } from './columns';
import { TBudgetingResponse } from '../interfaces/budgeting';
import { useTableData } from '@/shared/hooks/use-table-data';
import { DataTable } from '@/shared/components/ui/data-table';
import { useState } from 'react';
import DialogAdd from '@/shared/components/ui/dialog-add';
import { useUserStore } from '@/shared/store/user.store';
import FormBudgeting from './form-budgeting';

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
  } = useTableData<TBudgetingResponse>({
    table: 'budgeting',
    searchFields: ['name'],
    filters: {user_id: user}, // contoh: { role_id: 'admin' }
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
            title="Budgeting"
        >
            <FormBudgeting onClose={() => setOpen(false)} />
        </DialogAdd>
    </div>
  );
}
