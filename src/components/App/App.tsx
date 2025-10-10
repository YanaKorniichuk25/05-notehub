import { useState, type ChangeEvent } from "react";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useNotes } from "../../services/noteService";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawSearch, setRawSearch] = useState("");
  const [search] = useDebounce(rawSearch, 300);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useNotes(currentPage, search);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRawSearch(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={rawSearch} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}
      {data?.notes && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  );
}
