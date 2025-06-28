import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

export interface ReviewItem {
  id: string;
  score: number;
  comment?: string;
  date: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

export interface ReviewsResponse {
  reviews: ReviewItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

interface UseServiceReviewsParams {
  serviceId: string;
  page?: number;
  limit?: number;
}

export function useServiceReviews({ serviceId, page = 1, limit = 5 }: UseServiceReviewsParams) {
  return useQuery<ReviewsResponse>({
    queryKey: ["serviceReviews", serviceId, page, limit],
    queryFn: async () => {
      const response = await axiosClient.get(`/api/student-services/${serviceId}/service-reviews`, {
        params: { page, limit },
      });
      console.log("Service reviews response:", response.data);
      return response.data;
    },
    enabled: !!serviceId, // solo se ejecuta si hay serviceId
    placeholderData: (prevData) => prevData
  });
}
