# Leaflet + OpenStreetMap for the school map

We chose **Leaflet** with **OpenStreetMap** tiles for the interactive Danapur School Accessibility Map (Feature B).

**Context:** The PRD explicitly lists Leaflet + OpenStreetMap and cites "no API cost" as the reason. The map needs to show ~30–100 school markers with status indicators (Audited / Pending / Follow-up Required), popups, and keyboard accessibility.

**Alternatives considered:**
- *Google Maps:* Requires API key, billing, and has usage limits. Not justified for a research/fellowship project.
- *Mapbox:* Free tier exists but adds vendor dependency and API key management.

**Consequences:** Map tiles are free and open. We need to handle Leaflet's accessibility limitations ourselves (keyboard-navigable list alternative, proper ARIA labels on markers, non-colour-only status indicators).
