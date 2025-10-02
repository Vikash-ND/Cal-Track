
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionInfo } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeImageWithGemini = async (imageFile: File): Promise<NutritionInfo> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `
      Analyze the food items in this image.
      1. Identify the primary food item(s).
      2. Estimate the total portion size in grams.
      3. Provide a detailed nutritional analysis for the entire meal shown.
      4. Offer practical advice for portion control and suggest a healthier alternative.

      Return the data strictly in the JSON format defined by the schema.
    `;
    
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        foodName: { type: Type.STRING, description: "Name of the food or meal." },
        totalCalories: { type: Type.NUMBER, description: "Total calories for the meal." },
        portionSizeGrams: { type: Type.NUMBER, description: "Estimated portion size in grams." },
        macronutrients: {
          type: Type.OBJECT,
          properties: {
            proteinG: { type: Type.NUMBER, description: "Grams of protein." },
            carbohydratesG: { type: Type.NUMBER, description: "Grams of carbohydrates." },
            fatG: { type: Type.NUMBER, description: "Grams of fat." },
          },
          required: ["proteinG", "carbohydratesG", "fatG"],
        },
        micronutrients: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of the vitamin or mineral." },
              amount: { type: Type.STRING, description: "Amount with units (e.g., '10mg')." },
            },
            required: ["name", "amount"],
          },
        },
        recommendations: {
          type: Type.OBJECT,
          properties: {
            portionAdvice: { type: Type.STRING, description: "Advice on portion size." },
            healthierAlternative: { type: Type.STRING, description: "A healthier food alternative." },
          },
          required: ["portionAdvice", "healthierAlternative"],
        },
      },
      required: ["foodName", "totalCalories", "portionSizeGrams", "macronutrients", "micronutrients", "recommendations"],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            }
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        return parsedData as NutritionInfo;
    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw new Error("Failed to analyze image. The AI model could not process the request.");
    }
};
