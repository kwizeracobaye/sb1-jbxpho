import React from 'react';
import { School } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-indigo-600 text-white py-6 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        <School className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Lecturer Check-in System</h1>
      </div>
    </header>
  );
}