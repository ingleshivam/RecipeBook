import { error } from "console";
import { NextResponse } from "next/server";

export  async function POST(request:Request){
    try {
        const data = await request.json();
        console.log("Data : ", data);
        const response = await prisma?.recipe.create({
            data : {
                title : data.recipeTitle,
                description : data.recipeDescription,
                cookingTime : data.cookTime,
                servingSize : data.servings,
                categoryId : parseInt(data.category),
                images : {
                    create :{
                        imageUrl : data.imageUrl,
                        description : "NA"
                    }
                },
                ingredients :{
                    create : data.ingredients.map((ing : any)=> ({
                        quantity : ing.amount,
                        name : ing.item
                    }))
                },
                instructions : {
                    create : data.instructions.map((ing:any)=> ({
                        
                    }))
                }
            }
        })
        return NextResponse.json({status : 200,  message :{success : "Data is stored successfully !", error : ""}})
    } catch (error) {
        if(error instanceof Error){
            return NextResponse.json({status : 400, message : {success : "", error : error.message}});
        }
        return NextResponse.json({status : 500, message : {success : "", error : "Internal server error !"} });
    }
}