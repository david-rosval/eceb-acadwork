import { prisma } from "@/lib/prisma";
import { formattedUserName } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma"; 

type SortOption = "newest" | "price-low" | "price-high" | "rating";
type SortDirection = "asc" | "desc";

interface ServiceFilters {
  sort?: SortOption;
  sortDirection?: SortDirection;
  categoryId?: number;
  major?: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const skip = (page - 1) * limit;

  const filters: ServiceFilters = {
    sort: searchParams.get("sort") as SortOption,
    sortDirection: searchParams.get("sortDirection") as SortDirection,
    categoryId: searchParams.get("categoryId") ? parseInt(searchParams.get("categoryId")!) : undefined,
    major: searchParams.get("major") || undefined,
  };

  try {
    const whereClause: Prisma.ServiceWhereInput = {
      status: "active",
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.major && {
        user: {
          major: filters.major,
        },
      }),
    };

    const orderByClause: Prisma.ServiceOrderByWithRelationInput = (() => {
      switch (filters.sort) {
        case "price-low":
          return { price: "asc" };
        case "price-high":
          return { price: "desc" };
        case "rating":
          return { rating: filters.sortDirection || "desc" };
        case "newest":
        default:
          return { createdAt: filters.sortDirection || "desc" };
      }
    })();

    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              rating: true,
              major: true,
            },
          },
          transactions: {
            select: {
              reviews: {
                select: {
                  score: true,
                },
              },
            },
          },
        },
      }),
      prisma.service.count({ where: whereClause }),
    ]);

    const formatted = services.map((service) => {
      const allScores = service.transactions.flatMap((t) =>
        t.reviews.map((r) => r.score)
      );
      const averageRating =
        allScores.length > 0
          ? parseFloat(
              (
                allScores.reduce((acc, score) => acc + score, 0) /
                allScores.length
              ).toFixed(2)
            )
          : 0;

      return {
        id: service.id,
        title: service.title,
        image: service.imageUrl,
        price: parseFloat(service.price.toString()),
        rating: averageRating,
        reviewCount: allScores.length,
        seller: {
          name: `${service.user.firstName} ${service.user.lastName}`,
          rating: parseFloat(service.user.rating.toString()),
          avatar: `https://ui-avatars.com/api/?name=${formattedUserName(
            service.user.firstName,
            service.user.lastName
          )}`,
        },
      };
    });

    return NextResponse.json({
      services: formatted,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("[SERVICES_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener los servicios" },
      { status: 500 }
    );
  }
}
