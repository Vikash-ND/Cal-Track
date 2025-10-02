
export interface NutritionInfo {
  foodName: string;
  totalCalories: number;
  portionSizeGrams: number;
  macronutrients: {
    proteinG: number;
    carbohydratesG: number;
    fatG: number;
  };
  micronutrients: Array<{
    name: string;
    amount: string;
  }>;
  recommendations: {
    portionAdvice: string;
    healthierAlternative: string;
  };
}

export interface DiaryEntry extends NutritionInfo {
  id: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
