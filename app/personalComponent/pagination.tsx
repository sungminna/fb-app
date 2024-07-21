'use client'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import { max } from "date-fns";
import { create } from "domain";
import { useParams, usePathname, useSearchParams } from "next/navigation"
  
  export function MyPagination({ params }: {params: {count: number, next: string, previous: string, page_size:number, currentPage: number}}) {
    
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createQueryString = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, value);
        return params.toString();
    };

    const totalPages = Math.ceil(params.count / params.page_size)
    
    const renderPageNumbers = () => {
        let pages = [];
        const maxVisiblePages = 5;
        if(totalPages <= maxVisiblePages){
            for(let i = 1; i <= totalPages; i++){
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                        href={`${pathname}?${createQueryString('page', i.toString())}`}
                        isActive={i === params.currentPage}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }
        return pages;
    }
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
                href={params.previous ? `${pathname}?${createQueryString('page', (params.currentPage - 1).toString())}`: '#'}
                className={!params.previous ? 'pointer-events-none opacity-50': ''}
            />
          </PaginationItem>
          
            {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext 
                href={params.next ? `${pathname}?${createQueryString('page', (params.currentPage + 1).toString())}`: '#'}
                className={!params.next ? 'pointer-events-none opacity-50': ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }
  