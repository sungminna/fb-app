'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Button } from "@/components/ui/button"

  import { auth } from "@/lib/firebase/auth"
  import { useRouter } from 'next/navigation'
  import { useState } from "react"

export default function Component() {

    const [roomname, setRoomname] = useState("");
    const getToken = async() => {
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
    const router = useRouter();

    const sendChatRoomData = async () => {
        try{
            const token = await getToken();
            const res = await fetch('http://localhost:8000/chat/chatrooms/', {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`, 
                }, 
                body: JSON.stringify({'room_name': roomname}), 
              });
            if (!res.ok){
                throw new Error(`HTTP error! statys: ${res.status}`);
            }
            router.push('/chat');
            router.refresh();
        }
        catch(error){
            console.log(error);
        }

    }


    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New ChatRoom</CardTitle>
          <CardDescription>
            hi!
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={sendChatRoomData}>
                Make it!
            </Button>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="roomname">RoomName</Label>
              <Input
                id="roomname"
                type="text"
                className="w-full"
                placeholder='write room name here!'
                defaultValue=""
                onChange={(e) => setRoomname(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  

