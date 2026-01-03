
import { GoogleGenAI, Type } from "@google/genai";
import { QuizResult, UserAnswer, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateAIFeedback(result: QuizResult, questions: Question[]) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Dưới đây là kết quả bài thi trắc nghiệm lập trình của một người dùng:
    Chủ đề: ${result.topic}
    Điểm số: ${result.score}/${result.totalQuestions}
    Phân loại: ${result.level}
    
    Chi tiết các câu sai:
    ${result.userAnswers.filter(a => !a.isCorrect).map(a => {
      const q = questions.find(question => question.id === a.questionId);
      return `- Câu hỏi: "${q?.questionText}"
        - Người dùng trả lời: ${JSON.stringify(a.answer)}
        - Đáp án đúng: ${JSON.stringify(q?.correctAnswer)}
        - Giải thích gốc: ${q?.explanation}`;
    }).join('\n')}

    Hãy đóng vai một chuyên gia EdTech, phân tích:
    1. Những lỗ hổng kiến thức chính mà người dùng đang gặp phải dựa trên các lỗi sai.
    2. Gợi ý cụ thể các chủ đề hoặc từ khóa cần ôn tập lại.
    3. Đưa ra lời khuyên lộ trình ngắn hạn để cải thiện kỹ năng trong chủ đề này.
    
    Phản hồi bằng tiếng Việt, giọng điệu chuyên nghiệp, khích lệ và cấu trúc rõ ràng.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Feedback error:", error);
    return "Không thể kết nối với AI để lấy phân tích chi tiết. Tuy nhiên, hãy xem lại các giải thích trong danh sách bên dưới.";
  }
}
