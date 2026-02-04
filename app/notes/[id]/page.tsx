import { QueryClient } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return {
      title: `${note.title} | NoteHub`,
      description: note.content?.slice(0, 100) || "Note details in NoteHub",
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content?.slice(0, 100) || "Note details in NoteHub",
        url: `https://your-vercel-url.vercel.app/notes/${id}`,
        images: [
          { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Note not found | NoteHub",
      description: "The requested note does not exist",
      openGraph: {
        title: "Note not found | NoteHub",
        description: "The requested note does not exist",
        url: `https://your-vercel-url.vercel.app/notes/${id}`,
        images: [
          { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
        ],
      },
    };
  }
}

type PageProps = {
  params: { id: string };
};

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return <NoteDetailsClient id={id} />;
}
