export interface User {
    id: number;
    nickname: string;
    email: string;
    points: number;
    activity: boolean;
    country: string;
    city: string;
    role: string;
    registrationDate: Date;
    photo: number[];
}