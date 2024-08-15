export interface ChatRoom {
    id: any;
    room_name: any;
    owner: any;
    owner_name: any;
    timestamp: any;
}
export interface Chat{
    id: any;
    chatroom: any;
    participant: any;
    timestamp: any;
}
export interface Message{
    id: any;
    chat: any;
    sender: any;
    sender_name: any;
    text: any;
    timestamp: any;
}