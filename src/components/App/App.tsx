// import { useState } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";

function App() {
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <NoteList />
        {/* SearchBox */}
        {/* Пагінація */}
        {/* Кнопка */}
      </header>
    </div>
  );
}

export default App;
