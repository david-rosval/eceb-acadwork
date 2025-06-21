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
import { Grid, List } from "lucide-react";

// Sample data
const services = [
  {
    id: "service-1",
    title:
      "I will develop a responsive web application using React and Node.js",
    seller: {
      name: "Alex Johnson",
      avatar: "https://picsum.photos/seed/alex/40/40",
      rating: 4.95,
    },
    image: "https://picsum.photos/seed/web1/300/200",
    price: 150,
    rating: 4.89,
    reviewCount: 247,
    isFavorite: false,
  },
  {
    id: "service-2",
    title: "I will create a professional logo design for your brand",
    seller: {
      name: "Maria Garcia",
      avatar: "https://picsum.photos/seed/maria/40/40",
      rating: 4.87,
    },
    image: "https://picsum.photos/seed/logo1/300/200",
    price: 75,
    rating: 4.92,
    reviewCount: 189,
    isFavorite: true,
  },
  {
    id: "service-3",
    title: "I will write engaging content for your website or blog",
    seller: {
      name: "David Chen",
      avatar: "https://picsum.photos/seed/david/40/40",
      rating: 4.78,
    },
    image: "https://picsum.photos/seed/writing1/300/200",
    price: 45,
    rating: 4.76,
    reviewCount: 156,
    isFavorite: false,
  },
  {
    id: "service-4",
    title: "I will edit your video with professional transitions and effects",
    seller: {
      name: "Sarah Wilson",
      avatar: "https://picsum.photos/seed/sarah/40/40",
      rating: 4.91,
    },
    image: "https://picsum.photos/seed/video1/300/200",
    price: 120,
    rating: 4.85,
    reviewCount: 203,
    isFavorite: false,
  },
  {
    id: "service-5",
    title:
      "I will optimize your website for search engines and improve rankings",
    seller: {
      name: "Michael Brown",
      avatar: "https://picsum.photos/seed/michael/40/40",
      rating: 4.83,
    },
    image: "https://picsum.photos/seed/seo1/300/200",
    price: 200,
    rating: 4.79,
    reviewCount: 134,
    isFavorite: true,
  },
  {
    id: "service-6",
    title: "I will develop a mobile app for iOS and Android platforms",
    seller: {
      name: "Jennifer Lee",
      avatar: "https://picsum.photos/seed/jennifer/40/40",
      rating: 4.96,
    },
    image: "https://picsum.photos/seed/mobile1/300/200",
    price: 350,
    rating: 4.94,
    reviewCount: 89,
    isFavorite: false,
  },
  {
    id: "service-7",
    title: "I will create stunning graphics and illustrations for your project",
    seller: {
      name: "Robert Taylor",
      avatar: "https://picsum.photos/seed/robert/40/40",
      rating: 4.72,
    },
    image: "https://picsum.photos/seed/graphics1/300/200",
    price: 85,
    rating: 4.68,
    reviewCount: 167,
    isFavorite: false,
  },
  {
    id: "service-8",
    title: "I will provide data analysis and visualization services",
    seller: {
      name: "Lisa Anderson",
      avatar: "https://picsum.photos/seed/lisa/40/40",
      rating: 4.89,
    },
    image: "https://picsum.photos/seed/data1/300/200",
    price: 180,
    rating: 4.87,
    reviewCount: 112,
    isFavorite: true,
  },
  {
    id: "service-9",
    title: "I will compose original music for your video or podcast",
    seller: {
      name: "James Miller",
      avatar: "https://picsum.photos/seed/james/40/40",
      rating: 4.81,
    },
    image: "https://picsum.photos/seed/music1/300/200",
    price: 95,
    rating: 4.73,
    reviewCount: 145,
    isFavorite: false,
  },
  {
    id: "service-10",
    title:
      "I will translate documents between English and Spanish professionally",
    seller: {
      name: "Carmen Rodriguez",
      avatar: "https://picsum.photos/seed/carmen/40/40",
      rating: 4.93,
    },
    image: "https://picsum.photos/seed/translate1/300/200",
    price: 35,
    rating: 4.91,
    reviewCount: 278,
    isFavorite: false,
  },
  {
    id: "service-11",
    title: "I will create a comprehensive business plan for your startup",
    seller: {
      name: "Thomas Davis",
      avatar: "https://picsum.photos/seed/thomas/40/40",
      rating: 4.76,
    },
    image: "https://picsum.photos/seed/business1/300/200",
    price: 250,
    rating: 4.82,
    reviewCount: 67,
    isFavorite: true,
  },
  {
    id: "service-12",
    title: "I will design and develop a custom WordPress theme",
    seller: {
      name: "Emily White",
      avatar: "https://picsum.photos/seed/emily/40/40",
      rating: 4.88,
    },
    image: "https://picsum.photos/seed/wordpress1/300/200",
    price: 175,
    rating: 4.86,
    reviewCount: 198,
    isFavorite: false,
  },
  {
    id: "service-13",
    title: "I will provide virtual assistant services for your business needs",
    seller: {
      name: "Kevin Martinez",
      avatar: "https://picsum.photos/seed/kevin/40/40",
      rating: 4.74,
    },
    image: "https://picsum.photos/seed/assistant1/300/200",
    price: 25,
    rating: 4.71,
    reviewCount: 234,
    isFavorite: false,
  },
  {
    id: "service-14",
    title: "I will create animated explainer videos for your product",
    seller: {
      name: "Rachel Green",
      avatar: "https://picsum.photos/seed/rachel/40/40",
      rating: 4.92,
    },
    image: "https://picsum.photos/seed/animation1/300/200",
    price: 140,
    rating: 4.88,
    reviewCount: 156,
    isFavorite: true,
  },
  {
    id: "service-15",
    title: "I will audit your website security and provide recommendations",
    seller: {
      name: "Daniel Kim",
      avatar: "https://picsum.photos/seed/daniel/40/40",
      rating: 4.85,
    },
    image: "https://picsum.photos/seed/security1/300/200",
    price: 300,
    rating: 4.83,
    reviewCount: 78,
    isFavorite: false,
  },
  {
    id: "service-16",
    title: "I will design user interfaces and user experience for mobile apps",
    seller: {
      name: "Sophie Turner",
      avatar: "https://picsum.photos/seed/sophie/40/40",
      rating: 4.9,
    },
    image: "https://picsum.photos/seed/uiux1/300/200",
    price: 220,
    rating: 4.92,
    reviewCount: 143,
    isFavorite: false,
  },
  {
    id: "service-17",
    title: "I will provide social media marketing and management services",
    seller: {
      name: "Mark Thompson",
      avatar: "https://picsum.photos/seed/mark/40/40",
      rating: 4.77,
    },
    image: "https://picsum.photos/seed/social1/300/200",
    price: 80,
    rating: 4.75,
    reviewCount: 189,
    isFavorite: true,
  },
  {
    id: "service-18",
    title: "I will create professional product photography for e-commerce",
    seller: {
      name: "Anna Johnson",
      avatar: "https://picsum.photos/seed/anna/40/40",
      rating: 4.94,
    },
    image: "https://picsum.photos/seed/photo1/300/200",
    price: 110,
    rating: 4.89,
    reviewCount: 167,
    isFavorite: false,
  },
  {
    id: "service-19",
    title: "I will write and optimize press releases for media distribution",
    seller: {
      name: "Chris Wilson",
      avatar: "https://picsum.photos/seed/chris/40/40",
      rating: 4.82,
    },
    image: "https://picsum.photos/seed/press1/300/200",
    price: 65,
    rating: 4.78,
    reviewCount: 123,
    isFavorite: false,
  },
  {
    id: "service-20",
    title: "I will provide legal consultation for small business matters",
    seller: {
      name: "Victoria Adams",
      avatar: "https://picsum.photos/seed/victoria/40/40",
      rating: 4.97,
    },
    image: "https://picsum.photos/seed/legal1/300/200",
    price: 400,
    rating: 4.95,
    reviewCount: 45,
    isFavorite: true,
  },
  {
    id: "service-21",
    title: "I will create custom illustrations and character designs",
    seller: {
      name: "Lucas Brown",
      avatar: "https://picsum.photos/seed/lucas/40/40",
      rating: 4.86,
    },
    image: "https://picsum.photos/seed/illustration1/300/200",
    price: 90,
    rating: 4.84,
    reviewCount: 178,
    isFavorite: false,
  },
  {
    id: "service-22",
    title: "I will develop custom software solutions for your business",
    seller: {
      name: "Isabella Garcia",
      avatar: "https://picsum.photos/seed/isabella/40/40",
      rating: 4.91,
    },
    image: "https://picsum.photos/seed/software1/300/200",
    price: 500,
    rating: 4.93,
    reviewCount: 67,
    isFavorite: false,
  },
  {
    id: "service-23",
    title: "I will provide financial planning and investment advice",
    seller: {
      name: "William Davis",
      avatar: "https://picsum.photos/seed/william/40/40",
      rating: 4.79,
    },
    image: "https://picsum.photos/seed/finance1/300/200",
    price: 275,
    rating: 4.81,
    reviewCount: 89,
    isFavorite: true,
  },
  {
    id: "service-24",
    title: "I will create engaging podcast content and audio editing",
    seller: {
      name: "Olivia Martinez",
      avatar: "https://picsum.photos/seed/olivia/40/40",
      rating: 4.88,
    },
    image: "https://picsum.photos/seed/podcast1/300/200",
    price: 125,
    rating: 4.85,
    reviewCount: 134,
    isFavorite: false,
  },
];

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const servicesPerPage = 12;
  const totalPages = Math.ceil(services.length / servicesPerPage);

  const currentServices = services.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Topbar />

          <main className="flex-1">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12">
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
                    <Select defaultValue="recommended">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">Recomendado</SelectItem>
                        <SelectItem value="newest">Nuevo</SelectItem>
                        <SelectItem value="price-low">
                          Precio: Bajo a Alto
                        </SelectItem>
                        <SelectItem value="price-high">
                          Precio: Alto a Bajo
                        </SelectItem>
                        <SelectItem value="rating">
                          Mejor Calificados
                        </SelectItem>
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
                {currentServices.map((service) => (
                  <ServiceCard key={service.id} {...service} />
                ))}
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
