import { Button } from "@/shared/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { ReactElement, useState, cloneElement, isValidElement } from "react";
import { Search } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import { DialogSize, getDialogSizeClass } from "@/shared/lib/utils";


interface formDialogProps {
  children: ReactElement<{ onClose?: () => void }>;
  size?: DialogSize;
  title?: string;
  description?: string;
}

const DialogView = ({ children, size, title, description }: formDialogProps) => {
  const [open, setOpen] = useState(false);
  if (!children) return null;
  const childrenWithOnClose = isValidElement(children)
    ? cloneElement(children, { onClose: () => setOpen(false) })
    : children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outlinePrimary">
              <Search className="mr-1 w-4 h-4" />
              View
            </Button>
            
        </DialogTrigger>
        <DialogContent className={`p-4 max-h-[97vh] ${getDialogSizeClass(size)}`}>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription className="text-sm">{description}</DialogDescription>
                <Separator className="my-1 h-px bg-gray-200" />
            </DialogHeader>
            {childrenWithOnClose}
        
        </DialogContent>
    </Dialog>
  )
}

export default DialogView