'use client'
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Container } from "postcss"
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, useInfiniteQuery} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useMemo, useState } from "react";
import axios from "axios";
import React from 'react';
import { getToken } from "@/lib/firebase/getToken";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `username.${a.length - i}`
)

interface ChatListComponentProps extends AppProps{
  params: {
    chatroomId: string;
  };
}

export default function ChatListComponent({ Component, pageProps, params }: ChatListComponentProps ) {
  const queryClient = useMemo(() => new QueryClient(), []);
  const getMessageList = async(page: number=1) => {
    try{
      const res = await axios.get(
        `chat/messages/room_messages?room_id=${params.chatroomId}&page=${page}`
      );
      return res;
    }
    catch(error){
      console.log(error);
    }
  };
  const [ text, setText] = useState("");
  
  const sendMessageData = async () => {
    try{
        const token = await getToken();
        const res = await fetch(`http://localhost:8000/chat/messages/`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`, 
            }, 
            body: JSON.stringify({'text': text, 'chat_id': params.chatroomId}), 
          });
        if (!res.ok){
            throw new Error(`HTTP error! statys: ${res.status}`);
        }
        console.log(res);
    }
    catch(error){
        console.log(error);
    }
  }
  return (
    <main className="flex h-svh flex-col items-center justify-between p-12">
    <Card className="w-5/6 h-full">
      <CardHeader>
        <CardTitle>{params.chatroomId}</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <ScrollArea className="h-96 w-full rounded-md border">
          <div className="h-full p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
              {tags.map((tag) => (
                <>
                  <div key={tag} className="text-sm">
                    {tag}
                  </div>
                  <Card className="justify-left">
                    <CardContent>
                      <p className="text-left">
                        text
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="jsutify-right">
                    <CardContent className="container mx-auto text-wrap">
                      asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf
                      asdfasdfasdfasdfasdfasdfasdfasdfa
                      sdfasdfasdfassddddddddd
                      asdfasdfasdfasdfasdfasdfasdfasdfasdfasdf
                      ffffffffff
                      ffffffffff

                    </CardContent>
                  </Card>
                  <Separator className="my-2" />
                </>
              ))}
          </div>
        </ScrollArea>
        <div className="flex w-svh items-center space-x-2 py-6">
          <Input type="text" 
                placeholder="message"
                onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" onClick={sendMessageData}>Send</Button>
        </div>
      </CardContent>
    </Card>
  </main>
  );
}