# AI Linear Algebra Tutor

An intelligent web application that helps students learn linear algebra through interactive whiteboard and voice chat features.

## Features

- 🎨 **Interactive Whiteboard**: Draw, solve, and visualize linear algebra problems with Konva.js
- 🎤 **Voice Chat**: Ask questions and get instant AI explanations
- 🧮 **Math Tools**: Built-in calculators for matrices, vectors, and equations
- 📚 **AI-Powered Learning**: Adaptive explanations based on difficulty level
- 💾 **Save & Share**: Save your work and download chat conversations
- 🔧 **JSON Rendering**: Import and render mathematical objects from structured JSON
- 📊 **Export Options**: Export drawings as PNG, SVG, or JSON
- 🎯 **Mathematical Objects**: Pre-built vectors, matrices, equations, and geometric shapes

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- Lucide React for icons
- Konva.js + React-Konva for advanced whiteboard functionality
- Canvas API for drawing operations

### Backend
- Node.js with Express
- TypeScript for type safety
- CORS for cross-origin requests
- Multer for file uploads
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm 8+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-linear-algebra-tutor
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Start the development servers:
```bash
npm run dev
```

This will start both frontend (http://localhost:5173) and backend (http://localhost:5000) servers.

### Individual Commands

- **Frontend only**: `npm run dev:frontend`
- **Backend only**: `npm run dev:backend`
- **Build all**: `npm run build`
- **Production start**: `npm start`

## Project Structure

```
ai-linear-algebra-tutor/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── InteractiveWhiteboard.tsx
│   │   │   └── VoiceChat.tsx
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # TailwindCSS styles
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── chat.ts
│   │   │   ├── whiteboard.ts
│   │   │   └── math.ts
│   │   ├── services/        # Business logic
│   │   │   ├── chatService.ts
│   │   │   ├── whiteboardService.ts
│   │   │   └── mathService.ts
│   │   └── server.ts        # Express server
│   ├── uploads/             # File uploads
│   └── package.json
└── package.json             # Root package.json
```

## API Endpoints

### Chat API
- `POST /api/chat/message` - Send text message
- `POST /api/chat/voice` - Process voice input
- `GET /api/chat/suggestions` - Get topic suggestions

### Whiteboard API
- `POST /api/whiteboard/save` - Save drawing
- `GET /api/whiteboard/drawings` - Get saved drawings
- `POST /api/whiteboard/analyze` - Analyze drawing
- `DELETE /api/whiteboard/:id` - Delete drawing

### Math API
- `POST /api/math/calculate` - General calculations
- `POST /api/math/matrix` - Matrix operations
- `POST /api/math/vector` - Vector operations
- `POST /api/math/solve` - Solve problems
- `GET /api/math/examples` - Get examples

### Konva API
- `POST /api/konva/render` - Render JSON data to Konva shapes
- `POST /api/konva/export` - Export Konva stage data
- `POST /api/konva/analyze` - Analyze mathematical content
- `GET /api/konva/templates` - Get mathematical object templates

### AI Ask API
- `POST /api/ask` - Ask the AI Linear Algebra Tutor a question
- `GET /api/ask/health` - Health check for AI service
- `GET /api/ask/examples` - Get example questions by difficulty

## Features in Detail

### Interactive Whiteboard
- **Konva.js Integration**: Advanced 2D canvas with high performance
- **Drawing Tools**: Pen, eraser, shapes (rectangles, circles, arrows)
- **Mathematical Objects**: Pre-built vectors, matrices, equations
- **Color & Styling**: Full color palette and stroke width control
- **Export Options**: PNG, SVG, and JSON export functionality
- **JSON Import/Export**: Load and save structured mathematical data
- **Shape Selection**: Click to select and modify individual shapes
- **AI Analysis**: Automatic detection of mathematical content

### Enhanced Voice Chat
- **OpenAI Integration**: Powered by GPT-4 for intelligent responses
- **Speech-to-Text**: Real-time voice input with Web Speech API
- **Text-to-Speech**: Natural voice output with customizable settings
- **Structured Responses**: Explanation, LaTeX, and visual shapes
- **Context Awareness**: Remembers conversation history
- **Visual Integration**: Shapes automatically rendered on whiteboard
- **Rate Limiting**: Prevents API abuse with intelligent throttling

### Math Services
- Vector operations (addition, dot product, cross product)
- Matrix operations (multiplication, determinant, inverse)
- Linear system solving
- Step-by-step solutions
- Example problems by topic

### JSON Rendering System
- **Structured Data**: Import mathematical objects from JSON
- **Mathematical Objects**: Vectors, matrices, equations, functions
- **Shape Support**: Lines, circles, rectangles, arrows, text
- **Template Library**: Pre-built examples for common scenarios
- **Export/Import**: Save and load complex mathematical diagrams
- **Real-time Rendering**: Instant visualization of JSON data

### AI-Powered Learning
- **OpenAI GPT-4**: Advanced language model for intelligent tutoring
- **Structured Responses**: Explanation, LaTeX, and visual shapes
- **Context Awareness**: Remembers conversation history and difficulty level
- **Adaptive Learning**: Adjusts explanations based on student level
- **Visual Integration**: Automatically generates shapes for whiteboard
- **Rate Limiting**: Intelligent throttling to prevent API abuse
- **API Key Required**: Full functionality requires valid OpenAI API key

## Development

### Adding New Features
1. Create components in `frontend/src/components/`
2. Add API routes in `backend/src/routes/`
3. Implement business logic in `backend/src/services/`
4. Update types and interfaces as needed

### Styling
- Uses TailwindCSS utility classes
- Custom color scheme defined in `tailwind.config.js`
- Responsive design for mobile and desktop

### TypeScript
- Strict type checking enabled
- Interfaces for all data structures
- Type-safe API communication

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build:frontend
# Deploy the dist/ folder
```

### Backend (Railway/Heroku)
```bash
npm run build:backend
# Deploy with environment variables
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# OpenAI API Configuration (Required for AI features)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1500
OPENAI_TEMPERATURE=0.7

# Rate limiting settings
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

**Note**: The application now REQUIRES a valid OpenAI API key to function. No fallback responses are provided.

### Quick Setup

Run the setup script to configure your API key:

```bash
./setup-api-key.sh
```

Or manually edit the `backend/.env` file:

```env
OPENAI_API_KEY=your_actual_api_key_here
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Happy Learning! 🎓📐**