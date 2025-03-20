'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileQuestion, Home, ClipboardList, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 relative"
      >
        <div className="bg-muted/30 rounded-full p-8 relative">
          <FileQuestion className="h-24 w-24 text-primary" />
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute -top-4 -right-4 bg-destructive text-white rounded-full w-10 h-10 flex items-center justify-center font-bold"
          >
            404
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">Page Not Found</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
          Oops! We couldn&apos;t find the questionnaire or page you were looking for.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/questionnaires">
              <ClipboardList className="mr-2 h-5 w-5" />
              Browse Questionnaires
            </Link>
          </Button>
        </div>
        
        <div className="mt-12 space-y-2">
          <p className="text-muted-foreground font-medium">Or try one of these:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/questionnaires/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Questionnaire
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/statistics">
                <ClipboardList className="mr-2 h-4 w-4" />
                View Statistics
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}