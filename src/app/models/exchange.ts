export interface Exchange {
    id: number;
    initiatorId: number;
    initiator: string;
    recipientId: number;
    recipient: string;
    bookId: number;
    book: string;
    confirmed: boolean;
}