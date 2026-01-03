import React, { useMemo, useState } from 'react';

const SalesChart = ({ data }) => {
    // data format: [{ name: 'Jan', value: 4000 }, ...]
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const processedData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data;
    }, [data]);

    if (processedData.length === 0) {
        return (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10 group">
                <div className="w-12 h-12 bg-white/[0.02] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <p className="text-2xl text-slate-700 font-black tracking-tighter">0</p>
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">No signals detected in temporal buffers</p>
            </div>
        );
    }

    // Dimensions
    const padding = 60;
    const width = 1000;
    const height = 400;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = 32;
    const gap = (chartWidth - (processedData.length * barWidth)) / (processedData.length - 1);
    const maxValue = Math.max(...processedData.map(d => d.value), 1000);

    // Helper to map value to Y coord
    const getY = (val) => chartHeight - (val / maxValue) * chartHeight + padding;

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <div>
                        <h4 className="text-white font-black italic tracking-tight text-lg uppercase">Neural Revenue Manifest</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-0.5">Time-series extraction: {processedData.length} Temporal Nodes</p>
                    </div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-3 text-right">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Accumulated Extraction</p>
                    <p className="text-xl font-black text-emerald-400 italic tracking-tighter">
                        Rs. {processedData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '21/9', minHeight: '300px' }}>
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                        const y = chartHeight - (chartHeight * tick) + padding;
                        return (
                            <g key={i}>
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="rgba(255,255,255,0.03)"
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding - 15}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-slate-600 text-[9px] font-black uppercase font-sans tracking-[0.1em]"
                                >
                                    {Math.round(maxValue * tick / 1000)}k
                                </text>
                            </g>
                        );
                    })}

                    {/* Bars */}
                    {processedData.map((d, i) => {
                        const x = padding + (i * (barWidth + gap));
                        const y = getY(d.value);
                        const h = chartHeight - (y - padding);
                        const isHovered = hoveredIndex === i;

                        return (
                            <g
                                key={i}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="cursor-crosshair group"
                            >
                                {/* Shadow/Depth Effect */}
                                <rect
                                    x={x + 4}
                                    y={y}
                                    width={barWidth}
                                    height={h}
                                    rx={12}
                                    fill="black"
                                    opacity="0.2"
                                    className="scale-y-0 origin-bottom animate-[grow_1s_ease-out_forwards]"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                />

                                {/* Main Bar */}
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={h}
                                    rx={12}
                                    fill={isHovered ? "url(#hoverGradient)" : "url(#barGradient)"}
                                    className="transition-all duration-500 ease-out origin-bottom scale-y-0 animate-[grow_1s_ease-out_forwards]"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                    filter={isHovered ? "url(#glow)" : ""}
                                />

                                {/* Glow overlay on hover */}
                                {isHovered && (
                                    <rect
                                        x={x - 10}
                                        y={y - 10}
                                        width={barWidth + 20}
                                        height={h + 20}
                                        rx={20}
                                        fill="url(#hoverGlow)"
                                        opacity="0.3"
                                    />
                                )}

                                {/* Value Indicator */}
                                <g className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <rect x={x - 20} y={y - 45} width={barWidth + 40} height={30} rx={8} fill="white" />
                                    <path d={`M${x + barWidth / 2} ${y - 15} L${x + barWidth / 2 - 5} ${y - 20} L${x + barWidth / 2 + 5} ${y - 20} Z`} fill="white" />
                                    <text
                                        x={x + barWidth / 2}
                                        y={y - 25}
                                        textAnchor="middle"
                                        className="fill-black text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Rs. {(d.value / 1000).toFixed(1)}k
                                    </text>
                                </g>

                                {/* X Axis Label */}
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding + 35}
                                    textAnchor="middle"
                                    className={`text-[10px] uppercase font-black tracking-widest transition-all duration-300 ${isHovered ? 'fill-emerald-400 rotate-[5deg] scale-110' : 'fill-slate-600'}`}
                                >
                                    {d.name.substring(0, 3)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Definitions */}
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="hoverGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <radialGradient id="hoverGlow">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </radialGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
            </div>

            <style jsx>{`
                @keyframes grow {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
            `}</style>
        </div>
    );
};

export default SalesChart;
