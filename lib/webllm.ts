import {
  ChatCompletionMessageParam,
  CreateMLCEngine,
  MLCEngine,
  InitProgressReport,
} from "@mlc-ai/web-llm";

let engine: MLCEngine | null = null;
let isInitializing = false;

export async function initializeEngine(
  progressCallback?: (progress: InitProgressReport) => void
) {
  // Prevent duplicate initialization
  if (engine) {
    console.log("Engine already initialized");
    return engine;
  }

  if (isInitializing) {
    console.log("Engine initialization already in progress");
    return null;
  }

  isInitializing = true;

  try {
    const initProgressCallback = (progress: InitProgressReport) => {
      console.log(progress.text);
      if (progressCallback) {
        progressCallback(progress);
      }
    };

    engine = await CreateMLCEngine("Phi-3.5-mini-instruct-q4f16_1-MLC", {
      initProgressCallback,
    });
    
    console.log("Engine initialization complete");
    return engine;
  } catch (error) {
    console.error("Failed to initialize engine:", error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

export function isEngineInitialized(): boolean {
  return engine !== null;
}

export function isEngineInitializing(): boolean {
  return isInitializing;
}

export async function getCards(topic: string, count: number) {
  if (!engine) {
    console.error("Engine not initialized");
    return null;
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "user",
      content: `
                Generate ${count} flashcards for the topic: ${topic} to help me study for an exam.
                The flashcards should be in a JSON array format with the following fields: question, answer.
                The flashcards should be in whatever language the topic is in. 
                Only return the JSON array, no other text. Do not wrap the JSON in quotes.
                Check your spelling and grammar before returning the JSON array.
                Make sure the first JSON field is "question" and the second field is "answer".
                Do not include any markdown formatting (such as backticks) for code blocks.
                Make sure the JSON complies with javascripts JSON.parse() function rules, dont provide invalid characters in the JSON.
            `,
    },
  ];

  const reply = await engine!.chat.completions.create({
    messages,
  });

  const content = reply.choices[0].message.content;
  if (!content) return null;

  //console.log(content);

  return content;
}
