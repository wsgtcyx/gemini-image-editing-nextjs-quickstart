import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

// Initialize the fal client with your API key
const FAL_API_KEY = process.env.FAL_API_KEY || "";

// Configure fal client with API key
fal.config({
  credentials: FAL_API_KEY,
});

// Model endpoints - note that according to documentation these might be deprecated
const TEXT_TO_IMAGE_ENDPOINT = "fal-ai/qwen-image";
const EDIT_IMAGE_ENDPOINT = "fal-ai/flux-pro/kontext";

// Valid quality options
type Quality = "high" | "medium" | "low";

export async function POST(req: NextRequest) {
  try {
    // Parse JSON request
    const requestData = await req.json();
    const { prompt, image: inputImage, quality = "medium" } = requestData;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Validate quality parameter
    const validQuality: Quality = ["high", "medium", "low"].includes(quality) 
      ? quality as Quality 
      : "medium";
    
    console.log(`Using quality setting: ${validQuality}`);

    // Determine if this is an image generation or editing request
    const isImageEdit = !!inputImage;
    
    try {
      let result;
      
      if (isImageEdit) {
        // For image editing
        console.log("Processing image edit request");

        // Check if the image is a valid data URL
        if (!inputImage.startsWith("data:")) {
          throw new Error("Invalid image data URL format");
        }

        // Call fal.ai image edit API with the edit-image endpoint
        try {
          result = await fal.subscribe(EDIT_IMAGE_ENDPOINT, {
            input: {
              prompt: prompt,
              image_url: inputImage, // Use the full data URL
              num_images: 1,
              // quality: validQuality,
              image_size: "square_hd"
            },
            logs: true,
            onQueueUpdate: (update) => {
              if (update.status === "IN_PROGRESS") {
                console.log("Processing:", update.logs);
              }
            },
          });
        } catch (error) {
          console.error("Error accessing fal.ai API:", error);
          // Check if the error is related to the endpoint being deprecated
          if (error.message?.includes("deprecated") || error.message?.includes("no longer supported")) {
            throw new Error("The image editing API endpoint is deprecated. Please update to a supported endpoint.");
          }
          throw error;
        }
      } else {
        // For image generation (text-to-image)
        console.log("Processing text-to-image request");
        
        // Call fal.ai text to image API
        try {
          result = await fal.subscribe(TEXT_TO_IMAGE_ENDPOINT, {
            input: {
              prompt: prompt,
              // num_images: 1,
              // quality: validQuality,
              image_size: "square_hd",
              guidance_scale: "4",
            },
            logs: true,
            onQueueUpdate: (update) => {
              if (update.status === "IN_PROGRESS") {
                console.log("Processing:", update.logs);
              }
            },
          });
        } catch (error) {
          console.error("Error accessing fal.ai API:", error);
          // Check if the error is related to the endpoint being deprecated
          if (error.message?.includes("deprecated") || error.message?.includes("no longer supported")) {
            throw new Error("The image generation API endpoint is deprecated. Please update to a supported endpoint.");
          }
          throw error;
        }
      }

      console.log("Response received:", result);

      // Extract the image URL from the response
      if (result && result.data && result.data.images && result.data.images.length > 0) {
        const imageUrl = result.data.images[0].url;
        
        // Fetch the image and convert to base64
        const imageResponse = await fetch(imageUrl);
        const arrayBuffer = await imageResponse.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = imageResponse.headers.get('content-type') || 'image/png';
        
        // Return the base64 image as JSON
        return NextResponse.json({
          image: `data:${mimeType};base64,${base64Image}`,
          description: null, // fal.ai doesn't return a text description
        });
      } else {
        throw new Error("No image data in response");
      }
    } catch (error) {
      console.error("Error in fal.ai API call:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
