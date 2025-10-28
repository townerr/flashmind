"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BrowsePageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function BrowsePageHeader({
  searchTerm,
  onSearchChange,
}: BrowsePageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Browse Public Decks
      </h1>
      <p className="text-gray-600 mb-6">
        Discover and copy study decks created by the community
      </p>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by topic..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white"
        />
      </div>
    </div>
  );
}
