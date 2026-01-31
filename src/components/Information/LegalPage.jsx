export default function LegalPage({ title, lastUpdated, children }) {
    return (
        <div className="min-h-screen bg-white pt-32 pb-32">
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 mb-24"
                >
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.5em]">Policy Documentation</span>
                    <h1 className="font-fashion-serif text-5xl md:text-8xl italic font-black text-black leading-tight tracking-tighter">{title}</h1>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                        <span className="w-10 h-px bg-gray-100" />
                        Last Revised: {lastUpdated}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-neutral max-w-none prose-headings:font-fashion-serif prose-headings:font-black prose-headings:italic prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:tracking-tighter prose-p:text-gray-500 prose-p:leading-loose prose-p:text-base prose-strong:text-black prose-li:text-gray-500 prose-li:mb-4"
                >
                    {children}
                </motion.div>
            </div>
        </div >
    );
}
