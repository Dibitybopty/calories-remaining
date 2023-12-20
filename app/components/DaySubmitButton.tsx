import { useFormStatus } from "react-dom"

const DayButton = () => {
    const {pending} = useFormStatus();
  return (
    <button disabled={pending} className='btn btn-neutral m-5' >{pending ? 'Submitting...' : 'Submit'}</button>
  )
}

export default DayButton