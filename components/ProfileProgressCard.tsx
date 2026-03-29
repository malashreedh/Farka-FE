"use client";

import type { WorkflowStage } from "@/lib/types";

const STAGE_PROGRESS: Record<WorkflowStage, number> = {
  initial: 8,
  language_set: 18,
  collecting_basics: 34,
  collecting_experience: 50,
  path_decision: 64,
  collecting_skills: 78,
  collecting_business_details: 82,
  profile_complete: 95,
  job_matching: 100,
  checklist_generated: 100,
};

const STAGE_HINT: Record<WorkflowStage, string> = {
  initial: "Start by sharing where you are now.",
  language_set: "A bit more context helps Farka understand your situation.",
  collecting_basics: "Your work background is the next useful piece.",
  collecting_experience: "Your years of experience sharpen the recommendations.",
  path_decision: "Now choose whether you want jobs or a business plan.",
  collecting_skills: "A few core skills unlock better job matching.",
  collecting_business_details: "District and savings help shape a realistic plan.",
  profile_complete: "Your profile is almost ready.",
  job_matching: "Profile complete. Matching is underway.",
  checklist_generated: "Profile complete. Your roadmap is ready.",
};

export default function ProfileProgressCard({ stage }: { stage: WorkflowStage }) {
  const progress = STAGE_PROGRESS[stage];
  const circumference = 2 * Math.PI * 38;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="panel-subtle rounded-[30px] p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--muted-strong)]">Profile progress</p>
      <div className="mt-4 flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
          <circle cx="50" cy="50" r="38" stroke="rgba(0,0,0,0.08)" strokeWidth="10" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="var(--accent)"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
          />
        </svg>
        <div>
          <p className="text-2xl font-semibold tracking-[-0.03em] text-[color:var(--text)]">{progress}%</p>
          <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{STAGE_HINT[stage]}</p>
        </div>
      </div>
    </div>
  );
}
