"use server";

// all form actions has prevState if we are using useFormState in client component
// here FormContainer is used for toast feedback

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, reviewSchema } from "./validationSchemas";
import { uploadImage } from "./supabase_storage";
import { deleteImage } from "./supabase_storage";
import { revalidatePath } from "next/cache";
export async function fetchFeaturedProducts() {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });

  return products;
}
export async function fetchAllProducts({ search = "" }: { search: string }) {
  const products = await db.product.findMany({
    where: {
      OR: [
        {
          name: { contains: search, mode: "insensitive" },
        },
        {
          company: { contains: search, mode: "insensitive" },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return products;
}

export const fetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) {
    redirect("/products");
  }
  return product;
};

// helper fns
const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "An error occurred",
  };
};

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to access this route");
  }
  return user;
};

export const createProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData);
    const image = formData.get("image") as File;
    // safe parse for custom error messages gracefully
    const validatedData = productSchema.safeParse(rawData);
    const validatedImage = imageSchema.safeParse({ image: image });

    if (!validatedImage.success) {
      throw new Error(validatedImage.error?.issues[0]?.message);
    }
    // if not valid inputs
    if (!validatedData.success) {
      // getting all errors messages of array
      const errors = validatedData.error.issues.map((issue) => issue.message);
      // returning into a combined string message
      throw new Error(errors.join(","));
    }

    // upload image
    const fullPath = await uploadImage(validatedImage.data.image);
    await db.product.create({
      data: {
        ...validatedData.data,
        image: fullPath,
        clerkId: user.id,
      },
    });
  } catch (error) {
    return renderError(error);
  }
  redirect("/admin/products");
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");
  return user;
};
export const fetchAdminProducts = async () => {
  // check admin
  await getAdminUser();
  // find all products
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};

// delete a product
export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();

  try {
    const product = await db.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    revalidatePath("/admin/products");
    return { message: "product removed" };
  } catch (error) {
    return renderError(error);
  }
};

// admin single product detail fetch, update and updatewithImage
export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect("/admin/products");
  return product;
};

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  return { message: "Product updated successfully" };
};

// update image
// id and url is hidden input
export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAuthUser();
  try {
    const image = formData.get("image") as File;
    const productId = formData.get("id") as string;
    const oldImageUrl = formData.get("url") as string;

    const validatedFile = imageSchema.safeParse({ image: image });
    if (!validatedFile.success) {
      throw new Error(validatedFile.error?.issues[0]?.message);
    }
    const fullPath = await uploadImage(validatedFile.data.image);
    await deleteImage(oldImageUrl);
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product Image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// favorites
export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser();
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id || null;
};

// if favoriteId then remove from fav
// if only productId then add to fav
export const toggleFavoriteAction = async (prevState: {
  productId: string;
  favoriteId: string | null;
  pathname: string;
}) => {
  const user = await getAuthUser();
  const { productId, favoriteId, pathname } = prevState;
  try {
    if (favoriteId) {
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      });
    } else {
      await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      });
    }
    revalidatePath(pathname);
    return { message: favoriteId ? "Removed from Faves" : "Added to Faves" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchUserFavorites = async () => {
  const user = await getAuthUser();
  const favorites = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
  });
  return favorites;
};

// review
export const createReviewAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);

    const validatedFields = reviewSchema.safeParse(rawData);
    if (!validatedFields.success) {
      // getting all errors messages of array
      const errors = validatedFields.error.issues.map((issue) => issue.message);
      // returning into a combined string message
      throw new Error(errors.join(","));
    }
    await db.review.create({
      data: {
        ...validatedFields.data,
        clerkId: user.id,
      },
    });
    revalidatePath(`/products/${validatedFields.data.productId}`);
    return { message: "Review submitted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

// here user image and userName will be shown in reviewCard
// for specific product
export const fetchProductReviews = async ({
  productId,
}: {
  productId: string;
}) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return reviews;
};

// here product image and name will be shown in reviewCard
// for reviews page specific to user
export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser();
  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      product: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  });
  return reviews;
};
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState;
  const user = await getAuthUser();

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    });

    revalidatePath("/reviews");
    return { message: "Review deleted successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchProductRating = async ({
  productId,
}: {
  productId: string;
}) => {
  const result = await db.review.groupBy({
    by: ["productId"],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      productId,
    },
  });

  // empty array if no reviews
  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    count: result[0]?._count.rating ?? 0,
  };
};

// find existing review by user for specific product page
export const findExistingReview = async (userId: string, productId: string) => {
  // return null if not found
  return db.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  });
};
