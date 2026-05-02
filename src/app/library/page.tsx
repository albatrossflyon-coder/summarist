"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import BookCard from "@/components/ui/BookCard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Book } from "@/types";

export default function LibraryPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user.uid) {
      router.push("/");
      return;
    }
    getDocs(collection(db, "users", user.uid, "savedBooks")).then((snap) => {
      setBooks(snap.docs.map((d) => d.data() as Book));
      setLoading(false);
    });
  }, [user.uid]);

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="library__wrapper">
        <div className="library__title">My Library</div>

        {loading && (
          <div className="library__books">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="book skeleton" style={{ height: 220 }} />
            ))}
          </div>
        )}

        {!loading && books.length === 0 && (
          <div className="library__empty">
            <div className="library__empty--title">Your library is empty</div>
            <div className="library__empty--sub">
              Save books from their detail page to find them here.
            </div>
            <Link href="/for-you" className="btn library__empty--btn">
              Discover books
            </Link>
          </div>
        )}

        {!loading && books.length > 0 && (
          <div className="library__books">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
