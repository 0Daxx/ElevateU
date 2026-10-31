import {create} from "zustand";

interface AuthState {
    isAuth : boolean ;
    setIsAuth : (isAuth : boolean) => void ;
}

export const useAuthStore = create<AuthState>((set)=>({
    isAuth : true,
    setIsAuth : (isAuth : boolean) => set({isAuth})
}))