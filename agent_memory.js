import dotenv from 'dotenv';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tavily } from "@tavily/core";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { PromptTemplate } from "@langchain/core/prompts";
import readline from 'readline'; 

dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// 1. Tool Setup
const customSearchTool = new DynamicTool({
  name: "internet_search",
  description: "Useful for searching current events. Input should be a search query.",
  func: async (input) => {
    try {
      const response = await tvly.search(input, { max_results: 1 });
      return JSON.stringify(response.results);
    } catch (error) {
      return "Error: " + error.message;
    }
  },
});

const tools = [customSearchTool];

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY
});

// 2. Prompt with Memory Placeholder

const prompt = PromptTemplate.fromTemplate(`
You are a helpful assistant with internet access.
Answer the following questions as best you can. 

Previous Conversation:
{chat_history}

Tools available:
{tools}

Use the following format:
Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (repeat Thought/Action/Observation N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}
`);

// 3. Chat Interface Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startChat() {
  // Memory Store (Array)
  let chatHistory = [];

  const agent = await createReactAgent({
    llm: model,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
    handleParsingErrors: true,
  });

  console.log(" Agent Ready to answer your questions ! (Type 'exit' to stop)\n");

  // Recursive function 
  const askQuestion = () => {
    rl.question(' You: ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        // Chat History string conversion 
        const historyText = chatHistory.map(msg => 
          `${msg.role}: ${msg.content}`
        ).join("\n");

        const result = await agentExecutor.invoke({
          input: input,
          chat_history: historyText || "No previous conversation.", 
        });

        console.log(`\n AI Agent: ${result.output}\n`);

        
        chatHistory.push({ role: "Human", content: input });
        chatHistory.push({ role: "AI", content: result.output });

      } catch (error) {
        console.error("Error:", error.message);
      }

      askQuestion(); // ask again
    });
  };

  askQuestion();
}

startChat();