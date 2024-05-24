export interface Message {
    id: number;
    chatId: number;
    senderId: number;
    nickname: string;
    photo: number[];
    content: string;
    timestamp: Date;
}