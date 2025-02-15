export interface PaginatedResponse<T> {
  // The array of items for the current page
  items: T[];
  
  // Total number of items across all pages
  totalCount: number;
  
  // Current page number (1-based)
  pageNumber: number;
  
  // Total number of pages available
  totalPages: number;
  
  // Number of items per page
  pageSize: number;
  
  // Optional: Whether there are more pages available
  hasNextPage?: boolean;
  
  // Optional: Whether there are previous pages
  hasPreviousPage?: boolean;
} 