'use client'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, useCallback } from "react";
import React from 'react';
import { getToken } from "@/lib/firebase/getToken";
import { Message } from "@/app/models/chatModel"

export default function ChatRoomList({ params }: {params: {chatroomId: string}}) {

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [id, setId] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initial, setInitial] = useState(1);
  const [prevScroll, setPrevScroll] = useState(0);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);


  const wsRef = useRef<WebSocket | null>(null);


  const socketWork = useCallback(async() => {
    try{
      const token = await getToken();
      const ws = new WebSocket(`ws://sungminna.com/ws/room/${params.chatroomId}/messages/?token=${token}`)
      wsRef.current = ws;
      
      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        setMessages((prevMessages) => {
          if (prevMessages.length === 0 || prevMessages[prevMessages.length - 1].id !== newMessage.id) {
            return [...prevMessages, newMessage];
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
  }, [params.chatroomId]);

  const getUserId = async() => {
    try{
        const token = await getToken();
        const res = await fetch('https://sungminna.com/api/community/users/me', {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`, 
            }, 
          });
        if (!res.ok){
            throw new Error(`HTTP error! statys: ${res.status}`);
        }
        const userData = await res.json()
        return userData;
    }
    catch(error){
        console.log(error);
    }
}
  
  const sendMessageData = useCallback(async () => {
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
  }, [text, params.chatroomId]);

  const loadMoreMessages = useCallback(async () => {
    if(!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try{
      const token = await getToken();
      var uri="";
      if(page === 1){
        uri = `https://sungminna.com/api/chat/messages/room_messages?room_id=${params.chatroomId}&page=${page}&page_size=10`;
      }
      else{
        uri = `https://sungminna.com/api/chat/messages/room_messages?room_id=${params.chatroomId}&page=${page}`;
      }
      const res = await fetch(uri, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const newMessages = data.results;
      if(newMessages.length === 0){
        setHasMore(false);
      } 
      else {
        setMessages(prevMessages => {
          // 중복 메시지 제거
          const uniqueNewMessages = newMessages.filter((newMsg: Message)=> 
            !prevMessages.some(prevMsg => prevMsg.id === newMsg.id)
          );
          return [...uniqueNewMessages.reverse(), ...prevMessages];
        });
        if(page === 1){
          setPage(2);
        }
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
  }, [hasMore, page, isLoadingMore, params.chatroomId]);



useEffect(() => {
    async function fetchData(){
        try{
            const userData = await getUserId();
            setId(userData.id.toString());
        }
        catch (error) {
            console.error(error);
        }
    }
    fetchData();
}, [])


const handleScroll = useCallback(async (event: React.UIEvent<HTMLDivElement>) => {
  setPrevScroll(event.currentTarget.scrollHeight);
  if (event.currentTarget.scrollTop === 0 && hasMore && !isLoadingMore) {
    loadMoreMessages();
    const pos = event.currentTarget.scrollHeight - prevScroll;
    event.currentTarget.scrollTo({top: pos});
  }
}, [hasMore, isLoadingMore, loadMoreMessages, prevScroll]);




useEffect(() => {
  if (lastMessageRef.current && messages.length > 0 && initial == 1) {
    lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
    setInitial(0);
  }
}, [messages, initial]);


  useEffect(() => {
    socketWork();
    loadMoreMessages();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [socketWork, loadMoreMessages]);



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
                value={text}
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