
import { GoogleGenAI, Type, Modality, GenerateContentResponse, GenerateContentParameters } from "@google/genai";
import { AspectRatio, ImageSize, ThinkingLevel } from '@/types';

// Singleton instance to be recreated on demand if needed (for Veo/ApiKey dialog)
let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiInstance;
};

export const geminiService = {
  // 1. Image Editing (Gemini 2.5 Flash Image)
  async editImage(base64Data: string, prompt: string, mimeType: string = 'image/png') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt }
        ]
      }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // 2. Video Generation (Veo 3.1 Fast)
  async generateVideoFromImage(base64Data: string, prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this photo with subtle cinematic movements',
      image: {
        imageBytes: base64Data,
        mimeType: 'image/png'
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  },

  // 3. Search Grounding (Gemini 3 Flash)
  async searchEducationalInfo(query: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  // 4. High Quality Image Gen (Gemini 3 Pro Image)
  async generatePremiumImage(prompt: string, aspectRatio: AspectRatio, size: ImageSize) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio,
          imageSize: size
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  // 5. Image Analysis (Gemini 3.1 Pro)
  async analyzeDocument(base64Data: string, prompt: string, mimeType: string = 'image/png') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt || "Analyze this image/document in detail. If it's a school report, summarize the findings." }
        ]
      }
    });
    return response.text;
  },

  // 6. TTS (Gemini 2.5 Flash TTS)
  async textToSpeech(text: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;
    
    return base64Audio;
  },

  // 7. Complex Thinking Mode (Gemini 3.1 Pro)
  async thinkComplexly(prompt: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        // As per instructions: ThinkingLevel.HIGH, no maxOutputTokens
        thinkingConfig: { thinkingBudget: 32768 } 
      }
    } as any); // Typing for newer SDK fields
    return response.text;
  }
};
