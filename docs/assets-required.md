# Asset Manifest & Requirements — Jometry / D'WALL Catalogue

## Overview
This manifest identifies all technical diagrams, product photography placeholders, finish swatches, and branding assets required for the digital and PDF catalogue.

---

## 1. Technical Diagrams (SVG Vectors)

All technical diagrams are rendered as clean, high-resolution inline SVG graphics (scalable for print PDF and responsive web views):

| Asset ID | File Path / Identifier | Description | Status | Source |
| :--- | :--- | :--- | :--- | :--- |
| `diag-service-plan` | `/assets/diagrams/service-wall-plan-section.svg` | Plan section showing panel, standoff, service cavity with cable rails, mounting node, and substrate | Available | Embedded inline SVG in `dwall-service-wall-brochure.html` |
| `diag-acoustic-section` | `/assets/diagrams/acoustic-tile-section.svg` | Section through acoustic tile showing slotted face, cavity infill, and adjustable standoff | Available | Embedded inline SVG in `dwall-acoustic-brochure-v2.html` |
| `diag-acoustic-graph` | `/assets/diagrams/acoustic-frequency-graph.svg` | Absorption behaviour curve graph by cavity depth across low/mid/high frequencies | Available | Embedded inline SVG in `dwall-acoustic-brochure-v2.html` |
| `diag-living-section` | `/assets/diagrams/living-wall-cassette-section.svg` | Cassette cross-section showing planted face, growing medium, rear waterproof face, cavity, and drainage | Available | Embedded inline SVG in `dwall-livingwall-brochure.html` |
| `diag-air-path` | `/assets/diagrams/biofiltration-air-path.svg` | Air path diagram from room through root zone to cavity, particulate stage, and exhaust | Available | Embedded inline SVG in `dwall-livingwall-brochure.html` |

---

## 2. Product & Project Imagery (Placeholders & Requirements)

Since the original HTML source files use stylized CSS/SVG layout boxes with descriptive text placeholders for photography, the catalogue visually presents these as high-end architectural drawing/photo placeholders while providing production asset replacement slots in `/assets/`:

| Asset ID | File Path | Description | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `img-cover-service` | `/assets/products/cover-service-wall.jpg` | Finished Service Wall in live interior, panel lifted away, neat cabling visible | Placeholder | Needs high-res photo |
| `img-cover-acoustic` | `/assets/products/cover-acoustic-wall.jpg` | Completed acoustic wall, uniform tile grid, raking light revealing rib depth | Placeholder | Needs high-res photo |
| `img-cover-living` | `/assets/products/cover-living-wall.jpg` | Modular living wall, uniform cassette grid, shadow-gap reveals, no visible fixings | Placeholder | Clearly labeled CONCEPT VISUAL |
| `img-seq-release` | `/assets/products/sequence-01-release.jpg` | Access sequence Step 01: Release panel/cassette | Placeholder | Technical photo slot |
| `img-seq-open` | `/assets/products/sequence-02-open.jpg` | Access sequence Step 02: Open/remove panel | Placeholder | Technical photo slot |
| `img-seq-close` | `/assets/products/sequence-03-close.jpg` | Access sequence Step 03: Close/replace panel | Placeholder | Technical photo slot |
| `img-proj-01` | `/assets/projects/project-commercial-mumbai.jpg` | Project 01: Commercial interior in Mumbai with integrated services | Placeholder | Delivered project photo |
| `img-proj-02` | `/assets/projects/project-av-screening-01.jpg` | Project 02: AV / screening room acoustic wall in Mumbai | Placeholder | Delivered project photo |
| `img-proj-03` | `/assets/projects/project-av-screening-02.jpg` | Project 03: AV room basket-weave acoustic tile orientation | Placeholder | Delivered project photo |
| `img-proj-04` | `/assets/projects/project-illuminated-wall.jpg` | Project 04: Illuminated feature wall with lighting cassettes | Placeholder | Delivered project photo |
| `img-pattern-directional` | `/assets/finishes/pattern-directional.jpg` | Ribbed tile layout: Directional orientation | Placeholder | Pattern diagram/render |
| `img-pattern-basketweave` | `/assets/finishes/pattern-basketweave.jpg` | Ribbed tile layout: Basket-weave 90° rotation | Placeholder | Pattern diagram/render |
| `img-pattern-gradient` | `/assets/finishes/pattern-gradient.jpg` | Ribbed tile layout: Gradient slot density | Placeholder | Pattern diagram/render |
| `img-pattern-backlit` | `/assets/finishes/pattern-backlit.jpg` | Ribbed tile layout: Backlit LED slot glow detail | Placeholder | Feature render |
| `img-living-planted` | `/assets/products/living-planted-cassette.jpg` | Single living planted cassette render | Placeholder | Labeled CONCEPT VISUAL |
| `img-living-microgreen` | `/assets/products/living-microgreen-cassette.jpg` | Microgreen seeded mat cassette render | Placeholder | Labeled CONCEPT VISUAL |
| `img-living-moss` | `/assets/products/living-preserved-moss.jpg` | Preserved moss dry acoustic cassette render | Placeholder | Labeled CONCEPT VISUAL |
| `img-living-vent` | `/assets/products/living-vent-panel.jpg` | Micro-perforated anodised bronze accent panel render | Placeholder | Labeled CONCEPT VISUAL |

---

## 3. Asset Replacement Rules
- All concept imagery for D'WALL Living Wall must bear an explicit overlay badge: **`CONCEPT VISUAL — SYSTEM IN DEVELOPMENT`**.
- Technical vector diagrams (SVGs) are generated dynamically in inline HTML so they render losslessly at any print DPI or screen resolution.
