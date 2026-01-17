
import { GoogleGenAI, Modality } from "@google/genai";
import { DialogueSegment, Voice } from "../types";

/**
 * Decodes a base64 string into a Uint8Array.
 * Following recommended implementation for raw PCM audio streams.
 */
const decode = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * Decodes raw PCM audio data into an AudioBuffer.
 * Following recommended implementation for Gemini TTS output.
 */
const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

/**
 * Simplifies instructions for the TTS synthesis engine.
 * Avoids complex "Act as" prompts which can cause internal synthesis failures.
 */
const getFormattedPrompt = (text: string, persona: string, dialect: string) => {
  return `TTS style: ${persona}. Dialect: ${dialect}. 
Perform this text (ignore brackets for speech but use them for emotional context):
${text}`;
};

export const generateSpeech = async (
  text: string,
  voice: Voice,
  dialectLabel: string
): Promise<AudioBuffer> => {
  // Always initialize GoogleGenAI inside the function using process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Clean persona description
  const personaDesc = `${voice.gender} ${voice.traits.join(' ')}`;
  const fullPrompt = getFormattedPrompt(text, personaDesc, dialectLabel);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        // Use Modality.AUDIO constant from the SDK
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice.prebuiltId },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(part => part.inlineData?.data);
    const base64Audio = audioPart?.inlineData?.data;

    if (!base64Audio) throw new Error("No audio data returned from model.");

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
  } catch (error: any) {
    console.error("TTS Single Error:", error);
    throw error;
  }
};

export const generateDialogue = async (
  segments: DialogueSegment[],
  voices: [Voice, Voice],
  dialectLabel: string
): Promise<AudioBuffer> => {
  // Always initialize GoogleGenAI inside the function using process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use sanitized identifiers for speakers to avoid internal 500 errors 
  // caused by special characters/spaces in speaker names.
  const speaker1Id = "Speaker_A";
  const speaker2Id = "Speaker_B";

  const dialogueLines = segments.map(s => {
    const label = s.speakerIndex === 0 ? speaker1Id : speaker2Id;
    return `${label}: ${s.text}`;
  }).join('\n');

  const prompt = `TTS the following conversation between ${speaker1Id} and ${speaker2Id} in ${dialectLabel} dialect:\n\n${dialogueLines}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        // Use Modality.AUDIO constant from the SDK
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: speaker1Id,
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voices[0].prebuiltId } }
              },
              {
                speaker: speaker2Id,
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voices[1].prebuiltId } }
              }
            ]
          }
        }
      }
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(part => part.inlineData?.data);
    const base64Audio = audioPart?.inlineData?.data;

    if (!base64Audio) throw new Error("No dialogue audio data returned.");

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    return await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
  } catch (error: any) {
    console.error("TTS Dialogue Error:", error);
    throw error;
  }
};
