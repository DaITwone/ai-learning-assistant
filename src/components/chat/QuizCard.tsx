"use client";

import { useState } from "react";
import { parseQuizPayload, type QuizPayload } from "@/lib/quiz";

type QuizCardProps = {
  content: string;
};

// Mapping trạng thái làm bài (chưa trả lời / đúng / sai)
// sang style hiển thị tương ứng để giữ UI nhất quán giữa các đáp án.
function getOptionStyle(
  isSelected: boolean,
  isCorrect: boolean,
  answered: boolean,
): string {
  const base =
    "group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400";

  if (!answered) {
    return `${base} cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900 hover:shadow-sm active:scale-[0.99]`;
  }

  if (isSelected) {
    return isCorrect
      ? `${base} cursor-default border-emerald-400 bg-emerald-50 text-emerald-900 shadow-sm`
      : `${base} cursor-default border-rose-400 bg-rose-50 text-rose-900 shadow-sm`;
  }

  if (isCorrect && answered) {
    return `${base} cursor-default border-emerald-200 bg-emerald-50/40 text-emerald-700`;
  }

  return `${base} cursor-default border-slate-100 bg-slate-50/50 text-slate-400`;
}

// Hiển thị ký hiệu trạng thái của đáp án (A/B/C..., đúng, sai)
// dựa trên tiến trình làm bài của người dùng.
function OptionIcon({
  isSelected,
  isCorrect,
  answered,
  label,
}: {
  isSelected: boolean;
  isCorrect: boolean;
  answered: boolean;
  label: string;
}) {
  const baseCircle =
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-200";

  if (!answered) {
    return (
      <span
        className={`${baseCircle} bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700`}
      >
        {label}
      </span>
    );
  }

  if (isSelected) {
    return isCorrect ? (
      <span className={`${baseCircle} bg-emerald-500 text-white`}>✓</span>
    ) : (
      <span className={`${baseCircle} bg-rose-500 text-white`}>✗</span>
    );
  }

  // Luôn đánh dấu đáp án đúng sau khi câu hỏi được trả lời,
  // kể cả khi người dùng chọn sai đáp án khác.
  if (isCorrect) {
    return (
      <span className={`${baseCircle} bg-emerald-100 text-emerald-600`}>✓</span>
    );
  }

  return (
    <span className={`${baseCircle} bg-slate-100 text-slate-400`}>{label}</span>
  );
}

function QuizBody({ quiz }: { quiz: QuizPayload }) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    Array(quiz.questions.length).fill(-1),
  );
  const [activeQuestion, setActiveQuestion] = useState(0);

  // Mỗi câu chỉ được trả lời một lần để giữ kết quả ổn định và tránh thay đổi điểm sau khi đã xem đáp án.
  function handleSelectOption(questionIndex: number, optionIndex: number) {
    setSelectedAnswers((current) => {
      if (current[questionIndex] !== -1) return current;
      const next = [...current];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  const answeredCount = selectedAnswers.filter((a) => a !== -1).length;
  const isFullyAnswered = answeredCount === quiz.questions.length;
  const totalCorrect = quiz.questions.reduce(
    (count, question, index) =>
      count + (selectedAnswers[index] === question.answerIndex ? 1 : 0),
    0,
  );
  const progressPercent = (answeredCount / quiz.questions.length) * 100;
  const scorePercent = isFullyAnswered
    ? Math.round((totalCorrect / quiz.questions.length) * 100)
    : null;

  const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-500 p-5 text-white shadow-lg shadow-indigo-200">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-4 left-10 h-16 w-16 rounded-full bg-violet-300/20 blur-xl" />

        <div className="relative z-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-indigo-200">
            📝 Bài Quiz
          </p>
          <h2 className="text-lg font-bold leading-snug">{quiz.title}</h2>
          {quiz.topic && (
            <p className="mt-1 text-sm text-indigo-200">Chủ đề: {quiz.topic}</p>
          )}

          {/* Progress */}
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-white/80 tabular-nums">
              {answeredCount}/{quiz.questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Question navigator dots */}
      <div className="flex flex-wrap gap-2 px-1">
        {quiz.questions.map((q, i) => {
          const answered = selectedAnswers[i] !== -1;
          const correct = answered && selectedAnswers[i] === q.answerIndex;
          const wrong = answered && selectedAnswers[i] !== q.answerIndex;

          return (
            <button
              key={i}
              onClick={() => setActiveQuestion(i)}
              className={[
                "flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all duration-150",
                activeQuestion === i
                  ? "ring-2 ring-indigo-400 ring-offset-1 scale-105"
                  : "",
                correct
                  ? "bg-emerald-100 text-emerald-700"
                  : wrong
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              ].join(" ")}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Active question card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        {(() => {
          const question = quiz.questions[activeQuestion];

          // Sử dụng -1 để biểu thị trạng thái chưa trả lời thay vì null/undefined
          // nhằm đơn giản hóa việc tính điểm và kiểm tra tiến độ.
          const selectedAnswer = selectedAnswers[activeQuestion];
          const answered = selectedAnswer !== -1;

          return (
            <>
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 shrink-0 font-mono text-3xl font-black leading-none text-slate-100">
                  {String(activeQuestion + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 text-sm font-semibold leading-relaxed text-slate-800">
                  {question.question}
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswer === optionIndex;
                  const isCorrect = question.answerIndex === optionIndex;

                  return (
                    <li key={optionIndex}>
                      <button
                        className={getOptionStyle(
                          isSelected,
                          isCorrect,
                          answered,
                        )}
                        onClick={() =>
                          handleSelectOption(activeQuestion, optionIndex)
                        }
                        disabled={answered}
                      >
                        <OptionIcon
                          isSelected={isSelected}
                          isCorrect={isCorrect}
                          answered={answered}
                          label={
                            OPTION_LABELS[optionIndex] ??
                            String(optionIndex + 1)
                          }
                        />
                        <span className="flex-1 leading-relaxed">{option}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {answered && (
                <div
                  className={`mt-4 rounded-2xl p-3 text-xs font-medium leading-relaxed ${
                    selectedAnswer === question.answerIndex
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {selectedAnswer === question.answerIndex ? (
                    <span>✓ Chính xác!</span>
                  ) : (
                    <span>
                      ✗ Chưa đúng. Đáp án đúng là{" "}
                      <strong>{OPTION_LABELS[question.answerIndex]}</strong>.
                    </span>
                  )}
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setActiveQuestion((q) => Math.max(0, q - 1))}
          disabled={activeQuestion === 0}
          className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          ← Câu trước
        </button>
        <button
          onClick={() =>
            setActiveQuestion((q) => Math.min(quiz.questions.length - 1, q + 1))
          }
          disabled={activeQuestion === quiz.questions.length - 1}
          className="flex-1 rounded-2xl border border-indigo-100 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Câu tiếp →
        </button>
      </div>

      {/* Score panel */}
      {isFullyAnswered && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div
            className={`flex items-center justify-between px-5 py-4 ${
              scorePercent! >= 80
                ? "bg-linear-to-r from-emerald-50 to-teal-50"
                : scorePercent! >= 50
                  ? "bg-linear-to-r from-amber-50 to-yellow-50"
                  : "bg-linear-to-r from-rose-50 to-pink-50"
            }`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Kết quả
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">
                {totalCorrect}
                <span className="text-base font-medium text-slate-400">
                  /{quiz.questions.length}
                </span>
              </p>
              <p className="mt-0.5 text-sm text-slate-600">
                {scorePercent! >= 80
                  ? "🎉 Xuất sắc!"
                  : scorePercent! >= 50
                    ? "👍 Khá tốt, tiếp tục cố gắng!"
                    : "💪 Hãy ôn lại nhé!"}
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/60 shadow-inner">
              <span
                className={`text-xl font-black ${
                  scorePercent! >= 80
                    ? "text-emerald-600"
                    : scorePercent! >= 50
                      ? "text-amber-600"
                      : "text-rose-600"
                }`}
              >
                {scorePercent}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function QuizCard({ content }: QuizCardProps) {
  const quizPayload = parseQuizPayload(content);

  if (!quizPayload) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
        <p className="font-semibold">Không thể tải quiz</p>
        <p className="mt-1 text-rose-500">
          Dữ liệu không hợp lệ hoặc AI chưa trả về JSON đúng định dạng.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg p-4">
      <QuizBody quiz={quizPayload} />
    </div>
  );
}
