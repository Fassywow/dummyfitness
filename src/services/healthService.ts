

export const calculateBMI = (heightCm: number, weightKg: number): number => {
    if (heightCm <= 0 || weightKg <= 0) return 0;
    const heightM = heightCm / 100;
    return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#FF9800' };
    if (bmi < 24.9) return { category: 'Normal', color: '#4CAF50' };
    if (bmi < 29.9) return { category: 'Overweight', color: '#FF5722' };
    return { category: 'Obese', color: '#D32F2F' };
};

export const calculateWaterGoal = (weightKg: number): number => {
    // 35ml per kg is a standard recommendation
    return Math.round(weightKg * 35);
};
