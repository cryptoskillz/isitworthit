import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Trash2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, getStats, removeFromHistory } from '../services/historyService';
import type { HistoryItem } from '../services/historyService';
import StatsChart from '../components/StatsChart';

const Profile = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [stats, setStats] = useState({ worthIt: 0, notWorthIt: 0, total: 0, caloriesToBurnToday: 0 });

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setHistory(getHistory());
        setStats(getStats());
    };

    const handleDelete = (id: string) => {
        removeFromHistory(id);
        refreshData();
    };

    return (
        <div className="min-h-screen bg-sky-400 font-['Press_Start_2P'] relative overflow-x-hidden pb-20">
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

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 flex items-center gap-4 sticky top-0 bg-sky-400/90 backdrop-blur-md z-30 border-b-4 border-black shadow-[0_4px_0_rgba(0,0,0,0.2)]"
            >
                <button onClick={() => navigate('/')} className="p-3 bg-white border-2 border-black hover:bg-gray-100 transition-colors cursor-pointer shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none">
                    <ArrowLeft size={16} className="text-black" />
                </button>
                <h2 className="font-bold text-xs text-white drop-shadow-[2px_2px_0_rgba(0,0,0,1)] uppercase">My Profile</h2>
            </motion.div>

            <div className="p-6 relative z-10">
                {/* Stats Section */}
                <div className="mb-8">
                    <h3 className="text-white text-[10px] font-bold uppercase mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Your Verdicts</h3>
                    <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
                        <StatsChart {...stats} />

                        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-gray-500 uppercase">To Burn Today:</span>
                                <div className="flex items-center gap-2">
                                    <Flame size={16} className="text-orange-500" />
                                    <span className="text-sm font-bold text-black">{stats.caloriesToBurnToday.toFixed(2)} kcal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div>
                    <h3 className="text-white text-[10px] font-bold uppercase mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Meal History</h3>

                    <div className="flex flex-col gap-3">
                        {history.length === 0 ? (
                            <div className="text-center text-white/80 py-10 text-[10px] uppercase">No meals logged yet. Get scanning!</div>
                        ) : (
                            <AnimatePresence>
                                {history.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white border-4 border-black p-3 flex items-center gap-4 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                                    >
                                        {item.product.image_url ? (
                                            <img src={item.product.image_url} alt={item.product.product_name} className="w-12 h-12 object-contain bg-white border-2 border-black" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 border-2 border-black flex items-center justify-center text-[10px]">?</div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-black text-[10px] truncate mb-1">{item.product.product_name}</h4>
                                            <div className="flex items-center gap-2 text-[8px] text-gray-500">
                                                <Calendar size={10} />
                                                <span>{new Date(item.date).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{item.calories.toFixed(2)} kcal</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 items-end">
                                            <div className={`px-2 py-1 text-[8px] font-bold uppercase border-2 text-black ${item.verdict === 'worth_it'
                                                ? 'bg-[#4ade80] border-black'
                                                : 'bg-[#f87171] border-black'
                                                }`}>
                                                {item.verdict === 'worth_it' ? 'Worth It' : 'Not Worth'}
                                            </div>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-1 bg-gray-200 border-2 border-black hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
