"use client";

import { useState } from "react";

import { Topbar } from "@/components/home/topbar";
import { AppSidebar } from "@/components/home/app-sidebar";
import { ServiceCard } from "@/components/home/service-card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BrushCleaning, Grid, List } from "lucide-react";
import { useServices } from "@/hooks/useService";

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"price" | "rating" | "createdAt" | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [major, setMajor] = useState<string | undefined>();

  const { data, isLoading, isError } = useServices({
    page: currentPage,
    limit: 12,
    sort,
    sortDirection,
    categoryId,
    major
  });

  const services = data?.services || [];
  const totalPages = data?.totalPages || 1;

  const handleSortChange = (value: string) => {
    switch (value) {
      case "recommended":
      case "newest":
        setSort("createdAt");
        setSortDirection("desc");
        break;
      case "price-low":
        setSort("price");
        setSortDirection("asc");
        break;
      case "price-high":
        setSort("price");
        setSortDirection("desc");
        break;
      case "rating":
        setSort("rating");
        setSortDirection("desc");
        break;
      default:
        setSort(undefined);
        setSortDirection(undefined);
    }

    setCurrentPage(1); // Reiniciar paginación al cambiar orden
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar
          onCategorySelect={(value) => {
            setCategoryId(value);
            setCurrentPage(1);
          }}
          onMajorSelect={(value) => {
            setMajor(value);
            setCurrentPage(1);
          }}
        />
        <SidebarInset className="flex-1">
          <Topbar />

          <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-12">
              <div className="container px-4">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Encuentra y comparte tus habilidades entre tus compañeros
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    En AcadWork, la comunidad universitaria se conecta para{" "}
                    ofrecer y contratar servicios freelance: tutorías, tareas,{" "}
                    proyectos y más.
                  </p>
                </div>
              </div>
            </section>

            {/* Filters and Controls */}
            <section className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="lg:hidden" />
                    <span className="text-sm text-muted-foreground">
                      {services.length} Servicios disponibles
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCategoryId(undefined);
                        setMajor(undefined);
                      }}
                    >
                      Limpiar filtros
                      <BrushCleaning />
                    </Button>
                    <Select defaultValue="recommended" onValueChange={handleSortChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recomendado</SelectItem>
                        <SelectItem value="newest">Nuevo</SelectItem>
                        <SelectItem value="price-low">Precio: Bajo a Alto</SelectItem>
                        <SelectItem value="price-high">Precio: Alto a Bajo</SelectItem>
                        <SelectItem value="rating">Mejor Calificados</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-r-none"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Services Grid */}
            <section className="container px-4 py-8">
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-[repeat(auto-fill,minmax(300px,1fr))]"
                    : "grid-cols-1"
                }`}
              >
                {isLoading ? (
                  <p className="text-center text-muted-foreground">Cargando servicios...</p>
                ) : isError ? (
                  <p className="text-center text-red-500">Error al cargar servicios</p>
                ) : services.length === 0 ? (
                  <p className="text-center text-muted-foreground">No hay servicios disponibles</p>
                ) : (
                  services.map((service) => (
                    <ServiceCard key={service.id} {...service} />
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {totalPages > 5 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </section>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
