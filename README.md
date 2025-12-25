# AI Research Agent with Memory

## Overview

This project is a state-of-the-art Conversational AI Agent built using Node.js and LangChain. Unlike standard passive chatbots, this agent implements the ReAct (Reasoning and Acting) architecture. This allows the AI to "think" before answering, perform real-time internet searches, and maintain conversation context.

It uses Google's Gemini 1.5 Flash model as the reasoning engine and Tavily API for retrieving accurate, up-to-date information from the web.

## Key Features

- **Real-Time Internet Access:** Unlike static LLMs with training cutoffs, this agent can fetch live information (e.g., "Latest news," "Current stock prices").
- **Contextual Memory:** The agent remembers previous turns in the conversation. Users can ask follow-up questions using pronouns (e.g., "Who is the PM of India?" followed by "What is his age?") without losing context.
- **ReAct Pattern:** Implements a "Thought - Action - Observation - Answer" loop, ensuring answers are fact-checked and grounded in retrieved data.
- **System Awareness:** The agent is aware of the current date and time, preventing hallucinations about timelines.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** LangChain.js
- **LLM Provider:** Google Generative AI (Gemini 2.5 pro)
- **Search Engine:** Tavily Search API
- **Utilities:** Dotenv, Readline

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 18 or higher)
- NPM (Node Package Manager)

## Installation & Setup

1. **Clone the Repository** (or download the project folder):

```bash
git clone https://github.com/Apoorv479/Research-AI-Agent.
cd research-agent

```

2. **Install Dependencies:**
   This command installs LangChain, Gemini, Tavily, and other necessary packages.

```bash
npm install

```

3. **Configure Environment Variables:**
   Create a file named `.env` in the root directory of the project. Add your API keys as shown below:

```env
GOOGLE_API_KEY=your_google_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key

```

- _Get Gemini Key:_ Google AI Studio
- _Get Tavily Key:_ Tavily AI

## Usage

To start the agent with memory capabilities, run the following command in your terminal:

```bash
node agent_memory.js

```

### Example Interaction

Once the agent is running:

```text
[System] Chatbot Ready! (Type 'exit' to stop)

[User] You: Who is the current CEO of Microsoft?
[AI] AI: Satya Nadella is the Chairman and CEO of Microsoft.

[User] You: When did he join the company?
[AI] AI: Satya Nadella joined Microsoft in 1992.

```

_(Notice how the agent understood "he" refers to Satya Nadella based on the previous message.)_

## Project Structure

```
Research-agent/
├── node_modules/       # Dependencies
├── agent_memory.js     # Main Agent Logic (Memory + Search)
├── agents2.js          # Basic Agent Implementation
├── package.json        # Project Metadata & Scripts
├── .env                # API Keys (Not pushed to GitHub)
└── README.md           # Project Documentation

```

## Future Roadmap

- [ ] **RAG Implementation:** Add capability to read and chat with PDF documents/Resumes.
- [ ] **Persistent Database:** Move from in-memory storage to a database (Redis/PostgreSQL) to save chat history permanently.
- [ ] **Frontend UI:** Build a React.js interface for a better user experience.

## License

This project is open-source and available under the MIT License.
