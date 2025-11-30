# StyleFusion Source Code

This is the source code for the StyleFusion Virtual Try-On app.

## How to Deploy to Vercel
1. Upload this folder to a GitHub repository.
2. Import the project in Vercel.
3. Vercel should automatically detect 'Vite' as the framework.
4. **Important:** In Vercel Project Settings > Environment Variables, add a new variable:
   - Name: `API_KEY`
   - Value: Your Google Gemini API Key
5. Deploy!