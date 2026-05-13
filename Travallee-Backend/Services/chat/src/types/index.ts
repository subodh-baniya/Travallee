import { Socket as SocketType } from 'socket.io';

export interface ExtendedSocket extends SocketType {
  userId: string;
  userRole: string;
}

export interface ChatMessage {
  _id: string;
  room: string;
  sender: string;
  senderName: string;
  message: string;
  messageType: 'text' | 'image' | 'file';
  attachmentUrl?: string;
  readBy: ReadReceipt[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadReceipt {
  userId: string;
  readAt: Date;
}

export interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface JoinRoomData {
  roomId: string;
}

export interface SendMessageData {
  roomId: string;
  message: string;
  senderName: string;
}

export interface TypingData {
  roomId: string;
  senderName: string;
}

export interface DeleteMessageData {
  messageId: string;
  roomId: string;
}

export interface EditMessageData {
  messageId: string;
  roomId: string;
  newMessage: string;
}

export interface MarkAsReadData {
  roomId: string;
  messageIds: string[];
}

export interface GetHistoryData {
  roomId: string;
  limit?: number;
  skip?: number;
}

export interface GetRoomUsersData {
  roomId: string;
}

export interface GetUserStatusData {
  userId: string;
}

export interface ReceiveMessageEvent extends ChatMessage {}

export interface UserJoinedEvent {
  userId: string;
  message: string;
  timestamp: Date;
}

export interface UserLeftEvent {
  userId: string;
  message: string;
  timestamp: Date;
}

export interface UserTypingEvent {
  userId: string;
  senderName: string;
}

export interface UserStopTypingEvent {
  userId: string;
}

export interface MessageDeletedEvent {
  messageId: string;
}

export interface MessageEditedEvent {
  messageId: string;
  newMessage: string;
  isEdited: boolean;
  editedAt: Date;
}

export interface RoomUsersEvent {
  roomId: string;
  users: string[];
  count: number;
}

export interface ChatHistoryEvent {
  roomId: string;
  messages: ChatMessage[];
}

export interface UserOnlineEvent {
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface UserOfflineEvent {
  userId: string;
  lastSeen: Date;
  timestamp: Date;
}

export interface ErrorEvent {
  message: string;
}

export interface MessageReadEvent {
  userId: string;
  messageIds: string[];
}
