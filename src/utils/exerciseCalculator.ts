export interface Exercise {
    name: string;
    caloriesPerMinute: number; // Approximate burn rate
    unit: string; // "mins" or "reps"
}

// Burn rates are approximate for an average person (~70kg)
export const EXERCISES: Exercise[] = [
    { name: "Running (10km/h)", caloriesPerMinute: 11.5, unit: "mins" },
    { name: "Walking (Brisk)", caloriesPerMinute: 5, unit: "mins" },
    { name: "Cycling (Moderate)", caloriesPerMinute: 8, unit: "mins" },
    { name: "Burpees", caloriesPerMinute: 1.5, unit: "reps" }, // Special handling for reps? 1.5 per BURPEE (approx 10-15 cal/min)
    { name: "Swimming", caloriesPerMinute: 10, unit: "mins" },
    { name: "Jump Rope", caloriesPerMinute: 12, unit: "mins" },
];

// Special handling: Burpees caloriesPerMinute here is actually "Calories per Rep" for the sake of calculation in the loop?
// Let's standardize: All are Cal/Min, except Burpees which is easier to quantify in reps.
// Actually, let's keep it simple. We store "Calories Per Unit".
// For time-based: Calories per Minute.
// For rep-based: Calories per Rep.

const EXERCISE_RATES: Record<string, { rate: number, unit: string, label: string }> = {
    running: { rate: 11.5, unit: 'mins', label: 'Running' },
    walking: { rate: 5, unit: 'mins', label: 'Walking' },
    cycling: { rate: 8, unit: 'mins', label: 'Cycling' },
    burpees: { rate: 1.2, unit: 'reps', label: 'Burpees' }, // 1.2 kcal per burpee
    squats: { rate: 0.5, unit: 'reps', label: 'Squats' },
};

export const calculateExercise = (calories: number) => {
    return Object.entries(EXERCISE_RATES).map(([key, data]) => {
        const amount = Math.ceil(calories / data.rate);
        return {
            id: key,
            name: data.label,
            amount: amount,
            unit: data.unit
        };
    });
};
