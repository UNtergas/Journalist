'use client';

import { SignInResponse, User } from "@shared/frontend";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter} from "next/navigation";
import ApiClient from "./api/ApiClient";

interface AuthContextType {
    authInit: boolean;
    signIn: (email: string, password: string) => Promise<SignInResponse>;
    signOut: () => void;
    currentUser: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [authInit, setAuthInit] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname()

    const signIn = async (email: string, password: string):Promise<SignInResponse> => {
        try {
            const res = await ApiClient.Auth.signIn(email, password);
            await fetchCurrentUser();
            return res;
        }catch(e){
            throw e;
        }
    }

    const fetchCurrentUser = async () => {
        try {
            const res = await ApiClient.User.getMe();
            setCurrentUser(res);
        }catch(e){
            throw e;
        }
    }

    const signOut = async ()=>{
        await ApiClient.Auth.signOut();
        setCurrentUser(null);
        router.push("/signIn");

    }

    const checkAuth = async (): Promise<boolean> => {
        try {
            // Use a lightweight endpoint to check if the user is authenticated
            return ApiClient.Auth.checkAuth();
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const initAuthContext = async () => {
            try {
                const isAuthenticated = await checkAuth();
                // console.log("Is authenticated", isAuthenticated);
                if (isAuthenticated) {
                    await fetchCurrentUser();
                    // console.log("User is logged in", currentUser as User);
                }else{
                    // console.log("User is not logged in");
                }
            } catch (e) {
                console.error("Failed to fetch user during initialization:", e);
                signOut();
            } finally {
                setAuthInit(true);
            }
        };

        initAuthContext();
    }, [pathname]);

    return(
        <AuthContext.Provider value={{currentUser, authInit, signIn, signOut}}>{children}</AuthContext.Provider>   
    )
}

export const useAuth = () =>{
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth
}