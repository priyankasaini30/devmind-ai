const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// AI Code Review
async function reviewCodeWithGemini(code, language) {
  const prompt = `
You are an expert software engineer and code reviewer.

Analyze the following ${language} code.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside the JSON.

Use exactly this structure:

{
  "summary": "short overall review",
  "bugs": [
    {
      "title": "bug title",
      "description": "explanation",
      "severity": "High"
    }
  ],
  "security": [
    {
      "title": "security issue",
      "description": "explanation",
      "severity": "High"
    }
  ],
  "complexity": {
    "time": "O(1)",
    "space": "O(1)",
    "explanation": "short explanation"
  },
  "codeQuality": {
    "score": 8,
    "comment": "short explanation"
  },
  "suggestions": [
    "suggestion 1",
    "suggestion 2"
  ]
}

Rules:
- severity must be one of: "High", "Medium", "Low"
- score must be a number from 1 to 10
- If there are no bugs, return an empty bugs array.
- If there are no security issues, return an empty security array.
- Keep explanations concise.

Code:

${code}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const reviewText = response.text;
  return JSON.parse(reviewText);
}

module.exports = {
  reviewCodeWithGemini,
};