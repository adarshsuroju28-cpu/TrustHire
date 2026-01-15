
import { GoogleGenAI, Type } from "@google/genai";

// Always use a fresh instance right before making an API call
const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateEmailSecurity = async (email: string) => {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the security and validity of this email address: "${email}". 
    Check if the domain is a known burner/disposable email provider, if it has a valid MX record (simulate check), and if it has been associated with malicious activity. 
    Return a JSON object with: 
    - isValid (boolean)
    - isSafe (boolean)
    - reason (string)
    - domainTrustScore (number 0-100)`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          isSafe: { type: Type.BOOLEAN },
          reason: { type: Type.STRING },
          domainTrustScore: { type: Type.NUMBER }
        },
        required: ["isValid", "isSafe", "reason", "domainTrustScore"]
      }
    }
  });

  // Extract grounding chunks as required when using Google Search
  const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Security Context',
    url: chunk.web?.uri || '#'
  })) || [];

  return {
    analysis: JSON.parse(response.text.trim()),
    sources: urls
  };
};

export const analyzeJobPost = async (content: string, imageBase64?: string, mimeType: string = 'image/png') => {
  const ai = createAI();
  
  const parts: any[] = [];
  
  if (content.trim()) {
    parts.push({ text: `Content to analyze: ${content}` });
  }
  
  if (imageBase64) {
    parts.push({
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    });
  }

  const prompt = `Perform a deep security analysis on this job posting or communication. 
  IMPORTANT: If a URL or Link is detected in the text, use Google Search to:
  1. Check the domain's registration date and owner (Whois).
  2. Search for "scam", "phishing", or "fake" reports associated with this specific URL.
  3. Verify if the company mentioned actually owns this domain.
  4. Analyze the language for common phishing or recruitment fraud patterns.
  5. Extract text from the image if provided and analyze it.
  
  Provide a detailed risk assessment in JSON format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { text: prompt },
        ...parts
      ]
    },
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Trust score from 0-100" },
          riskLevel: { type: Type.STRING, description: "Low, Medium, or High" },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          verdict: { type: Type.STRING, description: "Short summary of findings" },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "riskLevel", "redFlags", "verdict", "recommendations"]
      }
    }
  });

  const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'External Source',
    url: chunk.web?.uri || '#'
  })) || [];

  return {
    analysis: JSON.parse(response.text.trim()),
    sources: urls
  };
};

export const getCareerGuidance = async (skills: string[]) => {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `As a professional career advisor, analyze these skills: ${skills.join(', ')}. 
    Suggest 3-4 specific job roles and legitimate, high-trust companies that actively hire for these skills. 
    Explain why they match and provide a description for each path.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            description: { type: Type.STRING },
            matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            topCompanies: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["role", "description", "matchingSkills", "topCompanies"]
        }
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const getUpskillingResources = async (interests: string[]) => {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Find high-rated learning resources for these interests: ${interests.join(', ')}. 
    I specifically need direct YouTube tutorial links (playlists or popular videos) and free courses.
    For each resource, provide a clear title, description, the provider name, and the direct URL.
    Return the data in a structured JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            provider: { type: Type.STRING },
            url: { type: Type.STRING },
            type: { type: Type.STRING },
            ratingInfo: { type: Type.STRING }
          },
          required: ["title", "description", "provider", "url", "type"]
        }
      }
    }
  });

  const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Source',
    url: chunk.web?.uri || '#'
  })) || [];

  return {
    resources: JSON.parse(response.text.trim()),
    sources: urls
  };
};

export const searchCompanyLegitimacy = async (query: string) => {
  const ai = createAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Investigate the legitimacy of this input: "${query}". 
    It may be a company name or a website URL. 
    Use Google Search to cross-reference:
    1. Official domain history and safety records.
    2. Physical registration and corporate headquarters.
    3. User reviews and scam alerts.
    4. Recent news.
    Summarize findings clearly and assign a status: 'Legitimate', 'Suspicious', or 'Verified'.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const urls = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Verification Link',
    url: chunk.web?.uri || '#'
  })) || [];

  return {
    text: response.text,
    urls: urls
  };
};
