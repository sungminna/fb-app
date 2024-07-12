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

  const getForumList = async () => {
    const token = await getToken();
    const res = await fetch('http://localhost:8000/community/forums/', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
    });
    if(!res.ok){
      throw new Error('Faild to fetch forum data');
    }
    return res.json();
  }

export default async function Component() {

    //const forums = [{'forumName': 'forum1', 'description': 'description1'}, {'forumName': 'forum2', 'description': 'description2'}, {'forumName': 'forum3', 'description': 'description3'}, ]
    let forums = [];
    try{
      forums = await getForumList();
    }
    catch(error){
      console.log(error);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forums</CardTitle>
        <CardDescription>
          Forum is here~~
          <Link href="forum/createForum">
            <Button>
              Create Forum
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
                forums.map((forum, index) => (
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
                            <Link href={'/forum/' + index}>{forum.forumName || 'N/A'}</Link>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">Draft</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{forum.description || 'N/A'}</TableCell>
                        <TableCell className="hidden md:table-cell">25</TableCell>
                        <TableCell className="hidden md:table-cell">
                            2023-07-12 10:42 AM
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
