'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ClipboardList, PlusCircle, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const features = [
    {
      title: 'Multiple Question Types',
      description:
        'Create diverse questionnaires with text, single-choice, multiple-choice, and image question types.',
      icon: <ClipboardList className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Drag-and-Drop Builder',
      description:
        'Intuitively build and reorder questionnaires with our user-friendly drag-and-drop interface.',
      icon: <PlusCircle className="h-6 w-6 text-primary" />,
    },
    {
      title: 'Detailed Statistics',
      description:
        'Analyze response data with comprehensive statistics and visual charts to gain insights.',
      icon: <BarChart className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      {/* Title Section */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Create and Manage Interactive Questionnaires
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Build custom questionnaires with various question types, collect
          responses, and analyze results with detailed statistics.
        </p>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut",
          delay: 0.2
        }}
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Button asChild className="w-full" size="lg">
            <Link 
              className='flex items-center justify-center py-3 sm:py-2'
              href="/questionnaires">
              <ClipboardList className="mr-2 h-5 w-5" />
              Browse Questionnaires
            </Link>
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1"
        >
          <Button asChild className="w-full" size="lg" variant="default">
            <Link 
              className='flex items-center justify-center py-3 sm:py-2'
              href="/questionnaires/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ 
          duration: 0.5,
          delay: 0.4
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="flex flex-col items-center text-center p-6 border rounded-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.5 + (index * 0.1)
            }}
          >
            <motion.div 
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15,
                delay: 0.6 + (index * 0.1) 
              }}
            >
              {feature.icon}
            </motion.div>
            <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}