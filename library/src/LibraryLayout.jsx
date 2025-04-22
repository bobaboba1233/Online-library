import  Input  from "./components/Input";
import { Search } from "lucide-react";
import  Avatar  from "./components/Avatar";
import Card from "./components/Card";

function LibraryLayout() {
  const books = [
    {
      cover: "/book-cover.jpg",
      title: "Ночной дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
    {
      cover: "/book-cover.jpg",
      title: "Ночной дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
    {
      cover: "/book-cover.jpg",
      title: "Ночной дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
    {
      cover: "/book-cover.jpg",
      title: "Ночной дозор",
      author: "Сергей Лукьяненко",
      genre: "Фантастика",
    },
  ];

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
      <div className="header-left">
        <a href="/" className="logo-link">
          <img src="/logo-book.png" alt="logo" className="w-8 h-8" />
        </a>
        <h1 className="text-2xl font-semibold">Библиотека</h1>
      </div>

        <div className="header-search">
          <div className="header-search-input">
            <Input
              type="text"
              placeholder="Поиск..."
            />
            <Search className="search-icon" size={20} />
          </div>
        </div>

        <div className="header-avatar">
          <Avatar src="/profile-avatar.png" />
        </div>
      </div>

      {/* Book list */}
      <div className="book-list">
        {books.map((book, index) => (
          <Card key={index} book={book} />
        ))}
      </div>
    </div>
  );
}

export default LibraryLayout;
