import React from 'react';
import { motion } from 'framer-motion';

const Logo = ({ size = 'text-2xl', iconSize = 'w-11 h-11', showText = true }) => {
    return (
        <motion.div
            initial={{ opacity: 0.9, y: -2 }}
            animate={{ y: [0, -8, 0], opacity: [0.95, 1, 0.95] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-4 group cursor-pointer selection:bg-transparent"
        >
            <div className={`relative ${iconSize} flex items-center justify-center rounded-[20px] overflow-hidden shadow-2xl border border-white/10 bg-[#1e1b4b]`}>
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 opacity-25 blur-2xl"
                />

                <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-[20px] border border-white/10"
                />

                <div className="relative z-10 flex flex-col gap-1.5 items-start">
                    {[14, 20, 12].map((width, index) => (
                        <motion.div
                            key={index}
                            initial={{ width: 0 }}
                            animate={{ width }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className={`h-1.5 bg-white ${index === 2 ? 'bg-white/50' : ''} rounded-full`}
                        />
                    ))}
                </div>

                <motion.div
                    animate={{ opacity: [0, 1, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-3 right-3 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_12px_#ec4899]"
                />

                <motion.div
                    animate={{ left: ['-120%', '140%'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-0 w-10 h-full bg-white/5 skew-x-[45deg] blur-md pointer-events-none"
                />
            </div>

            {showText && (
                <div className="flex flex-col">
                    <motion.span
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className={`${size} font-black text-[#1e1b4b] tracking-[-0.05em] uppercase leading-none`}
                    >
                        EVENT<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">FORGE</span>
                    </motion.span>
                    <div className="flex items-center gap-2 mt-1 px-0.5">
                        <div className="flex gap-1 items-end">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [2, i * 3 + 2, 2] }}
                                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                                    className="w-[2px] bg-indigo-400 rounded-full"
                                />
                            ))}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#1e1b4b]/40 italic">Signal Active</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Logo;
