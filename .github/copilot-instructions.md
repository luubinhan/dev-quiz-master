# DevQuiz Master - AI Agent Instructions

## Project Overview
A React/TypeScript developer quiz application featuring multiple question types (single choice, multiple choice, fill-in-the-blank, drag-drop matching). Uses Neubrutalist design aesthetic with inline Tailwind styles. Content is in Vietnamese.

## Architecture & Data Flow

### State Management (All in App.tsx)
- No Redux/Context - uses `useState` for three view states: `home` → `quiz` → `result`
- Single component architecture: `App.tsx` manages all routing and state
- Question data is static (imported from `constants.tsx` - 717 lines of quiz content)
- Navigation: User selects topic → takes 10 random questions → views detailed results

### Core Components
1. **App.tsx**: Main container managing view state, quiz lifecycle, and score calculation
2. **QuestionRenderer.tsx**: Polymorphic renderer handling 4 question types with type-specific UI
3. **geminiService.ts**: AI feedback generator using Google Gemini API (currently unused in UI)

### Type System (`types.ts`)
```typescript
ViewState = 'home' | 'quiz' | 'result'  // Three main screens
QuestionType = enum { SINGLE, MULTIPLE, FILL, DRAG_DROP }  // Four question formats
Difficulty = enum { EASY, MEDIUM, HARD }
Question: { correctAnswer: string | string[] | Record<string, string> }  // Polymorphic answer type
```

## Key Patterns & Conventions

### Styling Approach
- **Tailwind CDN** (not PostCSS) - all styles inline, no CSS modules
- Neubrutalist aesthetic: Heavy black borders (3px), bold shadows (`shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`)
- Signature classes: `.brutalist-card`, `.brutalist-button` (defined in `index.html`)
- Color palette: Black borders + vibrant fills (indigo-500, cyan-500, yellow-400, green-400, pink-200)
- Grid background: `radial-gradient` dots pattern in body

### Answer Validation Logic (App.tsx)
Type-specific comparison in `calculateScore()`:
- **SINGLE/FILL**: Lowercase + trim string comparison
- **MULTIPLE**: Array length match + `.every()` membership check
- **DRAG_DROP**: Object key iteration with value equality

### Question Rendering Pattern (QuestionRenderer.tsx)
Each question type has dedicated handler + UI:
- Manages local state for drag-drop matching (`matchingState`)
- `renderOptionContent()` helper detects code (by semicolons/keywords) → applies `font-mono`
- Uses `useEffect` to sync `currentAnswer` prop changes back to local state

### Vietnamese Content
All UI strings, questions, and explanations are in Vietnamese. Maintain this when adding content.

## Development Workflow

### Local Development
```bash
npm install              # Install dependencies
npm run dev             # Vite dev server on localhost:3000
npm run preview         # Preview production build
```

### Environment Variables
Vite config uses `loadEnv` to inject `GEMINI_API_KEY` from `.env.local`:
```typescript
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```
**Note**: AI feedback feature exists but is not integrated into UI yet.

### Deployment to GitHub Pages
```bash
npm run deploy          # Build + deploy via gh-pages
```
- GitHub Actions workflow in `.github/workflows/deploy.yml` auto-deploys on push to `dev` branch
- **Critical**: `vite.config.ts` has `base: '/dev-quiz-master/'` for GitHub Pages routing
- Workflow uses Node 20, builds to `./dist`, deploys via `actions/deploy-pages@v4`

## Adding New Features

### Adding Questions to Existing Topics
Edit `constants.tsx` → add to `MOCK_QUESTIONS` array:
```typescript
{
  id: 'unique-id',
  topic: 'javascript', // Must match TOPICS[].id
  difficulty: Difficulty.MEDIUM,
  type: QuestionType.SINGLE,
  questionText: 'Your question?',
  options: ['A', 'B', 'C', 'D'], // For single/multiple choice
  correctAnswer: 'A', // Type depends on QuestionType
  explanation: 'Why this is correct...',
  reference?: 'https://...' // Optional MDN/docs link
}
```

### Adding New Topics
1. Add to `TOPICS` array in `constants.tsx` with emoji icon
2. Add questions with matching `topic` field
3. App automatically generates topic cards on home screen

### Adding New Question Types
1. Add enum value to `QuestionType` in `types.ts`
2. Update `calculateScore()` in `App.tsx` with validation logic
3. Add rendering logic to `QuestionRenderer.tsx` (new conditional block)
4. Update `Question` interface if new fields needed

## Important Gotchas

### Question Randomization
`startQuiz()` uses `.sort(() => Math.random() - 0.5).slice(0, 10)` - quick but not cryptographically random. Acceptable for quiz shuffling.

### Answer Type Polymorphism
`correctAnswer` field changes type based on `QuestionType`:
- `SINGLE/FILL`: `string`
- `MULTIPLE`: `string[]`
- `DRAG_DROP`: `Record<string, string>`

QuestionRenderer and scoring logic must handle all variants.

### Drag-Drop State Management
QuestionRenderer maintains `matchingState` locally because interaction requires two-step selection (left item → right item). Final `pairs` object synced via `onAnswer()` callback.

### Code Snippet Detection
`renderOptionContent()` heuristic checks for semicolons/keywords to apply `font-mono`. Not perfect but works for current content.

## Tech Stack
- **Build**: Vite 6.2
- **Framework**: React 19.2 + TypeScript 5.8
- **Styling**: Tailwind CSS (CDN)
- **AI**: Google Gemini SDK (via `@google/genai`)
- **Deployment**: GitHub Pages via gh-pages + GitHub Actions
