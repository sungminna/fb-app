'use client'

import { Button } from "@/components/ui/button"


import { useState, useEffect } from "react";

import Link from "next/link";
import { getToken } from "@/lib/firebase/getToken";
import { join } from "path";



export function JoinButton({ params }: {params: {chatroomId: string}}) {
    const [joined, setJoined] = useState(true);

    const getIsParticipant = async() => {
        try{
            const token = await getToken();
            const res = await fetch(`http://localhost:8000/chat/chats/check?room_id=${params.chatroomId}`, {
                method: 'GET', 
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`, 
                }, 
              });
            if (!res.ok){
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const userData = await res.json()
            //console.log(res);
            return userData;
        }
        catch(error){
            console.log(error);
        }
    }

    const joinChat = async() => {
        try{
            const token = await getToken();
            const res = await fetch(`http://localhost:8000/chat/chats/`, {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`, 
                }, 
                body: JSON.stringify({'room_id': params.chatroomId}), 
              });
            if (!res.ok){
                throw new Error(`HTTP error! status: ${res.status}`);
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
                const userData = await getIsParticipant();
                console.log(userData);
                if(userData.participant == null){
                    setJoined(false);
                }
                else{
                    setJoined(true);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

  return(
    <Button
    disabled={joined}
    onClick={joinChat}
    >
        Join
    </Button>
  );
}