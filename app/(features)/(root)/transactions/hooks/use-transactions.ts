/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  create,
  createMonthlyAllocations,
  deleteMonthlyAllocationsByMonthAndUser,
  findTransactionById,
  getMonthlyExpense,
  update,
  updateMonthlyExpense,
} from "../services/transactions.service";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/shared/store/user.store";
import { dateNow, dateToString } from "@/shared/lib/utils";
import { TTransactionsPayload } from "../interfaces/transactions";
import { getBudgetingByUser } from "../../master/budgeting/services/budgeting.service";
import { getWalletByid, updateBalance } from "../../master/wallets/services/wallets.service";
import { findCategoryById } from "../../master/category/services/category.service";

const schema = z.object({
  wallet_id: z.string(),
  related_wallet_id: z.string().optional(),
  category_id: z.string().optional(),
  type: z.string(),
  name: z.string(),
  amount: z.string(),
  date: z.string(),
  description: z.string().optional(),
});

const useTransactions = (data?: any, onClose?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  let dataCategory;
  if (data && data.category_id) {
    dataCategory = `${data.category_id}#${data.category.name}`;
  }

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      wallet_id: data?.wallet_id ? String(data.wallet_id) : "",
      related_wallet_id: data?.related_wallet_id ?? "",
      category_id: dataCategory ?? "",
      type: data?.type ?? "",
      name: data?.name ?? "",
      amount: data?.amount ?? "",
      date: data?.date ?? dateNow(),
      description: data?.description ?? "",
    },
    resolver: zodResolver(schema),
  });

  const IdTransaction = data?.id ?? 0;

  const action = async (payload: TTransactionsPayload) => {
    try {
      // === Step 1: Rollback saldo & total_expense lama jika update ===
      if (IdTransaction !== 0) {
        const oldTransaction = (await findTransactionById(IdTransaction))[0];
        await rollbackWalletBalance(oldTransaction);
      }

      // === Step 2: Jika edit gaji, hapus monthly allocations lalu buat ulang (total_expense tetap) ===
      if (IdTransaction !== 0) {
        await updateMonthlyAllocationsIfSalary(payload, user);
      }

      // === Step 3: Terapkan saldo baru & update total_expense jika perlu ===
      await applyNewWalletBalance(payload, user, IdTransaction === 0);

      // === Step 4: Update / Create transaksi ===
      const category_id = payload.category_id ? payload.category_id.split("#")[0] : null;

      if (IdTransaction !== 0) {
        return update({
          id: IdTransaction,
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
      toast.success(
        IdTransaction !== 0
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 });
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

// Rollback saldo & total_expense lama saat update
const rollbackWalletBalance = async (transaction: any) => {
  const oldWallet = await getWalletByid(`${transaction.wallet_id}`);

  if (transaction.type === "income") {
    await updateBalance(oldWallet[0].id, `${oldWallet[0].balance - Number(transaction.amount)}`);
  }

  if (transaction.type === "expense") {
    await updateBalance(oldWallet[0].id, oldWallet[0].balance + Number(transaction.amount));

    // Rollback total_expense
    await updateMonthlyAllocationExpense(
      transaction.user_id,
      dateNow().slice(0, 7),
      Number(transaction.category_id),
      -Number(transaction.amount) // negatif untuk rollback
    );
  }

  if (transaction.type === "transfer") {
    const oldRelatedWallet = await getWalletByid(`${transaction.related_wallet_id}`);
    await updateBalance(oldWallet[0].id, oldWallet[0].balance + Number(transaction.amount));
    await updateBalance(
      oldRelatedWallet[0].id,
      `${oldRelatedWallet[0].balance - Number(transaction.amount)}`
    );
  }
};

// Terapkan saldo baru + update total_expense
const applyNewWalletBalance = async (payload: TTransactionsPayload, user: string, isNew: boolean) => {
  const wallet = await getWalletByid(`${payload.wallet_id}`);
  let category;
  const categoryId = payload.category_id?.split("#")[0];

  if (payload.type === "income" || payload.type === "expense") {
    category = payload.category_id?.split("#")[1] ?? "";
  }

  if (payload.type === "income") {
    if (category === "Gaji" && isNew) {
      await createMonthlyAllocationsForSalary(payload.amount, user);
    }
    await updateBalance(wallet[0].id, wallet[0].balance + Number(payload.amount));
  }

  if (payload.type === "expense") {
    await updateBalance(wallet[0].id, `${wallet[0].balance - Number(payload.amount)}`);
    await updateMonthlyAllocationExpense(
      user,
      dateNow().slice(0, 7),
      Number(categoryId),
      Number(payload.amount)
    );
  }

  if (payload.type === "transfer") {
    await updateBalance(wallet[0].id, `${wallet[0].balance - Number(payload.amount)}`);
    const relatedWalletId = await getWalletByid(`${payload.related_wallet_id}`);
    await updateBalance(
      relatedWalletId[0].id,
      relatedWalletId[0].balance + Number(payload.amount)
    );
  }
};

// Buat allocations dari gaji
const createMonthlyAllocationsForSalary = async (amount: string, user: string) => {
  const budgetings = await getBudgetingByUser(user);
  const allocationsPayload = budgetings.map((b) => ({
    user_id: `${user}`,
    budget_id: Number(b.id),
    month: dateNow().slice(0, 7),
    percentage: `${b.percentage}`,
    amount: `${(Number(amount) * b.percentage) / 100}`,
  }));
  await createMonthlyAllocations(allocationsPayload);
};

// Update allocations untuk gaji (total_expense tetap)
const updateMonthlyAllocationsIfSalary = async (payload: TTransactionsPayload, user: string) => {
  const category = payload.category_id?.split("#")[1] ?? "";
  if (payload.type === "income" && category === "Gaji") {
    const month = dateNow().slice(0, 7);

    // Simpan total_expense lama
    const budgetings = await getBudgetingByUser(user);
    const oldExpenses: Record<number, number> = {};
    for (const b of budgetings) {
      const monthlyExpense = await getMonthlyExpense(user, month, Number(b.id));
      oldExpenses[Number(b.id)] = Number(monthlyExpense[0]?.total_expense ?? 0);
    }

    // Hapus & buat ulang allocations
    await deleteMonthlyAllocationsByMonthAndUser(month, user);
    await createMonthlyAllocationsForSalary(payload.amount, user);

    // Restore total_expense lama
    for (const b of budgetings) {
      await updateMonthlyExpense(user, month, Number(b.id), oldExpenses[Number(b.id)]);
    }
  }
};

// Update total_expense (+ atau -)
const updateMonthlyAllocationExpense = async (
  user: string,
  month: string,
  categoryId: number,
  amount: number
) => {
  const category = await findCategoryById(Number(categoryId));
  const budgetId = category[0].budget_id;

  const monthlyExpense = await getMonthlyExpense(user, month, budgetId);
  const totalExpense = Number(monthlyExpense[0]?.total_expense ?? 0) + amount;

  await updateMonthlyExpense(user, month, budgetId, totalExpense);
};
