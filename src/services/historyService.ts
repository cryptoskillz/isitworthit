import type { ProductData } from './foodApi';

export interface HistoryItem {
    id: string;
    product: ProductData;
    date: string; // ISO string
    verdict: 'worth_it' | 'not_worth_it';
    calories: number;
}

const STORAGE_KEY = 'isitworthit_history';

export const getHistory = (): HistoryItem[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const addToHistory = (product: ProductData, verdict: 'worth_it' | 'not_worth_it', calories: number) => {
    const history = getHistory();
    const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        product,
        date: new Date().toISOString(),
        verdict,
        calories
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newItem, ...history]));
    return newItem;
};

export const removeFromHistory = (id: string) => {
    const history = getHistory();
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    return newHistory;
};

export const getStats = () => {
    const history = getHistory();
    const total = history.length;
    const worthIt = history.filter(i => i.verdict === 'worth_it').length;
    const notWorthIt = history.filter(i => i.verdict === 'not_worth_it').length;

    // Calculate calories to burn today
    const today = new Date().toDateString();
    const caloriesToBurnToday = history
        .filter(i => new Date(i.date).toDateString() === today)
        .reduce((sum, item) => sum + (item.calories || 0), 0);

    return {
        total,
        worthIt,
        notWorthIt,
        worthItPercentage: total === 0 ? 0 : Math.round((worthIt / total) * 100),
        notWorthItPercentage: total === 0 ? 0 : Math.round((notWorthIt / total) * 100),
        caloriesToBurnToday
    };
};
