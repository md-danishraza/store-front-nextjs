"use client";
import React from 'react'
import { usePathname } from 'next/navigation';
import FormContainer from '../form/FormContainer';
import { toggleFavoriteAction } from '@/utils/actions';
import { CardSubmitButton } from '../form/Buttons';

function FavoriteToggleForm({
  productId,
  favoriteId,
}:{
  productId:string,
  favoriteId:string | null,
}) {

  const pathname = usePathname();
  // bind to pass data to server action
  const toggleAction = toggleFavoriteAction.bind(null, {
    productId,
    favoriteId,
    pathname,
  });
  return (
    <FormContainer action={toggleAction}>
      <CardSubmitButton isFavorite={favoriteId ? true : false} />
    </FormContainer>
  );
}

export default FavoriteToggleForm
