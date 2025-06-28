import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function GET(_: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const service = await prisma.service.findUnique({
      where: {
        id: id,
        status: "active",
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            rating: true,
            createdAt: true,
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
    });

    if (!service) {
      return NextResponse.json(
        { error: "Servicio no encontrado" },
        { status: 404 }
      );
    }

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

    return NextResponse.json({
      id: service.id,
      title: service.title,
      description: service.description,
      price: parseFloat(service.price.toString()),
      image: service.imageUrl,
      rating: averageRating,
      reviewCount: allScores.length,
      category: service.category.name,
      seller: {
        id: service.user.id,
        firstName: service.user.firstName,
        lastName: service.user.lastName,
        rating: parseFloat(service.user.rating.toString()),
        memberSince: service.user.createdAt.getFullYear().toString(),
        avatar: `https://ui-avatars.com/api/?name=${service.user.firstName}+${service.user.lastName}`,
      },
    });
  } catch (error) {
    console.error("[SERVICE_DETAIL_ERROR]", error);
    return NextResponse.json(
      { error: "Error al obtener detalles del servicio" },
      { status: 500 }
    );
  }
}
