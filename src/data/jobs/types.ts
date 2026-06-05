export type JobStatus = "published" | "comingSoon" | "hidden";
export type FeedbackType = "good" | "strong_normal" | "normal" | "risky_bad" | "bad";
export type Phase = "起" | "承" | "転" | "結";
export type OptionId = "A" | "B" | "C" | "D";

export type ServiceSetting = {
  scenarioTitle: string;
  serviceName: string;
  serviceDescription: string;
  customerName: string;
  customerDescription: string;
  currentProblem: string;
  playerRole: string;
  mission: string;
};

export type ScoringRule = {
  maxScorePerQuestion: number;
  scoreMap: {
    good: number;
    strong_normal?: number;
    normal: number;
    risky_bad?: number;
    bad: number;
  };
  showScoreDuringGame: boolean;
};

export type Option = {
  id: OptionId;
  text: string;
  score: number;
  feedbackType: FeedbackType;
  feedback: string;
  scoreDetails?: Record<string, number>;
};

export type Question = {
  id: string;
  phase: Phase;
  businessProcess: string;
  title: string;
  situation: string;
  question: string;
  options: Option[];
};

export type ResultMessage = {
  minScorePercent: number;
  maxScorePercent: number;
  title: string;
  message: string;
};

export type NextJobSuggestion = {
  jobId: string;
  reason: string;
};

export type JobRpg = {
  id: string;
  version: string;
  displayName: string;
  subtitle: string;
  description: string;
  icon: string;
  status: JobStatus;
  estimatedMinutes: number;
  targetUser?: string;
  serviceSetting?: ServiceSetting;
  scoring: ScoringRule;
  questions: Question[];
  resultMessages: ResultMessage[];
  nextJobSuggestions?: NextJobSuggestion[];
  sceneImagePrefix?: string;
  scenarioDescription?: string;
};
