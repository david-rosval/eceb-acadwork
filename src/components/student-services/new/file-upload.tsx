"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  maxSize?: number // in MB
}

export function FileUpload({ onFileSelect, accept = "image/*", maxSize = 5 }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`)
      return
    }

    setFile(selectedFile)
    onFileSelect(selectedFile)

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setPreview(null)
    onFileSelect(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>Imagen referencial (opcional)</Label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />

        {preview ? (
          <div className="relative">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              width={200}
              height={150}
              className="mx-auto rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={removeFile}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              {dragActive ? (
                <Upload className="h-6 w-6 text-primary" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="mt-4">
              <Button type="button" variant="outline" onClick={onButtonClick}>
                Elegir archivo
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">o arrastra tu imagen aquí
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF no mayor a {maxSize}MB</p>
            </div>
          </div>
        )}
      </div>
      {file && (
        <p className="text-sm text-muted-foreground">
          Seleccionado: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </p>
      )}
    </div>
  )
}
