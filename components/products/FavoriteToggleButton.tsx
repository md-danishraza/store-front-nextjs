import React from 'react'
import { FaHeart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { CardSignInButton } from '../form/Buttons';
import { fetchFavoriteId } from '@/utils/actions';
import FavoriteToggleForm from './FavoriteToggleForm';

// if user not signed in show CardSignInButton that will prompt sign on click
// else show FavoriteToggleForm to check in/out of Favorite
async function FavoriteToggleButton({productId}:{productId:string}) {
  const { userId } = auth();
  if (!userId) return <CardSignInButton />;
  // it can be null = not favorite
  const favoriteId = await fetchFavoriteId({ productId });

  return <FavoriteToggleForm favoriteId={favoriteId} productId={productId} />;
}

export default FavoriteToggleButton
