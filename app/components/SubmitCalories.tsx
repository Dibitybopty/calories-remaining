'use client';

import React, { useEffect} from 'react'

import { useFormStatus } from 'react-dom';

export const SubmitCalories = () => {

  const {pending, data } = useFormStatus();

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



useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        //if there's no items (fresh log) then store default values

        localStorage.setItem('storedDaysNew', 'testing');

    }
  }, []);


  return (
    <button disabled={pending} className='btn btn-secondary'>Submit</button>
  )
}