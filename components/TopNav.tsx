"use client";

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopNav = () => {
  const { theme, setTheme } = useTheme();

  console.log('Current theme:', theme); // Debugging line

  return (
    <div className="flex justify-end items-center p-4 bg-white dark:bg-gray-800">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const newTheme = theme === 'dark' ? 'light' : 'dark';
          console.log('Switching to:', newTheme); // Debugging line
          setTheme(newTheme);
        }}
        aria-label="Toggle theme"
        className="border border-gray-300 dark:border-gray-600"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700" />
        )}
      </Button>
    </div>
  );
};

export default TopNav;
