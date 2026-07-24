import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Lightbulb, RotateCcw, Trophy } from "lucide-react";

type QuizQuestion = {
  id: string;
  question_type: "multiple_choice" | "true_false" | "reflection";
  question: string;
  options: string[] | null;
  correct_answer: string | null;
  explanation: string | null;
};

function generateQuiz(story: any, title: string): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const summary = (story?.summary || "").trim();
  const mainStory = (story?.main_story || "").trim();
  const keyDevs = (story?.key_developments || []) as string[];
  const fullText = `${summary} ${mainStory}`.trim();

  if (fullText.length < 50) return [];

  const sentences = fullText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(" ").length >= 6);

  if (sentences.length < 2) return [];

  // Q1: Multiple choice — what is this article about?
  const correctAnswer = summary
    ? summary.split(".")[0].slice(0, 80) + (summary.length > 80 ? "…" : "")
    : title;
  const wrongAnswers = [
    "A scientific discovery about marine biology",
    "A review of a new technology product",
    "A sports tournament recap and analysis",
  ];
  questions.push({
    id: "q-1",
    question_type: "multiple_choice",
    question: "What is the main topic of this article?",
    options: [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5),
    correct_answer: correctAnswer,
    explanation: `This article focuses on: ${title}`,
  });

  // Q2: True/False from a sentence in the article
  const sentenceIdx = Math.floor(Math.random() * sentences.length);
  const correctSentence = sentences[sentenceIdx];
  questions.push({
    id: "q-2",
    question_type: "true_false",
    question: `True or False: "${correctSentence}"`,
    options: null,
    correct_answer: "true",
    explanation: "This statement appears directly in the article.",
  });

  // Q3: Multiple choice from key developments
  if (keyDevs.length >= 2) {
    const correctIdx = Math.floor(Math.random() * keyDevs.length);
    const correctDev = keyDevs[correctIdx];
    const wrongDevs = keyDevs.filter((_, i) => i !== correctIdx).slice(0, 3);
    const distractors = [
      "The article discusses a major sporting event result",
      "A new space exploration mission was announced",
      "Local weather patterns changed significantly",
    ];
    while (wrongDevs.length < 3) {
      wrongDevs.push(distractors[wrongDevs.length] || "None of the above");
    }
    questions.push({
      id: "q-3",
      question_type: "multiple_choice",
      question: "Which of the following is a key development mentioned in the article?",
      options: [correctDev, ...wrongDevs].sort(() => Math.random() - 0.5),
      correct_answer: correctDev,
      explanation: "This is one of the key developments listed in the article.",
    });
  }

  // Q4: Reflection
  questions.push({
    id: "q-4",
    question_type: "reflection",
    question: `Reflect on this article. What perspective or insight did you gain about ${title}?`,
    options: null,
    correct_answer: null,
    explanation: null,
  });

  return questions;
}

export function KnowledgeCheck({ articleId, story, title, onReflection }: { articleId: string; story?: any; title?: string; onReflection?: (reflectionText: string) => void }) {
  const questions = useMemo(() => {
    if (!story) return [];
    return generateQuiz(story, title || "");
  }, [story, title]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) return null;

  const score = questions.filter((q) => q.question_type !== "reflection" && answers[q.id] === q.correct_answer).length;
  const gradedCount = questions.filter((q) => q.question_type !== "reflection").length;

  const reflectionQuestion = questions.find((q) => q.question_type === "reflection");

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="border-t rule pt-8 mt-4">
      <div className="kicker mb-6 flex items-center gap-2">
        <Trophy className="h-4 w-4" /> Knowledge Check
      </div>

      {submitted && (
        <div className="mb-8 rounded-lg border rule bg-foreground/[0.02] p-6 text-center">
          <div className="font-serif text-4xl mb-2">{score} / {gradedCount}</div>
          <p className="text-sm text-muted-foreground">
            {score === gradedCount ? "Perfect score — you mastered this story." : score >= gradedCount * 0.7 ? "Well done — you understood the key points." : "Review the article and try again."}
          </p>
          <button onClick={reset} className="mt-4 inline-flex items-center gap-2 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition">
            <RotateCcw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      )}

      <div className="grid gap-8">
        {questions.map((q, i) => (
          <div key={q.id} className="border rule p-6 rounded-lg">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-muted-foreground tabular-nums text-sm">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-serif text-xl leading-snug">{q.question}</h3>
            </div>

            {q.question_type === "reflection" ? (
              <div>
                <textarea
                  value={answers[q.id] ?? ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  rows={3}
                  placeholder="Share your reflection…"
                  className="w-full bg-transparent border rule p-4 font-serif text-base focus:outline-none focus:ring-1 focus:ring-foreground/40"
                />
              </div>
            ) : q.question_type === "true_false" ? (
              <div className="flex gap-3">
                {["true", "false"].map((opt) => {
                  const selected = answers[q.id] === opt;
                  const isCorrect = submitted && opt === q.correct_answer;
                  const isWrong = submitted && selected && opt !== q.correct_answer;
                  return (
                    <button
                      key={opt}
                      onClick={() => !submitted && setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      className={`flex-1 border rule px-4 py-3 font-serif text-lg capitalize transition ${
                        isCorrect ? "bg-foreground text-background border-foreground" :
                        isWrong ? "bg-destructive/10 border-destructive" :
                        selected ? "bg-foreground/[0.05] border-foreground/40" : "hover:bg-foreground/[0.02]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-2">
                {q.options?.map((opt, j) => {
                  const selected = answers[q.id] === opt;
                  const isCorrect = submitted && opt === q.correct_answer;
                  const isWrong = submitted && selected && opt !== q.correct_answer;
                  return (
                    <button
                      key={j}
                      onClick={() => !submitted && setAnswers((a) => ({ ...a, [q.id]: opt }))}
                      className={`flex items-center gap-3 border rule px-4 py-3 text-left transition ${
                        isCorrect ? "bg-foreground text-background border-foreground" :
                        isWrong ? "bg-destructive/10 border-destructive" :
                        selected ? "bg-foreground/[0.05] border-foreground/40" : "hover:bg-foreground/[0.02]"
                      }`}
                    >
                      <span className="font-serif text-sm text-muted-foreground w-6">{String.fromCharCode(65 + j)}</span>
                      <span className="font-serif text-base">{opt}</span>
                      {isCorrect && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                      {isWrong && <XCircle className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}

            {submitted && q.explanation && q.question_type !== "reflection" && (
              <div className="mt-4 flex items-start gap-2 rounded-md bg-foreground/[0.03] p-4">
                <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <p className="text-sm text-foreground/80 leading-relaxed">{q.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setSubmitted(true);
              const reflectionText = reflectionQuestion ? answers[reflectionQuestion.id]?.trim() : "";
              if (onReflection && reflectionText) onReflection(reflectionText);
            }}
            disabled={Object.keys(answers).length < gradedCount}
            className="border border-foreground px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
          >
            Check answers
          </button>
        </div>
      )}
    </div>
  );
}
