import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rawSearch, setRawSearch] = useState("");
  const [debouncedSearch] = useDebounce(rawSearch, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useQuery<NotesResponse>({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, debouncedSearch),
    staleTime: 1000 * 60, // 1 хвилина, щоб кеш не оновлювався миттєво
    placeholderData: { notes: [], totalPages: 1 },
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={rawSearch}
          onChange={(e) => setRawSearch(e.target.value)}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
