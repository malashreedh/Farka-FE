const BASE_URL = "https://farka-be.onrender.com/api/v1";

export const api = {
  // CHAT
  startChat: () => 
    fetch(`${BASE_URL}/chat/start`, { method: "POST" }).then(res => res.json()),
  
  sendMessage: (session_id: string, content: string) => 
    fetch(`${BASE_URL}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, content }),
    }).then(res => res.json()),

  // JOBS
  getJobMatches: (profile_id: string) => 
    fetch(`${BASE_URL}/jobs/matches/${profile_id}`).then(res => res.json()),

  triggerJobMatch: (profile_id: string) => 
    fetch(`${BASE_URL}/jobs/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id }),
    }).then(res => res.json()),

  // BUSINESS (Renamed to match your Page's call)
  getBusinessChecklist: (profile_id: string) => 
    fetch(`${BASE_URL}/business/checklist/${profile_id}`).then(res => res.json()),

  generateChecklist: (profile_id: string) => 
    fetch(`${BASE_URL}/business/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id }),
    }).then(res => res.json()),
};