import { authConfig } from "@/lib/auth"
import { getServerSession } from "next-auth"
import ButtonsComp from "./buttons";
import { createUser } from "@/actions/create-user-session";

const CaloriesDB = async () => {

    const session = await getServerSession(authConfig);

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const user = await createUser(session?.user?.name ?? '', session?.user?.email ?? '', session?.user?.image ?? '');

    // console.log(user);

    // console.log('getting things')

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

    return (
        session && session.user ?

            <>


                <ButtonsComp user={user as UserCalories} />


            </>

            :

            <div>Please sign in above.</div>

    )

}



export default CaloriesDB