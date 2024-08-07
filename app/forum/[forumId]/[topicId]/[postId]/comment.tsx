'use client'
import { Input } from "@/components/ui/input"
import {
    Card,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/auth"
import { useRouter } from 'next/navigation'



export function CommentInput({ params }: {params: {postId: string}}) {

    const [content, setContent] = useState("");
    const [logged, setLogged] = useState(true);
    const getToken = async() => {
        try{
            if(!auth.currentUser){
                console.log("no user signed in");
                setLogged(false);
                return;
              }
            setLogged(true);
            const user = auth.currentUser;
            const token = await user.getIdToken();
            return token;
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getToken();
    }, [])

    const router = useRouter();
    const sendCommentData = async () => {
        try{
            const token = await getToken();
            const res = await fetch('http://localhost:8000/community/comments/', {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`, 
                }, 
                body: JSON.stringify({'content': content, 'post': params.postId}), 
              });
            if (!res.ok){
                throw new Error(`HTTP error! statys: ${res.status}`);
            }
            router.refresh();
        }
        catch(error){
            console.log(error);
        }

    }

  return(
    <Card>
        <div className="flex w-full items-center space-x-2">
        <Input type="text" 
            id="comment"
            placeholder="comment" 
            onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={sendCommentData}
                disabled={!logged}        
        >
            Send
        </Button>
        </div>
    </Card>
  );
}