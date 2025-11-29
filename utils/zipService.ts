import JSZip from 'jszip';

export const downloadSourceCode = async () => {
  const zip = new JSZip();
  
  // List of files to include in the source code download
  const files = [
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
    zip.file("README.md", `# StyleFusion Source Code\n\nThis is the source code for the StyleFusion Virtual Try-On app.\n\n## How to run\n1. Install dependencies: \`npm install\`\n2. Run dev server: \`npm run dev\` (or equivalent)\n\nNote: You need to set up your API_KEY.`);

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