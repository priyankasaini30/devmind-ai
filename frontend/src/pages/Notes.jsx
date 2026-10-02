import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null); // null = not editing, "new" = creating
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/notes");
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const startNew = () => {
    setEditingId("new");
    setTitle("");
    setContent("");
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId === "new") {
        await apiFetch("/notes", {
          method: "POST",
          body: JSON.stringify({ title, content }),
        });
      } else {
        await apiFetch(`/notes/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({ title, content }),
        });
      }
      cancelEdit();
      loadNotes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeNote = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await apiFetch(`/notes/${id}`, { method: "DELETE" });
      loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Notes</h1>
            <p className="mt-2 text-slate-400">
              Save programming notes, concepts, and code snippets.
            </p>
          </div>

          {editingId === null && (
            <button
              onClick={startNew}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              + New Note
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Create/Edit form */}
        {editingId !== null && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <textarea
              placeholder="Write your note here... (code, concepts, resources)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="mb-4 w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 font-mono text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex gap-3">
              <button
                onClick={saveNote}
                disabled={saving}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Note"}
              </button>
              <button
                onClick={cancelEdit}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notes list */}
        {loading ? (
          <p className="text-slate-400">Loading notes...</p>
        ) : notes.length === 0 && editingId === null ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <div className="mb-3 text-4xl">📝</div>
            <p className="font-medium text-slate-300">No notes yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Save your first concept, snippet, or resource.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-slate-100">{note.title}</h3>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => startEdit(note)}
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeNote(note._id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap font-mono text-sm leading-6 text-slate-400">
                  {note.content}
                </p>
                <p className="mt-3 text-xs text-slate-600">
                  Updated {new Date(note.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Notes;