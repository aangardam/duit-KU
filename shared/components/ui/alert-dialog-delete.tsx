import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@radix-ui/react-separator';
import { BsTrash, BsXLg } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';

interface AlertDialogDelete {
    onAction?: () => void;
    title?:string;
    params?:string;
}

export function AlertDialogDelete(props:AlertDialogDelete) {
    const { 
        onAction,
        title = "Are you absolutely sure?",
        params=""
    } = props;
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outlineDanger">
                    <FaTrashAlt />{' '}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <span className='text-xl fonr-bold'> {title} </span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm mt-1">
                        Delete <span className="text-primary underline font-medium">{params}</span> ?
                    </AlertDialogDescription>
                    
                </AlertDialogHeader>
                
                <Separator className="my-1 h-px bg-gray-200" />

                <div className="flex gap-4 my-6 items-start mt-1">
                    <div className="w-12 h-12 border rounded-full flex items-center justify-center text-xl font-bold">?</div>
                    <div className="text-sm space-y-1">
                        <p>Selected {title} <b>{params}</b> will be deleted</p>
                        <p className="text-red-600 text-xs font-medium">
                            Are you sure you want to delete this item?
                        </p>
                    </div>
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        variant="outline"
                    >
                        <BsXLg className="mr-2" />
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        variant="destructive"
                        onClick={onAction}
                    >
                        <BsTrash className="mr-2" />
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
