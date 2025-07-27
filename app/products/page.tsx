import React from 'react'
import ProductsContainer from '@/components/products/ProductsContainer'
function ProductsPage({searchParams}:{searchParams:{layout? :string,search? :string}}) {
  // console.log(searchParams)
  // initial values 
  // using params for search and grid/list instead of using useStates
  const layout = searchParams.layout || 'grid'
  const search = searchParams.search || ''
  return (
    <>
      <ProductsContainer layout={layout} search={search} />
    </>
  )
}

export default ProductsPage
