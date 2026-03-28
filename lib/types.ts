// lib/types.ts
// TypeScript interfaces matching backend PostgreSQL/SQLAlchemy models exactly.
// SOURCE OF TRUTH: All field names mirror the backend schema spec.

export type Language = "en" | "ne";

export type WorkflowStage =
  | "initial"
  | "language_set"
  | "collecting_basics"
  | "collecting_experience"
  | "path_decision"
  | "collecting_skills"
  | "collecting_business_details"
  | "profile_complete"
  | "job_matching"
  | "checklist_generated";

export type TradeCategoryEnum =
  | "construction"
  | "hospitality"
  | "manufacturing"
  | "agriculture"
  | "domestic"
  | "transport"
  | "tech"
  | "other";

export type PathEnum = "job_seeker" | "business_starter" | "undecided";

export type OrgTypeEnum = "government" | "ngo" | "private";

export type ExperienceLevelEnum = "entry" | "mid" | "senior";

export type SavingsRangeEnum =
  | "under_5L"
  | "5L_to_20L"
  | "20L_to_50L"
  | "above_50L";

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  profile_id: string | null;
  messages: ChatMessage[];
  workflow_stage: WorkflowStage;
  language: Language;
  created_at: string;
  updated_at: string;
}

// ─── API Response shapes ───────────────────────────────────────────────────────

/** POST /chat/start */
export interface StartChatResponse {
  session_id: string;
  message: string;
  stage: WorkflowStage;
}

/** POST /chat/message */
export interface SendMessageResponse {
  message: string;
  stage: WorkflowStage;
  profile_id?: string;
  redirect?: "jobs" | "checklist" | null;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  current_location: string;
  path: PathEnum;
  trade_category: TradeCategoryEnum;
  years_experience: number | null;
  skills: string[];
  language_pref: Language;
  district_target: string | null;
  has_savings: boolean;
  savings_range: SavingsRangeEnum | null;
  created_at: string;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  org_name: string;
  org_type: OrgTypeEnum;
  district: string;
  trade_category: string;
  skill_tags: string[];
  experience_level: ExperienceLevelEnum;
  description: string;
  salary_range: string | null;
  apply_url: string;
  is_active: boolean;
  posted_at: string;
}

export interface JobMatch {
  job: Job;
  match_score: number;   // 0.0 – 1.0
  matched_tags: string[];
}

// ─── Business Checklist ───────────────────────────────────────────────────────

export interface ChecklistItem {
  category: string;
  week: number;
  task: string;
  done: boolean;
}

export interface BusinessChecklist {
  id: string;
  profile_id: string;
  trade: string;
  district: string;
  checklist_items: ChecklistItem[];
  raw_ai_output: string;
  created_at: string;
}

// ─── Canonical Skill Tags (mirrors backend spec exactly) ──────────────────────

export const SKILL_TAGS: Record<TradeCategoryEnum, string[]> = {
  construction:  ["formwork","concrete pouring","site supervision","scaffolding","MEP works","safety management","equipment operation","masonry","plumbing","electrical fitting"],
  hospitality:   ["front desk","housekeeping","food service","kitchen prep","event management","bartending","guest relations","hotel operations","tour guiding","cleaning supervision"],
  manufacturing: ["machine operation","quality control","assembly line","welding","fabrication","inventory management","forklift operation","production planning","packaging"],
  agriculture:   ["crop management","irrigation","livestock","greenhouse","organic farming","harvesting","agri-machinery","soil testing","pest control","market selling"],
  transport:     ["heavy vehicle driving","logistics","route planning","vehicle maintenance","cargo handling","fleet management","customer service","GPS navigation"],
  tech:          ["web development","data entry","IT support","networking","social media","graphic design","video editing","mobile apps","customer support","digital marketing"],
  domestic:      ["childcare","elder care","cooking","cleaning","home management","tutoring","driving","security","laundry","event catering"],
  other:         [],
};

// ─── Wrapper (all backend responses) ─────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
}