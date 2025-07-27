import React from 'react'
import { Input } from '../ui/input'
function NavSearch() {
  return (
    <Input
      type='search'
      placeholder='search product...'
      className='max-w-xs dark:bg-muted dark:shadow-white dark:shadow-sm'
    />
  )
}

export default NavSearch
