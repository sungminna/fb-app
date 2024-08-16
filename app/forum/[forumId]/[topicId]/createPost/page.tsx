'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase/auth"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"

import { AlertCircle } from "lucide-react" 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { getToken } from "@/lib/firebase/getToken";


export default function Component({ params }: {params: {forumId: string, topicId: string, username:string}}) {

  const [content, setContent] = useState("");
  const [logged, setLogged] = useState(true);

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

  const router = useRouter();
  const sendPostData = async () => {
      try{
          const token = await getToken();
          const res = await fetch('https://sungminna.com/api/community/posts/', {
              method: 'POST', 
              headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`, 
              }, 
              body: JSON.stringify({'content': content, 'topic': params.topicId}), 
            });
          if (!res.ok){
              throw new Error(`HTTP error! statys: ${res.status}`);
          }
          console.log(res);
          router.push(`/forum/${params.forumId}/${params.topicId}`);
          router.refresh();
      }
      catch(error){
          console.log(error);
      }
  }


  return (
    <Card>
      <Alert variant="destructive" hidden={logged}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
              Log in to create 
          </AlertDescription>
      </Alert>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>
          hehe
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Button onClick={sendPostData} disabled={!logged}>
              Make it!
          </Button>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder='write contents here!'
              className="min-h-32"
              defaultValue=""
              onChange={(e) => setContent(e.target.value)}

            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
  

