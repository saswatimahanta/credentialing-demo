'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Logo } from '../icons/logo';
import { navLinks } from '@/lib/data';
import { Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useContext } from 'react';
import { UserContext } from '../contexts/user-context';

export default function AppSidebar() {
  const { user, logout } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
        logout();
        router.push('/login');
    };

  const isChildActive = (href: string) => {
    // Exact match for most
    if (pathname === href) return true;
    
    // Special handling for nested routes
    if (href === '/applications/intake' && pathname.startsWith('/applications')) {
      return true;
    }
     if (href === '/credentialing' && pathname.startsWith('/credentialing')) {
      return true;
    }
    return false;
  };


  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          href="/executive-summary"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Logo />
          <span className="sr-only">FastCred</span>
        </Link>
        <TooltipProvider>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8',
                    isChildActive(href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <TooltipProvider>
            <Tooltip>
            <TooltipTrigger asChild>
                <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
        </TooltipProvider> */}
      </nav>
    </aside>
  );
}
