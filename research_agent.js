import dotenv from 'dotenv';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tavily } from "@tavily/core";
import { DynamicTool } from "@langchain/core/tools";
import { AgentExecutor, createReactAgent } from "langchain/agents"; 
import { PromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// 1. Tool Define 
const customSearchTool = new DynamicTool({
  name: "internet_search",
  description: "Useful for searching current events and news on the internet. Input should be a search query.",
  func: async (input) => {
    console.log(`\n Internet Search: "${input}"`);
    try {
      const response = await tvly.search(input, { max_results: 1 });
      // Context return 
      return JSON.stringify(response.results);
    } catch (error) {
      return "Error: " + error.message;
    }
  },
});

const tools = [customSearchTool];

// 2. Model Setup
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY
});

// 3. ReAct Prompt 
const prompt = PromptTemplate.fromTemplate(`
Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought:{agent_scratchpad}
`);

async function runAgent() {
  try {
    console.log("ReAct Agent start ho raha hai...\n");

    // 4. Create ReAct Agent
    const agent = await createReactAgent({
      llm: model,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true, // process visible
      handleParsingErrors: true, // agent can correct mistakes 
    });

    const question = " Who is the Current Prime Minister of India and what is the  latest news about him?";
    console.log(`User: ${question}`);
    
    const result = await agentExecutor.invoke({
      input: question,
    });

    console.log("\n Final Jawab:\n", result.output);

  } catch (error) {
    console.error(" Error:", error.message);
  }
}

runAgent();