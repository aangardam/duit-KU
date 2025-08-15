import useDeleteBudgeting from "@/app/(features)/(root)/master/budgeting/hooks/use-delete-budgeting";
import useDeleteCategory from "@/app/(features)/(root)/master/category/hooks/use-delete-category";
import useDeleteWallets from "@/app/(features)/(root)/master/wallets/hooks/use-delete-wallets";
import useDeleteTransaction from "@/app/(features)/(root)/transactions/hooks/use-delete-transactions";


export function useDeleteByMenuType(type: string) {
  const deleteWallet = useDeleteWallets();
  const deleteBudgeting = useDeleteBudgeting();
  const deleteCategory = useDeleteCategory();
  const deleteTransaction = useDeleteTransaction();
  
  switch (type) {
    case "wallet":
      return deleteWallet.mutateDeleteWallet;
    case "budgeting":
      return deleteBudgeting.mutateDeletBudgeting;
    case "category":
      return deleteCategory.mutateDeleteCategory;
    case "transaction":
      return deleteTransaction.mutateDeleteTransaction;
    default:
      return undefined;
  }
}
