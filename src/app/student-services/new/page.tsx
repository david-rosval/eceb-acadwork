"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/student-services/new/file-upload" 
import { useCategories } from "@/hooks/useCategories"
import { useCreateService } from "@/hooks/useCreateService"
import { useRouter } from "next/navigation"

export default function NewServicePage() {
  const router = useRouter();
  
  const { data: categories, isLoading, isError } = useCategories();
  const [, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const { mutate, isPending } = useCreateService();

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!categoryId) {
    alert("Debes seleccionar una categoría.");
    return;
  }

  if (!title || !description || !price) {
    alert("Completa todos los campos requeridos.");
    return;
  }

  mutate(
    {
      title,
      description,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
    },
    {
      onSuccess: ({ service }) => {
        console.log("Servicio creado:", service);
        alert("Servicio publicado con éxito");
        router.push("/");
      },
      onError: (error) => {
        const err = error as Error;
        alert(err.message || "Ocurrió un error");
      },
    }
  );
};


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Regresar a la página principal
          </Link>
          <h1 className="text-3xl font-bold">Crear un nuevo servicio</h1>
          <p className="text-muted-foreground mt-2">Comparte tus habilidades con nuestra comunidad</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Desarrollaré un sitio web para tu proyecto que consuma tu API"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select name="category" required onValueChange={(value) => setCategoryId(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Cargando...
                        </SelectItem>
                      ) : isError ? (
                        <SelectItem value="error" disabled>
                          Error al cargar
                        </SelectItem>
                      ) : (
                        categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price">Precio inicial (S/.) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">S/.</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="5"
                      step="5"
                      placeholder="20"
                      className="pl-8"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}

                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    El precio mínimo es S/.20.
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción del servicio *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe tu servicio en detalle. ¿Qué entregarás? ¿Qué hace único a tu servicio? Incluye cualquier requisito del comprador..."
                    className="min-h-[120px] resize-none"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mínimo 100 caracteres. Sé específico sobre lo que ofreces.
                  </p>
                </div>

                {/* Image Upload */}
                <FileUpload onFileSelect={setSelectedFile} accept="image/*" maxSize={5} />

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending ? "Publicando..." : "Publicar Servicio"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/">Cancelar</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
