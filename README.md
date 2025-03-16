# Image Creation & Editing with Next.js and Gemini 2.0 Flash

This project demonstrates how to create and edit images using Google's Gemini 2.0 Flash AI model in a Next.js web application. It allows users to generate images from text prompts or edit existing images through natural language instructions, maintaining conversation context for iterative refinements.

**How It Works:**

1. **Create Images**: Generate images from text prompts using Gemini 2.0 Flash
2. **Edit Images**: Upload an image and provide instructions to modify it
3. **Conversation History**: Maintain context through a conversation with the AI for iterative refinements
4. **Download Results**: Save your generated or edited images

## Features

- 🎨 Text-to-image generation with Gemini 2.0 Flash
- 🖌️ Image editing through natural language instructions
- 💬 Conversation history for context-aware image refinements
- 📱 Responsive UI built with Next.js and shadcn/ui
- 🔄 Seamless workflow between creation and editing modes
- ⚡ Uses Gemini 2.0 Flash Javascript SDK

## Known Issues

- **Hydration Mismatch**: If you encounter hydration mismatch errors related to attributes like `data-llm4sre-ubi-main-called`, this is likely caused by browser extensions that modify the DOM. We've added `suppressHydrationWarning` to the body tag to prevent these errors from affecting the application.

## Getting Started

### Local Development

First, set up your environment variables:

```bash
cp .env.example .env
```

Add your Google AI Studio API key to the `.env` file:

```
GEMINI_API_KEY=your_google_api_key
```

Then, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t nextjs-gemini-image-editing .
```

2. Run the container with your Google API key:

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_google_api_key nextjs-gemini-image-editing
```

Or using an environment file:

```bash
# Run container with env file
docker run -p 3000:3000 --env-file .env nextjs-gemini-image-editing
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for the web application
- [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/) - AI model for image generation and editing
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS 

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.
