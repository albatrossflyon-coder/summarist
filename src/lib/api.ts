import { Book } from "@/types";

const BASE_URL = "https://us-central1-summaristt.cloudfunctions.net";

export async function getSelectedBook(): Promise<Book> {
  const res = await fetch(`${BASE_URL}/getBooks?status=selected`);
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function getRecommendedBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/getBooks?status=recommended`);
  return res.json();
}

export async function getSuggestedBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/getBooks?status=suggested`);
  return res.json();
}

export async function getBookById(id: string): Promise<Book> {
  const res = await fetch(`${BASE_URL}/getBook?id=${id}`);
  return res.json();
}

export async function searchBooks(search: string): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`);
  return res.json();
}
