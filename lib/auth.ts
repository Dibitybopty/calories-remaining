import { createUser } from "@/actions/create-user-session";
import { NextAuthOptions } from "next-auth";

import GoogleProvider from 'next-auth/providers/google';

export const authConfig: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
          }),
        ],
        secret: process.env.NEXT_PUBLIC_SECRET,
        callbacks: {
            async signIn(user) {
              await createUser(user.user?.name as string, user.user?.email as string, user.user?.image as string)
              return true;
            },
            
          }
        

    
} 