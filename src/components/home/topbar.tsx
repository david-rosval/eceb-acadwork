"use client";

import { Search, Bell, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { formattedUserName } from "@/lib/utils";

export function Topbar() {
  const { isAuthenticated, logout, user } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Acadwork</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="¿Qué servicio buscas hoy?"
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          {!isAuthenticated && (
            <>
              <Button asChild className="cursor-pointer" variant="secondary">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="cursor-pointer">
                <Link href="/register">Registrarse</Link>
              </Button>
            </>
          )}

          {isAuthenticated && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:inline-flex"
                asChild
              >
                <Link href="/student-services/new">
                  Ofrece un servicio
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <MessageCircle className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  2
                </Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative overflow-hidden cursor-pointer">
                    <Image 
                      alt="Logged in user avatar"
                      src={`https://ui-avatars.com/api/?name=${formattedUserName(user?.firstName, user?.lastName)}`}
                      fill
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuLabel className="text-xs truncate max-w-[148px]">Bienvenido a Acadwork, <br/>{user?.firstName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button className="w-full" onClick={logout}>Cerrar Sesión</Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
