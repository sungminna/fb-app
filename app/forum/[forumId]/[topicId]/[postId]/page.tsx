import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  MoreVertical,
  Truck,
} from "lucide-react"

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"

import { CommentInput } from "./comment"

import { auth, app } from "@/lib/firebase/auth"
import { useEffect } from "react";

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

  const getPost = async (forumId: string, topicId:string, postId:string) => {
    const token = await getToken();
    const res = await fetch(`http://localhost:8000/community/posts/${postId}`, {
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


  const getCommentList = async (postId:string) => {
    const token = await getToken();
    const res = await fetch(`http://localhost:8000/community/comments/?post_id=${postId}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      //next: { revalidate: 0}, 
      cache: "no-cache", 
    });
    if(!res.ok){
      throw new Error('Faild to fetch comment data');
    }
    return res.json();
  }

import { Separator } from "@/components/ui/separator"

export default async function Component({ params }: {params: {postId:string, topicId: string, forumId: string}}) {
    let post = [];
    try{
      post = await getPost(params.forumId, params.topicId, params.postId);
      console.log(post);
    }
    catch(error){
      console.log(error);
    }
    let comments = [];
    try{
        comments = await getCommentList(params.postId);
        console.log(comments);
    }
    catch(error){
        console.log(error);
    }



  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {post.username}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          <CardDescription>Date: {post.created_at}</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Track Order
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">{post.content}</div>
          <Separator className="my-2" />
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Comments</div>
          <dl className="grid gap-3">
            {
                comments.map((comment, index) => (
                    <div className="flex items-center justify-between" key={ index }>
                        <dt className="text-muted-foreground">{comment.username}</dt>
                      <dd>{comment.content}</dd>
                    </div>
                ))
            }
            <Separator className="my-4" />
            <CommentInput params={{postId: params.postId}}></CommentInput>
          </dl>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
