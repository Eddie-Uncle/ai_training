# URL Shortener Frontend

A Matrix-themed, responsive Next.js 14 frontend for the URL shortener service.

## Features

- 🟢 Matrix-style cyberpunk UI with green glow effects
- 📊 Real-time history table showing all shortened URLs
- 🔄 Refresh button to update history
- 📋 One-click copy functionality for each URL
- ⚡ Fast and optimized with Next.js 14
- 📱 Fully responsive design (mobile, tablet, desktop)
- ✅ Form validation and error handling
- 🔄 Loading states with Matrix-style animations
- 🎨 Monospace fonts and terminal-style aesthetics

## Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:8000

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── globals.css       # Matrix-themed styles with Tailwind
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main URL shortener page with history
├── next.config.js        # Next.js configuration with API proxies
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## API Integration

The frontend proxies API requests to the backend through Next.js rewrites:
- `POST /api/shorten` → `POST http://localhost:8000/shorten`
- `GET /api/urls` → `GET http://localhost:8000/urls`

## Features in Detail

### URL Shortening
- Enter any valid HTTP/HTTPS URL
- Get instant shortened URL
- Automatic validation

### History Table
- Displays all shortened URLs
- Shows original URL, short URL, short code
- Click-to-visit external link icon
- Copy button for each entry
- Refresh to update list

### Matrix Theme
- Dark background (#0d0208)
- Matrix green text (#00ff41)
- Glowing effects on hover
- Terminal-style monospace fonts
- Cyberpunk aesthetics

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom Matrix theme
- **React Hooks** - State management

## Usage

1. Enter a URL (must start with `http://` or `https://`)
2. Click "[EXECUTE_SHORTEN]"
3. View your shortened URL
4. Check history table for all created short links
5. Click refresh to update the list
6. Copy any URL with one click!
