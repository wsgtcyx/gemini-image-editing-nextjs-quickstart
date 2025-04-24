# Gemini 2.0 Flash & Fal.ai GPT Image 1 for Image Generation and Editing

Nextjs quickstart for to generating and editing images with Google Gemini 2.0 Flash or Fal.ai GPT Image 1. It allows users to generate images from text prompts or edit existing images through natural language instructions, maintaining conversation context for iterative refinements. Try out the hosted demo at [Hugging Face Spaces](https://huggingface.co/spaces/philschmid/image-generation-editing).


https://github.com/user-attachments/assets/8ffa5ee3-1b06-46a9-8b5e-761edb0e00c3


Get your `GEMINI_API_KEY` key [here](https://ai.google.dev/gemini-api/docs/api-key) or your `FAL_API_KEY` from [fal.ai](https://fal.ai/) and start building. 

**How It Works:**

1. **Create Images**: Generate images from text prompts using Gemini 2.0 Flash or Fal.ai GPT Image 1
2. **Edit Images**: Upload an image and provide instructions to modify it
3. **Conversation History**: Maintain context through a conversation with the AI for iterative refinements
4. **Download Results**: Save your generated or edited images

## Basic request 

### Using Google Gemini API

For developers who want to call the Gemini API directly, you can use the Google Generative AI JavaScript SDK:

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage() {
  const contents = "Hi, can you create a 3d rendered image of a pig " +
                  "with wings and a top hat flying over a happy " +
                  "futuristic scifi city with lots of greenery?";

  // Set responseModalities to include "Image" so the model can generate 
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    const response = await model.generateContent(contents);
    for (const part of  response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync('gemini-native-image.png', buffer);
        console.log('Image saved as gemini-native-image.png');
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}
```

### Using Fal.ai API

#### Text-to-Image Generation

For developers who want to use Fal.ai GPT Image 1 API for image generation:

```javascript
import { fal } from "@fal-ai/client";

// Configure fal client with API key
fal.config({
  credentials: process.env.FAL_API_KEY,
});

async function generateImage() {
  const prompt = "A serene cyberpunk cityscape at twilight, with neon signs glowing in vibrant blues and purples";
  
  try {
    const result = await fal.subscribe("fal-ai/gpt-image-1/text-to-image", {
      input: {
        prompt: prompt,
        num_images: 1,
        quality: "high",
        image_size: "1024x1024"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Processing:", update.logs);
        }
      },
    });
    
    // The result contains the image URL
    console.log(result.data.images[0].url);
  } catch (error) {
    console.error("Error generating image:", error);
  }
}
```

#### Image Editing

For image editing with Fal.ai GPT Image 1:

```javascript
import { fal } from "@fal-ai/client";

// Configure fal client with API key
fal.config({
  credentials: process.env.FAL_API_KEY,
});

async function editImage() {
  const imageUrl = "https://example.com/your-image.png"; // URL of the image to edit
  const prompt = "Make this pixel-art style";
  
  try {
    const result = await fal.subscribe("fal-ai/gpt-image-1/edit-image", {
      input: {
        image_urls: [imageUrl],
        prompt: prompt,
        num_images: 1,
        quality: "high",
        image_size: "1024x1024"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Processing:", update.logs);
        }
      },
    });
    
    // The result contains the edited image URL
    console.log(result.data.images[0].url);
  } catch (error) {
    console.error("Error editing image:", error);
  }
}
```

## Features

- 🎨 Text-to-image generation with Gemini 2.0 Flash or Fal.ai GPT Image 1
- 🖌️ Image editing through natural language instructions
- 💬 Conversation history for context-aware image refinements
- 📱 Responsive UI built with Next.js and shadcn/ui
- 🔄 Seamless workflow between creation and editing modes
- ⚡ Uses Gemini 2.0 Flash Javascript SDK or Fal.ai client

## Getting Started

### Local Development

First, set up your environment variables:

```bash
cp .env.example .env
```

Add your API keys to the `.env` file: 

_Get your `GEMINI_API_KEY` key [here](https://ai.google.dev/gemini-api/docs/api-key) or your `FAL_API_KEY` from [fal.ai](https://fal.ai/)._

```
GEMINI_API_KEY=your_google_api_key
FAL_API_KEY=your_fal_api_key
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
docker build -t nextjs-image-editing .
```

2. Run the container with your API keys:

```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=your_google_api_key -e FAL_API_KEY=your_fal_api_key nextjs-image-editing
```

Or using an environment file:

```bash
# Run container with env file
docker run -p 3000:3000 --env-file .env nextjs-image-editing
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for the web application
- [Google Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/) - AI model for image generation and editing
- [Fal.ai GPT Image 1](https://fal.ai/models) - OpenAI's image generation model accessed through Fal.ai
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS 

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](./LICENSE) file for details.
