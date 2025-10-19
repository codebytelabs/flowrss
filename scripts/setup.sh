#!/bin/bash

# FlowRSS Setup Script
# This script helps you get started with FlowRSS development

set -e

echo "🚀 FlowRSS Setup Script"
echo "======================="
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Setup environment variables
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please edit .env and add your API keys (optional)"
    echo "   - Supabase (for cloud sync)"
    echo "   - OpenRouter (for AI summaries)"
    echo "   - Perplexity (for smart search)"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/icons
mkdir -p docs
echo "✅ Directories created"
echo ""

# Type check
echo "🔍 Running type check..."
npm run type-check
echo "✅ Type check passed"
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys (optional)"
echo "2. Run 'npm run dev' to start development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - INSTALL.md - Installation guide"
echo "   - ARCHITECTURE.md - Technical details"
echo "   - TODO.md - Development roadmap"
echo "   - LAUNCH_PLAN.md - Marketing strategy"
echo ""
echo "Happy coding! 🎉"
