import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { Note } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

axios.defaults.baseURL = "https://notehub-public.goit.study/api/";

const loadNotes = async (
  page: number,
  search: string
): Promise<NotesResponse> => {
  try {
    const response = await axios.get<NotesResponse>("notes", {
      params: { page, perPage: 12, search },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error("Could not load notes");
    throw error;
  }
};

export const addNote = async (data: {
  title: string;
  content?: string;
  tag: string;
}): Promise<Note> => {
  try {
    const response = await axios.post<Note>("notes", data, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    toast.success("New note saved!");
    return response.data;
  } catch (error) {
    toast.error("Error creating note");
    throw error;
  }
};

export const removeNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.delete<Note>(`/notes/${id}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Note removed");
    return response.data;
  } catch (error) {
    toast.error("Error deleting note");
    throw error;
  }
};

export const useNotes = (currentPage: number, search: string) => {
  return useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => loadNotes(currentPage, search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};
