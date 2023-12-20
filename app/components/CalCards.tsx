import { PiFireDuotone } from "react-icons/pi";

export const CalCards = ({user, getDay}:any) => {

    const days:string = getDay;

    return (
        <>
            <div className="stat ">

                <div className="stat-figure text-secondary">

                    <div className="w-24 rounded-full">


                        <div className="stat-action ">
                            
                            <button className="btn">Update</button>

                        </div>

                    </div>

                </div>
                <div className="stat-title text-secondary">{user[0]}</div>
                <div className="stat-value flex items-center justify-between">{days.includes(user[0]) ? <>{user[1]} <div className="text-secondary"><PiFireDuotone/></div>  </>  : user[1]}</div>
                <div className="stat-title">Calories consumed</div>
                
            </div>


        </>
    )
}
