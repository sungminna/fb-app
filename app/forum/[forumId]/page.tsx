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
import { getToken } from "@/lib/firebase/getToken";

import { Topic } from "@/app/models/communityModel"


const getTopicList = async (forumId: string) => {
  const token = await getToken();
  const res = await fetch(`http://localhost:8000/community/topics/?forum_id=${forumId}`, {
    method: 'GET', 
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`, 
    }, 
    cache: "no-cache", 
  });
  if(!res.ok){
    throw new Error('Faild to fetch topic data');
  }
  return res.json();
}

export default async function Component({ params }: {params: {forumId: string}}) {
    let topics = [];
    try{
      const page_topics = await getTopicList(params.forumId)
      topics = page_topics.results;
    }
    catch(error){
      console.log(error);
    }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics/ {params.forumId}</CardTitle>
        <CardDescription>
          Topic is here~~
          <Link href={`${params.forumId}/createTopic`}>
            <Button>
              Create Topic
            </Button>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
            {
                topics.map((topic: Topic, index: number) => (
                    <TableRow key={ index }>
                        <TableCell className="hidden sm:table-cell">
                            <Image
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src="/placeholder.svg"
                            width="64"
                            />
                        </TableCell>
                        <TableCell className="font-medium">
                            <Link href={`/forum/${params.forumId}/${topic.id}`}>{topic.title}</Link>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">Draft</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{topic.description}</TableCell>
                        <TableCell className="hidden md:table-cell">25</TableCell>
                        <TableCell className="hidden md:table-cell">
                            {topic.created_at}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))
            }

          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  )
}
