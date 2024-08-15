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

  import { useRouter } from 'next/navigation'
  import { useEffect, useState, useCallback } from "react"

  import { AlertCircle } from "lucide-react" 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { getToken } from "@/lib/firebase/getToken";

export default function Component({ params }: {params: {forumId: string, topicId: string, username:string, postId:string}}) {

    const [content, setContent] = useState("");
    const [logged, setLogged] = useState(true);

    const router = useRouter();

    const getPostData = useCallback(async () => {
      try{
          const token = await getToken();
          const res = await fetch(`http://localhost:8000/community/posts/${params.postId}`, {
              method: 'GET', 
              headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`, 
              }, 
            });
          if (!res.ok){
              throw new Error(`HTTP error! statys: ${res.status}`);
          }
          const data = await res.json();          
          return data;
      }
      catch(error){
          console.log(error);
      }
    }, [params.postId]);

    const sendPostData = async () => {
        try{
            const token = await getToken();
            const res = await fetch(`http://localhost:8000/community/posts/${params.postId}/`, {
                method: 'PATCH', 
                headers: {
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${token}`, 
                }, 
                body: JSON.stringify({'content': content}), 
              });
            if (!res.ok){
                throw new Error(`HTTP error! statys: ${res.status}`);
            }
            router.push(`/forum/${params.forumId}/${params.topicId}`);
            router.refresh();
        }
        catch(error){
            console.log(error);
        }
    }
    const deletePostData = async () => {
      try{
          const token = await getToken();
          const res = await fetch(`http://localhost:8000/community/posts/${params.postId}/`, {
              method: 'DELETE', 
              headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`, 
              }, 
            });
          if (!res.ok){
              throw new Error(`HTTP error! statys: ${res.status}`);
          }
          router.push(`/forum/${params.forumId}/${params.topicId}`);
          router.refresh();
      }
      catch(error){
          console.log(error);
      }
  }

  useEffect(() => {
    async function fetchData(){
        try{
            const data = await getPostData();
            await setContent(data.content);
        }
        catch (error) {
            console.error(error);
        }
    }
    fetchData();
}, [getPostData]);



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
          <CardTitle>Modify Post</CardTitle>
          <CardDescription>
            hehe
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={sendPostData} disabled={!logged}>
                Update it!
            </Button>
            <Button onClick={deletePostData} disabled={!logged}>
              Delete it!
            </Button>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder='write contents here!'
                className="min-h-32"
                defaultValue={content}
                onChange={(e) => setContent(e.target.value)}

              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  

