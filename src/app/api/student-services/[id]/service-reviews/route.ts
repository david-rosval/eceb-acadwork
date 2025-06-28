import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params; // ✅ mover esto dentro del try

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "3");
    const skip = (page - 1) * limit;

    const service = await prisma.service.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

    const ratedUserId = service.userId;

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { ratedUserId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          score: true,
          comment: true,
          createdAt: true,
          transaction: {
            select: {
              requester: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
      prisma.review.count({
        where: { ratedUserId },
      }),
    ]);

    const formatted = reviews.map((review) => {
      const user = review.transaction.requester;
      return {
        id: review.id,
        rating: review.score,
        comment: review.comment,
        date: review.createdAt.toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        user: {
          name: `${user.firstName} ${user.lastName}`,
          avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`,
        },
      };
    });

    return NextResponse.json({
      reviews: formatted,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error("[REVIEWS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener reseñas del servicio" },
      { status: 500 }
    );
  }
}
