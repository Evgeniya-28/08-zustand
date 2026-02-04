// app/notes/filter/[...slug]/page.tsx

import { fetchNotes } from "@/lib/api";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type NotesByCategoryProps = {
  readonly params: Promise<{ slug: string[] }>;
  readonly searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: NotesByCategoryProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] === "all" ? "All" : slug[0];

  return {
    title: `${tag} notes`,
    description: `All notes categorized as ${tag}`,
    openGraph: {
      title: `${tag} notes`,
      description: `All notes categorized as ${tag}`,
      url: `${SITE_URL}/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tag} notes`,
        },
      ],
    },
  };
}

const NotesByCategory = async ({
  params,
  searchParams,
}: NotesByCategoryProps) => {
  const { slug } = await params;
  const tag = slug[0] === "all" ? undefined : slug[0];

  const { page, query } = await searchParams;
  const pageNumber = Number(page) || 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", pageNumber, query, tag],
    queryFn: () => fetchNotes(pageNumber, query, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
