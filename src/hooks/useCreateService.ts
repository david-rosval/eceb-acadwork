import { useMutation } from "@tanstack/react-query";

interface NewServiceData {
  title: string;
  description: string;
  price: number;
  categoryId: number;
}

export function useCreateService() {
  return useMutation({
    mutationFn: async (data: NewServiceData) => {
      const res = await fetch("/api/student-services/new", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al crear servicio");
      }

      return res.json();
    },
  });
}
