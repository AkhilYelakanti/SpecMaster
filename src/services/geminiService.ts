/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY as string 
});

const MODEL_NAME = "gemini-3-flash-preview";

export async function suggestContent(section: string, projectTitle: string, projectSubtitle: string, currentContext: string = "") {
  try {
    const prompt = `
      You are an expert Technical Writer. 
      Generate content for the "${section}" section of a Technical Specification Document.
      
      Project Details:
      - Title: ${projectTitle}
      - Subtitle: ${projectSubtitle}
      ${currentContext ? `- Current Context: ${currentContext}` : ""}

      Requirements:
      - Format: Markdown
      - Tone: Professional, technical, concise
      - Length: Appropriate for the section (not too short, not a whole book)
      - Content: High-quality technical details, bullet points where appropriate.

      Return ONLY the markdown content.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function improveContent(content: string) {
  try {
    const prompt = `
      You are an expert Technical Writer. 
      Improve the following technical documentation content. 
      Fix grammar, improve clarity, use professional terminology, and ensure it follows markdown best practices.
      
      Content to improve:
      ${content}

      Return ONLY the improved markdown content.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function generateTestCases(businessNeed: string, proposedSolution: string) {
  try {
    const prompt = `
      Based on the following Business Need and Proposed Solution, generate a list of test scenarios.
      
      Business Need:
      ${businessNeed}
      
      Proposed Solution:
      ${proposedSolution}

      Requirements:
      - Return a JSON array of objects with the structure: [{ scenario: "Description", expectedResult: "What should happen", stage: "Functional" | "Integration" | "Regression" }]
      - Provide at least 3 scenarios for each stage if possible.
      
      Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
