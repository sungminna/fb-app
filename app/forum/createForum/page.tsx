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
  import { Textarea } from "@/components/ui/textarea"
  import { Button } from "@/components/ui/button"

  import { auth } from "@/lib/firebase/auth"
  import { useRouter } from 'next/navigation'
  import { useState } from "react"

export default function Component() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
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

    const sendForumData = async () => {
        try{
            const token = await getToken();
            const res = await fetch('http://localhost:8000/community/forums/', {
                method: 'POST', 
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`, 
                }, 
                body: JSON.stringify({'title': title, 'description': description}), 
              });
            if (!res.ok){
                throw new Error(`HTTP error! statys: ${res.status}`);
            }
            router.push('/forum');
            router.refresh();
        }
        catch(error){
            console.log(error);
        }

    }


    return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Fourm</CardTitle>
          <CardDescription>
            hehe
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={sendForumData}>
                Make it!
            </Button>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                className="w-full"
                placeholder='write title here!'
                defaultValue=""
                onChange={(e) => setTitle(e.target.value)}

              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder='write description here!'
                className="min-h-32"
                defaultValue=""
                onChange={(e) => setDescription(e.target.value)}

              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  

