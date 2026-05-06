/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  return localStorage.getItem('gemini_api_key') || (process.env.GEMINI_API_KEY as string) || "";
};

export const isAiConfigured = () => !!getApiKey();

const ai = () => new GoogleGenAI({ 
  apiKey: getApiKey() 
});

const MODEL_NAME = "gemini-3-flash-preview";

export async function suggestContent(section: string, projectTitle: string, projectSubtitle: string, currentContext: string = "") {
  if (!isAiConfigured()) {
    // Provide high-quality mock data for local development
    return `### ${section} (Draft)\n\n*This content was generated in Simulation Mode (No API Key found).* \n\n**Strategic Objective:** \nThe primary objective of the ${projectTitle} initiative is to streamline technical documentation using standardized frameworks. This section outlines the specific requirements and parameters for ${section}.\n\n#### Key Considerations:\n- **Scalability:** Ensure the architecture supports future vertical and horizontal scaling.\n- **Maintainability:** Focus on code modularity and documentation consistency.\n- **Integration:** Seamless connectivity with ${projectSubtitle} systems.\n\n> [!NOTE]\n> For production-ready AI generated content, please configure a GEMINI_API_KEY.`;
  }

  try {
    const response = await ai().models.generateContent({
      model: MODEL_NAME,
      contents: `
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
      `
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function improveContent(content: string) {
  if (!isAiConfigured()) {
    return `${content}\n\n*(Simulation Mode: Clarity and grammar improved according to technical best practices. Please add a Gemini API key for real AI refinement.)*`;
  }

  try {
    const response = await ai().models.generateContent({
      model: MODEL_NAME,
      contents: `
        You are an expert Technical Writer. 
        Improve the following technical documentation content. 
        Fix grammar, improve clarity, use professional terminology, and ensure it follows markdown best practices.
        
        Content to improve:
        ${content}

        Return ONLY the improved markdown content.
      `
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function generateTestCases(businessNeed: string, proposedSolution: string) {
  if (!isAiConfigured()) {
    return [
      { scenario: "Validate core system initialization with valid parameters", expectedResult: "System boots successfully into idle state", stage: "Functional" },
      { scenario: "Simulate high concurrency load during peak traffic", expectedResult: "Latency stays below 200ms with 99.9% success rate", stage: "Regression" },
      { scenario: "API Authentication handshake with expired token", expectedResult: "401 Unauthorized status with descriptive error message", stage: "Integration" }
    ];
  }

  try {
    const response = await ai().models.generateContent({ 
      model: MODEL_NAME,
      contents: `
        Based on the following Business Need and Proposed Solution, generate a list of test scenarios.
        
        Business Need:
        ${businessNeed}
        
        Proposed Solution:
        ${proposedSolution}

        Requirements:
        - Return a JSON array of objects with the structure: [{ scenario: "Description", expectedResult: "What should happen", stage: "Functional" | "Integration" | "Regression" }]
        - Provide at least 3 scenarios for each stage if possible.
        
        Return ONLY valid JSON.
      `,
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
