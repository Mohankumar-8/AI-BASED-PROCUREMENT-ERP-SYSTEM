import { GoogleGenAI } from '@google/genai';

export class GeminiService {
  private static instance: GeminiService;
  private client: GoogleGenAI | null = null;

  private constructor() {
    this.initClient();
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  private initClient(): void {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.client = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  public getClient(): GoogleGenAI | null {
    if (!this.client && process.env.GEMINI_API_KEY) {
      this.initClient();
    }
    return this.client;
  }

  public hasApiKey(): boolean {
    return Boolean(process.env.GEMINI_API_KEY);
  }

  /**
   * Generates structured JSON output using Gemini 3.7 Flash
   */
  public async generateJson<T = any>(
    prompt: string,
    systemInstruction?: string,
    fallbackData?: T
  ): Promise<{ data: T; engine: string }> {
    const ai = this.getClient();
    if (!ai) {
      if (fallbackData !== undefined) {
        return { data: fallbackData, engine: 'deterministic-smart-fallback' };
      }
      throw new Error('Gemini API key is not configured and no fallback data provided');
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          ...(systemInstruction ? { systemInstruction } : {}),
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return { data: parsed, engine: 'gemini-3.7-flash' };
    } catch (err: any) {
      console.warn('[GeminiService] AI generation failed, using fallback:', err.message);
      if (fallbackData !== undefined) {
        return { data: fallbackData, engine: 'deterministic-smart-fallback' };
      }
      throw err;
    }
  }

  /**
   * Generates conversational text for Copilot
   */
  public async generateChat(
    history: { role: string; content: string }[],
    systemInstruction: string,
    fallbackText: string
  ): Promise<{ text: string; engine: string }> {
    const ai = this.getClient();
    if (!ai) {
      return { text: fallbackText, engine: 'deterministic-smart-fallback' };
    }

    try {
      const formattedHistory = history
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      return { text: response.text || fallbackText, engine: 'gemini-3.7-flash' };
    } catch (err: any) {
      console.warn('[GeminiService] Chat generation failed, using fallback:', err.message);
      return { text: fallbackText, engine: 'deterministic-smart-fallback' };
    }
  }
}

export const geminiService = GeminiService.getInstance();
