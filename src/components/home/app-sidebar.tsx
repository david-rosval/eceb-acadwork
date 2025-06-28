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
import { useCategories } from "@/hooks/useCategories";

const categoryIcons = [
  { title: "Programación", icon: Code },
  { title: "Diseño Gráfico", icon: Palette },
  { title: "Cálculo", icon: Calculator },
  { title: "Física", icon: Orbit  },
  { title: "Química", icon: FlaskConical  },
  { title: "Estadística", icon: ChartNoAxesCombined  },
  { title: "IoT", icon: CircuitBoard  },
  { title: "Dibujo técnico", icon: Ruler },
];

const careers = [
  "Administración de Empresas",
  "Ing. Ambiental",
  "Ing. de Sistemas",
  "Ing. Electrónica y Telecomunicaciones",
  "Ing. Mecánica y Eléctrica",
];

const ratings = [5, 4, 3, 2, 1];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onCategorySelect: (category: number | undefined) => void;
  onMajorSelect: (major: string | undefined) => void;
}

export function AppSidebar({ onCategorySelect, onMajorSelect, ...props }: AppSidebarProps) {
  const { data: categories, isLoading, isError } = useCategories();
  

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
              {isLoading ? (
                <SidebarMenuItem>
                  Cargando categorías...
                </SidebarMenuItem>
              ) : isError ? (
                <SidebarMenuItem>
                  Error al cargar categorías...
                </SidebarMenuItem>
              ) : (
                categories?.map((category) => {
                  const IconComponent = categoryIcons.find((icon) => icon.title === category.name)?.icon;
                  return (
                    <SidebarMenuItem key={category.name}>
                      <SidebarMenuButton onClick={() => onCategorySelect(category.id)}>
                        {IconComponent ? (
                          <IconComponent className="h-4 w-4 mr-2" />
                        ) : (
                          <Star className="h-4 w-4 mr-2" />
                        )}
                        <span className="flex-1">{category.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({category.serviceCount})
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
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
                  <Checkbox id={career} onCheckedChange={(checked) => onMajorSelect(checked ? career : undefined)} />
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
