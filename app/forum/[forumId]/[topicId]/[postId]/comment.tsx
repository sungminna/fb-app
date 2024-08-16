'use client'
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase/auth"
import { useRouter } from 'next/navigation'
import { getToken } from "@/lib/firebase/getToken";

export function CommentInput({ params }: {params: {postId: string}}) {

  const [content, setContent] = useState("");
  const [logged, setLogged] = useState(true);

  const router = useRouter();
  const sendCommentData = async () => {
    try{
        const token = await getToken();
        const res = await fetch('https://sungminna.com/api/community/comments/', {
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
  
  useEffect(() => {
    async function fetchData(){
        const token = await getToken();
        if(token){
            setLogged(true);
        }
        else{
            setLogged(false);
        }
    }
    fetchData();
  }, []);

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