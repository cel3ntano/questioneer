# Questioneer - Build and Analyze Interactive Questionnaires

![Questioneer Banner](https://repository-images.githubusercontent.com/952152589/d16ea941-eef1-4261-9f76-4d52455925d0)

Questioneer is a modern web application designed to create, manage, and analyze interactive questionnaires. It provides an intuitive interface for building questionnaires with various question types, collecting responses, and generating insightful statistics.

## Features

- **Questionnaire Management**:

  - Create and edit questionnaires with a user-friendly interface
  - Drag-and-drop builder for reordering questions
  - Multiple question types: text, single choice, multiple choice, and image upload
  - Preview and validation before publishing

- **Interactive Questionnaire Completion**:

  - Progress indicator and navigation
  - Save intermediate progress to continue later
  - Completion summary and statistics

- **Advanced Statistics**:

  - Visualize response data with interactive charts
  - Track completion rates and time metrics
  - Analyze answer distributions for each question
  - View daily, weekly, and monthly trends

- **User Experience**:
  - Infinite scroll pagination for questionnaire listing
  - Sorting options (newest, oldest, name, question count, response count)
  - Responsive design that works on all devices
  - Animated interactions with visual feedback

## Tech Stack

- **Frontend Framework**: [Next.js 15](https://nextjs.org/) with Turbopack and App Router
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) built on [Radix UI](https://www.radix-ui.com/)
- **Database**: MongoDB with Prisma ORM
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://github.com/colinhacks/zod)
- **Drag and Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Image Handling**: [Cloudinary](https://cloudinary.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [Sonner](https://sonner.emilkowalski.com/)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:

```bash
git clone https://github.com/cel3ntano/questioneer.git
```

2. Navigate to the project directory:

```bash
cd questioneer
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env.local` file in the root directory based on `.env.example`:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/questioneer"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_FOLDER="questioneer"
```

5. Run Prisma generate:

```bash
npx prisma generate
```

6. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
questioneer/
├─ prisma/
│  └─ schema.prisma          # Database schema
├─ public/                   # Static assets
├─ src/
│  ├─ app/                   # Next.js pages and layouts
│  │  ├─ api/                # API routes
│  │  │  ├─ questionnaires/  # Questionnaire API endpoints
│  │  │  └─ statistics/      # Statistics API endpoints
│  │  ├─ questionnaires/     # Questionnaire routes
│  │  │  ├─ [id]/            # Single questionnaire routes
│  │  │  ├─ create/          # Creation page
│  │  │  └─ page.tsx         # Main listing page
│  │  ├─ statistics/         # Statistics page
│  │  ├─ globals.css         # Global styles
│  │  ├─ layout.tsx          # Root layout
│  │  └─ page.tsx            # Home page
│  ├─ components/            # React components
│  │  ├─ layout/             # Layout components
│  │  ├─ questionnaire/      # Questionnaire components
│  │  │  ├─ builder/         # Builder components
│  │  │  ├─ runner/          # Runner components
│  │  │  └─ stats/           # Statistics components
│  │  ├─ statistics/         # Global statistics components
│  │  └─ ui/                 # UI components from shadcn
│  ├─ hooks/                 # Custom React hooks
│  ├─ lib/                   # Utility functions
│  │  ├─ validators/         # Validation schemas
│  │  ├─ cloudinary.ts       # Cloudinary configuration
│  │  ├─ constants.ts        # Application constants
│  │  ├─ db.ts               # Database client
│  │  └─ utils.ts            # Utility functions
│  └─ types/                 # TypeScript type definitions
```

## Features in Detail

### Questionnaire Builder

- Create questionnaires with a name and description
- Add different question types:
  - Text questions for free-form responses
  - Single choice questions with radio buttons
  - Multiple choice questions with checkboxes
  - Image upload questions for visual responses
- Drag-and-drop interface for reordering questions and options
- Image upload support for visual questions
- Real-time validation with error messages

### Interactive Questionnaire Runner

- User-friendly interface for completing questionnaires
- Progress tracking with percentage indicator
- Navigation between questions (previous/next)
- Save progress in localStorage to continue later
- Completion summary showing all answers and time spent

### Statistics and Analytics

- Overview metrics (total responses, average completion time)
- Time-based analysis (daily, weekly, monthly completions)
- Question-specific statistics with visualizations
- Answer distribution charts for each question type
- Export capabilities for further analysis

### Global Statistics Dashboard

- System-wide metrics for administrators
- Most active questionnaires
- Latest responses
- Question type distribution
- Activity charts over time

## Deployment

The application can be deployed on Vercel, Netlify, or any other platform that supports Next.js applications.

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Author

Developed by Andrii Zhygalko
