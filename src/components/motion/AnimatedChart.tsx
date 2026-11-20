import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChartDataPoint } from '../../types';
import { EDITORIAL_EASE, MOTION_DURATIONS } from '../../lib/motion';

interface AnimatedChartProps {
  data: {
    title: string;
    subtitle?: string;
    xAxisLabel?: string;
    yAxisLabel?: string;
    points: ChartDataPoint[];
  };
  type?: 'bar' | 'line';
  className?: string;
}

export const AnimatedChart: React.FC<AnimatedChartProps> = ({
  data,
  type = 'bar',
  className = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const maxValue = Math.max(...data.points.map((p) => p.value), ...data.points.map((p) => p.baseline || 0)) * 1.15;

  return (
    <div className={`p-6 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-charcoal/10 dark:border-dark-border shadow-editorial ${className}`}>
      <div className="mb-6">
        <h4 className="font-editorial-serif text-xl text-foundation-charcoal dark:text-dark-text tracking-tight font-medium">
          {data.title}
        </h4>
        {data.subtitle && (
          <p className="text-xs text-foundation-muted dark:text-dark-muted mt-1 leading-relaxed">
            {data.subtitle}
          </p>
        )}
      </div>

      <div className="relative pt-6 pb-2">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-x-0 inset-y-6 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-foundation-charcoal dark:border-white" />
          <div className="border-b border-foundation-charcoal dark:border-white" />
          <div className="border-b border-foundation-charcoal dark:border-white" />
        </div>

        {/* Bar Chart View */}
        {type === 'bar' && (
          <div className="flex items-end justify-between gap-3 h-48 relative z-10 pt-4">
            {data.points.map((point, index) => {
              const heightPercent = (point.value / maxValue) * 100;
              const baselinePercent = point.baseline ? (point.baseline / maxValue) * 100 : null;

              return (
                <div
                  key={point.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-4 bg-foundation-charcoal text-white dark:bg-white dark:text-foundation-charcoal text-[11px] font-mono px-2 py-1 rounded shadow-md pointer-events-none z-20 whitespace-nowrap"
                    >
                      {point.label}: {point.value}%
                      {point.baseline && ` (Baseline: ${point.baseline}%)`}
                    </motion.div>
                  )}

                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Baseline indicator bar if present */}
                    {baselinePercent !== null && (
                      <motion.div
                        className="w-1/3 bg-foundation-muted/30 dark:bg-white/10 rounded-t"
                        initial={{ height: 0 }}
                        whileInView={{ height: `${baselinePercent}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: shouldReduceMotion ? 0.01 : MOTION_DURATIONS.sectionReveal,
                          ease: EDITORIAL_EASE,
                          delay: index * 0.05,
                        }}
                      />
                    )}

                    {/* Primary metric bar */}
                    <motion.div
                      className="w-full max-w-[40px] bg-accent-violet rounded-t group-hover:bg-[#6f44c9] transition-colors relative"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${heightPercent}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceMotion ? 0.01 : MOTION_DURATIONS.sectionReveal,
                        ease: EDITORIAL_EASE,
                        delay: index * 0.07,
                      }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-foundation-charcoal dark:text-dark-text opacity-0 group-hover:opacity-100 transition-opacity">
                        {point.value}
                      </span>
                    </motion.div>
                  </div>

                  <span className="text-[11px] font-mono text-foundation-muted dark:text-dark-muted mt-3">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-foundation-muted dark:text-dark-muted pt-4 border-t border-foundation-charcoal/5 dark:border-dark-border mt-2 font-mono">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-accent-violet inline-block" />
              Tathastu Top-K Model
            </span>
            {data.points.some((p) => p.baseline) && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-foundation-muted/30 dark:bg-white/20 inline-block" />
                Dense Baseline
              </span>
            )}
          </div>
          {data.yAxisLabel && <span>{data.yAxisLabel}</span>}
        </div>
      </div>
    </div>
  );
};
