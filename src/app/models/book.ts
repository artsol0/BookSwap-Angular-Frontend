export interface Book {
    id: number;
    ownerId: number;
    title: string;
    author: string;
    description: string;
    genres: string[];
    quality: string;
    status: string;
    language: string;
    photo: number[];
}