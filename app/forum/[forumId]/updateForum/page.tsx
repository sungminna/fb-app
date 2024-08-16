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
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from "react"
import { getToken } from "@/lib/firebase/getToken";

export default function Component({ params }: {params: {forumId: string}}) {
  const searchParams = useSearchParams();  
  const pTitle = searchParams.get('title');
  const pDescription = searchParams.get('description');
  const [title, setTitle] = useState(pTitle);
  const [description, setDescription] = useState(pDescription);


  const router = useRouter();

  const sendForumData = async () => {
    try{
      const token = await getToken();
      console.log(title, description);
      const res = await fetch(`https://sungminna.com/api/community/forums/${params.forumId}/`, {
        method: 'PATCH', 
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
        <CardTitle>Update Forum</CardTitle>
        <CardDescription>
          hehe
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Button onClick={sendForumData}>
              Update!
          </Button>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              className="w-full"
              placeholder='write title here!'
              defaultValue={pTitle || ""}
              disabled={pTitle != null}
              onChange={(e) => setTitle(e.target.value)}

            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder='write description here!'
              className="min-h-32"
              defaultValue={pDescription || ""}
              onChange={(e) => setDescription(e.target.value)}

            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
  

