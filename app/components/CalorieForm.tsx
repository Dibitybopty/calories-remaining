"use client";

import { useState, useRef, useEffect } from 'react';
import { Toaster, toast } from 'sonner';

//calories need to be divided by days left

const CalorieForm = () => {
  let totalDays = [{
    day: 'Sunday',
    calories: 1800,
    changed: false
  }, {
    day: 'Monday',
    calories: 1800,
    changed: false
  }, {
    day: 'Tuesday',
    calories: 1800,
    changed: false
  }, {
    day: 'Wednesday',
    calories: 1800,
    changed: false
  }, {
    day: 'Thursday',
    calories: 1800,
    changed: false
  }, {
    day: 'Friday',
    calories: 1800,
    changed: false
  }, {
    day: 'Saturday',
    calories: 1800,
    changed: false
  }];

  var storedDays = '';
  var storedTotalCals = '';
  var storedRemainingCals = '';

  var newDays: {
    day: string;
    calories: number;
    changed: boolean;
  }[] = [];


  const [startCalories, setStartCalories] = useState('');
  let remainingCalories = parseInt(startCalories);
  const myModal = useRef<HTMLDialogElement>(null);

  const [totalCals, setTotalCals] = useState(remainingCalories);
  const [customCals, setCustomCals] = useState('');
  const [getDays, setGetDays] = useState(newDays);
  const [cals, setCals] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [countDays, setCountDays] = useState(7);
  let date = new Date();
  let today = date.getDay();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {

      storedDays = localStorage.getItem('storedDays') ?? '';
      storedTotalCals = localStorage.getItem('totalCals') ?? '12600';
      storedRemainingCals = localStorage.getItem('remainingCals') ?? '12600';

      if (storedDays == '') {
        //if there's no items (fresh log) then store default values
        localStorage.setItem('storedDays', JSON.stringify(totalDays));
        localStorage.setItem('totalCals', '12600');
        localStorage.setItem('remainingCals', '12600');
      }

      newDays = JSON.parse(storedDays);

      remainingCalories = parseInt(storedRemainingCals);

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
    localStorage.setItem('totalCals', customCals);
    toast.success('Calories Updated!');
    myModal.current?.close();
  }

  return (
    <>
    <Toaster position={'bottom-center'} />

      <dialog ref={myModal}>
        <div className='flex border-2 flex-col p-10'>
          <input className='input input-bordered' onChange={(e) => setCustomCals(e.target.value)}></input>
          <button className='btn btn-secondary m-5' onClick={() => updateCalories()}>Set Calories</button>
          <button className='btn btn-secondary m-5' onClick={() => localStorage.setItem('storedDays', '')}>Remove Cookies</button>
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