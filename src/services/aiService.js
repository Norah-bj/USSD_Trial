// src/services/aiService.js
import OpenAI from "openai";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load AI system instructions (optional custom guide file)
const systemInstructions = readFileSync(
  join(__dirname, "../config/ai-instructions.txt"),
  "utf-8"
);

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get AI assistance for MotherLink
 * @param {string} topic - Type of request (pregnancy, counselling, distress, etc.)
 * @param {string} customRequest - Optional custom message from user
 * @param {string} locale - Language preference (default: rw)
 * @returns {Promise<Object>} AI response
 */
export const getMotherlinkGuidance = async (
  topic,
  customRequest = null,
  locale = "rw"
) => {
  try {
    const userPrompt = customRequest
      ? buildCustomPrompt(customRequest, locale)
      : buildTopicPrompt(topic, locale);

    const systemPrompt = `${systemInstructions}\nMake responses short, friendly, and easy to understand for USSD users.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    const aiText = completion.choices[0].message.content;
    const formattedText = formatForUSSD(aiText);

    return {
      success: true,
      guidance: formattedText,
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      success: false,
      error: error.message,
      guidance: getDefaultGuidance(topic, locale),
    };
  }
};

/**
 * Build prompt for common MotherLink topics
 */
const buildTopicPrompt = (topic, locale) => {
  const langInstruction = getLanguageInstruction(locale);

  const prompts = {
    pregnancy: `${langInstruction} Umuntu utwite arakeneye inama zihuse ku bijyanye n'ubuzima bwe n'ubw'umwana. Tangira inama ngufi kandi z'umwihariko ku bijyanye n'ubuzima bw'ababyeyi batwite.`,
    postpartum: `${langInstruction} Umubyeyi amaze kubyara arashaka inama ku buryo yakwita ku mwana n'ubuzima bwe. Tanga inama z'ingenzi kandi ngufi.`,
    counselling: `${langInstruction} Umuntu arumva afite ikibazo cy'agahinda cyangwa ihungabana. Tangira amagambo yihuse yo kumuhumuriza n'aho yahera kugira ngo abone ubufasha.`,
    distress: `${langInstruction} Umuntu ari mu bibazo bikomeye byihutirwa (nk'iterabwoba, ihohoterwa, cyangwa ikibazo cy'ubuzima). Tanga inama y'ibanze mu buryo bugufi kandi bworoheje.`,
    health: `${langInstruction} Umuntu arashaka kumenya uburyo bwo kubaho neza no kurinda ubuzima bwe. Tanga inama zoroheje ku buzima rusange.`,
    other: `${langInstruction} Tanga inama z'ibanze kandi ngufi ku bijyanye n'ubuzima n'umutekano.`,
  };

  return prompts[topic] || prompts.other;
};

/**
 * Build custom prompt for user question
 */
const buildCustomPrompt = (customRequest, locale) => {
  const langInstruction = getLanguageInstruction(locale);
  return `${langInstruction} Umuntu wo mu Rwanda yabajije ikibazo gikurikira: "${customRequest}". Tanga igisubizo ngufi, cyumvikana, gifasha kandi cyuje ubuntu. Niba ari ikibazo cy’ubuzima cyangwa iterambere, fata nk’umujyanama w’umuryango ufasha mu buryo bworoheje.`;
};

/**
 * Language control for AI
 */
const getLanguageInstruction = (locale) => {
  const instructions = {
    rw: "Subiza mu Kinyarwanda, ukoreshe amagambo asanzwe yoroheje kumvwa n'abantu bose.",
    en: "Respond in English, clearly and simply.",
  };
  return instructions[locale] || instructions.rw;
};

/**
 * Format response for USSD
 */
const formatForUSSD = (text) => {
  let formatted = text.replace(/[*_#]/g, "");
  formatted = formatted.replace(/\s+/g, " ").trim();

  if (formatted.length > 480) {
    formatted = formatted.substring(0, 477) + "...";
  }

  return formatted;
};

/**
 * Default fallback messages
 */
const getDefaultGuidance = (topic, locale) => {
  const defaultGuidance = {
    rw: {
      pregnancy:
        "Gerageza kuruhuka bihagije, unywe amazi menshi, kandi ujye kwa muganga buri gihe. Niba ubabara, hamagara 114 cyangwa 112.",
      postpartum:
        "Wite ku isuku yawe n'iy'umwana. Niba ubabara cyangwa utagira ibyishimo, saba ubufasha kwa muganga cyangwa umujyanama.",
      counselling:
        "Uri umuntu ukomeye. Vugana n'inshuti cyangwa umuryango. Ushobora no guhamagara 112 niba ubabaye cyane.",
      distress:
        "Igarurire icyizere. Hamagara 112 cyangwa 3512 niba ukeneye ubufasha bwihuse. Ntube wenyine muri ibi bihe.",
      health:
        "Kurya neza, gukora imyitozo, no gusinzira neza ni ingenzi. Gerageza kubaho utuje kandi urinde umubiri wawe.",
      other:
        "Ibibazo byose bifite ibisubizo. Kurikiza inama z'ubuzima kandi ushake ubufasha igihe bikomeye.",
    },
    en: {
      pregnancy:
        "Get enough rest, drink water, and visit the clinic regularly. If you feel pain, call 114 or 112.",
      postpartum:
        "Take care of your hygiene and your baby’s. If you feel unwell or sad, talk to a doctor or counselor.",
      counselling:
        "You are strong. Talk to someone you trust or call 112 for help.",
      distress:
        "Stay calm and seek help. Call 112 or 3512 for immediate assistance.",
      health:
        "Eat healthy, stay active, and rest well. Stay calm and take care of your body.",
      other:
        "Every problem has a solution. Stay hopeful and seek help when needed.",
    },
  };

  const guidance = defaultGuidance[locale] || defaultGuidance.rw;
  return guidance[topic] || guidance.other;
};

/**
 * Emergency-specific AI response (for USSD quick guidance)
 */
export const getEmergencyGuidance = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an emergency assistant for Rwandans via USSD. Keep answers short (max 500 characters), in simple Kinyarwanda when possible.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    });

    const aiText = response.choices[0].message.content.trim();
    return formatForUSSD(aiText);
  } catch (error) {
    console.error("Emergency AI Error:", error);
    return "Ntitwashoboye kugufasha ubu. Gerageza kongera cyangwa hamagara 112.";
  }
};
