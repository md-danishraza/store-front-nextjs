"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { productSchema } from "./validationSchemas";
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
    // safe parse for custom error messages gracefully
    const validatedData = productSchema.safeParse(rawData);
    // if not valid inputs
    if (!validatedData.success) {
      // getting all errors messages of array
      const errors = validatedData.error.issues.map((issue) => issue.message);
      // returning into a combined string message
      throw new Error(errors.join(","));
    }

    // await db.product.create({
    //   data: {
    //     ...validatedData.data,
    //     image: "/images/test.png",
    //     clerkId: user.id,
    //   },
    // });
    return { message: "product created" };
  } catch (error) {
    return renderError(error);
  }
};
