import { GoogleGenerativeAI } from '@google/generative-ai';
import { getEnvVar } from '../config/env';

class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = getEnvVar('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  public getAI() {
    return this.genAI;
  }

  async generateBookMetadata(title: string, author: string, description: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a concise metadata summary for the following book:
    Title: ${title}
    Author: ${author}
    Description: ${description}

    Focus on key themes, main ideas, and potential business applications.
    Keep it under 250 words.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      return response;
  } 
    catch (error) {
      console.error('Error generating book metadata:', error);
      throw new Error('Failed to generate metadata. Please try again.');
  }  
}

}

export const geminiService = new GeminiService(); 