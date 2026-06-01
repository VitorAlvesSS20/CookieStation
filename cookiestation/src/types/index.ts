export interface Story {
  id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt?: Date | number | { seconds: number };
}