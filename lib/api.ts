// lib/api.ts
// All endpoints match the backend spec exactly.
// Every response is wrapped in {"data": ..., "message": "success"} — we unwrap here.
// BASE_URL points to the deployed Render backend.

import type {
  ApiResponse,
  BusinessChecklist,
  JobMatch,
  Profile,
  SendMessageResponse,
  StartChatResponse,
} from "@/lib/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:8000/api/v1";

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorBody.detail ?? `HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiResponse<T>).data;
  }
  return json as T;
}
  
  // ─── CHAT ─────────────────────────────────────────────────────────────────────
  
  /** POST /chat/start — body: {} */
  export async function startChat(): Promise<StartChatResponse> {
    return apiFetch<StartChatResponse>("/chat/start", {
      method: "POST",
      body: JSON.stringify({}),
    });
  }
  
  /**
   * POST /chat/message
   * body: { session_id: string, content: string }   ← "content" NOT "message"
   */
  export async function sendMessage(
    session_id: string,
    content: string
  ): Promise<SendMessageResponse> {
    return apiFetch<SendMessageResponse>("/chat/message", {
      method: "POST",
      body: JSON.stringify({ session_id, content }),
    });
  }
  
  // ─── PROFILE ──────────────────────────────────────────────────────────────────
  
  /** GET /profile/{id} */
  export async function getProfile(id: string): Promise<Profile> {
    return apiFetch<Profile>(`/profile/${id}`);
  }
  
  /** PATCH /profile/{id} */
  export async function updateProfile(
    id: string,
    fields: Partial<Profile>
  ): Promise<Profile> {
    return apiFetch<Profile>(`/profile/${id}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    });
  }
  
  // ─── JOBS ─────────────────────────────────────────────────────────────────────
  
  /**
   * GET /jobs/matches/{profile_id}   ← PATH param, not query param
   * Returns existing job matches for a profile.
   */
  export async function getJobMatches(profile_id: string): Promise<JobMatch[]> {
    return apiFetch<JobMatch[]>(`/jobs/matches/${profile_id}`);
  }
  
  /**
   * POST /jobs/match
   * body: { profile_id }
   * Triggers a fresh match computation and returns results.
   */
  export async function triggerJobMatch(profile_id: string): Promise<JobMatch[]> {
    return apiFetch<JobMatch[]>("/jobs/match", {
      method: "POST",
      body: JSON.stringify({ profile_id }),
    });
  }
  
  // ─── BUSINESS ─────────────────────────────────────────────────────────────────
  
  /**
   * GET /business/checklist/{profile_id}   ← PATH param
   * Returns existing checklist if already generated.
   */
  export async function getChecklist(
    profile_id: string
  ): Promise<BusinessChecklist> {
    return apiFetch<BusinessChecklist>(`/business/checklist/${profile_id}`);
  }
  
  /**
   * POST /business/checklist
   * body: { profile_id }
   * Triggers AI generation of a new checklist.
   */
  export async function generateChecklist(
    profile_id: string
  ): Promise<BusinessChecklist> {
    return apiFetch<BusinessChecklist>("/business/checklist", {
      method: "POST",
      body: JSON.stringify({ profile_id }),
    });
  }
  
  /**
   * PATCH /business/checklist/item
   * body: { checklist_id, item_index, done }
   */
  export async function toggleChecklistItem(
    checklist_id: string,
    item_index: number,
    done: boolean
  ): Promise<BusinessChecklist> {
    return apiFetch<BusinessChecklist>("/business/checklist/item", {
      method: "PATCH",
      body: JSON.stringify({ checklist_id, item_index, done }),
    });
  }
  
  // ─── AUTH (dummy) ──────────────────────────────────────────────────────────────
  
  /** POST /auth/session — creates anonymous profile, returns fake JWT */
  export async function createSession(name?: string, phone?: string) {
    return apiFetch<{ profile_id: string; token: string }>("/auth/session", {
      method: "POST",
      body: JSON.stringify({ name, phone }),
    });
  }
  
  // Named export object for legacy imports (chat/page.tsx uses `api.startChat` etc.)
  export const api = {
    startChat,
    sendMessage,
    getProfile,
    updateProfile,
    getJobMatches,
    triggerJobMatch,
    getChecklist,
    generateChecklist,
    toggleChecklistItem,
    createSession,
  };
