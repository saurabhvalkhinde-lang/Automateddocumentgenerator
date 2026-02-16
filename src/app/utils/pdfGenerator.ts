import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  isPro?: boolean;
  addWatermark?: boolean;
  watermarkText?: string;
}

export const generatePDF = async (
  elementId: string,
  filename: string,
  options: PDFOptions = {}
) => {
  const { isPro = false, addWatermark = !isPro, watermarkText = 'Created with PDFDecor' } = options;
  
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found');
    return;
  }

  // Create a hidden clone for rendering
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = element.offsetWidth + 'px';
  clone.id = elementId + '-pdf-clone';
  document.body.appendChild(clone);

  try {
    // Convert all colors to RGB/hex format
    convertColorsToRGB(clone);
    
    // Add watermark if free user
    if (addWatermark && !isPro) {
      addWatermarkToElement(clone, watermarkText);
    }
    
    // Wait for styles to be applied
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId + '-pdf-clone');
        if (clonedElement) {
          convertColorsToRGB(clonedElement as HTMLElement);
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(
      imgData,
      'PNG',
      imgX,
      imgY,
      imgWidth * ratio,
      Math.min(imgHeight * ratio, pdfHeight)
    );
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('There was an error generating the PDF. Please try again.');
  } finally {
    // Remove the clone
    document.body.removeChild(clone);
  }
};

function addWatermarkToElement(element: HTMLElement, text: string) {
  const watermark = document.createElement('div');
  watermark.textContent = text;
  watermark.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 48px;
    font-weight: bold;
    color: rgba(128, 128, 128, 0.15);
    pointer-events: none;
    white-space: nowrap;
    z-index: 9999;
  `;
  element.style.position = 'relative';
  element.appendChild(watermark);
}

function convertColorsToRGB(element: HTMLElement) {
  const allElements = [element, ...Array.from(element.querySelectorAll('*'))];
  
  for (const el of allElements) {
    if (!(el instanceof HTMLElement)) continue;
    
    const computed = window.getComputedStyle(el);
    
    // Color properties to convert
    const colorProps: Array<{ css: string; js: keyof CSSStyleDeclaration }> = [
      { css: 'color', js: 'color' },
      { css: 'background-color', js: 'backgroundColor' },
      { css: 'border-top-color', js: 'borderTopColor' },
      { css: 'border-right-color', js: 'borderRightColor' },
      { css: 'border-bottom-color', js: 'borderBottomColor' },
      { css: 'border-left-color', js: 'borderLeftColor' },
    ];
    
    for (const prop of colorProps) {
      try {
        const value = computed.getPropertyValue(prop.css);
        if (value && !value.includes('transparent') && !value.includes('rgba(0, 0, 0, 0)')) {
          const rgb = convertToRGB(value);
          if (rgb && rgb !== value) {
            el.style.setProperty(prop.css, rgb, 'important');
          }
        }
      } catch (e) {
        // Continue on error
      }
    }
    
    // Handle background images and gradients
    try {
      const bgImage = computed.getPropertyValue('background-image');
      if (bgImage && bgImage !== 'none') {
        const converted = convertGradientColors(bgImage);
        if (converted !== bgImage) {
          el.style.setProperty('background-image', converted, 'important');
        }
      }
    } catch (e) {
      // Continue on error
    }
  }
}

function convertToRGB(color: string): string {
  // If already RGB or hex, return it
  if (color.startsWith('rgb') || color.startsWith('#')) {
    return color;
  }
  
  // For oklch and other modern formats, use canvas to convert
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return color;
    
    // Set color and get computed value
    ctx.fillStyle = '#000000';
    ctx.fillStyle = color;
    const computedColor = ctx.fillStyle;
    
    // If it changed from black, it worked
    if (computedColor !== '#000000') {
      return computedColor;
    }
    
    // Try drawing and reading pixel
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    
    const imageData = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  } catch (e) {
    return color;
  }
}

function convertGradientColors(gradient: string): string {
  try {
    // Match modern color functions
    const colorRegex = /(oklch|oklab|lch|lab|color)\([^)]+\)/g;
    const matches = gradient.match(colorRegex);
    
    if (!matches) return gradient;
    
    let converted = gradient;
    
    for (const match of matches) {
      const rgb = convertToRGB(match);
      if (rgb !== match) {
        converted = converted.replace(match, rgb);
      }
    }
    
    return converted;
  } catch (e) {
    return gradient;
  }
}

// Sharing utilities
export const shareViaWhatsApp = (message: string, url?: string) => {
  const text = encodeURIComponent(url ? `${message} ${url}` : message);
  window.open(`https://wa.me/?text=${text}`, '_blank');
};

export const shareViaEmail = (subject: string, body: string) => {
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};