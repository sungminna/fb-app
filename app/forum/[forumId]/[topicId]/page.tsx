
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
import { MyPagination } from "@/app/personalComponent/pagination";

import { ManipuateButton } from "./manipulate";
import { getToken } from "@/lib/firebase/getToken";

  const getPostList = async (forumId: string, topicId:string, page: number = 1) => {
    const token = await getToken();
    const res = await fetch(`http://localhost:8000/community/posts/?forum_id=${forumId}&topic_id=${topicId}&page=${page}`, {
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

export default async function Component({ params, searchParams }: {
  params: {topicId: string, forumId: string}, 
  searchParams: {page?: string}
}) {
    /*const posts = [{'author': 'postauthor1', 'content': 'content1'},
                    {'author': 'postauthor2', 'content': 'content2'},
                    {'author': 'postauthor3', 'content': 'content3'},
                    {'author': 'postauthor4', 'content': 'content4'},
                ]
      */
    const currentPage = Number(searchParams.page) || 1;
    let posts = [];
    let page_posts = {};
    try{
      page_posts = await getPostList(params.forumId, params.topicId, currentPage);
      posts = page_posts.results;
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
          Showing <strong>{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, page_posts.count)}</strong> of <strong>{page_posts.count}</strong> posts
        </div>
        <MyPagination params={{count: page_posts.count, next: page_posts.next, previous: page_posts.previous, page_size: 10, currentPage: currentPage}}></MyPagination>
      </CardFooter>
    </Card>
  )
}

