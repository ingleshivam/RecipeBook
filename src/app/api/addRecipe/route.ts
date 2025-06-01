import { error } from "console";
import { NextResponse } from "next/server";

export  async function POST(request:Request){
    try {
        const data = await request.json();
        console.log("Data : ", data);
        return NextResponse.json({status : 200,  message :{success : "Data is stored successfully !", error : ""}})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({status : 400, message : {success : "", error : error.message}});
        }
        return NextResponse.json({status : 500, message : {success : "", error : "Internal server error !"} });
    }
}