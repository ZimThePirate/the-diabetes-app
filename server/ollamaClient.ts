import ollama from "ollama";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default class OllamaClient {
  async chat(model: string, messages: ChatMessage[]) {
    const response = await ollama.chat({
      model,
      messages,
    });
    return response;
  }

  async *streamChat(model: string, messages: ChatMessage[]) {
    const stream = await ollama.chat({
      model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk?.message?.content) {
        yield chunk.message.content;
      }
    }
  }

  async generate(model: string, prompt: string) {
    const res = await ollama.generate({
      model,
      prompt,
    });
    return res.response;
  }

  async listModels() {
    const list = await ollama.list();
    return list.models.map((m: any) => m.name);
  }

  async pullModel(model: string) {
    await ollama.pull({ model });
    return `${model} pulled successfully`;
  }
}
