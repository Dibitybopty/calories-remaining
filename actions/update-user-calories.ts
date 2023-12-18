'use server';

import { z } from 'zod';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';



export async function updateUserCalories(state: any, formData: FormData) {

    const amount = formData.get('amount') ?? 0;
    const email = formData.get('email') as string;

    const UpdateCalories = z.object({
        caloriesTarget: z.number(),
        caloriesRemaining: z.number(),
        Monday: z.number(),
        Tuesday: z.number(),
        Wednesday: z.number(),
        Thursday: z.number(),
        Friday: z.number(),
        Saturday: z.number(),
        Sunday: z.number(),
    });

    const caloriesData = UpdateCalories.parse({
        caloriesTarget: +amount * 7,
        caloriesRemaining: +amount * 7,
        Monday: +amount,
        Tuesday: +amount,
        Wednesday: +amount,
        Thursday: +amount,
        Friday: +amount,
        Saturday: +amount,
        Sunday: +amount,
    });

    await db.calories.update({

        where: {
            userEmail: email,
        },
        data: caloriesData
    });

    revalidatePath('/DBCalories');
}

export async function updateUserDay(state: any, formData: FormData) {

    // console.log(formData)

    const day = formData.get('calsDay') as string;
    const amountConv = formData.get('calsDayAmount') as string;
    const email = formData.get('calsDayEmail') as string;

    const amount = +amountConv;

    const UpdateCalories = z.object({
        [day]: z.number().min(0, 'Number below zero.'),
    });

    const result = UpdateCalories.safeParse({
        [day]: amount,
        Checked: day,
    });

    // console.log(result)

    if (result.success) {

        const checkDays = await db.calories.findFirst({

            where: {
                userEmail: email,
            },
        });

        //add days that have been checked by the user
        //needed to calculate through remaining days

        if (!checkDays?.Checked.includes(day)) {
            let getDays = checkDays?.Checked;

            getDays += `${day}, `;

            await db.calories.update({

                where: {
                    userEmail: email,
                },
                data: {
                    [day]: result.data[day],
                    Checked: getDays
                }

            });

            // return;
        }

        await db.calories.update({

            where: {
                userEmail: email,
            },
            data: result.data
        });
    }

    if (!result.success) {
        return 'Enter a number.'
    }


    revalidatePath('/DBCalories');
}