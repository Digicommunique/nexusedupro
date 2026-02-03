
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDashboardInsight(stats: any) {
  try {
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
