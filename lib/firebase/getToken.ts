import { auth, app } from "@/lib/firebase/auth"


export const getToken = async() => {
    try{
        if(!auth.currentUser){
            console.log("no user signed in");
            return;
          }
        const user = auth.currentUser;
        const token = await user.getIdToken();
        return token;
    }
    catch(error){
        console.log(error);
    }
}

