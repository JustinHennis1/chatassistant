import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req) {
  const client = new OpenAI({ baseURL: "http://localhost:1234/v1", apiKey: "lm-studio" });

  let systemDefault = "You are an Artificially Intelligent Assistant here to help people manage their daily schedules. " +
    "Plan out their day and engage with them on ways to be more productive. Use a maximum of 5 sentences.";

  let usermessage = await req.json();
  //console.log("message history:", usermessage);

  const completion = await client.chat.completions.create({
    model: "lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF",
    messages: [{ role: 'system', content: systemDefault }, ...usermessage],
    temperature: 0.7,
    stream: true,
    max_tokens: 100,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      try {
        for await (const chunk of completion) {
          if (chunk.choices && chunk.choices.length > 0) {
            const content = chunk.choices[0]?.delta?.content; // Access the delta property
            if (content) {
              const text = encoder.encode(content)
              controller.enqueue(content); // Stream the content
            } 
          } 
        }
      } catch (error) {
        console.error("Error while streaming:", error);
        controller.error(error); // Handle errors
      } finally {
        controller.close(); // Close the stream when done
      }
    }
  });

  return new NextResponse(stream);
}