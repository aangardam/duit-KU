

import { Button } from "./button";
import DialogEdit from "./dialog-edit";
import { Search } from "lucide-react";
import DialogView from "./dialog-view";
import Link from "next/link";
import { DialogSize } from "@/shared/lib/utils";
import { useDeleteByMenuType } from "@/shared/hooks/use-delete-by-type";
import { AlertDialogDelete } from "./alert-dialog-delete";


interface HasId {
  id: string | number;
}

interface FormDialogGlobalProps<T> {
  title?: string
  row: T
  formComponent?: React.ComponentType<{ data: T }>
  description?: string

  // view
  actionView?: boolean;
  isPopUp?: boolean;
  link?: string;
  dialogSizeView?: DialogSize;

  // update
  actionUpdate?: boolean;
  dialogSizeUpdate?: DialogSize;

  // delete
  actionDelete?: boolean;
  params?: string;
  deleteActionType?:string;
 
}
  
export function CellAction<T extends HasId>(props: FormDialogGlobalProps<T>) {
  const {
    title = "Form",
    row,
    formComponent: FormComponent,
    description,
    actionView = false,
    isPopUp = true,
    link = '',
    dialogSizeView = 'md',
    actionUpdate = true,
    dialogSizeUpdate = 'md',
    actionDelete = true,
    params = '',
    deleteActionType,
  } = props;

 
  const mutateDelete = useDeleteByMenuType(deleteActionType ?? "");
 
  const handleDelete = () => {
    console.log("delete", row?.id)
    if (mutateDelete) {
      mutateDelete({ id: Number(row?.id) });
    } else {
      console.warn("Delete handler not found for", deleteActionType);
    }
  }

  return (
    <div className="flex">
      {actionView  && (
        isPopUp && FormComponent ? (
          <DialogView 
            size={dialogSizeView}
            title={title}
            description={description}
          >
            {FormComponent && <FormComponent data={row} />}
          </DialogView>
        ) : (
         <Link href={link}>
          <Button variant="outlinePrimary">
            <Search className="mr-1 w-4 h-4" />
            View
          </Button>
        </Link>
        )
      )}

      {actionUpdate && FormComponent && (
        <DialogEdit title={title} size={dialogSizeUpdate}>
          <FormComponent data={row} />
        </DialogEdit>
      )}
      {actionDelete && (
          <AlertDialogDelete  
            onAction={handleDelete}
            title={title}
            params={params}
          />
      )}
      
    </div>
  )
}
  