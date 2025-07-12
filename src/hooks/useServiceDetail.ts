// src/hooks/useServiceDetail.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";

interface SellerInfo {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  memberSince: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  seller: SellerInfo;
}


export function useServiceDetail(id: string | undefined) {
  return useQuery<ServiceDetail>({
    queryKey: ["service-detail", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/api/student-services/${id}`);
      console.log("Service detail response:", res.data);
      return res.data;
    },
    enabled: !!id,
  });
}
