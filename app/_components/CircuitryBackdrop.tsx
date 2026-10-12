/**
 * Decorative circuit-board traces for the homepage hero.
 *
 * Every trace is drawn twice: once as a static line, and once as a short dash
 * whose `stroke-dashoffset` animates along the same path, which reads as a
 * charge travelling the trace. Keeping both copies on identical `d` values is
 * what makes the pulse follow the corners instead of cutting across them.
 *
 * The animation lives in globals.css (`.circuitry-*`) so this stays a server
 * component, and it is disabled under `prefers-reduced-motion`.
 */

/** [path, pulse duration in seconds, pulse delay in seconds] */
const TRACES: [string, number, number][] = [
  ['M -20 60 H 150 L 200 110 H 360 L 400 70 H 620', 7, 0],
  ['M -20 170 H 90 L 140 120 H 300 L 340 160 H 520 L 560 120 H 1220', 9, 1.4],
  ['M -20 300 H 210 L 260 250 H 430 L 470 290 H 700', 8, 3.1],
  ['M 1220 90 H 980 L 930 140 H 780 L 740 100 H 620', 7.5, 0.8],
  ['M 1220 230 H 1050 L 1000 180 H 860 L 820 220 H 660 L 620 260 H 430', 10, 2.2],
  ['M 1220 340 H 900 L 850 290 H 690 L 650 330 H 470', 8.5, 4],
  ['M 120 420 V 300 L 170 250 V 150 L 210 110 V -20', 9.5, 1.9],
  ['M 1080 420 V 320 L 1030 270 V 160 L 990 120 V -20', 8, 3.6],
  ['M 480 420 V 350 L 530 300 V 210 L 570 170 V 60 L 610 20 V -20', 11, 0.4],
  ['M 760 -20 V 40 L 800 80 V 180 L 850 230 V 420', 10.5, 2.7],
];

/** Solder-pad dots sprinkled along the trace junctions. */
const PADS: [number, number][] = [
  [150, 60], [200, 110], [400, 70], [140, 120], [340, 160], [560, 120],
  [260, 250], [470, 290], [930, 140], [740, 100], [1000, 180], [820, 220],
  [620, 260], [850, 290], [650, 330], [170, 250], [210, 110], [1030, 270],
  [530, 300], [610, 20], [800, 80], [850, 230],
];

export function CircuitryBackdrop() {
  return (
    <svg
      className='circuitry'
      viewBox='0 0 1200 400'
      preserveAspectRatio='xMidYMid slice'
      aria-hidden='true'
      focusable='false'
    >
      <g className='circuitry-traces'>
        {TRACES.map(([d]) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className='circuitry-pads'>
        {PADS.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={4} />
        ))}
      </g>
      <g className='circuitry-pulses'>
        {TRACES.map(([d, duration, delay]) => (
          <path
            key={d}
            d={d}
            // Normalizes every trace to a length of 100 so one dash pattern in
            // globals.css yields the same pulse size on each of them.
            pathLength={100}
            style={{
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
