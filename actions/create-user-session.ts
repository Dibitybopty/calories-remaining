'use server';

import { db } from '@/lib/db';

export async function createUser(name: string, email: string, image: string) {

    // console.log('checking if user exists')

    const users = await db.calories.findFirst({
        where: {
            userEmail: email
        }
    });

    // //return out if user already exists    
    if (users !== null) {

        return users;
    } 

    await db.users.create({
        data: {
             name,
             image,
             email,
        }
    });

    await db.calories.create({
        data: {
             caloriesTarget : 0,
             caloriesRemaining : 0,
             Monday : 0,
             Tuesday : 0,
             Wednesday : 0,
             Thursday : 0,
             Friday : 0,
             Saturday : 0,
             Sunday : 0,
             Checked : '',
             userEmail : email,
        }
    });

    return users;

}