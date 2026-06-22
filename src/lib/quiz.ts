/**
 * Cấu trúc của 1 câu hỏi quiz.
 * answerIndex là vị trí đáp án đúng trong mảng options.
 */
export type QuizQuestion = {
  question: string;
  options: string[];
  answerIndex: number;
};

/**
 * Dữ liệu quiz được AI trả về dưới dạng JSON.
 */
export type QuizPayload = {
  title: string;
  topic?: string;
  questions: QuizQuestion[];
};

/**
 * Type Guard:
 * Kiểm tra object có đúng cấu trúc QuizQuestion hay không.
 *
 * Dùng để validate dữ liệu từ AI trước khi sử dụng,
 * tránh lỗi runtime khi dữ liệu bị sai format.
 */
function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (typeof value !== "object" || value === null) return false;

  const question = (value as { question?: unknown }).question;
  const options = (value as { options?: unknown }).options;
  const answerIndex = (value as { answerIndex?: unknown }).answerIndex;

  return (
    typeof question === "string" &&
    Array.isArray(options) &&
    options.every((option) => typeof option === "string") &&
    typeof answerIndex === "number" &&
    Number.isInteger(answerIndex) &&
    answerIndex >= 0 &&
    answerIndex < options.length
  );
}

/**
 * Type Guard:
 * Kiểm tra object có đúng cấu trúc QuizPayload hay không.
 *
 * Bao gồm:
 * - title là string
 * - topic (nếu có) là string
 * - questions là mảng QuizQuestion hợp lệ
 */
function isQuizPayload(value: unknown): value is QuizPayload {
  if (typeof value !== "object" || value === null) return false;

  const parsed = value as {
    title?: unknown;
    topic?: unknown;
    questions?: unknown;
  };

  return (
    typeof parsed.title === "string" &&
    (parsed.topic === undefined || typeof parsed.topic === "string") &&
    Array.isArray(parsed.questions) &&
    parsed.questions.every(isQuizQuestion)
  );
}

/**
 * AI đôi khi trả về:
 *
 * ```json
 * {
 *   ...
 * }
 * ```
 *
 * hoặc:
 *
 * Đây là quiz của bạn:
 * {
 *   ...
 * }
 *
 * Hàm này lấy ra phần JSON object đầu tiên trong chuỗi.
 */
function extractJson(content: string): string | null {
  const match = content.match(/\{[\s\S]*\}/);
  return match?.[0] ?? null;
}

/**
 * Parse nội dung AI trả về thành QuizPayload.
 *
 * Flow:
 * 1. Trim dữ liệu đầu vào
 * 2. Tách phần JSON khỏi text
 * 3. JSON.parse()
 * 4. Validate bằng Type Guard
 * 5. Trả về QuizPayload hoặc null nếu dữ liệu không hợp lệ
 */
export function parseQuizPayload(content: string): QuizPayload | null {
  const normalized = content.trim();

  if (!normalized) {
    return null;
  }

  const jsonString = extractJson(normalized);

  if (!jsonString) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonString);
    return isQuizPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}