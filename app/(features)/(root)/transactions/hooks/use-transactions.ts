/* eslint-disable @typescript-eslint/no-explicit-any */
// =============================
// useTransactions Hook Refactor
// =============================

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUserStore } from "@/shared/store/user.store";
import { dateNow, dateToString } from "@/shared/lib/utils";

import {
  create,
  findTransactionById,
  update,
} from "../services/transactions.service";
import { TTransactionsPayload } from "../interfaces/transactions";

import {
  getBudgetingByUser,
} from "../../master/budgeting/services/budgeting.service";
import {
  getWalletByid,
  updateBalance,
} from "../../master/wallets/services/wallets.service";
import { findCategoryById } from "../../master/category/services/category.service";
import {
  createMonthlyAllocations,
  deleteMonthlyAllocationsByMonthAndUser,
  getMonthlyExpense,
  updateMonthlyExpense,
} from "@/shared/service/monthly-allocation.service";


// ========== Schema ==========
const schema = z.object({
  wallet_id: z.string(),
  related_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  type: z.string(),
  name: z.string().optional(),
  amount: z.string(),
  date: z.string(),
  description: z.string().optional(),
  monthly_allocations: z.boolean().optional(),
});


// ========== Hook ==========
const useTransactions = (data?: any, onClose?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const categoryValue =
    data && data.category_id
      ? `${data.category_id}#${data.category.name}`
      : "";

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      wallet_id: data?.wallet_id ? String(data.wallet_id) : "",
      related_wallet_id: data?.related_wallet_id ?? "",
      category_id: categoryValue,
      type: data?.type ?? "",
      name: data?.name ?? "",
      amount: `${data?.amount ?? ""}`,
      date: data?.date ?? dateNow(),
      description: data?.description ?? "",
      monthly_allocations: false, // selalu false ketika edit
    },
    resolver: zodResolver(schema),
  });

  const transactionId = data?.id ?? 0;

  const action = async (payload: TTransactionsPayload) => {
    try {
      // rollback balance lama kalau update
      if (transactionId !== 0) {
        const oldTransaction = (await findTransactionById(transactionId))[0];
        await rollbackWalletBalance(oldTransaction);
      }

      // apply saldo baru
      await applyNewWalletBalance(payload, user);

      // handle monthly allocations via checkbox
      if (payload.monthly_allocations) {
        await recreateMonthlyAllocations(payload.amount, user);
      } else {
        // jika sebelumnya ada allocations, hapus
        await deleteMonthlyAllocationsByMonthAndUser(dateNow().slice(0, 7), user);
      }

      // simpan transaksi
      const category_id = payload.category_id
        ? payload.category_id.split("#")[0]
        : null;

      if (transactionId !== 0) {
        return update({
          id: transactionId,
          ...payload,
          category_id,
          related_wallet_id: payload.related_wallet_id || null,
          date: dateToString(new Date(payload.date)),
        });
      } else {
        return create({
          ...payload,
          category_id,
          user_id: user,
          related_wallet_id: payload.related_wallet_id || null,
          date: dateToString(new Date(payload.date)),
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const { mutate: actionWallet } = useMutation({
    mutationFn: action,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({
          queryKey: ["total-salary"],
      })
      queryClient.invalidateQueries({
          queryKey: ["allocation"],
      })
      toast.success(
        transactionId !== 0
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : String(error), {
        duration: 3000,
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = (formData: z.infer<typeof schema>) => {
    setIsLoading(true);
    actionWallet(formData as TTransactionsPayload);
    if (onClose) onClose();
  };

  const dataDropdownType = [
    { value: "expense", label: "Expense" },
    { value: "income", label: "Income" },
    { value: "transfer", label: "Transfer" },
  ];

  return {
    handleSubmit,
    form,
    isLoading,
    dataDropdownType,
  };
};

export default useTransactions;


// =========================
// ==== HELPER FUNCTIONS ===
// =========================

// rollback saldo saat update
const rollbackWalletBalance = async (transaction: any) => {
  const oldWallet = await getWalletByid(`${transaction.wallet_id}`);

  if (transaction.type === "income") {
    await updateBalance(
      oldWallet[0].id,
      `${oldWallet[0].balance - Number(transaction.amount)}`
    );
  }

  if (transaction.type === "expense") {
    await updateBalance(
      oldWallet[0].id,
      oldWallet[0].balance + Number(transaction.amount)
    );

    // rollback total_expense
    await updateMonthlyAllocationExpense(
      transaction.user_id,
      dateNow().slice(0, 7),
      Number(transaction.category_id),
      -Number(transaction.amount)
    );
  }

  if (transaction.type === "transfer") {
    const oldRelatedWallet = await getWalletByid(
      `${transaction.related_wallet_id}`
    );
    await updateBalance(
      oldWallet[0].id,
      oldWallet[0].balance + Number(transaction.amount)
    );
    await updateBalance(
      oldRelatedWallet[0].id,
      `${oldRelatedWallet[0].balance - Number(transaction.amount)}`
    );
  }
};

// terapkan saldo baru
const applyNewWalletBalance = async (
  payload: TTransactionsPayload,
  user: string
) => {
  const wallet = await getWalletByid(`${payload.wallet_id}`);

  if (payload.type === "income") {
    await updateBalance(wallet[0].id, wallet[0].balance + Number(payload.amount));
  }

  const categoryId = payload.category_id?.split("#")[0];
  if (payload.type === "expense") {
    await updateBalance(
      wallet[0].id,
      `${wallet[0].balance - Number(payload.amount)}`
    );
    await updateMonthlyAllocationExpense(
      user,
      dateNow().slice(0, 7),
      Number(categoryId),
      Number(payload.amount)
    );
  }

  if (payload.type === "transfer") {
    await updateBalance(
      wallet[0].id,
      `${wallet[0].balance - Number(payload.amount)}`
    );
    const relatedWallet = await getWalletByid(`${payload.related_wallet_id}`);
    await updateBalance(
      relatedWallet[0].id,
      relatedWallet[0].balance + Number(payload.amount)
    );
  }
};

// recreate allocations dari gaji (cekbox on)
const recreateMonthlyAllocations = async (amount: string, user: string) => {
  const month = dateNow().slice(0, 7);
  const budgetings = await getBudgetingByUser(user);

  // simpan total_expense lama
  const oldExpenses: Record<number, number> = {};
  for (const b of budgetings) {
    const monthlyExpense = await getMonthlyExpense(user, month, Number(b.id));
    oldExpenses[b.id] = Number(monthlyExpense[0]?.total_expense ?? 0);
  }

  // hapus allocations lama & create ulang
  await deleteMonthlyAllocationsByMonthAndUser(month, user);

  const allocationsPayload = budgetings.map((b) => ({
    user_id: user,
    budget_id: b.id,
    month,
    percentage: `${b.percentage}`,
    amount: `${(Number(amount) * b.percentage) / 100}`,
  }));
  await createMonthlyAllocations(allocationsPayload);

  // restore total_expense lama
  for (const b of budgetings) {
    await updateMonthlyExpense(user, month, b.id, oldExpenses[b.id]);
  }
};

// update total_expense (+/-)
const updateMonthlyAllocationExpense = async (
  user: string,
  month: string,
  categoryId: number,
  amount: number
) => {
  const category = await findCategoryById(categoryId);
  const budgetId = category[0].budget_id;

  const monthlyExpense = await getMonthlyExpense(user, month, budgetId);
  const totalExpense = Number(monthlyExpense[0]?.total_expense ?? 0) + amount;

  await updateMonthlyExpense(user, month, budgetId, totalExpense);
};
