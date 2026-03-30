import * as pdfjsLib from 'pdfjs-dist'
import * as mammoth from 'mammoth'

// @ts-ignore - Required for Vite worker loading
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase()
  
  if (extension === 'pdf') {
    return extractTextFromPdf(file)
  } else if (extension === 'docx') {
    return extractTextFromDocx(file)
  }
  
  throw new Error("Format non supporté. Veuillez utiliser PDF ou DOCX.")
}

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
  let text = ""
  
  // Limiter à 30 pages max pour éviter de surcharger l'IA côté VITE
  const maxPages = Math.min(pdf.numPages, 30)
  
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(" ")
    text += pageText + "\n"
  }
  
  return text
}

async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}
