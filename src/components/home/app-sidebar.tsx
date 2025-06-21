"use client";

import type React from "react";

import {
  Code,
  Palette,
  Star,
  Filter,
  Calculator,
  Orbit,
  FlaskConical,
  ChartNoAxesCombined,
  CircuitBoard,
  Ruler,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const categories = [
  { title: "Programación", icon: Code, count: 1234 },
  { title: "Diseño Gráfico", icon: Palette, count: 2156 },
  { title: "Cálculo", icon: Calculator, count: 987 },
  { title: "Física", icon: Orbit, count: 654 },
  { title: "Química", icon: FlaskConical, count: 1876 },
  { title: "Estadística", icon: ChartNoAxesCombined, count: 543 },
  { title: "IoT", icon: CircuitBoard, count: 765 },
  { title: "Dibujo técnico", icon: Ruler, count: 543 },
];

const careers = [
  "Ing. Sistemas",
  "Ing. Mecánica & Eléctrica",
  "Ing. Ambiental",
  "Ing. Electrónica & Telecomunicaciones",
  "Administración",
];

const ratings = [5, 4, 3, 2, 1];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">Filtros</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categorías</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((category) => (
                <SidebarMenuItem key={category.title}>
                  <SidebarMenuButton>
                    <category.icon className="h-4 w-4" />
                    <span className="flex-1">{category.title}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category.count})
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Career */}
        <SidebarGroup>
          <SidebarGroupLabel>Carreras</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-2">
              {careers.map((career) => (
                <div key={career} className="flex items-center space-x-2">
                  <Checkbox id={career} />
                  <label htmlFor={career} className="text-sm font-medium">
                    {career}
                  </label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Rating */}
        <SidebarGroup>
          <SidebarGroupLabel>Calificaciones</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox id={`rating-${rating}`} />
                  <label
                    htmlFor={`rating-${rating}`}
                    className="text-sm font-medium flex items-center gap-1"
                  >
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span>a más</span>
                  </label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
