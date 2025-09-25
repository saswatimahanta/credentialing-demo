
'use client';

import {
  Home,
  LineChart,
  Package,
  PanelLeft,
  Users2,
  FileText,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Logo } from '../icons/logo';
import React from 'react';

function getBreadcrumbs(pathname: string) {
    const pathParts = pathname.split('/').filter(part => part);
    const breadcrumbs = [{ href: '/', label: 'Home' }];

    let currentPath = '';
    pathParts.forEach((part, index) => {
        currentPath += `/${part}`;
        const isLast = index === pathParts.length - 1;

        let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        // Special cases
        if (part.startsWith('APP-')) {
            label = `Review ${part}`;
        }
        if (part === 'verification-centres') {
          label = 'Verification Centres'
        }


        if (isLast) {
            breadcrumbs.push({ href: currentPath, label: label, isPage: true });
        } else {
             breadcrumbs.push({ href: currentPath, label: label });
        }
    });

    if (breadcrumbs.length <= 2) {
      if(breadcrumbs.length == 2 && breadcrumbs[1].href !== '/executive-summary') {
        return [breadcrumbs[1]];
      }
      return [];
    }

    return breadcrumbs.slice(1);
}


export default function AppHeader() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Logo />
              <span className="sr-only">FastCred</span>
            </Link>
            <Link
              href="/executive-summary"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Executive Summary
            </Link>
            <Link
              href="/applications/intake"
              className="flex items-center gap-4 px-2.5 text-foreground"
            >
              <FileText className="h-5 w-5" />
              Applications
            </Link>
            <Link
              href="/credentialing"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Package className="h-5 w-5" />
              Credentialing
            </Link>
            <Link
              href="/verification-centres"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Users2 className="h-5 w-5" />
              Verification Centres
            </Link>
             <Link
              href="/communication"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
              Communication
            </Link>
            <Link
              href="applications/reports"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <LineChart className="h-5 w-5" />
              Reports
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4">
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                    {crumb.isPage ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                    <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
            ))}
            </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative ml-auto flex-1 md:grow-0">

      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Image
              src="https://placehold.co/36x36.png"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
              data-ai-hint="user avatar"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
