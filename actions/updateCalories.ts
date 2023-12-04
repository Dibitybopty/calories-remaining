'use server';

import { cookies } from 'next/headers';

const updateCalories = async (formData: FormData) => {
    const content = formData.get('content');

    // console.log(Date.now());
    const oneDay = 24 * 60 * 60 * 1000 * 100000;
    cookies().set('newCals', content as string, { expires: Date.now() + oneDay});

  return {
    content,
  }
}

export default updateCalories