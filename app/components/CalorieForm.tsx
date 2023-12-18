"use client";

import { useSession } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

//calories need to be divided by days left

const CalorieForm = () => {
  let totalDays = [{
    day: 'Sunday',
    calories: 0,
    changed: false,
    dayCode: 0
  }, {
    day: 'Monday',
    calories: 0,
    changed: false,
    dayCode: 1
  }, {
    day: 'Tuesday',
    calories: 0,
    changed: false,
    dayCode: 2
  }, {
    day: 'Wednesday',
    calories: 0,
    changed: false,
    dayCode: 3
  }, {
    day: 'Thursday',
    calories: 0,
    changed: false,
    dayCode: 4
  }, {
    day: 'Friday',
    calories: 0,
    changed: false,
    dayCode: 5
  }, {
    day: 'Saturday',
    calories: 0,
    changed: false,
    dayCode: 6
  }];

  var localStoredDays = '';
  var storedTotalCals = '';
  var storedRemainingCals = '';

  var newDays: {
    day: string;
    calories: number;
    changed: boolean;
    dayCode: number;
  }[] = [];

  const {data : session} = useSession();

  const [startCalories, setStartCalories] = useState('');
  const [storedDays, setstoredDays] = useState('');
  let remainingCalories = parseInt(startCalories);
  const [theDay, setTheDay] = useState(0);
  const myModal = useRef<HTMLDialogElement>(null);
  const calModel = useRef<HTMLDialogElement>(null);

  const [totalCals, setTotalCals] = useState(remainingCalories);
  const [customCals, setCustomCals] = useState('');
  const [getDays, setGetDays] = useState(newDays);
  // let date = new Date();
  // let today = date.getDay();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {

      localStoredDays = localStorage.getItem('storedDays') ?? '';

      setstoredDays(localStoredDays);

      storedTotalCals = localStorage.getItem('totalCals') ?? '0';
      storedRemainingCals = localStorage.getItem('remainingCals') ?? '0';

      if (localStoredDays == '') {
        //if there's no items (fresh log) then store default values

        localStorage.setItem('storedDays', JSON.stringify(totalDays));
        localStorage.setItem('totalCals', '0');
        localStorage.setItem('remainingCals', '0');

        localStoredDays = localStorage.getItem('storedDays') ?? '';

      }

      newDays = JSON.parse(localStoredDays);

      remainingCalories = parseInt(storedRemainingCals);

      setstoredDays(localStoredDays);
      setTotalCals(remainingCalories);
      setStartCalories(storedTotalCals);


      setGetDays(newDays);
    }
  }, []);

  const days = (day: number | null) => {

    let minusDays = 7;

    newDays = getDays;

    if (day !== null) {
      newDays[day].calories = +customCals;
      newDays[day].changed = true;
    }




    //go through and minus the calories of the days already checked
    //then go through again and spread out the remaining calories to the rest of the days
    newDays.forEach((val) => {

      if (val.changed == true) {
        remainingCalories -= val.calories;
        minusDays--;
      }

    });

    newDays.forEach((val) => {
      if (!val.changed) {
        val.calories = Math.round(remainingCalories / minusDays);
      }
    })

    setTotalCals(remainingCalories);

    setGetDays(newDays);

    localStorage.setItem('storedDays', JSON.stringify(newDays));
    localStorage.setItem('remainingCals', JSON.stringify(remainingCalories));

    calModel.current?.close();

  }

  const updateCalories = () => {

    //multiply calories by 7 for week
    let multiCals: number = +customCals * 7;

    newDays = getDays;

    newDays.forEach((val) => {
      if (!val.changed) {
        val.calories = Math.round(multiCals / 7);
      }
    })

    setGetDays(newDays);

    localStorage.setItem('storedDays', JSON.stringify(newDays));
    localStorage.setItem('totalCals', multiCals.toString());
    localStorage.setItem('remainingCals', multiCals.toString());
    toast.success('Calories Updated!');
    myModal.current?.close();
    calModel.current?.close();

    setStartCalories(multiCals.toString());
    setTotalCals(multiCals);
  }

  const removeCookies = () => {
    localStorage.setItem('storedDays', '')
    localStorage.setItem('remainingCals', '')
    localStorage.setItem('totalCals', '');

    setStartCalories('0');
    remainingCalories = 0;
    setCustomCals('0');
    setTotalCals(0);

    setGetDays(totalDays);

    toast.success('Week Reset!');
    myModal.current?.close();

  }

  const resetDay = (theDay: number) => {

    newDays = getDays;

    newDays[theDay].changed = false;

    setGetDays(newDays);

    days(null);

    // console.log(getDays);

  }

  return (

    session && session.user ? 


    storedDays.length < 1 ?

      <>
        <div>
          <h1>Loading Content</h1>
        </div>

      </>

      :

      startCalories == '0' ?

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
              <input placeholder='Daily Goal' className='input input-bordered' onChange={(e) => setCustomCals(e.target.value)}></input>
              <button className='btn btn-secondary m-5' onClick={() => updateCalories()}>Set Calories</button>
              <button className='btn btn-secondary m-5' onClick={() => removeCookies()}>Reset All</button>
              <button className='btn btn-secondary m-5' onClick={() => myModal.current?.close()}>Close</button>

            </div>
          </dialog>

          <dialog ref={calModel}>
            <div className='flex border-2 flex-col p-10'>
              <input placeholder='Calories Consumed' className='input input-bordered' onChange={(e) => setCustomCals(e.target.value)}></input>
              <button className='btn btn-secondary m-5' onClick={() => days(theDay)}>Submit</button>
              <button className='btn btn-secondary m-5' onClick={() => resetDay(theDay)}>Reset Day</button>
              <button className='btn btn-secondary m-5' onClick={() => calModel.current?.close()}>Close</button>

            </div>
          </dialog>
          <p>Click on a day to add your calories.</p>

          <button className='btn btn-secondary my-5 max-w-xs' onClick={() => myModal.current?.showModal()}>⚙️ Settings</button>

          <h1>Starting Calories: {startCalories}</h1>
          <h1>Calories Remaining: {totalCals}</h1>

          {/* <div className='flex py-5'>
            <form action={days} className='flex'>
              <input className='input input-bordered w-full max-w-xs' onChange={(e) => setCals(parseInt(e.target.value))} />
              <button className='btn btn-secondary ml-5'>Submit</button>
            </form>
          </div> */}

          <div className='flex flex-col'>


            {getDays.map((days) => {
              return (

                <button onClick={() => { calModel.current?.showModal(); setTheDay(days.dayCode); }} className='btn btn-secondary my-2 max-w-xs' key={days.day}>{days.day}: {days.calories} {days.changed ? '✔️' : ''}</button>
              )
            })}
          </div>

          <p>Track your weekly calories.</p>
          <p>If you go over (or under) your daily calories on any day,</p> 
          <p>this tool will automatically recalculate your remaining days calories for the week.</p>
          
        </>

        :

        <>
        <div>
          <p>Please log in above.</p>
        </div>
        </>
        
  )
}

export default CalorieForm