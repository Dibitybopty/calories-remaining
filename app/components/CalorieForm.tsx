"use client";

import { useState, useRef, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

//calories need to be divided by days left

const CalorieForm = () => {
  let totalDays = [{
    day: 'Sunday',
    calories: 0,
    changed: false
  }, {
    day: 'Monday',
    calories: 0,
    changed: false
  }, {
    day: 'Tuesday',
    calories: 0,
    changed: false
  }, {
    day: 'Wednesday',
    calories: 0,
    changed: false
  }, {
    day: 'Thursday',
    calories: 0,
    changed: false
  }, {
    day: 'Friday',
    calories: 0,
    changed: false
  }, {
    day: 'Saturday',
    calories: 0,
    changed: false
  }];

  var localStoredDays = '';
  var storedTotalCals = '';
  var storedRemainingCals = '';

  var newDays: {
    day: string;
    calories: number;
    changed: boolean;
  }[] = [];


  const [startCalories, setStartCalories] = useState('');
  const [storedDays, setstoredDays] = useState('');
  let remainingCalories = parseInt(startCalories);
  const myModal = useRef<HTMLDialogElement>(null);

  const [totalCals, setTotalCals] = useState(remainingCalories);
  const [customCals, setCustomCals] = useState('');
  const [getDays, setGetDays] = useState(newDays);
  const [cals, setCals] = useState(0);
  let date = new Date();
  let today = date.getDay();

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

  const days = async () => {

    let minusDays = 7;

    newDays = getDays;

    newDays[today].calories = cals;
    newDays[today].changed = true;


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
    localStorage.setItem('totalCals', customCals);
    localStorage.setItem('remainingCals', customCals);
    toast.success('Calories Updated!');
    myModal.current?.close();

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

  return (


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
            <p className='text-center my-1'>Daily Calorie Goal:</p>
            <input className='input input-bordered w-full max-w-xs' onChange={(e) => setCustomCals(e.target.value)}></input>
            <button className='btn btn-secondary my-3 w-full max-w-xs' onClick={() => updateCalories()}>Set Calories</button>
          </div>
        </>
        :

        <>
          <Toaster position={'bottom-center'} />

          <dialog ref={myModal}>
            <div className='flex border-2 flex-col p-10'>
              <input className='input input-bordered' onChange={(e) => setCustomCals(e.target.value)}></input>
              <button className='btn btn-secondary m-5' onClick={() => updateCalories()}>Set Calories</button>
              <button className='btn btn-secondary m-5' onClick={() => removeCookies()}>Reset All</button>
              <button className='btn btn-secondary m-5' onClick={() => myModal.current?.close()}>Close</button>

            </div>
          </dialog>
          <button className='btn btn-secondary my-5' onClick={() => myModal.current?.showModal()}>⚙️ Settings</button>

          <h1>Starting Calories: {startCalories}</h1>
          <h1>Calories Remaining: {totalCals}</h1>

          <div className='flex py-5'>
            <form action={days} className='flex'>
              <input className='input input-bordered w-full max-w-xs' onChange={(e) => setCals(parseInt(e.target.value))} />
              <button className='btn btn-secondary ml-5'>Submit</button>
            </form>
          </div>

          <div>


            {getDays.map((days) => {
              return (

                <h2 key={days.day}>{days.day}: {days.calories}</h2>
              )
            })}
          </div>
        </>
  )
}

export default CalorieForm