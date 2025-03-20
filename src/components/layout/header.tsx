'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MenuIcon,
  ClipboardList,
  PlusCircle,
  BarChart,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {
      name: 'Home',
      href: '/',
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Questionnaires',
      href: '/questionnaires',
      icon: <ClipboardList className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Create New',
      href: '/questionnaires/create',
      icon: <PlusCircle className="h-4 w-4 mr-2" />,
    },
    {
      name: 'Statistics',
      href: '/statistics',
      icon: <BarChart className="h-4 w-4 mr-2" />,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Questioneer</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors flex items-center ${
                isActive(link.href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex md:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-14 inset-x-0 bg-background border-b md:hidden z-50"
            >
              <div className="container py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center py-2 text-sm font-medium ${
                      isActive(link.href)
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}