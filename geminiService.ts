
import { GoogleGenAI } from "@google/genai";

// Function to get AI client ensures we always use the latest environment variables
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI insights will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export async function getDashboardInsight(stats: any) {
  try {
    const ai = getAIClient();
    if (!ai) return "AI Insight unavailable: API Key not configured.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following school statistics, provide a 2-sentence professional analysis for the administrator.
      Stats: Total Students: ${stats.totalStudents}, Total Staff: ${stats.totalStaff}, Gender Ratio: ${stats.genderRatio}, Attendance Rate: ${stats.attendance}%.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Insight unavailable at the moment.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Error generating AI insights.";
  }
}
