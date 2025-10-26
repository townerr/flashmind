import { ChatCompletionMessageParam, CreateMLCEngine, InitProgressReport } from "@mlc-ai/web-llm";

 // Initialize with a progress callback
 const initProgressCallback = (progress: InitProgressReport) => {
     //console.log("Model loading progress:", progress.text);
 };

// Using CreateMLCEngine
const engine = await CreateMLCEngine("Phi-3.5-mini-instruct-q4f16_1-MLC", { initProgressCallback });

export async function getCards(topic: string, count: number) {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: "user",
            content:
            `
                Generate ${count} flashcards for the topic: ${topic} to help me study for an exam.
                The flashcards should be in a JSON array format with the following fields: question, answer.
                The flashcards should be in whatever language the topic is in. 
                Only return the JSON array, no other text. Do not wrap the JSON in quotes.
                Check your spelling and grammar before returning the JSON array.
                Make sure the first JSON field is "question" and the second field is "answer".
            `
        }
    ];

    const reply = await engine.chat.completions.create({
        messages,
    });

    const content = reply.choices[0].message.content;
    if (!content) return null;

    console.log(content);

    return content;
}