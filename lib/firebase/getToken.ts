import { auth } from "@/lib/firebase/auth"


export const getToken = async() => {
    try{
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        return token;
    }
    catch(error){
        console.log(error);
    }
}


export const getTokenServer = async() => {
    try{
        if(!auth.currentUser){
            console.log("no user signed in");
            return;
          }
        const user = auth.currentUser;
        const token = await user.getIdToken();
        const userString = JSON.stringify(user)

        localStorage.setItem('user', userString);
        localStorage.setItem('token', token);
        return token;
    }
    catch(error){
        console.log(error);
    }
}