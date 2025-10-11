export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "personal" | "work" | "ideas" | "others";
  createdAt: string;
  updatedAt: string;
}
