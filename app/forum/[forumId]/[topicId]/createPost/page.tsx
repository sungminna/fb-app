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
  import Link from "next/link";
  import { Button } from "@/components/ui/button"

  import { auth, app } from "@/lib/firebase/auth"
  import { useRouter } from 'next/navigation'
  import { useEffect, useState } from "react"

  import { AlertCircle } from "lucide-react" 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function Component({ params }: {params: {forumId: string, topicId: string}}) {

    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [logged, setLogged] = useState(true);
    const getToken = async() => {
        try{
            console.log(auth.currentUser);

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
    const sendPostData = async () => {
        try{
            const token = await getToken();
            const res = await fetch('http://localhost:8000/community/posts/', {
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
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                className="w-full"
                placeholder='Who is Author'
                defaultValue=""
                onChange={(e) => setAuthor(e.target.value)}

              />
            </div>
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
  

