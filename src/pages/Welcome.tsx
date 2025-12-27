import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Search, Scan, Utensils, ChevronRight } from 'lucide-react';
import Scanner from '../components/Scanner';
import { getProduct, searchProduct } from '../services/foodApi';
import type { ProductData } from '../services/foodApi';

const FOOD_EMOJIS = ['🍔', '🍎', '🍕', '🍟', '🌭', '🌮', '🌯', '🍩', '🍪', '🍦', '🍣', '🍿', '🍰', '🍺', '🥤'];

const WaveText = ({ text, delayOffset = 0 }: { text: string, delayOffset?: number }) => {
    return (
        <div className="flex justify-center">
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    animate={{ y: [0, -15, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: delayOffset + (i * 0.1),
                    }}
                    className="text-4xl text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] inline-block"
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </div>
    );
};

// Pixel Art Runner Sprite Component
const RunnerSprite = () => {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(f => (f + 1) % 2);
        }, 150);
        return () => clearInterval(interval);
    }, []);

    // Colors
    const skin = "#ffcccc";
    const hair = "#5c3504";
    const white = "white";
    const blue = "#3b82f6";
    const red = "#b91c1c";

    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
            {/* PROFILE VIEW FACING RIGHT */}

            {/* Head & Hair */}
            <path d="M10 2 H15 V5 H16 V6 H16 V9 H10 V6 H9 V5 H10 V2 Z" fill={hair} /> {/* Hair Helmet */}
            <path d="M10 6 H15 V9 H16 V10 H12 V9 H10 V9 Z" fill={skin} /> {/* Face */}

            {/* Body (Tank Top) */}
            <path d="M11 10 H14 V16 H11 Z" fill={white} />
            <rect x="11" y="10" width="3" height="6" fill={blue} fillOpacity="0.3" /> {/* Blue tint */}

            {/* Arm (Swinging) */}
            {frame === 0 ? (
                // Arm Fwd
                <path d="M13 11 H16 V13 H13 Z" fill={skin} />
            ) : (
                // Arm Back
                <path d="M9 11 H12 V13 H9 Z" fill={skin} />
            )}

            {/* Shorts */}
            <path d="M11 16 H14 V18 H11 Z" fill={red} />

            {/* Legs & Shoes - Scissoring */}
            {frame === 0 ? (
                <>
                    {/* Leg 1 (Back) */}
                    <path d="M10 18 H12 V22 H10 Z" fill={skin} />
                    <path d="M9 22 H12 V24 H9 Z" fill={white} />
                    {/* Leg 2 (Fwd) */}
                    <path d="M13 18 H15 V21 H13 Z" fill={skin} />
                    <path d="M13 21 H16 V23 H13 Z" fill={white} />
                </>
            ) : (
                <>
                    {/* Leg 1 (Fwd) */}
                    <path d="M13 18 H15 V22 H13 Z" fill={skin} />
                    <path d="M13 22 H16 V24 H13 Z" fill={white} />
                    {/* Leg 2 (Back) */}
                    <path d="M10 18 H12 V21 H10 Z" fill={skin} />
                    <path d="M9 21 H12 V23 H9 Z" fill={white} />
                </>
            )}
        </svg>
    );
};

const Welcome = () => {
    const navigate = useNavigate();
    const [gameStarted, setGameStarted] = useState(false);

    // Generate random obstacles once
    const obstacles = useMemo(() => {
        const shuffled = [...FOOD_EMOJIS].sort(() => 0.5 - Math.random());
        // Ensure we have exactly 15 items to match the timing loop
        return shuffled.slice(0, 15);
    }, []);

    // Home Logic States
    const [isScanning, setIsScanning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchResults, setSearchResults] = useState<ProductData[]>([]);

    const handleScanSuccess = useCallback(async (decodedText: string) => {
        setIsScanning(false);
        setLoading(true);
        setError('');
        setSearchResults([]);

        try {
            const product = await getProduct(decodedText);
            if (product) {
                navigate('/result', { state: { product } });
            } else {
                setError('Product not found. Try searching manually.');
            }
        } catch (err) {
            setError('Error fetching product data.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        setSearchResults([]);

        try {
            const products = await searchProduct(searchQuery);
            if (products.length > 0) {
                setSearchResults(products);
            } else {
                setError('No products found.');
            }
        } catch (err) {
            setError('Search failed.');
        } finally {
            setLoading(false);
        }
    };

    const selectProduct = (product: ProductData) => {
        navigate('/result', { state: { product } });
    };

    return (
        <div className="min-h-screen bg-sky-400 flex flex-col items-center justify-center relative overflow-hidden font-['Press_Start_2P']">
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-16 bg-[#cda434] border-t-4 border-black z-0 overflow-hidden">
                <motion.div
                    animate={{ backgroundPositionX: ["0px", "-64px"] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
                ></motion.div>
            </div>

            {/* Clouds (Simple CSS shapes) */}
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

            {/* Retro Runner & Obstacles */}
            <div className="absolute bottom-16 w-full h-40 overflow-hidden pointer-events-none z-10">
                {/* Obstacles - Moving Right to Left */}
                {obstacles.map((emoji, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: "100vw" }}
                        animate={{ x: "-20vw" }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                            delay: (i * 1.3333333) + 0.53,
                            repeatDelay: 16 // Cycle (20s) - Duration (4s)
                        }}
                        className="absolute bottom-0 left-0 text-2xl"
                    >
                        {emoji}
                    </motion.div>
                ))}

                {/* The Runner - Stationary X, Jumping Y */}
                <motion.div
                    // Run-Jump-Run Cycle
                    animate={{
                        y: [0, -5, 0, -80, 0, -5, 0]
                    }}
                    transition={{
                        duration: 1.33,
                        repeat: Infinity,
                        times: [0, 0.15, 0.25, 0.5, 0.75, 0.85, 1], // Wider Jump: 0.25 to 0.75
                        ease: "linear"
                    }}
                    className="absolute bottom-0 left-[20%] w-12 h-16" // Slightly larger container for profile
                >
                    <RunnerSprite />
                </motion.div>
            </div>

            <div className="z-10 flex flex-col items-center w-full max-w-md px-6">
                {/* Profile Button (Only visible when started) */}
                {gameStarted && (
                    <motion.button
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => navigate('/profile')}
                        className="absolute top-6 right-6 p-3 bg-white/20 rounded-full border-2 border-white/40 hover:bg-white/30 transition-colors z-50 cursor-pointer"
                    >
                        <Utensils size={24} className="text-white" />
                    </motion.button>
                )}

                {/* Title */}
                <motion.div
                    initial={{ scale: 0, rotate: -720, opacity: 0 }}
                    animate={{
                        scale: gameStarted ? 0.6 : 1,
                        rotate: 0,
                        opacity: 1,
                        y: gameStarted ? -50 : 0
                    }}
                    transition={{ duration: gameStarted ? 0.5 : 4.0, type: "spring", bounce: 0.5 }}
                    className="mb-8 text-center leading-relaxed"
                >
                    <WaveText text="IS IT" delayOffset={gameStarted ? 0 : 4.0} />
                    <div className="h-4"></div>
                    <WaveText text="WORTH IT?" delayOffset={gameStarted ? 0.5 : 4.5} />
                </motion.div>

                {/* Animation Container (Hide when started) */}
                <AnimatePresence>
                    {!gameStarted && (
                        <motion.div
                            exit={{ opacity: 0, scale: 0 }}
                            className="relative w-64 h-64 flex items-center justify-center mb-12"
                        >
                            {/* Question Block */}
                            <motion.div
                                whileTap={{ y: -20 }}
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-24 h-24 bg-[#e69c21] border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center relative z-20 cursor-pointer"
                            >
                                <span className="text-4xl text-[#5c3504] font-bold">?</span>
                                <div className="absolute top-1 left-1 w-2 h-2 bg-[#ffce63]"></div>
                            </motion.div>

                            {/* Jumping Item */}
                            <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: [0, 1, 1, 0], y: -80 }}
                                transition={{ duration: 2, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                                className="absolute text-4xl z-10"
                            >
                                🍎
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Start Button or Game UI */}
                <AnimatePresence mode="wait">
                    {!gameStarted ? (
                        <motion.button
                            key="start-btn"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setGameStarted(true)}
                            className="bg-transparent text-white text-xl flex items-center gap-4 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] hover:text-yellow-300 transition-colors cursor-pointer z-50 py-4"
                        >
                            <Play size={24} fill="currentColor" />
                            PRESS START
                        </motion.button>
                    ) : (
                        <motion.div
                            key="game-ui"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="w-full flex flex-col items-center z-50"
                        >
                            {/* Scan Button */}
                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsScanning(true)}
                                className="w-full bg-[#e69c21] border-4 border-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer mb-6"
                            >
                                <Scan size={24} />
                                <span>SCAN BARCODE</span>
                            </motion.button>

                            <div className="relative w-full flex items-center justify-center mb-6">
                                <div className="h-[2px] bg-black/20 w-full"></div>
                                <span className="absolute bg-sky-400 px-2 text-white/60 text-[10px] font-bold">OR SEARCH</span>
                            </div>

                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="w-full relative mb-4">
                                <input
                                    type="text"
                                    placeholder="SEARCH FOOD..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/20 border-4 border-black rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/60 font-bold focus:outline-none focus:bg-white/30 transition-all font-['Press_Start_2P'] text-xs"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={20} />
                            </form>

                            {/* Results Area */}
                            {loading && (
                                <div className="text-white text-xs animate-pulse mt-4">LOADING...</div>
                            )}

                            {error && (
                                <div className="mt-4 p-2 bg-red-500 border-2 border-black text-white text-[10px] w-full text-center shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                    {error}
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <motion.div className="w-full mt-4 flex flex-col gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar">
                                    {searchResults.map((product) => (
                                        <motion.div
                                            key={product.code}
                                            onClick={() => selectProduct(product)}
                                            whileHover={{ x: 5 }}
                                            className="bg-white/10 border-2 border-white/40 p-3 flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-colors"
                                        >
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.product_name} className="w-12 h-12 object-contain bg-white border border-black" />
                                            ) : (
                                                <div className="w-12 h-12 bg-white/20 border border-black flex items-center justify-center text-[10px]">?</div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-white text-xs truncate mb-1">{product.product_name}</h4>
                                                <p className="text-[10px] text-white/60 truncate">{product.brands}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-white" />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scanner Overlay */}
            {isScanning && (
                <Scanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setIsScanning(false)}
                />
            )}

            {/* Copyright / Footer */}
            <div className="absolute bottom-4 text-[10px] text-white/80 z-0">
                © 2025 CALORIE GAMES
            </div>
        </div>
    );
};

export default Welcome;
