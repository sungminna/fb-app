import { MoreHorizontal } from "lucide-react"

import Link from "next/link";
import { JoinButton } from "./joinBtn";
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

import { auth } from "@/lib/firebase/auth"


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

  const getChatRoomList = async () => {
    const token = await getToken();
    const res = await fetch('http://localhost:8000/chat/chatrooms/', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      //next: { revalidate: 0}, 
      cache: "no-cache", 
    });
    if(!res.ok){
      throw new Error('Faild to fetch forum data');
    }
    return res.json();
  }

export default async function Component() {

    //const forums = [{'forumName': 'forum1', 'description': 'description1'}, {'forumName': 'forum2', 'description': 'description2'}, {'forumName': 'forum3', 'description': 'description3'}, ]
    let chatrooms = [];
    try{
      const page_chatrooms = await getChatRoomList();
      chatrooms = page_chatrooms.results;
      console.log(chatrooms);
    }
    catch(error){
      console.log(error);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ChatRooms</CardTitle>
        <CardDescription>
          Chaty is here~~
          <Link href="chat/createChatRoom">
            <Button>
              Create Room
            </Button>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RoomName</TableHead>
              <TableHead>Onwer</TableHead>
              <TableHead>
                Control
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>Join</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
            {
                chatrooms.map((chatroom, index) => (
                    <TableRow key={ index }>
                        <TableCell className="font-medium">
                            <Link href={{pathname: '/chat/' + chatroom.id, 
                                        query: {
                                          room_name: chatroom.room_name, 
                                        }, 
                            }}as={'/chat/' + chatroom.id}>{chatroom.room_name || 'N/A'}</Link>
                        </TableCell>
                        <TableCell className="font-medium">{chatroom.owner_name || 'N/A'}</TableCell>
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
                              <Link href={{pathname: '/chat/' + chatroom.id + '/updateForum/', 
                              query: {
                                chatroomId: chatroom.id, 
                                owner: chatroom.owner, 
                              }, 
                              }}>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                              </Link>
                              <Link href="#">
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </Link>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium">
                          <JoinButton params={{chatroomId: chatroom.id}}></JoinButton>
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
