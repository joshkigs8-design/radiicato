import { jsPDF } from 'jspdf';
import { Order } from '@/types';
import { formatKES, formatDateTime } from '@/lib/utils';

/**
 * Generates and downloads an authentic, high-contrast RADIICATO Atelier PDF Invoice.
 */
export async function downloadOrderInvoicePDF(order: Order): Promise<void> {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Colors
  const black = [10, 10, 10] as const;
  const grayMuted = [113, 113, 122] as const;
  const borderLight = [228, 228, 231] as const;
  const bgSubtle = [250, 250, 250] as const;

  // 1. Top Decorative Accent Line
  doc.setDrawColor(...black);
  doc.setLineWidth(1.2);
  doc.line(margin, 12, margin + contentWidth, 12);

  // 2. Brand Header & Document Title
  let currentY = 22;

  // Try to load and render the logo image if available in browser
  let logoLoaded = false;
  if (typeof window !== 'undefined') {
    try {
      const img = new (window as any).Image();
      img.src = '/logo.png';
      await new Promise((resolve) => {
        img.onload = () => {
          logoLoaded = true;
          resolve(true);
        };
        img.onerror = () => resolve(false);
      });
      if (logoLoaded) {
        doc.addImage(img, 'PNG', margin, currentY - 5, 38, 12);
      }
    } catch {
      logoLoaded = false;
    }
  }

  if (!logoLoaded) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...black);
    doc.text('RADIICATO', margin, currentY + 3);
  }

  // Atelier sub-headline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...grayMuted);
  doc.text('ATELIER // NAIROBI FLAGSHIP STUDIO', margin, currentY + 12);

  // Document Type & Number (Right Aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...black);
  doc.text('TAX INVOICE', margin + contentWidth, currentY + 2, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...black);
  doc.text(`NO: ${order.orderNumber}`, margin + contentWidth, currentY + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...grayMuted);
  doc.text(`ISSUED: ${formatDateTime(order.createdAt)}`, margin + contentWidth, currentY + 13, { align: 'right' });

  currentY = 40;

  // Thin separator
  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  currentY += 6;

  // 3. Studio Info (Left) & Payment Metadata (Right)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...black);
  doc.text('ISSUER & ATELIER DETAILS:', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...grayMuted);
  doc.text('RADIICATO KENYA LTD', margin, currentY + 4.5);
  doc.text('Nairobi Flagship Studio, Kenya', margin, currentY + 8.5);
  doc.text('Official Contact: +254 706 528 908', margin, currentY + 12.5);
  doc.text('Online Storefront: radiicato.co.ke', margin, currentY + 16.5);

  // Payment Metadata (Right Column)
  const metaRightX = margin + contentWidth;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...black);
  doc.text('PAYMENT SPECIFICATION:', metaRightX - 60, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...grayMuted);

  const paymentMethodLabel = order.paymentMethod === 'mpesa' ? 'Safaricom M-PESA STK' : 'Card / Paystack';
  doc.text(`Method: ${paymentMethodLabel}`, metaRightX - 60, currentY + 4.5);

  if (order.paymentDetails?.mpesaReceiptNumber) {
    doc.text(`M-PESA Ref: ${order.paymentDetails.mpesaReceiptNumber}`, metaRightX - 60, currentY + 8.5);
  } else {
    doc.text(`Status: ${order.paymentStatus.toUpperCase()}`, metaRightX - 60, currentY + 8.5);
  }

  doc.text(`Fulfillment: ${order.fulfillmentStatus.toUpperCase()}`, metaRightX - 60, currentY + 12.5);
  if (order.trackingNumber) {
    doc.text(`Courier Tracking: ${order.trackingNumber}`, metaRightX - 60, currentY + 16.5);
  }

  currentY += 24;

  // 4. Customer Details & Delivery Destination Card
  doc.setFillColor(...bgSubtle);
  doc.setDrawColor(...borderLight);
  doc.rect(margin, currentY, contentWidth, 26, 'FD');

  // Left sub-column: Customer Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...grayMuted);
  doc.text('BILLED TO (CUSTOMER):', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...black);
  doc.text(order.customerName || order.shippingAddress.fullName || 'Customer', margin + 4, currentY + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...grayMuted);
  doc.text(order.email || '', margin + 4, currentY + 15);
  doc.text(order.phone || '', margin + 4, currentY + 19.5);

  // Right sub-column: Shipping Address
  const shipX = margin + 95;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...grayMuted);
  doc.text('DELIVERY DESTINATION:', shipX, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...black);
  doc.text(
    `${order.shippingAddress.streetAddress || ''}, ${order.shippingAddress.town || ''}`,
    shipX,
    currentY + 10.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...grayMuted);
  doc.text(
    `${order.shippingAddress.county || 'Nairobi'} County, Kenya`,
    shipX,
    currentY + 15
  );

  if (order.shippingAddress.deliveryInstructions) {
    const instructions = doc.splitTextToSize(`Note: ${order.shippingAddress.deliveryInstructions}`, 80);
    doc.text(instructions[0], shipX, currentY + 19.5);
  }

  currentY += 32;

  // 5. Line Items Table Header
  const colIndex = margin + 4;
  const colDesc = margin + 14;
  const colVariant = margin + 90;
  const colQty = margin + 130;
  const colPrice = margin + 152;
  const colTotal = margin + contentWidth - 4;

  doc.setFillColor(...black);
  doc.rect(margin, currentY, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('#', colIndex, currentY + 4.8);
  doc.text('ITEM DESCRIPTION', colDesc, currentY + 4.8);
  doc.text('VARIANT / SIZE', colVariant, currentY + 4.8);
  doc.text('QTY', colQty, currentY + 4.8, { align: 'center' });
  doc.text('PRICE', colPrice, currentY + 4.8, { align: 'right' });
  doc.text('TOTAL', colTotal, currentY + 4.8, { align: 'right' });

  currentY += 7;

  // 6. Line Items Table Rows
  order.items.forEach((item, index) => {
    // Check if new page is needed
    if (currentY > pageHeight - 55) {
      doc.addPage();
      currentY = 20;
    }

    const rowHeight = 9;
    const isEven = index % 2 === 0;

    if (isEven) {
      doc.setFillColor(253, 253, 253);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...grayMuted);
    doc.text(String(index + 1), colIndex, currentY + 5.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...black);
    // Truncate description if too long
    const cleanName = item.productName.length > 40 ? item.productName.substring(0, 38) + '...' : item.productName;
    doc.text(cleanName, colDesc, currentY + 5.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...grayMuted);
    doc.text(item.variantTitle || '-', colVariant, currentY + 5.8);

    doc.setTextColor(...black);
    doc.text(String(item.quantity), colQty, currentY + 5.8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.text(formatKES(item.price), colPrice, currentY + 5.8, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text(formatKES(item.total), colTotal, currentY + 5.8, { align: 'right' });

    // Underline
    doc.setDrawColor(...borderLight);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    currentY += rowHeight;
  });

  currentY += 6;

  // 7. Pricing Summary Totals Block (Right Aligned)
  const summaryBoxWidth = 80;
  const summaryX = margin + contentWidth - summaryBoxWidth;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...grayMuted);
  doc.text('Subtotal:', summaryX, currentY);
  doc.setTextColor(...black);
  doc.text(formatKES(order.subtotal), margin + contentWidth - 4, currentY, { align: 'right' });

  currentY += 5;

  if (order.discount && order.discount > 0) {
    doc.setTextColor(...grayMuted);
    const codeNotice = order.discountCode ? ` (${order.discountCode})` : '';
    doc.text(`Discount${codeNotice}:`, summaryX, currentY);
    doc.setTextColor(...black);
    doc.text(`-${formatKES(order.discount)}`, margin + contentWidth - 4, currentY, { align: 'right' });
    currentY += 5;
  }

  doc.setTextColor(...grayMuted);
  doc.text('Delivery & Courier:', summaryX, currentY);
  doc.setTextColor(...black);
  const shippingText = order.shippingFee === 0 ? 'FREE (COMPLIMENTARY)' : formatKES(order.shippingFee);
  doc.text(shippingText, margin + contentWidth - 4, currentY, { align: 'right' });

  currentY += 6;

  // Final Total Double Accent Box
  doc.setFillColor(...bgSubtle);
  doc.setDrawColor(...black);
  doc.setLineWidth(0.6);
  doc.rect(summaryX - 4, currentY - 1, summaryBoxWidth + 4, 10, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...black);
  doc.text('ESTIMATED TOTAL:', summaryX, currentY + 5.5);
  doc.setFontSize(10.5);
  doc.text(formatKES(order.total), margin + contentWidth - 4, currentY + 5.5, { align: 'right' });

  currentY += 18;

  // 8. Bottom Footer & Atelier Guarantee
  const footerY = pageHeight - 20;

  doc.setDrawColor(...borderLight);
  doc.setLineWidth(0.4);
  doc.line(margin, footerY - 5, margin + contentWidth, footerY - 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...black);
  doc.text('THANK YOU FOR YOUR PATRONAGE // RADIICATO ATELIER', pageWidth / 2, footerY, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(...grayMuted);
  doc.text(
    'All garments are crafted with heavyweight French terry and premium streetwear textiles. Official receipt of order.',
    pageWidth / 2,
    footerY + 4,
    { align: 'center' }
  );
  doc.text(
    'Studio Support Hotline: +254 706 528 908 • Nairobi, Kenya • radiicato.co.ke',
    pageWidth / 2,
    footerY + 7.5,
    { align: 'center' }
  );

  // Trigger browser download
  const filename = `radiicato-invoice-${order.orderNumber}.pdf`;
  doc.save(filename);
}
