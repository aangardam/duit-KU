import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/shared/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
  
  interface CrudDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children: React.ReactNode;
  }
  
  export default function DialogAdd({
    open,
    onOpenChange,
    title = "Tambah Data",
    children,
  }: CrudDialogProps) {
    return (
      <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
      >
        <DialogContent
          className="lg:w-3/4  p-4 max-h-[97vh]"
          onPointerDownOutside={(e) => {
            // Mencegah penutupan jika klik pada kalender
            if ((e.target as Element)?.closest('.rmdp-container')) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-sm">Add new data {title}</DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  