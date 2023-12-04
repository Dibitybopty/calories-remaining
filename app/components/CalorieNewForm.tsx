import React from 'react'
import { SubmitCalories } from './SubmitCalories'
import updateCalories from '@/actions/updateCalories'

const CalorieNewForm = () => {
  return (
    <>
    <form action={updateCalories}>
        <input
        className='input input-bordered m-5'
        type='text' 
        name='content'
        placeholder='Daily Calories'
        required
        />
        <SubmitCalories />

    </form>
    <div></div>
    </>
  )
}

export default CalorieNewForm