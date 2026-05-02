"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BookCard from "@/components/ui/BookCard";
import { searchBooks } from "@/lib/api";
import { Book } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { BiSearch } from "react-icons/bi";

export default function SearchPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!user.uid) router.push("/");
  }, [user.uid]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await searchBooks(query.trim());
      setResults(data);
      setLoading(false);
      setSearched(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="search__wrapper">
        <div className="search__content">

          <div className="search__input--wrapper">
            <BiSearch className="search__icon" />
            <input
              type="text"
              className="search__input"
              placeholder="Search for books or authors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {loading && (
            <div className="search__results">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="book skeleton" style={{ height: 220 }} />
              ))}
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="search__empty">
              <div className="search__empty--title">No results found</div>
              <div className="search__empty--sub">Try searching for a different book or author</div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="search__count">{results.length} result{results.length !== 1 ? "s" : ""}</div>
              <div className="search__results">
                {results.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </>
          )}

          {!query && (
            <div className="search__prompt">
              <BiSearch className="search__prompt--icon" />
              <div className="search__prompt--text">Start typing to search books and authors</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
