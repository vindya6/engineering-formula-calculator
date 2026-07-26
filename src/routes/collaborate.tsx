import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Users, Send, Copy, Plus, LogIn, Eraser } from "lucide-react";
import { FORMULAS } from "@/lib/formulas";

export const Route = createFileRoute("/collaborate")({
  head: () => ({
    meta: [
      { title: "Collaborate — Formula Lab" },
      { name: "description", content: "Solve engineering formulas together in a shared room with chat, a shared scratchpad, and a linked formula." },
      { property: "og:title", content: "Collaborate — Formula Lab" },
      { property: "og:description", content: "Real-time collaboration rooms for solving engineering formulas together." },
    ],
  }),
  component: CollaboratePage,
});

interface Message {
  id: string;
  author: string;
  text: string;
  ts: number;
}

interface RoomState {
  scratchpad: string;
  messages: Message[];
  formulaId: string | null;
  members: { name: string; lastSeen: number }[];
}

const emptyRoom: RoomState = { scratchpad: "", messages: [], formulaId: null, members: [] };

function roomKey(id: string) { return `efc:room:${id}`; }
function readRoom(id: string): RoomState {
  if (typeof window === "undefined") return emptyRoom;
  try {
    const raw = localStorage.getItem(roomKey(id));
    return raw ? { ...emptyRoom, ...JSON.parse(raw) } : emptyRoom;
  } catch { return emptyRoom; }
}
function writeRoom(id: string, state: RoomState) {
  try { localStorage.setItem(roomKey(id), JSON.stringify(state)); } catch { /* ignore */ }
}

function makeId(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = ""; for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function CollaboratePage() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinInput, setJoinInput] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const r = url.searchParams.get("room");
    if (r) setRoomId(r.toUpperCase());
    const savedName = localStorage.getItem("efc:collab:name") || "";
    setName(savedName);
  }, []);

  const createRoom = () => {
    const id = makeId();
    const url = new URL(window.location.href);
    url.searchParams.set("room", id);
    window.history.replaceState({}, "", url.toString());
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!joinInput.trim()) return;
    const id = joinInput.trim().toUpperCase();
    const url = new URL(window.location.href);
    url.searchParams.set("room", id);
    window.history.replaceState({}, "", url.toString());
    setRoomId(id);
  };

  if (!roomId) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Users className="h-3.5 w-3.5" /> Collaboration
          </div>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">Solve together in a room</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Create a room and share the link with a friend. Work on the same formula, chat, and share a scratchpad in real time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2 text-primary"><Plus className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Create room</span></div>
            <h2 className="mt-2 text-xl font-bold">Start a new session</h2>
            <p className="mt-1 text-sm text-muted-foreground">A shareable link is generated instantly.</p>
            <button onClick={createRoom} className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Create room
            </button>
          </div>
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2 text-primary"><LogIn className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">Join room</span></div>
            <h2 className="mt-2 text-xl font-bold">Enter a room code</h2>
            <div className="mt-4 flex gap-2">
              <input
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                placeholder="e.g. AB3F9K"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
              />
              <button onClick={joinRoom} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted">Join</button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Rooms sync across browser tabs on the same device using local storage. For cross-device real-time collaboration, enable Lovable Cloud.
        </p>
      </div>
    );
  }

  return <Room roomId={roomId} initialName={name} onNameChange={setName} />;
}

function Room({ roomId, initialName, onNameChange }: { roomId: string; initialName: string; onNameChange: (n: string) => void }) {
  const [state, setState] = useState<RoomState>(() => readRoom(roomId));
  const [name, setName] = useState(initialName);
  const [nameSet, setNameSet] = useState(!!initialName);
  const [draft, setDraft] = useState("");
  const bcRef = useRef<BroadcastChannel | null>(null);
  const applyingRemote = useRef(false);

  // Sync via BroadcastChannel + storage events
  useEffect(() => {
    const bc = new BroadcastChannel(`efc-room-${roomId}`);
    bcRef.current = bc;
    bc.onmessage = (e) => {
      applyingRemote.current = true;
      setState(e.data as RoomState);
      applyingRemote.current = false;
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === roomKey(roomId) && e.newValue) {
        applyingRemote.current = true;
        setState(JSON.parse(e.newValue));
        applyingRemote.current = false;
      }
    };
    window.addEventListener("storage", onStorage);
    return () => { bc.close(); window.removeEventListener("storage", onStorage); };
  }, [roomId]);

  // Persist + broadcast on local changes
  useEffect(() => {
    if (applyingRemote.current) return;
    writeRoom(roomId, state);
    bcRef.current?.postMessage(state);
  }, [state, roomId]);

  // Presence heartbeat
  useEffect(() => {
    if (!nameSet || !name) return;
    const tick = () => {
      setState((prev) => {
        const others = prev.members.filter((m) => m.name !== name && Date.now() - m.lastSeen < 30_000);
        return { ...prev, members: [...others, { name, lastSeen: Date.now() }] };
      });
    };
    tick();
    const t = setInterval(tick, 5_000);
    return () => clearInterval(t);
  }, [name, nameSet]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const u = new URL(window.location.href);
    u.searchParams.set("room", roomId);
    return u.toString();
  }, [roomId]);

  const send = () => {
    if (!draft.trim()) return;
    const msg: Message = { id: crypto.randomUUID(), author: name || "Guest", text: draft.trim(), ts: Date.now() };
    setState((prev) => ({ ...prev, messages: [...prev.messages, msg].slice(-200) }));
    setDraft("");
  };

  const setFormula = (id: string) => setState((p) => ({ ...p, formulaId: id || null }));
  const clearBoard = () => setState((p) => ({ ...p, scratchpad: "" }));

  const formula = state.formulaId ? FORMULAS.find((f) => f.id === state.formulaId) : null;
  const activeMembers = state.members.filter((m) => Date.now() - m.lastSeen < 30_000);

  if (!nameSet) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="card-elevated p-6">
          <h1 className="text-xl font-bold">Join room {roomId}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick a display name to enter.</p>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-4 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) { localStorage.setItem("efc:collab:name", name.trim()); onNameChange(name.trim()); setNameSet(true); } }}
          />
          <button
            disabled={!name.trim()}
            onClick={() => { localStorage.setItem("efc:collab:name", name.trim()); onNameChange(name.trim()); setNameSet(true); }}
            className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Enter room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Room</div>
          <h1 className="font-mono text-2xl font-bold">{roomId}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <Users className="h-3.5 w-3.5 text-primary" />
            {activeMembers.length} online
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs hover:bg-muted"
          >
            <Copy className="h-3.5 w-3.5" /> Copy invite link
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <div className="card-elevated p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Active formula</h2>
              {formula && (
                <Link to="/formula/$id" params={{ id: formula.id }} className="text-xs text-primary hover:underline">
                  Open full page →
                </Link>
              )}
            </div>
            <select
              value={state.formulaId ?? ""}
              onChange={(e) => setFormula(e.target.value)}
              className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">— Pick a formula to work on together —</option>
              {FORMULAS.map((f) => (
                <option key={f.id} value={f.id}>{f.name} ({f.subject})</option>
              ))}
            </select>
            {formula && (
              <div className="mt-3 rounded-xl bg-secondary px-4 py-3 font-mono text-lg">{formula.expression}</div>
            )}
          </div>

          <div className="card-elevated p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shared scratchpad</h2>
              <button onClick={clearBoard} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Eraser className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
            <textarea
              value={state.scratchpad}
              onChange={(e) => setState((p) => ({ ...p, scratchpad: e.target.value }))}
              placeholder="Write derivations, substitutions, and steps here. Everyone in the room sees it."
              className="mt-3 h-64 w-full resize-none rounded-lg border border-input bg-background p-3 font-mono text-sm outline-none ring-ring focus:ring-2"
            />
          </div>
        </div>

        <div className="card-elevated flex h-[560px] flex-col p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Chat</h2>
          <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
            {state.messages.length === 0 && (
              <p className="text-sm text-muted-foreground">No messages yet. Say hi!</p>
            )}
            {state.messages.map((m) => (
              <div key={m.id} className={`rounded-lg px-3 py-2 text-sm ${m.author === name ? "ml-8 bg-primary/10" : "mr-8 bg-muted"}`}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {m.author} · {new Date(m.ts).toLocaleTimeString()}
                </div>
                <div className="mt-0.5 whitespace-pre-wrap">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Message the room…"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus:ring-2"
            />
            <button onClick={send} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </div>
          {activeMembers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {activeMembers.map((m) => (
                <span key={m.name} className="rounded-full bg-muted px-2 py-0.5 text-[11px]">{m.name}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
