# LookSwap AI Wizard

LookSwap is an AI-powered fashion transformation tool that allows users to upload a photo, crop a specific clothing piece, and seamlessly generate a new look using Google's Gemini models. It generates video production scripts based on the transformation.

## Features

- **Smart Crop**: Intelligent cropping tool with auto-fit and zoom.
- **Scene Styling**: Choose from Mirror, Selfie, Promo, or Editorial styles.
- **AI Transformation**: Uses Gemini 2.5 to preserve garment details while changing the model/environment.
- **Video Instructions**: Generates a complete .md script for video production.

## Tech Stack

- **Frontend**: React 19, TailwindCSS
- **AI**: Google Gemini API (@google/genai)
- **Build**: Vite

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your API Key:
   - Create a `.env` file.
   - Add `API_KEY=your_google_genai_api_key`
4. Run locally: `npm run dev`

## Deployment

This project is configured for easy deployment on Netlify.

1. Connect your repository to Netlify.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Add your `API_KEY` in the Netlify Environment Variables settings.
