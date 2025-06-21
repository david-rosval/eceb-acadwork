"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    college: "",
    semester: "",
    linkedinUrl: "",
    description: "",
  });

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...form, semester: Number(form.semester) }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[400px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Crear cuenta</h1>
            <p className="text-muted-foreground">
              Ingresa tu información para registrarte
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* College and Semester */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="college">Universidad *</Label>
                <Input
                  id="college"
                  name="college"
                  type="text"
                  placeholder="University name"
                  value={form.college}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semestre *</Label>
                <Select
                  name="semester"
                  required
                  value={form.semester}
                  onValueChange={(value) =>
                    setForm({ ...form, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">Perfil de LinkedIn (opcional)</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={form.linkedinUrl}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Acerca de ti (opcional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Cuéntanos acerca de ti, tus intereses, gustos, etc."
                className="min-h-[80px] resize-none"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>

          <div className="text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline hover:text-primary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://picsum.photos/seed/register/1920/1080"
          alt="Registration illustration"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
