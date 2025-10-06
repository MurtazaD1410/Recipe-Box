import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    pagination: {
        current_page: number;
        last_page: number;
        links: PaginationLink[];
        prev_page_url: string | null;
        next_page_url: string | null;
        from: number;
        to: number;
        total: number;
    };
}

export default function Pagination({ pagination }: Props) {
    const { links, current_page, last_page } = pagination;

    // Don't show pagination if only 1 page
    if (last_page <= 1) {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                {pagination.prev_page_url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={pagination.prev_page_url} preserveScroll>
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Previous
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Previous
                    </Button>
                )}

                {/* Page Numbers */}
                <div className="hidden gap-1 sm:flex">
                    {links?.slice(1, -1).map((link, index) => {
                        // Handle ellipsis
                        if (link.label === '...') {
                            return (
                                <span key={index} className="px-3 py-2 text-sm">
                                    ...
                                </span>
                            );
                        }

                        return link.url ? (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                asChild
                            >
                                <Link href={link.url} preserveScroll>
                                    {link.label}
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                disabled
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                </div>

                {/* Mobile: Show current page */}
                <div className="sm:hidden">
                    <span className="text-sm">
                        Page {current_page} of {last_page}
                    </span>
                </div>

                {/* Next Button */}
                {pagination.next_page_url ? (
                    <Button variant="outline" size="sm" asChild>
                        <Link href={pagination.next_page_url} preserveScroll>
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                ) : (
                    <Button variant="outline" size="sm" disabled>
                        Next
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Results info */}
            <div className="mt-4 text-center text-sm text-gray-600">
                Showing {pagination.from} to {pagination.to} of{' '}
                {pagination.total} recipes
            </div>
        </div>
    );
}
