'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = 'Search...', className }: SearchBarProps) {
  const [query, setQuery] = React.useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-20 pl-10"
        />
        <Button
          type="submit"
          size="sm"
          className="absolute top-1/2 right-2 -translate-y-1/2"
          disabled={!query.trim()}
        >
          Search
        </Button>
      </div>
    </form>
  )
}
