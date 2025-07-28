'use client'
// this component just changes the params as input change
// at server Products page take the params & pass it to productsContainer 
// that fetches the products and renders it either as List or Grid

import React from 'react'
import { Input } from '../ui/input'
import { useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';
function NavSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState(
    searchParams.get('search')?.toString() || ''
  );
  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    replace(`/products?${params.toString()}`);
  }, 300);

  useEffect(() => {
    if (!searchParams.get('search')) {
      setSearch('');
    }
  }, [searchParams.get('search')]);
  return (
    <Input
      type='search'
      placeholder='search product...'
      className='max-w-xs dark:bg-muted '
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
      value={search}
    />
  );
}

export default NavSearch


