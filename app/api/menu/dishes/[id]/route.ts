import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { DishType } from "@prisma/client";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;

    // Authenticate user
    const authResult = await authMiddleware(req);
    if (authResult.error) {
        return authResult.error;
    }

    const restaurantId = req.cookies.get("userId")?.value;
    if (!restaurantId) {
        return NextResponse.json({ msg: "User ID or Restaurant ID not found" }, { status: 400 });
    }

    
    try {
        // Read form data
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const price = formData.get("price") as string;
        const file = formData.get("image") as File;
        const type = formData.get("type")as DishType;
        const description = formData.get("description") as string;

        if (!name || !price || !file) {
            return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
        }

        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const base64String = Buffer.from(buffer).toString("base64");

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64String}`, {
            folder: "dishes_image",
            public_id: file.name.split(".")[0],
        });

        const imageUrl = uploadResponse.secure_url;

        console.log(`Dish: ${name}, Price: ${price}, Image: ${imageUrl}`);

        // Save dish to database
        const dish = await prisma.dishes.create({
            data: {
                name,
                price: parseFloat(price),
                image: imageUrl,
                categoryId: parseInt(id),
                description:description,
                type:type,
                restaurantId: parseInt(restaurantId),
            }
        });

        return NextResponse.json({ dish });

    } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ msg: "Error uploading image" }, { status: 500 });
    }
}



export async function DELETE(req:NextRequest, context:{params:{id:string}}) {

    const {id} = context.params;

     // Authenticate user
     const authResult = await authMiddleware(req);
     if (authResult.error) {
         return authResult.error;
     }

    console.log("is send to backend",id)

    const deleteDish = await prisma.dishes.delete({
        where:{
            id:parseInt(id)
        }
    })

    console.log(`dish with id ${id} is deleted`)

    return NextResponse.json({msg:"Dish is deleted"})
    
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const authResult = await authMiddleware(req);
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body = await req.json();
    const { name, description, price, type } = body;

    if (!name || !description || !price || !type) {
      return NextResponse.json({ error: "Please provide all required fields." }, { status: 400 });
    }

    const updatedDish = await prisma.dishes.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        type,
      },
    });

    return NextResponse.json({ success: true, updatedDish }, { status: 200 });
  } catch (error) {
    console.error("Error updating dish:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
