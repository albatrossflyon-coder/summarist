"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { getBookById } from "@/lib/api";
import { Book } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { AiOutlineArrowLeft, AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import { BiSkipPrevious, BiSkipNext } from "react-icons/bi";

function PlayerContent() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "listen";
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!user.uid) {
      router.push("/");
      return;
    }
    getBookById(id).then((data) => {
      setBook(data);
      setLoading(false);
    });
  }, [id, user.uid]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  function skip(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + seconds), duration);
  }

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  }

  if (loading) {
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="player__wrapper">
          <div className="player__skeleton skeleton" />
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="player__wrapper">
        <div className="player__content">
          <Link href={`/book/${book.id}`} className="player__back">
            <AiOutlineArrowLeft />
            <span>Back</span>
          </Link>

          <div className="player__book--info">
            <figure className="player__book--image--mask">
              <img src={book.imageLink} alt={book.title} className="player__book--image" />
            </figure>
            <div className="player__book--text">
              <div className="player__book--title">{book.title}</div>
              <div className="player__book--author">{book.author}</div>
            </div>
          </div>

          {type === "read" ? (
            <div className="player__summary">{book.summary}</div>
          ) : (
            <>
              <audio
                ref={audioRef}
                src={book.audioLink}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="player__controls">
                <div className="player__track">
                  <span className="player__time">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    className="player__scrubber"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleScrub}
                  />
                  <span className="player__time">{formatTime(duration)}</span>
                </div>

                <div className="player__buttons">
                  <button className="player__btn" onClick={() => skip(-10)} title="Back 10s">
                    <BiSkipPrevious />
                    <span className="player__btn--label">-10</span>
                  </button>
                  <button className="player__btn player__btn--play" onClick={togglePlay}>
                    {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
                  </button>
                  <button className="player__btn" onClick={() => skip(10)} title="Forward 10s">
                    <BiSkipNext />
                    <span className="player__btn--label">+10</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense>
      <PlayerContent />
    </Suspense>
  );
}
