// NEXT_PUBLIC_ ensures this is available in the browser
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = {
  startChat: async () => {
    const res = await fetch(`${BASE_URL}/chat/start`, { 
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    return json.data; // { session_id, message, stage }
  },
  
  sendMessage: async (session_id: string, content: string) => {
    const res = await fetch(`${BASE_URL}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, content }),
    });
    const json = await res.json();
    return json.data; // { message, stage, profile_id, redirect }
  },

  getJobMatches: async (profile_id: string) => {
    const res = await fetch(`${BASE_URL}/jobs/matches/${profile_id}`);
    const json = await res.json();
    return json.data; // Array of JobMatch objects
  }
};