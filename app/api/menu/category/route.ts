import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    console.log("Handler initiated");

    const authResult = await authMiddleware(req);

    if (authResult.error) {
        return authResult.error; 
    }

    const userId = req.cookies.get("userId")?.value;
    const restaurantId  = req.cookies.get("userId")?.value
    
    console.log("User ID:", userId);
    console.log("Restaurant ID:", restaurantId);

    if (!userId || !restaurantId) {
        return NextResponse.json({ msg: "User ID or Restaurant ID not found" }, { status: 400 });
    }
   
    try {
        const { category } = await req.json();
        console.log("Incoming category data:", category);

        if (!category || typeof category !== "string") {
            return NextResponse.json({ msg: "Invalid category data" }, { status: 400 });
        }

        const newCategory = await prisma.category.create({
            data: {
                restaurantId: parseInt(restaurantId),
                name: category,
            },
        });

        return NextResponse.json(newCategory, { status: 200 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
    }
}



export async function GET(req:NextRequest) {
    const authResult = await authMiddleware(req)

    if(authResult.error){
        return authResult.error;
    }

    const restaurantId = req.cookies.get("userId")?.value;
    const userId = req.cookies.get("userId")?.value

    if (!userId || !restaurantId) {
        return NextResponse.json({ msg: "User ID or Restaurant ID not found" }, { status: 400 });
    }

    const allCategories = await prisma.category.findMany({
        where:{
            restaurantId:parseInt(restaurantId),
            
        },
        
    })

    return NextResponse.json({allCategories})


    
}