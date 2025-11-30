import JSZip from 'jszip';

export const downloadSourceCode = async () => {
  const zip = new JSZip();
  
  // List of files to include in the source code download
  const files = [
    'package.json',
    'vite.config.ts',
    'index.html',
    'index.tsx',
    'App.tsx',
    'types.ts',
    'metadata.json',
    'manifest.json',
    'services/geminiService.ts',
    'components/Slot.tsx',
    'utils/zipService.ts'
  ];

  try {
    const promises = files.map(async (fileName) => {
      try {
        // Fetch the file content as text
        // In a real dev server, these paths usually resolve to the source files.
        const response = await fetch(fileName);
        if (!response.ok) throw new Error(`Failed to fetch ${fileName}`);
        const content = await response.text();
        zip.file(fileName, content);
      } catch (err) {
        console.warn(`Could not include ${fileName} in zip:`, err);
        // Add a placeholder for missing files so the user knows something is missing
        zip.file(`${fileName}.missing.txt`, `Could not fetch content for ${fileName}.`);
      }
    });

    await Promise.all(promises);

    // Add a simple README
    zip.file("README.md", `# StyleFusion Source Code\n\nThis is the source code for the StyleFusion Virtual Try-On app.\n\n## How to Deploy to Vercel\n1. Upload this folder to a GitHub repository.\n2. Import the project in Vercel.\n3. Vercel should automatically detect 'Vite' as the framework.\n4. **Important:** In Vercel Project Settings > Environment Variables, add a new variable:\n   - Name: \`API_KEY\`\n   - Value: Your Google Gemini API Key\n5. Deploy!`);

    // Generate the zip blob
    const content = await zip.generateAsync({ type: 'blob' });

    // Trigger download
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stylefusion-source.zip';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error creating zip:", error);
    return false;
  }
};