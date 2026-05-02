"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import BookCard from "@/components/ui/BookCard";
import { getSelectedBook, getRecommendedBooks, getSuggestedBooks } from "@/lib/api";
import { Book } from "@/types";
import { BsStarFill } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";

export default function ForYouPage() {
  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [sel, rec, sug] = await Promise.all([
        getSelectedBook(),
        getRecommendedBooks(),
        getSuggestedBooks(),
      ]);
      setSelected(sel);
      setRecommended(rec);
      setSuggested(sug);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="for-you__wrapper">
        <div className="for-you__content">

          {/* Selected Book */}
          <div className="for-you__title">Selected just for you</div>
          {loading ? (
            <div className="selected__book skeleton" />
          ) : selected ? (
            <Link href={`/book/${selected.id}`} className="selected__book">
              <div className="selected__book--sub--title">{selected.subTitle}</div>
              <div className="selected__book--line" />
              <div className="selected__book--content">
                <figure className="selected__book--image--mask">
                  <img src={selected.imageLink} alt={selected.title} className="selected__book--image" />
                </figure>
                <div className="selected__book--text">
                  <div className="selected__book--title">{selected.title}</div>
                  <div className="selected__book--author">{selected.author}</div>
                  <div className="selected__book--details--wrapper">
                    <div className="selected__book--details">
                      <AiOutlineClockCircle />
                      <span className="selected__book--details--text">{selected.type}</span>
                    </div>
                    <div className="selected__book--details">
                      <BsStarFill />
                      <span className="selected__book--details--text">
                        {selected.averageRating?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          {/* Recommended */}
          <div className="for-you__title">Recommended for you</div>
          <div className="for-you__sub--title">We think you&apos;ll like these</div>
          <div className="for-you__recommended--books">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="book skeleton" />
                ))
              : recommended.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
          </div>

          {/* Suggested */}
          <div className="for-you__title">Suggested books</div>
          <div className="for-you__sub--title">Browse these curated lists</div>
          <div className="for-you__recommended--books">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="book skeleton" />
                ))
              : suggested.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
          </div>

        </div>
      </div>
    </div>
  );
}
