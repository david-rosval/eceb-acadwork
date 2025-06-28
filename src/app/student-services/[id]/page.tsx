"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ArrowLeft, Star, Heart, MessageCircle, ImageIcon } from "lucide-react"

import { useServiceDetail } from "@/hooks/useServiceDetail"
import { useServiceReviews } from "@/hooks/useServiceReviews"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"



export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [reviewsPage, setReviewsPage] = useState(1)
  const reviewsPerPage = 3

  const { data: service, isLoading: isServiceLoading } = useServiceDetail(id)
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
  } = useServiceReviews({ serviceId: id, page: reviewsPage, limit: reviewsPerPage })

  if (isServiceLoading) return <div className="p-8 text-center">Cargando servicio...</div>
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Servicio no encontrado</h1>
          <Link href="/"><Button>Regresar al inicio</Button></Link>
        </div>
      </div>
    )
  }

  const { seller } = service
  const totalPages = Math.ceil((reviewsData?.totalCount ?? 0) / reviewsPerPage)

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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{service.category}</Badge>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <h1 className="text-2xl font-bold mb-4">{service.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={seller.avatar} />
                      <AvatarFallback>{seller.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{seller.firstName} {seller.lastName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{service.rating.toFixed(2)}</span>
                    <span className="text-muted-foreground">({service.reviewCount} reviews)</span>
                  </div>
                </div>
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={800}
                    height={400}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-gray-400">
                    <ImageIcon className="h-12 w-12" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Descripción</TabsTrigger>
                    <TabsTrigger value="seller">Acerca de {seller.firstName}</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({service.reviewCount})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Acerca de este servicio</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </TabsContent>

                  <TabsContent value="seller" className="mt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={seller.avatar} />
                        <AvatarFallback>{seller.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{seller.firstName} {seller.lastName}</h3>
                        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{seller.rating.toFixed(2)} ({seller.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-6">
                    {isReviewsLoading ? (
                      <p>Cargando reviews...</p>
                    ) : (
                      <div className="space-y-6">
                        {reviewsData?.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{review.user.name}</span>
                                  <div className="flex">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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

                        {totalPages > 1 && (
                          <div className="flex justify-center mt-6">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      if (reviewsPage > 1) setReviewsPage(reviewsPage - 1)
                                    }}
                                    className={reviewsPage === 1 ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => (
                                  <PaginationItem key={i + 1}>
                                    <PaginationLink
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        setReviewsPage(i + 1)
                                      }}
                                      isActive={reviewsPage === i + 1}
                                    >
                                      {i + 1}
                                    </PaginationLink>
                                  </PaginationItem>
                                ))}

                                {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}

                                <PaginationItem>
                                  <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      if (reviewsPage < totalPages) setReviewsPage(reviewsPage + 1)
                                    }}
                                    className={reviewsPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contactar estudiante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Iniciar chat
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  ¿Tienes preguntas? Envía un mensaje a {seller.firstName} para discutir tu proyecto.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Precio</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-3xl font-bold">S/.{service.price}</div>
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
