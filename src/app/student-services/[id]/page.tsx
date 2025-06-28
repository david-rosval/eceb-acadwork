"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Heart, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

// Sample data (same as in the main page)
const services = [
  {
    id: "service-1",
    title: "Desarrollaré una aplicación web responsiva utilizando React y Node.js",
    seller: {
      firstName: "Alex",
      lastName: "Johnson",
      avatar: "https://picsum.photos/seed/alex/40/40",
      rating: 4.95,
      reviewCount: 156,
      memberSince: "2022",
    },
    image: "https://picsum.photos/seed/web1/800/600",
    price: 150,
    rating: 4.89,
    reviewCount: 247,
    isFavorite: false,
    category: "Programación",
    description:
      "Crearé una aplicación web moderna y responsiva utilizando las últimas tecnologías, incluyendo React.js para el frontend y Node.js para el backend. La aplicación será completamente responsiva, optimizada para rendimiento e incluirá autenticación de usuarios, integración de base de datos y desarrollo de API.",
  },
  // Add more services as needed...
]

const reviews = [
  {
    id: 1,
    user: {
      name: "Sarah Wilson",
      avatar: "https://picsum.photos/seed/sarah-review/40/40",
    },
    rating: 5,
    comment:
      "Excellent work! Alex delivered exactly what I needed and even added some extra features. The code is clean and well-documented. Highly recommended!",
    date: "2 weeks ago",
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      avatar: "https://picsum.photos/seed/michael-review/40/40",
    },
    rating: 5,
    comment:
      "Outstanding developer! The web application works perfectly and looks amazing. Great communication throughout the project.",
    date: "1 month ago",
  },
  {
    id: 3,
    user: {
      name: "Emma Davis",
      avatar: "https://picsum.photos/seed/emma-review/40/40",
    },
    rating: 4,
    comment:
      "Very professional and delivered on time. The application meets all requirements and the seller was responsive to feedback.",
    date: "2 months ago",
  },
  {
    id: 4,
    user: {
      name: "John Smith",
      avatar: "https://picsum.photos/seed/john-review/40/40",
    },
    rating: 5,
    comment:
      "Amazing service! The developer went above and beyond my expectations. Fast delivery and excellent communication throughout.",
    date: "3 months ago",
  },
  {
    id: 5,
    user: {
      name: "Lisa Johnson",
      avatar: "https://picsum.photos/seed/lisa-review/40/40",
    },
    rating: 4,
    comment:
      "Great work overall. The project was completed on time and met all the requirements. Would definitely work with Alex again.",
    date: "4 months ago",
  },
  {
    id: 6,
    user: {
      name: "David Brown",
      avatar: "https://picsum.photos/seed/david-review/40/40",
    },
    rating: 5,
    comment:
      "Exceptional quality and attention to detail. The web application is exactly what I envisioned. Highly professional service.",
    date: "5 months ago",
  },
  {
    id: 7,
    user: {
      name: "Maria Garcia",
      avatar: "https://picsum.photos/seed/maria-review/40/40",
    },
    rating: 4,
    comment:
      "Good experience working with this seller. The project was delivered as promised and the code quality is solid.",
    date: "6 months ago",
  },
  {
    id: 8,
    user: {
      name: "Robert Taylor",
      avatar: "https://picsum.photos/seed/robert-review/40/40",
    },
    rating: 5,
    comment:
      "Perfect execution! The developer understood my requirements perfectly and delivered a high-quality solution.",
    date: "7 months ago",
  },
]

export default function ServiceDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false)
  const params = useParams<{ id: string }>()
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1)
  const reviewsPerPage = 3

  // Find the service by ID
  const service = services.find((s) => s.id === params.id)

  const totalReviewsPages = Math.ceil(reviews.length / reviewsPerPage)
  const currentReviews = reviews.slice((reviewsCurrentPage - 1) * reviewsPerPage, reviewsCurrentPage * reviewsPerPage)

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Servicio no encontrado</h1>
          <Link href="/">
            <Button>Regresar al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Regresar al inicio
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{service.category}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                <h1 className="text-2xl font-bold mb-4">{service.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={service.seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{service.seller.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{service.seller.firstName} {service.seller.lastName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating.toFixed(2)}</span>
                    <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                  </div>
                </div>

                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Descripción</TabsTrigger>
                    <TabsTrigger value="seller">Acerca de {service.seller.firstName}</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({service.reviewCount})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Acerca de este servicio</h3>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>

                    </div>
                  </TabsContent>

                  <TabsContent value="seller" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={service.seller.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{service.seller.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{service.seller.firstName} {service.seller.lastName}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>
                                {service.seller.rating.toFixed(2)} ({service.seller.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mt-2">Miembro desde {service.seller.memberSince}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-6">
                      {currentReviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{review.user.name}</span>
                                <div className="flex">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Reviews Pagination */}
                      {totalReviewsPages > 1 && (
                        <div className="flex justify-center mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (reviewsCurrentPage > 1) setReviewsCurrentPage(reviewsCurrentPage - 1)
                                  }}
                                  className={reviewsCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>

                              {Array.from({ length: Math.min(5, totalReviewsPages) }, (_, i) => {
                                const page = i + 1
                                return (
                                  <PaginationItem key={page}>
                                    <PaginationLink
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setReviewsCurrentPage(page)
                                      }}
                                      isActive={reviewsCurrentPage === page}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                )
                              })}

                              {totalReviewsPages > 5 && (
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}

                              <PaginationItem>
                                <PaginationNext
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    if (reviewsCurrentPage < totalReviewsPages)
                                      setReviewsCurrentPage(reviewsCurrentPage + 1)
                                  }}
                                  className={
                                    reviewsCurrentPage === totalReviewsPages ? "pointer-events-none opacity-50" : ""
                                  }
                                />
                              </PaginationItem>
                            </PaginationContent>
                          </Pagination>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Seller */}
            <Card>
              <CardHeader>
                <CardTitle>Contactar estudiante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Iniciar chat
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Tienes preguntas? Envía un mensaje a {service.seller.firstName} para discutir tu proyecto.
                </p>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Precio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">S/.{service.price}</div>
                </div>


                <Separator />

                <Button className="w-full" size="lg">
                  Ordenalo ahora (S/.{service.price})
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
