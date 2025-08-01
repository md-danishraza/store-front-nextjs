import React from 'react'
import { fetchAdminProducts } from '@/utils/actions'
import Link from 'next/link'
import { formatCurrency } from '@/utils/format'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


async function AdminProductsPage() {
  const products = await fetchAdminProducts();

  return (
    <Table>
    <TableCaption className="capitalize">Total Products: {products.length}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead >Product Name</TableHead>
        <TableHead className='hidden md:block'>Company</TableHead>
        <TableHead>Price</TableHead>
        <TableHead className="text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
          {products.map((item) => {
            const { id: productId, name, company, price } = item;
            return (
              <TableRow key={productId}>
                <TableCell>
                  <Link
                    href={`/products/${productId}`}
                    className="underline text-muted-foreground hover:text-primary tracking-wide capitalize"
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell className='hidden md:block'>{company}</TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>

                <TableCell className="flex items-center gap-x-2"></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
    
  </Table>
  )
}

export default AdminProductsPage
