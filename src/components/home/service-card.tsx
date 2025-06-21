"use client";

import Image from "next/image";
import { Star, Heart } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  id: string;
  title: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
}

export function ServiceCard({
  title,
  seller,
  image,
  price,
  rating,
  reviewCount,
  isFavorite = false,
}: ServiceCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={200}
          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Image
            src={seller.avatar || "/placeholder.svg"}
            alt={seller.name}
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="text-sm font-medium">{seller.name}</span>
          <div className="flex items-center gap-1 ml-auto">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {seller.rating.toFixed(2)}
            </span>
          </div>
        </div>

        <h3 className="font-medium line-clamp-2 mb-4 group-hover:text-blue-800">
          {title}
        </h3>

        <div className="flex items-center gap-1 mb-4">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-muted-foreground">Desde</span>
          <span className="text-lg font-bold">S/.{price}</span>
        </div>
      </CardContent>
    </Card>
  );
}
