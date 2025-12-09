import { config } from "../config/index.js";

export const generateContent = async (topic) => {
  try {
    const payload = {
      model: config.ai.model,
      messages: [
        {
          role: "user",
          content: `Write a technical blog post about "${topic}". Do not include a title in the body. Do not use markdown formatting.`,
        },
      ],
    };

    const response = await fetch(config.ai.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.ai.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `AI API Error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Received empty content from AI provider");

    return content;
  } catch (error) {
    console.error(
      `[AI Service] Generation failed for topic "${topic}":`,
      error.message,
    );
    throw error;
  }
};
