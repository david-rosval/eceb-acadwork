"use client";

import type React from "react";

import {
  Code,
  Palette,
  Megaphone,
  Video,
  PenTool,
  Music,
  Briefcase,
  TrendingUp,
  Star,
  Filter,
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
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const categories = [
  { title: "Programming & Tech", icon: Code, count: 1234 },
  { title: "Graphics & Design", icon: Palette, count: 2156 },
  { title: "Digital Marketing", icon: Megaphone, count: 987 },
  { title: "Video & Animation", icon: Video, count: 654 },
  { title: "Writing & Translation", icon: PenTool, count: 1876 },
  { title: "Music & Audio", icon: Music, count: 432 },
  { title: "Business", icon: Briefcase, count: 765 },
  { title: "Data", icon: TrendingUp, count: 543 },
];

const serviceTypes = ["Basic", "Standard", "Premium"];

const deliveryTimes = ["24 hours", "3 days", "7 days", "14 days", "30 days"];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Filter className="h-4 w-4" />
          <span className="font-semibold">Filters</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
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

        {/* Price Range */}
        <SidebarGroup>
          <SidebarGroupLabel>Price Range</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-4">
              <Slider
                defaultValue={[5, 500]}
                max={1000}
                min={5}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$5</span>
                <span>$1000+</span>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Service Type */}
        <SidebarGroup>
          <SidebarGroupLabel>Service Type</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-2">
              {serviceTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={type} />
                  <label htmlFor={type} className="text-sm font-medium">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Delivery Time */}
        <SidebarGroup>
          <SidebarGroupLabel>Delivery Time</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-2">
              {deliveryTimes.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox id={time} />
                  <label htmlFor={time} className="text-sm font-medium">
                    {time}
                  </label>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Seller Level */}
        <SidebarGroup>
          <SidebarGroupLabel>Seller Level</SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="top-rated" />
                <label
                  htmlFor="top-rated"
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  Top Rated Seller
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="level-2" />
                <label htmlFor="level-2" className="text-sm font-medium">
                  Level 2 Seller
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="level-1" />
                <label htmlFor="level-1" className="text-sm font-medium">
                  Level 1 Seller
                </label>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
