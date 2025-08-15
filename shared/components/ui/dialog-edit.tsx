import { Button } from "@/shared/components/ui/button"
import { FaEdit } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { ReactElement, useState, cloneElement, isValidElement } from "react";
import { DialogSize, getDialogSizeClass } from "@/shared/lib/utils";


interface formDialogProps {
  children: ReactElement<{ onClose?: () => void }>;
  title?: string;
  size?: DialogSize;
}

const DialogEdit = ({ children, title, size } : formDialogProps) => {
  const [open, setOpen] = useState(false);
  const childrenWithOnClose = isValidElement(children)
    ? cloneElement(children, { onClose: () => setOpen(false) })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outlinePrimary">
                <FaEdit />
            </Button>
            
        </DialogTrigger>
        <DialogContent className={`p-4 max-h-[97vh] ${getDialogSizeClass(size)}`}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="text-sm">View/Update {title}. Click save when you are done.</DialogDescription>
            </DialogHeader>
            {childrenWithOnClose}
        
        </DialogContent>
    </Dialog>
  )
}

export default DialogEdit