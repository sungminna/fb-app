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

export default function Component({ params }: {params: {topicId: string, forumId: string}}) {
    const posts = [{'author': 'postauthor1', 'content': 'content1'},
                    {'author': 'postauthor2', 'content': 'content2'},
                    {'author': 'postauthor3', 'content': 'content3'},
                    {'author': 'postauthor4', 'content': 'content4'},
                ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts/ {params.topicId}</CardTitle>
        <CardDescription>
          Posts are here~~
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
            {
                posts.map((post, index) => (
                    <Card key={index} className='my-4'>
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle>
                          <Link href={`/forum/${params.forumId}/${params.topicId}/${index}`}>{post.author}</Link>
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

