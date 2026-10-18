# Chart library — TBD

Status: **proposed** (pending user decision)

The PRD's Research Dashboard (Section 6/9) needs bar/pie charts for accessibility category data (Entrance, Ramps, Toilets, Classrooms, Signage). Every chart must have a text/table alternative for accessibility.

Two options from the PRD:

1. **Recharts** — React-native, declarative, SVG-based, good accessibility support out of the box, responsive container built in.
2. **Chart.js** (via react-chartjs-2) — Canvas-based, slightly harder to make fully accessible (need to add ARIA descriptions manually), but lighter bundle.

Recommendation: **Recharts** — better React integration, SVG is inherently more accessible than Canvas for screen readers.

Waiting for user decision.
