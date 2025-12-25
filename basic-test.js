// 1. Libraries Import 
import dotenv from 'dotenv';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// 2. Environment Variables load
dotenv.config();

// 3. AI Model (Brain)  Initialized 
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash", // Google AI  model
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY, 
  temperature: 0.7, // Creativity level (0 = Robot, 1 = Creative)
});

// 4. Function to talk to AI 
async function testAgent() {
  try {
    console.log(" Agent is thinking...");
    
    // 5.sending(invoke) message to AI 
    const response = await model.invoke("Tell me in one sentence ,what is AI agent");
    
    // 6. Answer print 
    console.log("\n Agent Answer:");
    console.log(response.content);

  } catch (error) {
    console.error("Error came :", error.message);
  }
}

// Function run
testAgent();