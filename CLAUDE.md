# CLAUDE.md – Project Briefing for danctrl.dev Portfolio

## Project Overview

This is a personal portfolio website for **Daniel Guntermann** (`danctrl.dev`), built with **Astro** and **Tailwind CSS**, deployed on **Cloudflare Pages**. The site replaces an older Hugo-based portfolio and serves as a professional showcase targeting **Junior DevOps / AI / Cybersecurity** positions.

## About Daniel

- **Name:** Daniel Guntermann
- **Handle:** danctrl
- **Location:** Berlin, Germany
- **Education:** B.A. Business Administration at Berlin School of Economics and Law (HWR Berlin), since April 2024
- **Certifications:**
  - Full-Stack Web Developer – Le Wagon (November 2023): HTML, CSS, Bootstrap, JS, SQL, Git, Ruby on Rails
  - English Language Correspondent – IHK zu Lippe Detmold (March 2016)
- **Languages:** German (native), English (fluent), Spanish (basic)
- **Career Goal:** Junior position in DevOps / AI / Cybersecurity – bridging technical systems with business understanding
- **Interests:** AI & Automation, Privacy-First Systems, Open Source, Self-Hosting, Smart Home, Cybersecurity, Gym, Cats, Travel

## Professional Experience (chronological, newest first)

1. **Freelance Technologist** (March 2023 – Present)
   - Homelab with Podman on RHEL, containerization, Home Assistant smart home, Hugo site with CI/CD
2. **Technical Specialist – Apple** (Oct 2021 – Jan 2023)
   - Hardware/software troubleshooting, Genius Bar, customer support
3. **Public Support Specialist – Foundever** (Jan 2021 – Sep 2021)
   - NRW COVID-19 vaccination hotline, 75+ daily callers
4. **Social Media Manager – nussknagger GmbH** (Nov 2020 – Jan 2021)
   - Social campaigns, lead generation, content strategy
5. **Project Manager – JobTender24 GmbH** (Jul 2018 – Oct 2019)
   - Recruitment projects, process optimization, pipeline scaling

## Key Projects (highlight these prominently)

1. **Podman-powered Homelab** ⭐ (MOST IMPORTANT – showcase DevOps skills)
   - Self-hosted infrastructure on Red Hat Linux
   - Podman containers, Traefik reverse proxy
   - Should include an architecture diagram on the site

2. **Smart Home with Home Assistant**
   - Home Assistant in KVM VM on RHEL server
   - Automation workflows

3. **danctrl.dev Portfolio** (this site itself – meta-project)
   - Astro + Tailwind + Cloudflare Pages
   - CI/CD via GitHub Actions
   - "How I built this" as a showcase of DevOps thinking

4. **my kita – Le Wagon Final Project**
   - Web app helping Berlin parents find kindergartens
   - Ruby on Rails, team project

## Tech Stack (for the site)

- **Framework:** Astro (static site generation)
- **Styling:** Tailwind CSS with dark mode support (class strategy)
- **Animations:** CSS animations + Intersection Observer API (keep it lightweight, no heavy libraries)
- **Deployment:** Cloudflare Pages (auto-deploy from GitHub on push to `main`)
- **Language:** TypeScript where applicable
- **No:** React, Vue, or other UI frameworks unless absolutely needed for a specific interactive component

## Design Direction

### Reference & Inspiration
The design is inspired by a "Build Log" aesthetic – minimal, utilitarian, maker-oriented. Think developer portfolio meets personal changelog. Clean lines, generous whitespace, technical typography.

### Theme: Light + Dark Mode with Toggle
- **Default theme: Dark** (first impression = DevOps/cybersecurity vibe)
- **Light theme available** via toggle in navigation
- Use Tailwind's `dark:` class strategy
- Persist user preference in localStorage
- Respect `prefers-color-scheme` on first visit

### Color Palette

**Dark Mode (default):**
- Background: `#0a0a0a` (near black) to `#111827` (gray-900)
- Surface/Cards: `#1f2937` (gray-800) with subtle borders `#374151` (gray-700)
- Text primary: `#f9fafb` (gray-50)
- Text secondary: `#9ca3af` (gray-400)
- Accent: `#10b981` (Emerald 500)
- Accent hover: `#34d399` (Emerald 400)

**Light Mode:**
- Background: `#f7f7f5` (warm off-white, NOT pure white)
- Surface/Cards: `#ffffff` with subtle borders `#e5e7eb` (gray-200)
- Text primary: `#1a1a1a` (near black)
- Text secondary: `#6b7280` (gray-500)
- Accent: `#059669` (Emerald 600 – slightly darker for contrast on light bg)
- Accent hover: `#10b981` (Emerald 500)

### Typography
- **Headlines:** Monospace font (JetBrains Mono or similar) – technical, developer aesthetic
- **Body text:** Clean sans-serif (Inter or system fonts for performance)
- Large bold headings, comfortable reading size for body
- The monospace headlines are a key design element – they signal "this person is technical"

### Key Design Elements

1. **Status Indicator** in hero section
   - Small pill/badge: "● Currently studying & building" (green dot + text)
   - Shows the site feels alive and current

2. **Navigation**
   - Logo/brand "danctrl" on the left (monospace)
   - Nav links center: Timeline, Projects, Skills
   - CTA button right: "Download CV" (emerald accent)
   - Dark/Light mode toggle icon
   - Mobile: hamburger menu

3. **No Metrics Panel** (not enough data yet – can add later)

### Animations & Micro-interactions
- Fade-in / slide-up on scroll (using Intersection Observer)
- Smooth hover effects on project cards (subtle scale + shadow shift)
- Typing effect in hero section (rotating titles: "DevOps Engineer", "System Administrator", "Cybersecurity Enthusiast", "AI Explorer")
- Subtle gradient or glow animation in hero background
- Smooth scroll between sections
- Theme toggle: smooth color transition (CSS transition on background/color)
- NO: bouncing, excessive parallax, heavy particle effects, anything gimmicky

### Page Structure (Single Page)

1. **Hero Section**
   - Status indicator pill ("● Currently studying & building")
   - Large monospace headline: "Documenting the journey of building infrastructure"
     (or similar – convey the "building in public" vibe)
   - Subtitle: brief description of who Daniel is
   - Two CTA buttons: "View Timeline →" (filled, emerald) / "Browse Projects" (outlined)
   - Subtle animated background

2. **About Me**
   - Short bio (2-3 paragraphs max)
   - Profile photo
   - Key facts / quick stats

3. **Experience Timeline**
   - Vertical timeline, newest first
   - Clean cards with role, company, dates, highlights
   - Scroll-reveal animation (items fade in as you scroll)
   - Visual distinction between tech roles and other roles

4. **Skills / Tech Stack**
   - Visual representation (NOT boring progress bars)
   - Group by category: DevOps, Development, Business, Tools
   - Consider: icon grid with subtle hover glow, or tag-style layout

5. **Certifications**
   - Le Wagon, IHK
   - Link to certificates

6. **Projects**
   - Card grid with hover effects
   - Featured project (Homelab) gets extra prominence
   - Each card: image/screenshot, title, short description, tech tags, link

7. **Contact**
   - Email, GitHub, LinkedIn
   - Simple and clean, no unnecessary form

8. **Footer**
   - Minimal: copyright, "Built with Astro", social links

## Code Conventions

- Use Astro components (`.astro` files) for all sections
- Keep components in `src/components/`
- Main page layout in `src/layouts/Layout.astro`
- Index page in `src/pages/index.astro`
- Static assets in `public/`
- Use Tailwind utility classes, avoid custom CSS where possible
- Use semantic HTML (`<section>`, `<nav>`, `<header>`, `<footer>`, `<main>`)
- Mobile-first responsive design
- Dark mode classes using Tailwind `dark:` prefix
- Aim for perfect Lighthouse scores (Performance, Accessibility, SEO)

## Content Notes

- Tone: Professional but approachable, first person
- Language: English (international audience for tech jobs)
- The site should subtly communicate: "I understand both tech and business"
- Emphasize hands-on DevOps experience over business background
- The business background is a bonus, not the focus

## Important

- Always test changes with `npm run dev` before committing
- Commit after each working section with descriptive messages
- Keep the site fast – no unnecessary JavaScript
- All images should be optimized (WebP format, lazy loading)
- Accessibility matters – proper alt texts, contrast ratios, keyboard navigation
- Theme toggle must work without page reload
- Fonts: load JetBrains Mono from Google Fonts (only weights 400, 700)
