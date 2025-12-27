import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Scan, Utensils, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from '../components/Scanner';
import { getProduct, searchProduct } from '../services/foodApi';
import type { ProductData } from '../services/foodApi';

const Home = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchResults, setSearchResults] = useState<ProductData[]>([]);

    const handleScanSuccess = async (decodedText: string) => {
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
    };

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
        <div className="min-h-screen bg-dark flex flex-col p-6 items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] bg-secondary/20 rounded-full blur-[100px] pointer-events-none"
            />

            <div className="z-10 w-full max-w-md flex flex-col items-center">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-4 bg-white/5 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <Utensils size={48} className="text-primary group-hover:scale-110 transition-transform" />
                    </button>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2 text-center"
                >
                    Is It Worth It?
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-400 text-center mb-10 text-lg"
                >
                    Scan food. See the cost in sweat.
                </motion.p>

                {/* Scan Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setIsScanning(true)}
                    className="w-full btn-primary flex items-center justify-center gap-3 mb-6 group text-lg h-16 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Scan size={24} className="relative z-10" />
                    <span className="relative z-10">Scan Barcode</span>
                </motion.button>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative w-full flex items-center justify-center mb-6"
                >
                    <div className="h-[1px] bg-white/10 w-full"></div>
                    <span className="absolute bg-dark px-2 text-gray-500 text-sm font-medium">OR</span>
                </motion.div>

                {/* Search Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    onSubmit={handleSearch}
                    className="w-full relative"
                >
                    <input
                        type="text"
                        placeholder="Search food (e.g. 'Coke')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-dark-card border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                </motion.form>

                <AnimatePresence mode="wait">
                    {searchResults.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="w-full mt-6 flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar"
                        >
                            <h3 className="text-gray-400 text-sm font-medium mb-2 pl-1">Results ({searchResults.length})</h3>
                            {searchResults.map((product) => (
                                <motion.div
                                    key={product.code}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => selectProduct(product)}
                                    className="glass-panel p-3 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.product_name} className="w-12 h-12 object-contain bg-white rounded-md" />
                                    ) : (
                                        <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center text-[10px] text-gray-500">No Img</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white text-sm truncate">{product.product_name || "Unknown Product"}</h4>
                                        <p className="text-xs text-gray-400 truncate">{product.brands || "Unknown Brand"}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-500" />
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        error && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-center text-sm w-full"
                            >
                                {error}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>

                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-400">Crunching numbers...</span>
                    </motion.div>
                )}
            </div>

            {isScanning && (
                <Scanner
                    onScanSuccess={handleScanSuccess}
                    onClose={() => setIsScanning(false)}
                />
            )}
        </div>
    );
}

export default Home;
