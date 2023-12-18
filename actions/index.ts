'use server';

import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateSafeUser } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { name, image, email } = data;

    if(!data){
        return {
            error: 'No data',
        };
    }

    let user;

    try {
        user = await db.users.create({
            data: {
                name,
                image,
                email,
            }
        });
    }catch (error){
        return {
            error: 'Failed to add user'
        }
    }

    revalidatePath(`/user/${user.id}`);

    return { data: user}
};

export const createNewUser = createSafeAction(CreateSafeUser, handler);