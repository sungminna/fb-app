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

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import React from 'react';
import { getToken } from "@/lib/firebase/getToken";
import { auth, app } from "@/lib/firebase/auth"

export default function ChatRoomList({ params }: {params: {chatroomId: string}}) {

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [id, setId] = useState("");
  const [chatId, setChatId] = useState("");
  const [username, setUsername] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initial, setInitial] = useState(0);
  const [prevScroll, setPrevScroll] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);



  const wsRef = useRef<WebSocket | null>(null);


  const socketWork = async() => {
    try{
      const token = await getToken();
      const ws = new WebSocket(`ws://localhost:8000/ws/room/${params.chatroomId}/messages/?token=${token}`)
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        console.log(newMessage);
        setMessages((prevMessages) => {
          if (prevMessages.length === 0 || prevMessages[prevMessages.length - 1].id !== newMessage.id) {
            return [...prevMessages, {
              id: newMessage.id, 
              chat: newMessage.chat, 
              sender: newMessage.sender,
              sender_name: newMessage.sender_name,
              text: newMessage.text,
              timestamp: newMessage.timestamp
            }];
          }
          return prevMessages;
        });
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
    
    }catch(error){
      console.log(error);
    }
  }

  const getUserId = async() => {
    try{
        const token = await getToken();
        const res = await fetch('http://localhost:8000/community/users/me', {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`, 
            }, 
            //credentials: 'include', 
          });
        if (!res.ok){
            throw new Error(`HTTP error! statys: ${res.status}`);
        }
        const userData = await res.json()
        //console.log(res);
        return userData;
    }
    catch(error){
        console.log(error);
    }
}
  

const getIsParticipant = async() => {
  try{
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/chat/chats/check?room_id=${params.chatroomId}`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`, 
          }, 
        });
      if (!res.ok){
          throw new Error(`HTTP error! status: ${res.status}`);
      }
      const userData = await res.json()
      //console.log(res);
      return userData;
  }
  catch(error){
      console.log(error);
  }
}

  const sendMessageData = async () => {
    try{
      if(wsRef.current && wsRef.current.readyState === WebSocket.OPEN){
        wsRef.current.send(JSON.stringify({
          type: 'chat_message', 
          text: text, 
          room_id: params.chatroomId
        }));
        setText("");
      }else{
        console.error("websocket not conn");
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const loadMoreMessages = useCallback(async () => {
    if(!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try{
      const token = await getToken();
      const res = await fetch(`http://localhost:8000/chat/messages/room_messages?room_id=${params.chatroomId}&page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(res);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const newMessages = data.results;
  
      if(newMessages.length === 0){
        setHasMore(false);
      } else {
        setMessages(prevMessages => [...newMessages.reverse(), ...prevMessages]);
        setPage(prevPage => prevPage + 1);
        setHasMore(data.next !== null);
      }

    }
    catch(error){
      console.log('error loading more msgs', error);
    }
    finally{
      setIsLoadingMore(false);
    }
  }, [hasMore, page, params.chatroomId]);



useEffect(() => {
    async function fetchData(){
        try{
            const chat = await getIsParticipant();
            setChatId(chat.id.toString());
            const userData2 = await getUserId();
            setId(userData2.id.toString());
            setUsername(userData2.username.toString());
        }
        catch (error) {
            console.error(error);
        }
    }
    fetchData();
}, [])




const handleScroll = useCallback((event) => {
  setPrevScroll(event.target.scrollHeight);
  if (event.target.scrollTop === 0 && hasMore && !isLoadingMore) {
    console.log("Reached top, loading more messages");
    loadMoreMessages();
    console.log(event.target.scrollHeight, prevScroll);
    setInitial(1);
    const pos = event.target.scrollHeight - prevScroll;
    event.target.scrollTo({top:pos + 5});
  }
}, [hasMore, isLoadingMore]);




useEffect(() => {
  if (lastMessageRef.current && messages.length > 0 && initial == 0) {
    lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
  }
}, [messages]);


  useEffect(() => {
    socketWork();
    loadMoreMessages();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);



  return (
    <main className="flex h-svh flex-col items-center justify-between p-12">
    <Card className="w-5/6 h-full my-6">
      <CardHeader>
        <CardTitle>{params.chatroomId}</CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col">
      <ScrollArea className="flex-grow h-96 w-full rounded-md border" ref={scrollAreaRef} onScrollCapture={handleScroll}>
          <div className="p-4 flex flex-col">
              {messages.map((message, index) => (
              <div key={index} 
                ref={index === messages.length - 1 ? lastMessageRef : null }
                className={`m-2 flex ${message.sender == id ? 'justify-end' : 'justify-start'}`}
              >
              <div className={`max-w-[70%] rounded-lg p-3 shadow ${
                message.sender == id ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}>
                <div className="font-semibold text-xs mb-1">{message.sender_name}</div>
                <div className="text-base break-words">{message.text}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
              ))}
          </div>
        </ScrollArea>
        <div className="flex w-svh items-center space-x-2 py-6">
          <Input type="text" 
                placeholder="message"
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key ==='Enter' && sendMessageData()}
          />
          <Button type="submit" onClick={sendMessageData}>Send</Button>
        </div>
      </CardContent>
    </Card>
  </main>
  );
}