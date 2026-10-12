'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  ArcElement,
  Chart,
  PieController,
  Tooltip,
  type ChartConfiguration,
} from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip);

const PALETTE = [
  '#f6a32a', '#37a2eb', '#ff6384', '#ff9e40', '#9966ff',
  '#4dbd74', '#ffcd56', '#00b8d4', '#c2185b', '#7e57c2',
  '#8bc34a', '#5c6bc0', '#ec407a', '#26a69a', '#d4a017',
  '#90a4ae',
];

export interface PieChartProps {
  labels: string[];
  data: number[];
  /** Accessible description of the chart. */
  ariaLabel: string;
  /** Called with the clicked slice's label. */
  onSliceClick?: (label: string) => void;
  /** Legend text color (use white on dark cards). */
  legendColor?: string;
  height?: number;
}

export function PieChart({
  labels,
  data,
  ariaLabel,
  onSliceClick,
  legendColor,
  height = 260,
}: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  // Keep the latest click handler without re-creating the chart.
  const clickRef = useRef(onSliceClick);
  clickRef.current = onSliceClick;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: ariaLabel,
            data,
            backgroundColor: labels.map((_, i) => PALETTE[i % PALETTE.length]),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          // The legend is rendered as HTML alongside the canvas so it can
          // scroll; Chart.js draws inside the canvas and would otherwise
          // silently drop entries that do not fit.
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.label}: ${Number(ctx.parsed).toLocaleString()}`,
            },
          },
        },
        onClick: (_event, elements) => {
          if (elements.length && clickRef.current) {
            const index = elements[0].index;
            clickRef.current(String(labels[index]));
          }
        },
      },
    };

    chartRef.current = new Chart(canvas, config);
    return () => chartRef.current?.destroy();
  }, [labels, data, ariaLabel]);

  const total = data.reduce((sum, value) => sum + value, 0);

  return (
    <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1.5, height }}>
      <Box sx={{ position: 'relative', flex: '1 1 55%', minWidth: 0 }}>
        <canvas ref={canvasRef} role='img' aria-label={ariaLabel} />
      </Box>
      <Box
        component='ul'
        aria-label={`${ariaLabel} legend`}
        sx={{
          flex: '1 1 45%',
          minWidth: 0,
          m: 0,
          pl: 0,
          listStyle: 'none',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          fontSize: '0.75rem',
          lineHeight: 1.4,
          color: legendColor ?? 'inherit',
          // Keep the scrollbar visible against the dark chart cards.
          scrollbarWidth: 'thin',
          scrollbarColor: legendColor
            ? 'rgba(255,255,255,0.35) transparent'
            : 'rgba(17,24,39,0.30) transparent',
        }}
      >
        {labels.map((label, index) => (
          <Box
            component='li'
            key={label}
            onClick={
              onSliceClick ? () => onSliceClick(String(label)) : undefined
            }
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 0.75,
              py: 0.25,
              cursor: onSliceClick ? 'pointer' : 'default',
              '&:hover': onSliceClick ? { opacity: 0.75 } : undefined,
            }}
          >
            <Box
              aria-hidden
              sx={{
                flexShrink: 0,
                width: 12,
                height: 12,
                mt: '2px',
                borderRadius: '2px',
                bgcolor: PALETTE[index % PALETTE.length],
              }}
            />
            <Box component='span' sx={{ minWidth: 0, wordBreak: 'break-word' }}>
              {label}
              <Box component='span' sx={{ opacity: 0.7 }}>
                {' — '}
                {data[index].toLocaleString()}
                {total > 0 &&
                  ` (${((data[index] / total) * 100).toFixed(1)}%)`}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
