"use client";

import Link from 'next/link';
import { Home, PlusCircle, BarChart2, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNavigation() {
  const pathname = usePathname();

  // Hide bottom navigation on auth and onboarding pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/onboarding')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/checkin', label: 'Check-in', icon: PlusCircle, prominent: true },
    { href: '/timeline', label: 'Timeline', icon: BarChart2 },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t pb-safe">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const IconWrapper = item.icon;

          if (item.prominent) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-5 flex flex-col items-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95">
                  <IconWrapper className="h-7 w-7" />
                </div>
                <span className="mt-1 text-[10px] font-medium text-muted-foreground">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <IconWrapper className="h-6 w-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
