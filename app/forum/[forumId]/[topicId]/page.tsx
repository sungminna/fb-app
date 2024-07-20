import Image from "next/image"
import { MoreHorizontal } from "lucide-react"

import Link from "next/link";

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { auth, app } from "@/lib/firebase/auth"
import { useEffect } from "react";

const getToken = async() => {
  try{
      console.log(auth);
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

  const getPostList = async (forumId: string, topicId:string) => {
    const token = await getToken();
    const res = await fetch(`http://localhost:8000/community/posts/?forum_id=${forumId}&topic_id=${topicId}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      //next: { revalidate: 0}, 
      cache: "no-cache", 
    });
    if(!res.ok){
      throw new Error('Faild to fetch post data');
    }
    return res.json();
  }

export default async function Component({ params }: {params: {topicId: string, forumId: string}}) {
    /*const posts = [{'author': 'postauthor1', 'content': 'content1'},
                    {'author': 'postauthor2', 'content': 'content2'},
                    {'author': 'postauthor3', 'content': 'content3'},
                    {'author': 'postauthor4', 'content': 'content4'},
                ]
      */

    let posts = [];
    try{
      posts = await getPostList(params.forumId, params.topicId);
      console.log(posts);
    }
    catch(error){
      console.log(error);
    }
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts/ {params.topicId}</CardTitle>
        <CardDescription>
          Posts are here~~
          <Link href={`${params.topicId}/createPost`}>
            <Button>
              Create Post
            </Button>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
      {
        posts.map((post, index) => (
          <Card key={index} className='my-4'>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>
                <Link href={`/forum/${params.forumId}/${params.topicId}/${post.id}`}>{post.username}</Link>
              </CardTitle>
              <CardDescription>
                description
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              {post.content}
            </CardContent>
          </Card>              
        ))
            }
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  )
}

