// app/(features)/menu/page.tsx
'use client'

import { columns } from './columns';
import { TFilterTransactions, TTransactionsResponse } from '../interfaces/transactions';
import { useTableData } from '@/shared/hooks/use-table-data';
import { DataTable } from '@/shared/components/ui/data-table';
import { useState } from 'react';
import DialogAdd from '@/shared/components/ui/dialog-add';
import { useUserStore } from '@/shared/store/user.store';
import FormTransaction from './form-transactions';


interface PropTypes {
  dataFilter: TFilterTransactions;
}

export default function Client(props:PropTypes) {
  const { startDateTransaction, endDateTransaction, categoryId, type, walletId } = props.dataFilter
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
  } = useTableData<TTransactionsResponse>({
    table: 'transactions',
    searchFields: ['name', 'type', 'description'],
    filters: { user_id: user },
    relations: 'wallets(name), category(name)',
    customFilterFn: (query) => {
      if (startDateTransaction && endDateTransaction) {
        query = query.gte('date', startDateTransaction).lte('date', endDateTransaction);
      }
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      if (type) {
        query = query.eq('type', type);
      }
      if (walletId) {
        query = query.eq('wallet_id', walletId);
      }
      return query;
    },
    extraKey: { startDateTransaction, endDateTransaction, categoryId, type, walletId },
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
            title="Transaction"
        >
            <FormTransaction onClose={() => setOpen(false)} />
        </DialogAdd>
    </div>
  );
}
