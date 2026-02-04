
import { GoogleGenAI } from "@google/genai";

// Guidelines: Always create a new instance right before making an API call
export async function getDashboardInsight(stats: any) {
  try {
    // Guidelines: Obtained exclusively from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Guidelines: Using 'gemini-3-flash-preview' for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on the following school statistics, provide a 2-sentence professional analysis for the administrator.
      Stats: Total Students: ${stats.totalStudents}, Total Staff: ${stats.totalStaff}, Gender Ratio: ${stats.genderRatio}, Attendance Rate: ${stats.attendance}%.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Guidelines: Directly accessing the .text property
    return response.text || "Insight unavailable at the moment.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Error generating AI insights.";
  }
}
