'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';


export async function userDetails(email: string) {

    // console.log('finding user')

    const users = await db.calories.findMany({
               
        where: {
            userEmail: email,
        },
    });

    // console.log(users);

    // revalidatePath(`/DBCalories`);

    return users;


}