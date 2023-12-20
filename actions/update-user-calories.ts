'use server';

import { z } from 'zod';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';



export async function updateUserCalories(state: any, formData: FormData) {

    // console.log(formData)

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
        Checked: z.string(),
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
        Checked: '',
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

    // console.log(reset)

    const day = formData.get('day') as string;
    const amountConv = formData.get('amount') as string;
    const email = formData.get('email') as string;

    let amount = +amountConv;

    const UpdateCalories = z.object({
        [day]: z.number().min(0, 'Number below zero.'),
    });

    const result = UpdateCalories.safeParse({
        [day]: amount,
        Checked: day,
    });


    if (result.success) {

        const checkDays = await db.calories.findFirst({

            where: {
                userEmail: email,
            },
        });

        let getDays = checkDays?.Checked ?? '';
        let remainingCals = checkDays?.caloriesTarget ?? 0;

        //add days that have been checked by the user
        //needed to calculate through remaining days

        if (!checkDays?.Checked.includes(day)) {

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

        // if (amount === 0) {
        //     amount = checkDays?.caloriesTarget as number / 7

        //     result.data[day] = amount;
        // }


        //need to check through days that have been already updated
        //if the day hasn't been updated then spread the remaining calories to those days
        //this is going to be annoying

        //split the days up to get days that have been already checked
        const someDays = getDays.split(', ').slice(0, -1) ?? []
        someDays?.forEach((val) => {
            //if we're changing a day that's already changed then only minus the amount from user input
            //otherwise minus all checked days
            if (val === day) {
                remainingCals -= amount;
            } else {
                remainingCals -= Object.values(checkDays ?? 0).at(Object.keys(checkDays ?? 0).findIndex((ind) => ind === val));
            }
        })

        let spreadCals = remainingCals / (7 - someDays?.length)

        //add the remaining calories to each day that hasn't had calories added to it
        //Note: this will need to be also calculated in optimistic results for instant results on screen
        Object.keys(checkDays ?? 0).map((val) => {
            //extract only days from db results
            if (val.includes('day')) {
                if (!someDays.includes(val)) {
                    result.data[val] = spreadCals;
                }
            }
        })

        //add remaining calories to object  
        result.data['caloriesRemaining'] = remainingCals;

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