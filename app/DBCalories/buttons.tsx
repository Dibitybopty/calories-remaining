'use client';

import { updateUserCalories, updateUserDay } from "@/actions/update-user-calories";
import { useOptimistic, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Toaster } from "sonner";
import DayButton from "../components/DaySubmitButton";
import  CalCards  from "../components/CalCards";

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

            if (Object.entries(newData).length > 1) {
                // console.log('wtf')
                oldState.map((c) => {
                    c[1] = Object.values(newData).at(0) as number;
                })

                return oldState;
            }

            oldState.map((c) => {
                // console.log(c)
                if (c[0] === Object.keys(newData).at(0)) {
                    c[1] = Object.values(newData).at(0) as number;
                    
                }else{
                    c[1] = '...'
                }
            })

            

            return oldState;
        }

    )

    // console.log(optimisticCals)

    //get days to add checked emote on days with entries
    let tempDay = '';

    optimisticCals.map((val) => {
        if(Object.entries(val).at(1)?.[1]?.toString().includes('day')){
            tempDay += Object.entries(val).at(1)?.[1]?.toString()
        }
    })


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

                    <form id='startCals' className="flex flex-col" action={async formData => {
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
                        closeModels();
                        await updateUserCalories(stateCals, formData);

                    }}>
                        <input required type="number" name="amount" placeholder='Daily Calories Goal' className='input input-bordered my-5' ></input>
                        <input readOnly value={user.userEmail} hidden name='email' placeholder='Calories Consumed' className='input input-bordered ' ></input>
                        <button className='btn btn-neutral '>Set Calories</button>
                    </form>
                </div>
            </>
            :
            <>

                <Toaster position={'bottom-center'} />

                <dialog ref={myModal}>
                    <div className='flex border-2 flex-col p-10'>
                        <form id='legitUpdateCals' className="flex flex-col" action={async formData => {
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
                            closeModels();                            
                            await updateUserCalories(stateCals, formData);
                            
                        }}>
                            <input required type="number" name="amount" placeholder='Daily Calories Goal' className='input input-bordered m-5' ></input>
                            <input readOnly value={user.userEmail} hidden name='email' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <button className='btn btn-neutral m-5'>Set Calories</button>
                        </form>
                        <form className="flex flex-col" id='resetForm' action={formActionStartingCals}>
                            <input hidden readOnly value={0} type="number" name="amount" placeholder='Daily Calories Goal' className='input input-bordered m-5' ></input>
                            <input readOnly value={user.userEmail} hidden name='email' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <button className='btn btn-neutral m-5'>Reset All</button>
                        </form>

                        <button className='btn btn-neutral m-5' onClick={() => closeModels()}>Close</button>

                    </div>
                </dialog>

                <dialog ref={calModel}>
                    <div className='flex border-2 flex-col p-5'>
                        <form id="singleSub" className="flex flex-col" action={async formData => {
                            const amount = formData.get('amount') ?? '0';
                            const day = formData.get('day') as string;
                            addOptimisticCals({
                                [day]: +amount as number
                            });
                            closeModels();
                            await updateUserDay(state, formData);

                        }}>
                            <input required type="number" name="amount" placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <input readOnly value={theDay} hidden name='day' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <input readOnly value={user.userEmail} hidden name='email' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <DayButton />
                        </form>

                        <form id="resetForm" className="flex flex-col" action={async formData => {
                            const day = formData.get('day') as string;
                            addOptimisticCals({
                                [day]: '...'
                            });
                            closeModels();
                            await updateUserDay(state, formData, true);

                        }}>
                            <input readOnly hidden value={0} required type="number" name="amount" placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <input readOnly value={theDay} hidden name='day' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <input readOnly value={user.userEmail} hidden name='email' placeholder='Calories Consumed' className='input input-bordered m-5' ></input>
                            <button className='btn btn-neutral m-5'>Reset Day</button>
                        </form>
                        
                        <button className='btn btn-neutral m-5' onClick={() => closeModels()}>Close</button>

                    </div>
                </dialog>
                <p>Click on a day to add your calories.</p>

                <button className='btn btn-neutral my-5 max-w-xs' onClick={() => myModal.current?.showModal()}>⚙️ Settings</button>

                <h1>Starting Calories: {user.caloriesTarget}</h1>
                <h1>Calories Remaining: {user.caloriesRemaining}</h1>

                <div className='flex flex-col'>

                    {
                        
                        optimisticCals.map((val) => {    
                            // console.log(val)                      
                          
                            if (val[0].includes('day')) {
                                return (
                                    
                                <div key={val[0]} className="stats shadow my-1 hover:cursor-pointer bg-neutral" onClick={() => { calModel.current?.showModal(); setTheDay(val[0]) }}>
                                    <CalCards user={val} getDay={tempDay}  />
                                    </div>
                                    
                                    
                                    // <button key={val[0]} className='btn btn-neutral my-2 max-w-xs' onClick={() => { calModel.current?.showModal(); setTheDay(val[0]) }} >
                                    //     {val[0]}: {tempDay.includes(val[0]) ? `${val[1]} ✔️ `: val[1]}
                                        
                                    // </button>
                                    

                                )

                            }


                        })
                    }

                </div>
            </>
    )
}

export default ButtonsComp