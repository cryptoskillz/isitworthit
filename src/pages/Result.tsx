import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, Activity, ThumbsUp, ThumbsDown, Leaf } from 'lucide-react';
import { extractCalories, getHealthyAlternatives } from '../services/foodApi';
import type { ProductData } from '../services/foodApi';
import { calculateExercise } from '../utils/exerciseCalculator';
import { addToHistory } from '../services/historyService';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product as ProductData;
    const [alternatives, setAlternatives] = useState<ProductData[]>([]);

    useEffect(() => {
        if (product) {
            getHealthyAlternatives(product).then(setAlternatives);
        }
    }, [product]);

    if (!product) {
        useEffect(() => { navigate('/home'); }, [navigate]);
        return null; // Redirecting
    }

    const calories = extractCalories(product);
    const exercises = calories ? calculateExercise(calories) : [];

    // Sort exercises to show biggest "shock" first? Or just list them.
    // Let's feature "Running" as the main metric
    const mainExercise = exercises.find(e => e.id === 'running');
    const otherExercises = exercises.filter(e => e.id !== 'running');

    const handleVerdict = (verdict: 'worth_it' | 'not_worth_it') => {
        if (calories !== null) {
            addToHistory(product, verdict, calories);
            navigate('/profile');
        }
    };

    const selectAlternative = (alt: ProductData) => {
        navigate('/result', { state: { product: alt } });
        window.scrollTo(0, 0); // Reset scroll
    }

    return (
        <div className="min-h-screen bg-sky-400 font-['Press_Start_2P'] relative overflow-x-hidden pb-32">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Ground */}
                <div className="absolute bottom-0 w-full h-16 bg-[#cda434] border-t-4 border-black">
                    <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>
                {/* Clouds */}
                <motion.div
                    animate={{ x: [0, 100, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 left-10 w-24 h-8 bg-white rounded-full opacity-80"
                />
                <motion.div
                    animate={{ x: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-40 right-20 w-32 h-10 bg-white rounded-full opacity-60"
                />
            </div>

            {/* Header / Nav */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 flex items-center gap-4 sticky top-0 bg-sky-400/90 backdrop-blur-md z-30 border-b-4 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)]"
            >
                <button onClick={() => navigate('/')} className="p-3 bg-white border-2 border-black hover:bg-gray-100 transition-colors cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none">
                    <ArrowLeft size={16} className="text-black" />
                </button>
                <h2 className="font-bold text-xs truncate flex-1 text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] leading-relaxed uppercase">{product.product_name}</h2>
            </motion.div>

            <div className="p-6 flex flex-col gap-6 relative z-10">
                {/* Product Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border-4 border-black p-4 flex items-center gap-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                >
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.product_name} className="w-20 h-20 object-contain bg-white border-2 border-black" />
                    ) : (
                        <div className="w-20 h-20 bg-gray-200 border-2 border-black flex items-center justify-center text-gray-500 text-[10px]">?</div>
                    )}
                    <div>
                        <div className="text-gray-500 text-[10px] uppercase mb-2">Energy Content</div>
                        <div className="text-2xl text-black flex items-baseline gap-1">
                            {calories !== null ? Number(calories).toFixed(2) : '?'}
                            <span className="text-xs text-red-500">kcal</span>
                        </div>
                        {product.serving_size && <div className="text-[10px] text-gray-400 mt-1">Per {product.serving_size}</div>}
                    </div>
                </motion.div>

                {/* Macro Grid */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-4 gap-2"
                >
                    <div className="bg-white border-4 border-black p-2 flex flex-col items-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        <div className="text-[8px] text-gray-500 uppercase mb-1">Protein</div>
                        <div className="text-sm font-bold text-black">{Math.round(product.nutriments["proteins_100g"] || 0)}g</div>
                    </div>
                    <div className="bg-white border-4 border-black p-2 flex flex-col items-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        <div className="text-[8px] text-gray-500 uppercase mb-1">Carbs</div>
                        <div className="text-sm font-bold text-black">{Math.round(product.nutriments["carbohydrates_100g"] || 0)}g</div>
                    </div>
                    <div className="bg-white border-4 border-black p-2 flex flex-col items-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        <div className="text-[8px] text-gray-500 uppercase mb-1">Fat</div>
                        <div className="text-sm font-bold text-black">{Math.round(product.nutriments["fat_100g"] || 0)}g</div>
                    </div>
                    <div className="bg-white border-4 border-black p-2 flex flex-col items-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        <div className="text-[8px] text-gray-500 uppercase mb-1">Sugar</div>
                        <div className="text-sm font-bold text-black">{Math.round(product.nutriments["sugars_100g"] || 0)}g</div>
                    </div>
                </motion.div>

                {calories === null ? (
                    <div className="p-4 bg-yellow-100 border-4 border-black text-black text-[10px] shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        COULD NOT CALCULATE CALORIES.
                    </div>
                ) : (
                    <>
                        {/* Main Verdict */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#2a2a2a] border-4 border-black p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                        >
                            <h3 className="text-white text-[10px] uppercase mb-4 bg-black px-2 py-1">Cost to Burn</h3>

                            <div className="flex flex-col items-center gap-2 mb-4">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                >
                                    <Timer size={40} className="text-red-500 mb-2" />
                                </motion.div>
                                <div className="text-4xl text-white tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                                    {mainExercise?.amount}
                                    <span className="text-sm text-red-500 ml-2">MINS</span>
                                </div>
                                <div className="text-xs text-gray-300 mt-2 uppercase">of Running</div>
                            </div>
                        </motion.div>

                        {/* Other Activities Grid */}
                        <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-xs font-bold text-white mt-4 flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] uppercase"
                        >
                            <Activity size={16} /> Burn Options
                        </motion.h3>

                        <div className="grid grid-cols-2 gap-4">
                            {otherExercises.map((ex, i) => (
                                <motion.div
                                    key={ex.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.6 + (i * 0.1) }}
                                    className="bg-white border-4 border-black p-3 flex flex-col items-center justify-center text-center shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                                >
                                    <div className="text-lg text-black mb-1">
                                        {ex.amount}
                                        <span className="text-[10px] text-gray-500 ml-1">{ex.unit}</span>
                                    </div>
                                    <div className="text-[8px] text-sky-500 font-bold uppercase">{ex.name}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* HEALTHY ALTERNATIVES SECTION */}
                        {alternatives.length > 0 && (
                            <>
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-xs font-bold text-white mt-8 flex items-center gap-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] uppercase"
                                >
                                    <Leaf size={16} className="text-[#4ade80]" /> Better Choices
                                </motion.h3>

                                <div className="flex flex-col gap-4">
                                    {alternatives.map((alt, i) => (
                                        <motion.div
                                            key={alt.code}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.8 + (i * 0.1) }}
                                            onClick={() => selectAlternative(alt)}
                                            className="bg-[#dcfce7] border-4 border-black p-3 flex items-center gap-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#bbf7d0] transition-colors"
                                        >
                                            {alt.image_url ? (
                                                <img src={alt.image_url} alt={alt.product_name} className="w-12 h-12 object-contain bg-white border-2 border-black" />
                                            ) : (
                                                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-[10px]">?</div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-black text-xs truncate mb-1">{alt.product_name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-[#4ade80] text-black text-[8px] px-1 border border-black font-bold">GRADE A</span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-black font-bold">
                                                Go!
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Sticky Action Footer */}
            {calories !== null && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="fixed bottom-0 left-0 w-full p-4 bg-sky-400/90 backdrop-blur-md border-t-4 border-black flex gap-4 z-40"
                >
                    <button
                        onClick={() => handleVerdict('worth_it')}
                        className="flex-1 bg-[#4ade80] border-4 border-black text-black text-xs font-bold py-4 rounded-none flex items-center justify-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer uppercase hover:bg-[#22c55e]"
                    >
                        <ThumbsUp size={16} />
                        Worth It
                    </button>
                    <button
                        onClick={() => handleVerdict('not_worth_it')}
                        className="flex-1 bg-[#f87171] border-4 border-black text-white text-xs font-bold py-4 rounded-none flex items-center justify-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer uppercase hover:bg-[#ef4444]"
                    >
                        <ThumbsDown size={16} />
                        Not Worth It
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Result;
