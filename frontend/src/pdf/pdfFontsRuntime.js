// frontend/src/pdf/pdfFontsRuntime.js
import { jsPDF } from "jspdf";

let registered = false;

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function registerFromTTF(doc, url, vfsName, familyName) {
  console.log(`🔄 Attempting to load font: ${familyName}`);
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Font fetch failed: ${url} - Status: ${res.status}`);
  }
  
  const buf = await res.arrayBuffer();
  console.log(`📦 Font loaded: ${familyName}, size: ${buf.byteLength} bytes`);
  
  const b64 = arrayBufferToBase64(buf);
  
  // Add font to PDF
  doc.addFileToVFS(vfsName, b64);
  doc.addFont(vfsName, familyName, "normal");
  
  console.log(`✅ Font registered: ${familyName}`);
  
  // Verify the font was added
  const fontList = doc.getFontList();
  if (fontList[familyName]) {
    console.log(`✅ Font verified in font list: ${familyName}`);
  } else {
    console.error(`❌ Font NOT found in font list: ${familyName}`);
    console.log('Available fonts:', Object.keys(fontList));
  }
}

export async function registerSinhalaTamilFonts(doc) {
  console.log('🚀 registerSinhalaTamilFonts called');
  
  if (registered) {
    console.log('⚠️ Fonts already registered');
    return;
  }

  try {
    console.log('📥 Starting font registration...');
    
    await registerFromTTF(
      doc,
      "/fonts/NotoSansSinhala-Regular.ttf",
      "NotoSansSinhala-Regular.ttf",
      "NotoSansSinhala"
    );

    await registerFromTTF(
      doc,
      "/fonts/NotoSansTamil-Regular.ttf", 
      "NotoSansTamil-Regular.ttf",
      "NotoSansTamil"
    );

    registered = true;
    console.log('🎉 All fonts registered successfully');
    
  } catch (error) {
    console.error('💥 Font registration failed:', error);
    registered = false;
    throw error;
  }
}