// app/components/NoteForm/NoteForm.tsx
"use client";

import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createNote } from "@/lib/api";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import type { NoteFormValues, NoteTag } from "../../types/note";

const NoteForm = () => {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      router.push("/notes/filter/all");
    },
    onError: () => {
      toast.error("Failed to create the note. Please try again.");
    },
  });

  function handleInputChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  }

  function handleClickCancelBtn() {
    router.push("/notes/filter/all");
  }

  function handleSubmit(formData: FormData): void {
    const title = (formData.get("title") as string) ?? "";
    const content = (formData.get("content") as string) ?? "";
    const tag: NoteTag = formData.get("tag") as NoteTag;

    if ((title.length > 50 || title.length < 3) && content.length > 500) {
      toast.error(
        "Title must be between 3 and 50 characters and content can contain up to 500 characters!",
      );
      return;
    }

    if ((title.length > 50 || title.length < 3) && content.length < 500) {
      toast.error("Title must be between 3 and 50 characters!");
      return;
    }

    if (content.length > 500) {
      toast.error("Content can contain up to 500 characters!");
      return;
    }

    const values: NoteFormValues = {
      title,
      content,
      tag,
    };
    console.log(values);
    createNoteMutation.mutate(values);
  }

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className={css.input}
          defaultValue={draft?.title}
          onChange={handleInputChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleInputChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft?.tag}
          onChange={handleInputChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          disabled={createNoteMutation.isPending}
          onClick={handleClickCancelBtn}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
