'use client'

import { Button } from "@/components/ui/button"


import { useState, useEffect } from "react";

import Link from "next/link";
import { getToken } from "@/lib/firebase/getToken";



export function ManipuateButton({ params }: {params: {postUserId: string, postId:string, topicId: string}}) {
    const [id, setId] = useState("");
    const [owner, setOwner] = useState(false);

    const getUserId = async() => {
        try{
            const token = await getToken();
            const res = await fetch('http://localhost:8000/community/users/me', {
                method: 'GET', 
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`, 
                }, 
                //credentials: 'include', 
              });
            if (!res.ok){
                throw new Error(`HTTP error! statys: ${res.status}`);
            }
            const userData = await res.json()
            //console.log(res);
            return userData;
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        async function fetchData(){
            try{
                const userData = await getUserId();
                setOwner(userData.id.toString() == params.postUserId)
                await setId(userData.id.toString());
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

  return(
    <Link href={`${params.topicId}/${params.postId}/modifyPost`}>
        <Button
            disabled={!owner}
        >
        Update or Delete
        </Button>
    </Link>
  );
}