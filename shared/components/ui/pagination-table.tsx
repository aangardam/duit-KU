/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '../ui/button';
// import { PaginationEllipsis } from '../ui/pagination';

export const PaginationTable = ({ tableLib }: any) => {
    const visiblePageNumbers = 3; // You can adjust the number of visible page numbers

    const getPageNumbers = () => {
        const currentPage = tableLib.getState().pagination?.pageIndex + 1;
        const pageCount = tableLib.getPageCount();
        const startPage = Math.max(
            1,
            currentPage - Math.floor(visiblePageNumbers / 2),
        );
        const endPage = Math.min(pageCount, startPage + visiblePageNumbers - 1);

        return Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => startPage + index,
        );
    };

    return (
        <footer className="pagination flex">
            <Button
                variant="ghost"
                size="sm"
                disabled={!tableLib.getCanPreviousPage()}
                onClick={() => tableLib.setPageIndex(0)}
            >
                {'<<'}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                disabled={!tableLib.getCanPreviousPage()}
                onClick={tableLib.previousPage}
            >
                {'<'}
            </Button>
            {getPageNumbers().map((number) => (
                <Button
                    variant={'ghost'}
                    key={number}
                    onClick={() => tableLib.setPageIndex(number - 1)}
                    isActive={
                        number === tableLib.getState().pagination?.pageIndex + 1
                    }
                >
                    {number}
                </Button>
            ))}

            <Button
                variant="ghost"
                size="sm"
                disabled={!tableLib.getCanNextPage()}
                onClick={tableLib.nextPage}
            >
                {'>'}
            </Button>
            <Button
                variant="ghost"
                size="sm"
                disabled={!tableLib.getCanNextPage()}
                onClick={() =>
                    tableLib.setPageIndex(tableLib.getPageCount() - 1)
                }
            >
                {'>>'}
            </Button>
        </footer>
    );
};
