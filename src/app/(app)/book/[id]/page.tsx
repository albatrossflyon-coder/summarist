"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBookById } from "@/lib/api";
import { Book } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { db } from "@/lib/firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { BsStarFill, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { AiOutlineClockCircle, AiOutlineRead, AiFillPlayCircle } from "react-icons/ai";
import { BiMicrophone } from "react-icons/bi";
import { RiLightbulbFlashLine } from "react-icons/ri";

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user.authLoading) return;
    if (!user.uid) {
      router.push("/");
      return;
    }
    getBookById(id).then((data) => {
      setBook(data);
      setLoading(false);
    });
    getDoc(doc(db, "users", user.uid, "savedBooks", id)).then((snap) => {
      setSaved(snap.exists());
    });
  }, [id, user.uid, user.authLoading]);

  async function toggleSave() {
    if (!user.uid || !book) return;
    const ref = doc(db, "users", user.uid, "savedBooks", book.id);
    if (saved) {
      await deleteDoc(ref);
      setSaved(false);
    } else {
      await setDoc(ref, book);
      setSaved(true);
    }
  }

  const isPremiumLocked = book?.subscriptionRequired && !user.isSubscribed;

  if (loading) {
    return (
      <div className="book-detail__wrapper">
        <div className="book-detail__skeleton--title skeleton" />
        <div className="book-detail__skeleton--content skeleton" />
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="book-detail__wrapper">
      <div className="book-detail__content">

        {/* Left column */}
        <div className="book-detail__left">
          <div className="book-detail__title">{book.title}</div>
          <div className="book-detail__author">{book.author}</div>
          <div className="book-detail__sub--title">{book.subTitle}</div>

          <div className="book-detail__stats">
            <div className="book-detail__stat">
              <BsStarFill />
              <span>{book.averageRating?.toFixed(1)} ({book.totalRating} ratings)</span>
            </div>
            <div className="book-detail__stat">
              <AiOutlineClockCircle />
              <span>{book.type}</span>
            </div>
            <div className="book-detail__stat">
              <RiLightbulbFlashLine />
              <span>{book.keyIdeas} Key ideas</span>
            </div>
          </div>

          <div className="book-detail__btns">
            {isPremiumLocked ? (
              <Link href="/choose-plan" className="btn book-detail__btn">
                Get Premium
              </Link>
            ) : (
              <>
                <Link href={`/player/${book.id}?type=read`} className="btn book-detail__btn">
                  <AiOutlineRead />
                  Read
                </Link>
                <Link href={`/player/${book.id}?type=listen`} className="btn book-detail__btn">
                  <BiMicrophone />
                  Listen
                </Link>
              </>
            )}
            <button className="btn btn--secondary book-detail__btn" onClick={toggleSave}>
              {saved ? <BsBookmarkFill /> : <BsBookmark />}
              {saved ? "Saved" : "Add to Library"}
            </button>
          </div>

          {isPremiumLocked && (
            <div className="book-detail__locked">
              <AiFillPlayCircle className="book-detail__locked--icon" />
              <div>
                <div className="book-detail__locked--title">
                  This title is available for Premium users only
                </div>
                <Link href="/choose-plan" className="book-detail__locked--link">
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          )}

          <div className="book-detail__tags">
            {book.tags?.map((tag) => (
              <span key={tag} className="book-detail__tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Right column */}
        <figure className="book-detail__right">
          <img
            src={book.imageLink}
            alt={book.title}
            className="book-detail__image"
          />
        </figure>

      </div>

      {/* Description sections */}
      <div className="book-detail__sections">
        <div className="book-detail__section--title">What&apos;s it about?</div>
        <div className="book-detail__section--text">{book.bookDescription}</div>

        <div className="book-detail__section--title">About the author</div>
        <div className="book-detail__section--text">{book.authorDescription}</div>
      </div>

    </div>
  );
}
