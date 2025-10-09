import { useState, useEffect } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import { useNotes } from "../../services/noteService";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawSearch, setRawSearch] = useState("");
  const [debouncedSearch] = useDebounce(rawSearch, 300);

  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  const { data, isSuccess, isLoading, isError } = useNotes(
    currentPage,
    debouncedSearch
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (isSuccess && data?.notes && data.notes.length === 0) {
      toast.error("No notes found.");
    }
  }, [isSuccess, data]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={rawSearch}
          onChange={(e) => setRawSearch(e.target.value)}
        />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}

      <Toaster
        toastOptions={{
          duration: 2000,
          position: "top-right",
        }}
      />
    </div>
  );
}
