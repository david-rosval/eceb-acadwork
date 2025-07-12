export interface Category {
  id: number;
  name: string;
  serviceCount: number;
}

export interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  sender: {
    firstName: string
    lastName: string
  }
  createdAt: string
  readStatus: boolean
}

export interface PusherMessage {
  id: string
  content: string
  senderId: string
  receiverId: string
  senderName: string
  timestamp: string
}