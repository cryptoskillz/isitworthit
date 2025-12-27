import { motion } from 'framer-motion';

interface StatsProps {
    worthIt: number;
    notWorthIt: number;
    total: number;
}

const StatsChart = ({ worthIt, notWorthIt, total }: StatsProps) => {
    if (total === 0) return <div className="text-white text-center text-[10px] uppercase">No data recorded yet</div>;

    const worthItHeight = Math.max(10, (worthIt / total) * 100);
    const notWorthItHeight = Math.max(10, (notWorthIt / total) * 100);

    return (
        <div className="flex items-end justify-center gap-8 h-48 w-full font-['Press_Start_2P']">
            <div className="flex flex-col items-center gap-2 w-24">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${worthItHeight}%` }}
                    className="w-full bg-[#4ade80] border-4 border-black border-b-0 relative group shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                >
                    <div className="absolute -top-8 w-full text-center text-[#4ade80] text-xs font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{worthIt}</div>
                </motion.div>
                <span className="text-[8px] text-[#4ade80] font-bold uppercase tracking-wider drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">Worth It</span>
            </div>

            <div className="flex flex-col items-center gap-2 w-24">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${notWorthItHeight}%` }}
                    className="w-full bg-[#f87171] border-4 border-black border-b-0 relative shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                >
                    <div className="absolute -top-8 w-full text-center text-[#f87171] text-xs font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">{notWorthIt}</div>
                </motion.div>
                <span className="text-[8px] text-[#f87171] font-bold uppercase tracking-wider drop-shadow-[1px_1px_0_rgba(0,0,0,1)]">Not Worth</span>
            </div>
        </div>
    );
};

export default StatsChart;
