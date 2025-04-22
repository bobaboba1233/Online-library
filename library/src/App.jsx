import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LibraryLayout from "./LibraryLayout";
import ProfilePage from "./pages/ProfilePage";
import BookPage from "./pages/BookPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LibraryLayout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;