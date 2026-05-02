import Link from "next/link";
import { Book } from "@/types";
import { BsStarFill } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`} className="book">
      {book.subscriptionRequired && (
        <div className="book__pill">Premium</div>
      )}
      <figure className="book__image--wrapper">
        <img src={book.imageLink} alt={book.title} className="book__image" />
      </figure>
      <div className="book__content">
        <div className="book__title">{book.title}</div>
        <div className="book__author">{book.author}</div>
        <div className="book__sub--title">{book.subTitle}</div>
        <div className="book__details--wrapper">
          <div className="book__details">
            <AiOutlineClockCircle />
            <span className="book__details--text">{book.type}</span>
          </div>
          <div className="book__details">
            <BsStarFill />
            <span className="book__details--text">{book.averageRating?.toFixed(1) || "4.5"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
