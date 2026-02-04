// app/notes/Notes.client.tsx

"use client";

import css from "./NotesPage.module.css";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Link from "next/link";

type NotesClientProps = {
  readonly tag?: string;
};

const NotesClient = ({ tag }: NotesClientProps) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string | undefined>(undefined);

  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["notes", page, query, tag],
    queryFn: () => fetchNotes(page, query, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isSuccess && !isPending && data?.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [data?.notes.length, isSuccess, isPending]);

  const handleChangeQuery = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setQuery(event.target.value.trim());
    },
    1000,
  );

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChangeQuery} />
        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
        <Link
          href={"/notes/action/create"}
          aria-label="Create note"
          className={css.button}
        >
          Create note +
        </Link>
      </header>
      {notes.length > 0 && <NoteList notes={notes} />}
      <Toaster />
    </div>
  );
};

export default NotesClient;
