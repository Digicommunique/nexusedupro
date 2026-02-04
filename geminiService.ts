
import { GoogleGenAI } from "@google/genai";

export async function getDashboardInsight(stats: any) {
  try {
    // The API key is obtained exclusively from the environment variable process.env.API_KEY.
    // We initialize it inside the function to ensure the most up-to-date key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI School Consultant. Provide a 2-sentence professional analysis for the administrator.
      Stats: Total Students: ${stats.totalStudents}, Total Staff: ${stats.totalStaff}, Attendance Rate: ${stats.attendance}%. 
      Context: Viewing data for ${stats.segment}.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Insight calibrated successfully.";
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Intelligence node synchronizing. Please check API_KEY in Vercel settings.";
  }
}
