// src/hooks/useServices.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export interface UseServicesParams {
  sort?: "price" | "rating" | "createdAt";
  sortDirection?: "asc" | "desc";
  categoryId?: number;
  major?: string;
  page?: number;
  limit?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  image: string | null;
  price: number;
  rating: number;
  reviewCount: number;
  seller: {
    name: string;
    rating: number;
    avatar: string;
  };
}

interface ServiceResponse {
  services: ServiceItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function useServices(params?: UseServicesParams) {
  return useQuery<ServiceResponse>({
    queryKey: ["services", params],
    queryFn: async () => {
      const response = await axiosClient.get("/api/student-services", {
        params,
      });
      return response.data;
    },
    placeholderData: (prevData) => prevData
  });
}
