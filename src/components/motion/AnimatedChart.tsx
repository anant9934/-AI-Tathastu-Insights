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
    primaryDatasetLabel?: string;
    baselineDatasetLabel?: string;
    unit?: string;
    isDemonstration?: boolean;
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

  const values = data.points.map((p) => p.value);
  const baselines = data.points.map((p) => p.baseline || 0);
  const rawMax = Math.max(...values, ...baselines);
  const maxValue = rawMax > 0 ? Math.ceil(rawMax * 1.2) : 100;

  // Generate 4 clean tick values for Y-axis
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const val = Math.round((maxValue / tickCount) * (tickCount - i));
    return val;
  });

  const unit = data.unit || (data.yAxisLabel?.includes('%') ? '%' : '');

  return (
    <div className={`p-6 sm:p-8 bg-white dark:bg-dark-surface rounded-2xl border border-foundation-border dark:border-dark-border shadow-editorial ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 pb-4 border-b border-foundation-border/70 dark:border-dark-border">
        <div>
          <span className="type-meta text-accent-violet block uppercase mb-1 font-semibold">
            {data.isDemonstration ? 'Illustrative Benchmark Telemetry (Synthetic Model)' : 'Empirical Benchmark Telemetry'}
          </span>
          <h4 className="type-card-heading text-foundation-ink dark:text-dark-ink font-medium">
            {data.title}
          </h4>
          {data.subtitle && (
            <p className="type-secondary text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono shrink-0">
          <span className="inline-flex items-center gap-1.5 text-foundation-ink dark:text-dark-ink">
            <span className="w-3 h-3 rounded-sm bg-accent-violet inline-block" />
            {data.primaryDatasetLabel || 'Tathastu Evaluated'}
          </span>
          {data.points.some((p) => p.baseline !== undefined) && (
            <span className="inline-flex items-center gap-1.5 text-foundation-secondary dark:text-dark-secondary">
              <span className="w-3 h-3 rounded-sm bg-foundation-secondary/30 dark:bg-white/20 inline-block" />
              {data.baselineDatasetLabel || 'Baseline SOTA'}
            </span>
          )}
        </div>
      </div>

      {/* Chart Canvas with Y-axis Ticks & X-axis */}
      <div className="relative pt-6 pb-2">
        <div className="flex">
          {/* Y-Axis Labels & Ticks Column */}
          <div className="w-12 sm:w-16 shrink-0 flex flex-col justify-between h-56 text-right pr-3 font-mono text-[11px] text-foundation-secondary dark:text-dark-secondary select-none">
            {ticks.map((tick, i) => (
              <span key={i} className="leading-none">
                {tick}{unit}
              </span>
            ))}
          </div>

          {/* Chart Plot Area with Grid Lines */}
          <div className="flex-1 relative h-56">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {ticks.map((_, i) => (
                <div
                  key={i}
                  className="w-full border-b border-foundation-border/60 dark:border-dark-border/60"
                />
              ))}
            </div>

            {/* Bars Container */}
            <div className="absolute inset-0 flex items-end justify-around gap-2 sm:gap-4 px-2 sm:px-6 z-10">
              {data.points.map((point, index) => {
                const heightPercent = (point.value / maxValue) * 100;
                const baselinePercent = point.baseline !== undefined ? (point.baseline / maxValue) * 100 : null;
                const delta = point.baseline !== undefined ? point.value - point.baseline : null;

                return (
                  <div
                    key={point.label}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Interactive Tooltip */}
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foundation-ink text-foundation-paper dark:bg-white dark:text-foundation-ink text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-xl pointer-events-none z-30 whitespace-nowrap flex flex-col items-center"
                      >
                        <span className="font-semibold">
                          {point.label}: {point.value}{unit}
                        </span>
                        {point.baseline !== undefined && (
                          <span className="text-[10px] opacity-80">
                            Baseline: {point.baseline}{unit} {delta !== null && (delta >= 0 ? `(+${delta.toFixed(1)}${unit})` : `(${delta.toFixed(1)}${unit})`)}
                          </span>
                        )}
                        <div className="w-2 h-2 bg-foundation-ink dark:bg-white rotate-45 -mb-1 mt-0.5" />
                      </motion.div>
                    )}

                    <div className="w-full flex items-end justify-center gap-1.5 h-full pb-px">
                      {/* Baseline Bar */}
                      {baselinePercent !== null && (
                        <motion.div
                          className="w-2/5 max-w-[28px] bg-foundation-secondary/25 dark:bg-white/15 rounded-t-sm"
                          initial={shouldReduceMotion ? false : { height: 0 }}
                          animate={{ height: `${baselinePercent}%` }}
                          transition={{
                            duration: shouldReduceMotion ? 0.01 : MOTION_DURATIONS.sectionReveal,
                            ease: EDITORIAL_EASE,
                            delay: index * 0.05,
                          }}
                        />
                      )}

                      {/* Primary Bar */}
                      <motion.div
                        className="w-full max-w-[36px] bg-accent-violet rounded-t-sm group-hover:bg-[#6841c2] transition-colors relative"
                        initial={shouldReduceMotion ? false : { height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{
                          duration: shouldReduceMotion ? 0.01 : MOTION_DURATIONS.sectionReveal,
                          ease: EDITORIAL_EASE,
                          delay: index * 0.07,
                        }}
                      >
                        {/* Data label above bar */}
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono font-medium text-foundation-ink dark:text-dark-ink opacity-0 group-hover:opacity-100 transition-opacity">
                          {point.value}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* X-Axis Labels Row */}
        <div className="flex pt-3 pl-12 sm:pl-16">
          <div className="flex-1 flex justify-around px-2 sm:px-6">
            {data.points.map((point) => (
              <span
                key={point.label}
                className="text-[11px] font-mono text-foundation-secondary dark:text-dark-secondary text-center truncate max-w-[80px]"
              >
                {point.label}
              </span>
            ))}
          </div>
        </div>

        {/* Axis Unit Labels Footnote */}
        <div className="flex items-center justify-between text-[11px] text-foundation-secondary dark:text-dark-secondary pt-4 mt-2 border-t border-foundation-border/60 dark:border-dark-border/60 font-mono">
          <span>{data.xAxisLabel ? `X: ${data.xAxisLabel}` : 'Evaluation Slices'}</span>
          <span>{data.yAxisLabel ? `Y: ${data.yAxisLabel}` : `Metric (${unit || 'Value'})`}</span>
        </div>
      </div>
    </div>
  );
};
