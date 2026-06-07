"use client";

import { useCallback, useRef, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import JobTileGrid from "@/components/JobTileGrid";
import JobModal from "@/components/JobModal";
import ScenarioIntro from "@/components/ScenarioIntro";
import GameLayout from "@/components/GameLayout";
import ResultScreen from "@/components/ResultScreen";
import { getVisibleJobs, getVisibleJobGroups } from "@/data/jobs";
import type { JobRpg, Option } from "@/data/jobs/types";
import type { PlayerAnswer } from "@/lib/scoring";
import type { Gender } from "@/components/JobModal";
import {
  calculateMaxScore,
  calculateScorePercent,
  calculateTotalScore,
} from "@/lib/scoring";

type Screen = "home" | "intro" | "question" | "feedback" | "result";

const visibleJobs = getVisibleJobs();
const visibleJobGroups = getVisibleJobGroups();

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedJob, setSelectedJob] = useState<JobRpg | null>(null);
  const [modalJob, setModalJob] = useState<JobRpg | null>(null);
  const [playerName, setPlayerName] = useState("プレイヤー");
  const [gender, setGender] = useState<Gender>("male");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);
  const questionStartedAt = useRef<string>(new Date().toISOString());
  const jobTilesSectionRef = useRef<HTMLDivElement>(null);

  const scrollToJobs = () => {
    jobTilesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectJob = (job: JobRpg) => {
    if (job.status === "published") {
      setModalJob(job);
    }
  };

  const handleModalClose = () => setModalJob(null);

  const handleGameStart = async (name: string, selectedGender: Gender) => {
    if (!modalJob) return;
    const job = modalJob;
    setModalJob(null);
    setSelectedJob(job);
    setPlayerName(name);
    setGender(selectedGender);
    setCurrentIndex(0);
    setAnswers([]);

    try {
      const res = await fetch("/api/sessions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          scenarioVersion: job.version,
          playerName: name,
          userAgent: navigator.userAgent,
          referrer: document.referrer || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSessionId(data.sessionId);
      } else {
        setSessionId(null);
      }
    } catch {
      setSessionId(null);
    }

    setScreen("intro");
  };

  const handleIntroStart = () => {
    if (!selectedJob) return;
    setScreen("question");
    questionStartedAt.current = new Date().toISOString();
    if (sessionId) {
      const q = selectedJob.questions[0];
      fetch("/api/questions/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          jobId: selectedJob.id,
          scenarioVersion: selectedJob.version,
          questionId: q.id,
          questionIndex: 1,
        }),
      }).catch(() => {});
    }
  };

  const handleSelectOption = useCallback(
    async (option: Option) => {
      if (!selectedJob) return;
      const q = selectedJob.questions[currentIndex];
      const now = new Date().toISOString();
      const startedAt = questionStartedAt.current;
      const answerTimeMs = Math.max(
        0,
        new Date(now).getTime() - new Date(startedAt).getTime()
      );

      const answer: PlayerAnswer = {
        questionId: q.id,
        questionIndex: currentIndex + 1,
        selectedOptionId: option.id,
        score: option.score,
        feedbackType: option.feedbackType,
        questionStartedAt: startedAt,
        answeredAt: now,
        answerTimeMs,
      };

      setAnswers((prev) => [...prev, answer]);
      setSelectedOption(option);
      setScreen("feedback");

      if (sessionId) {
        fetch("/api/questions/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            jobId: selectedJob.id,
            scenarioVersion: selectedJob.version,
            questionId: q.id,
            questionIndex: currentIndex + 1,
            selectedOptionId: option.id,
            selectedScore: option.score,
            feedbackType: option.feedbackType,
            questionStartedAt: startedAt,
            answeredAt: now,
            answerTimeMs,
          }),
        }).catch(() => {});
      }
    },
    [selectedJob, currentIndex, sessionId]
  );

  const handleNextQuestion = useCallback(
    async (currentAnswers: PlayerAnswer[]) => {
      if (!selectedJob) return;
      const nextIndex = currentIndex + 1;

      if (nextIndex >= selectedJob.questions.length) {
        setScreen("result");
        if (sessionId) {
          const totalScore = calculateTotalScore(currentAnswers);
          const maxScore = calculateMaxScore(selectedJob);
          const scorePercent = calculateScorePercent(totalScore, maxScore);
          fetch("/api/sessions/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId,
              totalScore,
              maxScore,
              resultScorePercent: scorePercent,
            }),
          }).catch(() => {});
        }
        return;
      }

      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setScreen("question");
      questionStartedAt.current = new Date().toISOString();

      if (sessionId) {
        const q = selectedJob.questions[nextIndex];
        fetch("/api/questions/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            jobId: selectedJob.id,
            scenarioVersion: selectedJob.version,
            questionId: q.id,
            questionIndex: nextIndex + 1,
          }),
        }).catch(() => {});
      }
    },
    [selectedJob, currentIndex, sessionId]
  );

  const handleRetry = () => {
    if (!selectedJob) return;
    setModalJob(selectedJob);
    setScreen("home");
  };

  const handleGoTop = () => {
    setScreen("home");
    setSelectedJob(null);
    setSessionId(null);
    setAnswers([]);
    setCurrentIndex(0);
    setSelectedOption(null);
  };

  const handleSelectNextJob = (jobId: string) => {
    const job = visibleJobs.find((j) => j.id === jobId);
    if (job && job.status === "published") {
      setModalJob(job);
      setScreen("home");
    }
  };

  if (screen === "intro" && selectedJob) {
    return (
      <ScenarioIntro
        job={selectedJob}
        playerName={playerName}
        onStart={handleIntroStart}
      />
    );
  }

  if ((screen === "question" || screen === "feedback") && selectedJob) {
    const currentQuestion = selectedJob.questions[currentIndex];
    return (
      <GameLayout
        job={selectedJob}
        playerName={playerName}
        gender={gender}
        currentQuestion={currentQuestion}
        currentIndex={currentIndex}
        gamePhase={screen === "question" ? "question" : "feedback"}
        selectedOption={selectedOption}
        onSelectOption={handleSelectOption}
        onNextQuestion={() => handleNextQuestion(answers)}
      />
    );
  }

  if (screen === "result" && selectedJob) {
    return (
      <ResultScreen
        job={selectedJob}
        playerName={playerName}
        answers={answers}
        onRetry={handleRetry}
        onGoTop={handleGoTop}
        onSelectJob={handleSelectNextJob}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection onClickCta={scrollToJobs} />
      <div ref={jobTilesSectionRef}>
        <JobTileGrid groups={visibleJobGroups} onSelectJob={handleSelectJob} />
      </div>
      <footer className="border-t border-amber-100/80 py-8 px-4 mt-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="inline-flex items-center gap-1.5 text-sm font-extrabold text-gray-700 mb-3">
            <span className="grid place-items-center w-6 h-6 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 text-white text-xs">
              🎮
            </span>
            お仕事体験.com
          </p>
          <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
            このサイトでは、サービス改善のために、選択肢の選択状況や解答時間などの匿名データを記録する場合があります。
          </p>
          <p className="text-xs text-gray-300 mt-2">© 2026 お仕事体験.com</p>
        </div>
      </footer>
      <JobModal
        job={modalJob}
        onClose={handleModalClose}
        onStart={handleGameStart}
      />
    </div>
  );
}
