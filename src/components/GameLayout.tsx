"use client";

import type { JobRpg, Option, Question } from "@/data/jobs/types";
import type { Gender } from "./JobModal";
import ProgressIndicator from "./ProgressIndicator";
import QuestionCard from "./QuestionCard";
import FeedbackCard from "./FeedbackCard";

type GamePhase = "question" | "feedback";

type Props = {
  job: JobRpg;
  playerName: string;
  gender: Gender;
  currentQuestion: Question;
  currentIndex: number;
  gamePhase: GamePhase;
  selectedOption: Option | null;
  onSelectOption: (option: Option) => void;
  onNextQuestion: () => void;
};

export default function GameLayout({
  job,
  playerName,
  gender,
  currentQuestion,
  currentIndex,
  gamePhase,
  selectedOption,
  onSelectOption,
  onNextQuestion,
}: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ProgressIndicator
        current={currentIndex + 1}
        total={job.questions.length}
        phase={currentQuestion.phase}
        businessProcess={currentQuestion.businessProcess}
        jobName={job.displayName}
      />

      <div className="flex-1">
        {gamePhase === "question" && (
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex + 1}
            playerName={playerName}
            gender={gender}
            onSelect={onSelectOption}
            disabled={false}
          />
        )}
        {gamePhase === "feedback" && selectedOption && (
          <FeedbackCard
            selectedOption={selectedOption}
            currentIndex={currentIndex + 1}
            totalQuestions={job.questions.length}
            gender={gender}
            onNext={onNextQuestion}
          />
        )}
      </div>
    </div>
  );
}
