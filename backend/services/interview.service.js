const { GoogleGenAI } = require("@google/genai");
const Interview = require("../models/interview.model");
const AppError = require("../utils/AppError");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MAX_QUESTIONS = 3; // interview ends after this many questions

// Generates the very first question for a new session
async function generateFirstQuestion(topic, code) {
  const prompt = `
You are a senior technical interviewer conducting a mock interview.

Topic: ${topic}
${code ? `The candidate submitted this code, which the interview should be based on:\n${code}` : ""}

Ask ONE clear, focused interview question to start the interview.
Return ONLY valid JSON, no markdown, in this exact structure:

{
  "question": "the interview question"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text).question;
}

// Evaluates the candidate's answer and generates feedback + a score
async function evaluateAnswer(topic, question, answer) {
  const prompt = `
You are a senior technical interviewer speaking directly to the candidate in a live mock interview.

Topic: ${topic}
Question you asked: ${question}
Their answer: ${answer}

Give feedback DIRECTLY to the candidate, as if speaking to them face to face.
Address them as "you" — never refer to them as "the candidate" or in the third person.
Be honest and direct about gaps, but constructive, the way a good interviewer gives real-time feedback.

Return ONLY valid JSON, no markdown, in this exact structure:

{
  "feedback": "direct, second-person feedback on the answer, 2-3 sentences",
  "score": 7
}

Rules:
- score must be an integer from 0 to 10
- Never use the phrase "the candidate" or refer to the person in third person
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text);
}

// Generates a follow-up question based on the conversation so far
async function generateNextQuestion(topic, previousQA) {
  const history = previousQA
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}`)
    .join("\n\n");

  const prompt = `
You are a senior technical interviewer conducting a mock interview.

Topic: ${topic}

Conversation so far:
${history}

Ask the NEXT interview question. It can be a follow-up to the previous answer
or a new question on the same topic, but do not repeat earlier questions.
Return ONLY valid JSON, no markdown, in this exact structure:

{
  "question": "the next interview question"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text).question;
}

// Generates an overall summary once the interview is complete
async function generateOverallFeedback(topic, questions) {
  const summary = questions
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}\nScore: ${qa.score}/10`)
    .join("\n\n");

  const prompt = `
You are a senior technical interviewer giving final feedback DIRECTLY to the candidate
after a completed mock interview, speaking to them face to face.

Topic: ${topic}

Full transcript:
${summary}

Address the person as "you" throughout — never refer to them as "the candidate" or in the third person.
Summarize their strengths, weaknesses, and overall performance honestly but constructively.

Return ONLY valid JSON, no markdown, in this exact structure:

{
  "overallScore": 7,
  "overallFeedback": "2-4 sentence summary, written directly to the candidate in second person"
}

Rules:
- overallScore must be an integer from 0 to 10
- Never use the phrase "the candidate" or refer to the person in third person
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });

  return JSON.parse(response.text);
}
const startInterview = async ({ userId, topic, code }) => {
  const question = await generateFirstQuestion(topic, code);

  const interview = await Interview.create({
    userId,
    topic,
    code,
    questions: [{ question }],
    maxQuestions: MAX_QUESTIONS,
  });

  return interview;
};

const submitAnswer = async ({ interviewId, userId, answer }) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });

  if (!interview) {
    throw new AppError("Interview session not found", 404);
  }
  if (interview.status === "completed") {
    throw new AppError("This interview has already ended", 400);
  }

  const currentQA = interview.questions[interview.questions.length - 1];
  const { feedback, score } = await evaluateAnswer(
    interview.topic,
    currentQA.question,
    answer
  );

  currentQA.answer = answer;
  currentQA.feedback = feedback;
  currentQA.score = score;

  if (interview.questions.length >= interview.maxQuestions) {
    // Interview is done — generate overall summary
    const { overallScore, overallFeedback } = await generateOverallFeedback(
      interview.topic,
      interview.questions
    );
    interview.status = "completed";
    interview.overallScore = overallScore;
    interview.overallFeedback = overallFeedback;
  } else {
    // Ask the next question
    const nextQuestion = await generateNextQuestion(interview.topic, interview.questions);
    interview.questions.push({ question: nextQuestion });
  }

  await interview.save();
  return interview;
};

const getInterviewById = async (id, userId) => {
  return Interview.findOne({ _id: id, userId });
};

const getAllInterviews = async (userId) => {
  return Interview.find({ userId })
    .sort({ createdAt: -1 })
    .select("topic status overallScore createdAt");
};

module.exports = {
  startInterview,
  submitAnswer,
  getInterviewById,
  getAllInterviews,
};