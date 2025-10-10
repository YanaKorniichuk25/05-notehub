import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import toast from "react-hot-toast";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: removeNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete note");
      console.error(error);
    },
  });

  const handleDelete = (id: string) => {
    // якщо вже видаляється — ігноруємо
    if (mutation.isPending || deletingId) return;

    setDeletingId(id);
    mutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  if (!notes.length) return null;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
              disabled={deletingId === note.id || mutation.isPending}
            >
              {deletingId === note.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
