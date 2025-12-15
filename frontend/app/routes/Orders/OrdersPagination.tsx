import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../src/store/store";
import { setCurrentPage } from "../../../src/store/orderSlice";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "~/components/ui/pagination";

export default function OrdersPagination({ totalPages }: { totalPages: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPage } = useSelector((state: RootState) => state.orders);

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-6 flex justify-center">
      <PaginationPrevious onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))} />
      <PaginationContent>
        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i + 1}
              onClick={() => dispatch(setCurrentPage(i + 1))}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
      <PaginationNext onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))} />
    </Pagination>
  );
}
