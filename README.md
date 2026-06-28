# ╔════════════════════════════════════════════╗
# ║              KESHAV TEJRA              ║
# ║  Full-Stack Dev • AI Eng • Mobile Dev     ║
# ╚════════════════════════════════════════════╝

An interactive, cyberpunk, retro-terminal portfolio website built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. Experience a fully-simulated Command Line Interface (CLI) operating system complete with a boot sequence, terminal commands, an AI mode, a matrix rain screen, and multiple themes.

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/Keshav-Tejra04/Portfolio.git

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to load the terminal.

---

## ⚙️ Features

### 🖥️ 1. Immersive Retro CLI Experience
* **Interactive Shell**: Fully functional text input with custom cursor blinking, command history mapping (using **Up/Down arrows**), and auto-completion using the **Tab** key.
* **Boot Sequence**: A styled bootloader simulating memory checks, dependency checks, and environment configurations before granting console access.
* **Matrix Rain Toggle**: A fully responsive Canvas-based digital rain effect in the background, matching the selected terminal theme color.

### 🎨 2. Custom Terminal Themes
Dynamic theme switcher (`theme [name]`) allowing users to hot-swap terminal styling:
* `hacker-green` (Default CRT Green)
* `cyberpunk-blue` (Deep Blue & Neon Cyan)
* `github-dark` (Developer Dark Mode)
* `vercel-black` (High Contrast Black & White)

### 🤖 3. Interactive AI Assistant Mode
Unlock an AI-powered conversational prompt by running the `ai` command. 
* Shifts prompt to `ask>`
* Ready to answer questions about skills, experience, and custom prompts.
* Run `exit` to return to the standard shell prompt (`keshav@portfolio:~$`).

### 🔑 4. Sudo Commands (Easter Eggs)
Try running commands with superuser access (`sudo [args]`):
* `sudo hire-keshav` - Custom response for recruitment.
* `sudo deploy-production` - Simulates a complete, optimized production deployment.
* `sudo make-coffee` - Classic developer joke handler.

---

## 💻 Available Commands

Execute any of the following commands in the terminal input:

| Command | Action |
| :--- | :--- |
| `help` | Lists all available system commands |
| `whoami` | Displays developer profile summary (Keshav Tejra) |
| `about` | Reads short bio, education details, and focus areas |
| `experience` / `timeline` | Displays professional experience history |
| `skills` | Renders a grid breakdown of core technical competencies |
| `mobile` / `android` | Shows specific mobile app development experience |
| `projects` | Lists featured projects with descriptions and tech stacks |
| `stats` | Shows career impact metrics (users served, query reductions) |
| `achievements` | Displays personal milestones and co-founding stats |
| `contact` | Reveals links to email, Github, and LinkedIn |
| `github` | Opens Keshav's Github profile in a new tab |
| `linkedin` | Opens Keshav's LinkedIn profile in a new tab |
| `resume` | Initiates the download of Keshav's resume PDF |
| `scratchbox` | Details about Scratchbox (live coding LMS) |
| `devflow` | Details about Devflow project (AI PR reviewer) |
| `skill-evaluator` | Details about Skill Evaluator project (AI resume analyzer) |
| `theme [name]` | Changes terminal look & feel (e.g., `theme cyberpunk-blue`) |
| `matrix` | Toggles the matrix code rain background effect |
| `ai` | Enters simulated AI response mode |
| `clear` | Clears terminal scrollback history |

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Frontend Library:** [React 19](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Theme Management:** [next-themes](https://github.com/pacocoursey/next-themes)

---

## 📂 Project Structure

```bash
Portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css         # Custom utility classes & Tailwind setup
│   │   ├── layout.tsx          # Root layout and theme injection
│   │   └── page.tsx            # Renders main terminal container
│   ├── components/
│   │   ├── BootSequence.tsx    # Renders the OS boot animation
│   │   ├── MatrixRain.tsx      # Renders background digital rain
│   │   ├── Terminal.tsx        # Core terminal controller, input & history
│   │   ├── ThemeProvider.tsx   # Light/dark/custom theme wrapper
│   │   └── outputs/            # Rich components rendering command responses
│   │       ├── AboutOutput.tsx
│   │       ├── ExperienceOutput.tsx
│   │       ├── ProjectsOutput.tsx
│   │       └── ...
│   ├── hooks/
│   │   └── useTerminal.ts      # Custom hook managing input, history, and autocomplete
│   └── utils/
│       └── commands.tsx        # Registry of command objects & UI response handlers
```

---

## 📝 Customization

To add your own command output:
1. Create a component in `src/components/outputs/YourCommandOutput.tsx`.
2. Open `src/utils/commands.tsx`.
3. Add the command to the `COMMANDS` registry mapping:
```typescript
yourcommand: {
  description: "Description of what this does",
  handler: () => <YourCommandOutput />
}
```

---

*Designed and Developed by [Keshav Tejra](https://github.com/Keshav-Tejra04).*
