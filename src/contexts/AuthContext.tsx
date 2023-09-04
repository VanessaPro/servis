
import {ReactNode, createContext, useState, useEffect} from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConecction';

interface AuthProviderProps{
    children:ReactNode
}

type AuthContextData={
    signed:boolean;
    loadinAuth:boolean;
}

interface UserProps{
    uid:string;
    name:string |null;
    email:string |null;
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider ({ children }: AuthProviderProps){
   const  [user, setUser] = useState<UserProps | null>(null);
   const [loadinAuth, setLoadinAuth] = useState(true);

   useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
         if (user){
            setUser({
              uid: user.uid,
              name:user?.displayName,
              email:user?.email
            }) 

            setLoadinAuth(false);
         }else{
            setUser(null);
            setLoadinAuth(false);
         }
      })
       
      return () =>{
        unsub();
      }

   }, [])


    return(
        <AuthContext.Provider value={{
            signed: !!user,
            loadinAuth,
            }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthProvider;