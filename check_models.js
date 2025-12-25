import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ Error: .env file not found");
  process.exit(1);
}

console.log(" Checking available models ...");

async function getModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error.message);
    } else {
      console.log("\n Available Models:");
      // Only 'generateContent' models filtering
      const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
      
      chatModels.forEach(model => {
        console.log(`- ${model.name.replace("models/", "")}`);
      });
    }
  } catch (error) {
    console.error(" Network Error:", error.message);
  }
}

getModels();