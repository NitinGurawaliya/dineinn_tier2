import { authMiddleware } from "@/app/lib/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(req:NextRequest,res:NextResponse) {

    console.log("from menu router")

    console.log("Auth Middleware Cookies:", req.cookies.get("userId")?.value);


    const authResult = await authMiddleware(req);
    if(authResult.error){
        return authResult.error;
    }

    const userId = req.cookies.get("userId")?.value;
    console.log(userId)

    if(!userId){
        return NextResponse.json({msg:"no user id"})
    }

    console.log("this is response from",userId);

    const response = await prisma.restaurantDetail.findUnique({
        where:{
            id:parseInt(userId)
        },
        select:{
            id: true,
            logo:true,
            restaurantName:true,
            weekdaysWorking:true,
            weekendWorking:true,
            instagram:true,
            facebook:true,
            qrScans:true,
            categories:true,
            dishes:true,
            user: {
                select: {
                    name: true
                }
            }
        }
    })

    return NextResponse.json(response)
}