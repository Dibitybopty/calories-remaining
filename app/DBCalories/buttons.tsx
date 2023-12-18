'use client';

import { updateUserCalories, updateUserDay } from "@/actions/update-user-calories";
import { useOptimistic, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Toaster } from "sonner";
import DayButton from "../components/DaySubmitButton";

type UserCalories = {

    id: number;
    caloriesTarget: number;
    caloriesRemaining: number;
    Sunday: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Checked: string | null;
    userEmail: string;

}

const ButtonsComp = ({
    user,
}: {
    user: UserCalories,
}) => {


    const myModal = useRef<HTMLDialogElement>(null);
    const calModel = useRef<HTMLDialogElement>(null);


    const [customCals, setCustomCals] = useState('');
    const [theDay, setTheDay] = useState('');


    const [state, formAction] = useFormState(updateUserDay, null);
    const [stateCals, formActionStartingCals] = useFormState(updateUserCalories, null);


    let newUser = Object.entries(user);

    const [optimisticCals, addOptimisticCals] = useOptimistic(
        newUser,
        (oldState, newData: any) => {

            //replaces day in array with temp data from newData (gotten from form submit)
            //first checks if it's a reset of all days or just a change to one

            if(Object.entries(newData).length > 1){
                oldState.map((c)=>{
                    c[1] = Object.values(newData).at(0) as number;
                })

                return oldState;
            }

            oldState.map((c) => {
                // console.log(c[1])
                if (c[0] === Object.keys(newData).at(0)) {
                    c[1] = Object.values(newData).at(0) as number;
                    return;
                }
            })

            return oldState;
        }

    )

    // console.log(optimisticCals)



    function closeModels() {
        calModel.current?.close();
        myModal.current?.close();
    }


    function updateCalories(): void {
        // updateUserCalories(+customCals, user.userEmail);
        closeModels();
    }

    function removeCookies(): void {
        console.log('clicked')
    }


    function resetDay(): void {
        console.log('clicked')
    }

    return (
        user.caloriesTarget == 0 ?

            <>


                <Toaster position={'bottom-center'} />

                <div className='flex flex-col items-start'>

                    <input
                        className='input input-bordered w-full max-w-xs'
                        onChange={(e) => setCustomCals(e.target.value)}
                        placeholder='Daily Calorie Goal'>
                    </input>

                    <button className='btn btn-secondary my-3 w-full max-w-xs' onClick={() => updateCalories()}>Set Calories</button>
                </div>
            </>
            :
            <>

                <Toaster position={'bottom-center'} />

                <dialog ref={myModal}>
                    <div className='flex border-2 flex-col p-10'>
                        <form className="flex flex-col" action={async formData => {
                            const amount = formData.get('amount') ?? '0';
                            addOptimisticCals({
                                Monday: +amount as number,
                                Tuesday: +amount as number,
                                Wednesday: +amount as number,
                                Thursday: +amount as number,
                                Friday: +amount as number,
                                Saturday: +amount as number,
                                Sunday: +amount as number,
                            });
                            await updateUserCalories(stateCals, formData);
                        }}>
                            <input required type="number" name="amount" placeholder='Daily Calories Goal' className='input input-bordered m-5' ></input>

                            <input readOnly value={user.userEmail} hidden name='email' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <button className='btn btn-secondary m-5'>Set Calories</button>
                        </form>
                        <button className='btn btn-secondary m-5' onClick={() => removeCookies()}>Reset All</button>
                        <button className='btn btn-secondary m-5' onClick={() => closeModels()}>Close</button>

                    </div>
                </dialog>

                <dialog ref={calModel}>
                    <div className='flex border-2 flex-col p-5'>
                        <form className="flex flex-col" action={async formData => {
                            const amount = formData.get('calsDayAmount') ?? '0';
                            const day = formData.get('calsDay') as string;
                            addOptimisticCals({
                                [day]: +amount as number
                            });
                            await updateUserDay(state, formData);

                        }}>
                            <input required type="number" name="calsDayAmount" placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <input readOnly value={theDay} hidden name='calsDay' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <input readOnly value={user.userEmail} hidden name='calsDayEmail' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <DayButton />
                        </form>
                        <button className='btn btn-secondary m-5' onClick={() => resetDay()}>Reset Day</button>
                        <button className='btn btn-secondary m-5' onClick={() => closeModels()}>Close</button>

                    </div>
                </dialog>
                <p>Click on a day to add your calories.</p>

                <button className='btn btn-secondary my-5 max-w-xs' onClick={() => myModal.current?.showModal()}>⚙️ Settings</button>

                <h1>Starting Calories: {user.caloriesTarget}</h1>
                <h1>Calories Remaining: {user.caloriesRemaining}</h1>

                <div className='flex flex-col'>

                    {
                        optimisticCals.map((val) => {

                            if (val[0].includes('day')) {
                                return (
                                    <button key={val[0]} className='btn btn-secondary my-2 max-w-xs' onClick={() => { calModel.current?.showModal(); setTheDay(val[0]) }} >
                                        {val[0]}: {val[1]}
                                    </button>

                                )

                            }


                        })
                    }

                </div>
            </>
    )
}

export default ButtonsComp