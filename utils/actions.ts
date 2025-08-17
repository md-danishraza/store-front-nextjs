"use server";

// all form actions has prevState if we are using useFormState in client component
// here FormContainer is used for toast feedback

import db from "@/utils/db";
import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { imageSchema, productSchema, reviewSchema } from "./validationSchemas";
import { uploadImage } from "./supabase_storage";
import { deleteImage } from "./supabase_storage";
import { revalidatePath } from "next/cache";
import { Cart } from "@prisma/client";
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
export const deleteProductAction = async (boundValues: {
  productId: string;
}) => {
  const { productId } = boundValues;
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

// cart
export const fetchCartNumItems = async () => {
  // this can be null
  const { userId } = auth();

  const cart = await db.cart.findFirst({
    where: {
      // nullish coalescence
      clerkId: userId ?? "",
    },
    select: {
      numItemsInCart: true,
    },
  });
  return cart?.numItemsInCart || 0;
};

const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  });
  // if product doesn't exit
  if (!product) throw new Error("product not found");

  return product;
};

// errorOnFailure ensure that cart should be definitely present
export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string;
  errorOnFailure?: boolean;
}) => {
  // cart with userId
  // cartItems [] in which each item will have product model as well
  // fetch cart
  let cart = await db.cart.findFirst({
    where: {
      clerkId: userId,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });
  if (cart) return cart;

  if (!cart && errorOnFailure) {
    throw new Error("Cart doesn't exist!");
  }
  // create a cart for that user
  cart = await db.cart.create({
    data: {
      clerkId: userId,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });
  return cart;
};

const updateOrCreateCartItem = async ({
  productId,
  cartId,
  amount,
}: {
  productId: string;
  cartId: string;
  amount: number;
}) => {
  // check if cartItem exist or not for that productId and cartId
  let cartItem = await db.cartItem.findFirst({
    where: {
      productId,
      cartId,
    },
  });
  // if exist than update the amount/quantity
  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        amount: cartItem.amount + amount,
      },
    });
  } else {
    // else create the item
    cartItem = await db.cartItem.create({
      data: {
        amount,
        productId,
        cartId,
      },
    });
  }
};

export const updateCart = async (cart: Cart) => {
  // fetching all the cartItem that belongs to the above cart
  // also including the product model for latest price
  // [{cartitemid, amount, product:{id:price}}]
  const cartItems = await db.cartItem.findMany({
    where: {
      cartId: cart.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  let numItemsInCart = 0;
  let cartTotal = 0;

  for (let item of cartItems) {
    numItemsInCart += item.amount;
    cartTotal += item.amount * item.product.price;
  }
  // tax rate is hardcoded
  const tax = cartTotal * cart.taxRate;

  const shipping = cartTotal ? 200 : 0;
  const orderTotal = cartTotal + tax + shipping;

  // update the current cart
  const currentCart = await db.cart.update({
    where: {
      id: cart.id,
    },
    data: {
      numItemsInCart,
      cartTotal,
      tax,
      orderTotal,
      shipping,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return { currentCart, cartItems };
};

export const addToCartAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  try {
    const productId = formData.get("productId") as string;
    const amount = Number(formData.get("amount"));
    // check whether product exist
    await fetchProduct(productId);
    // fetch or create a cart
    const cart = await fetchOrCreateCart({ userId: user.id });
    // create or update cart item
    await updateOrCreateCartItem({ productId, cartId: cart.id, amount });
    // now update the cart (totals)
    await updateCart(cart);
  } catch (error) {
    return renderError(error);
  }
  redirect("/cart");
};

// cart page
// remove cart item for that user cart and cart item id
export const removeCartItemAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser();
  try {
    const cartItemId = formData.get("id") as string;
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.delete({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
    });

    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "Item removed from cart" };
  } catch (error) {
    return renderError(error);
  }
};
// cart page
// update the amount for a cartItem
export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number;
  cartItemId: string;
}) => {
  const user = await getAuthUser();

  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    });
    await updateCart(cart);
    revalidatePath("/cart");
    return { message: "cart updated" };
  } catch (error) {
    return renderError(error);
  }
};

// orders
// coming soon
export const checkoutComingSoon = async () => {
  return { message: "Feature Coming Soon" };
};
export const createOrderAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser();
  // for checkout page
  let orderId: null | string = null;
  let cartId: null | string = null;
  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    });
    cartId = cart.id;
    // deleting all previous false order so only one will be available
    await db.order.deleteMany({
      where: {
        clerkId: user.id,
        isPaid: false,
      },
    });
    // creating the order
    const order = await db.order.create({
      data: {
        clerkId: user.id,
        products: cart.numItemsInCart,
        orderTotal: cart.orderTotal,
        tax: cart.tax,
        shipping: cart.shipping,
        email: user.emailAddresses[0].emailAddress,
      },
    });
    orderId = order.id;
  } catch (error) {
    return renderError(error);
  }
  // will turn order true after payment and empty the cart
  redirect(`/checkout?orderId=${orderId}&cartId=${cartId}`);
};
// fetch orders for user
export const fetchUserOrders = async () => {
  const user = await getAuthUser();
  const orders = await db.order.findMany({
    where: {
      clerkId: user.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};
// fetch order for admin sales page
export const fetchAdminOrders = async () => {
  const user = await getAdminUser();

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
};
