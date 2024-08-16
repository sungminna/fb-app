'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MyPagination } from "@/app/personalComponent/pagination";
import { ManipuateButton } from "./manipulate";
import { getToken } from "@/lib/firebase/getToken";
import { Post, PostListResponse } from "@/app/models/communityModel"

const getPostList = async (forumId: string, topicId:string, page: number = 1) => {
  const token = await getToken();
  const res = await fetch(`https://sungminna.com/api/community/posts/?forum_id=${forumId}&topic_id=${topicId}&page=${page}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`, 
    }, 
    cache: "no-cache", 
  });
  if(!res.ok){
    throw new Error('Faild to fetch post data');
  }
  return res.json();
  }

export default async function Component({ params, searchParams }: {
  params: {topicId: string, forumId: string}, 
  searchParams: {page?: string}
}) {
    const currentPage = Number(searchParams.page) || 1;
    let posts: Post[] = [];
    let page_posts: PostListResponse = {count: null, next: null, previous: null, results: []};
    try{
      page_posts = await getPostList(params.forumId, params.topicId, currentPage);
      posts = page_posts.results;
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
                  <ManipuateButton params={{topicId: params.topicId, postUserId: post.author, postId: post.id}}></ManipuateButton>
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
            Showing <strong>{(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, page_posts.count)}</strong> of <strong>{page_posts.count}</strong> posts
          </div>
          <MyPagination params={{count: page_posts.count, next: page_posts.next, previous: page_posts.previous, page_size: 10, currentPage: currentPage}}></MyPagination>
        </CardFooter>
      </Card>
    )
  }

