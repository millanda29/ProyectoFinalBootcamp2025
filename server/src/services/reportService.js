import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportService = {
  async generateTripReportPDF(trip, user) {
    try {
      // Crear directorio de reportes si no existe
      const reportsDir = path.join(__dirname, '../../reports');
      try {
        await fs.access(reportsDir);
      } catch {
        await fs.mkdir(reportsDir, { recursive: true });
      }

      // Generar el HTML del reporte
      const html = this.generateTripHTML(trip, user);
      
      // Configurar Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      
      // Generar PDF
      const fileName = `trip-${trip._id}-${Date.now()}.pdf`;
      const filePath = path.join(reportsDir, fileName);
      
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });
      
      await browser.close();
      
      return {
        fileName,
        filePath,
        fileUrl: `/reports/${fileName}` // URL relativa para acceso
      };
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      throw new Error('Error al generar el reporte PDF');
    }
  },

  generateTripHTML(trip, user) {
    const startDate = new Date(trip.startDate).toLocaleDateString('es-ES');
    const endDate = new Date(trip.endDate).toLocaleDateString('es-ES');
    const totalBudget = trip.costs.reduce((sum, cost) => sum + (cost.amount * cost.quantity), 0);
    
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reporte de Viaje - ${trip.title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .header h1 {
          margin: 0;
          font-size: 2.5em;
          font-weight: 300;
        }
        
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
          font-size: 1.1em;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .info-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .info-card h3 {
          margin: 0 0 10px 0;
          color: #667eea;
          font-size: 1.2em;
        }
        
        .info-card p {
          margin: 5px 0;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section h2 {
          color: #333;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        
        .day-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .day-header {
          background: #667eea;
          color: white;
          padding: 10px 15px;
          margin: -20px -20px 15px -20px;
          border-radius: 8px 8px 0 0;
          font-weight: bold;
        }
        
        .activity {
          background: #f8f9fa;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 6px;
          border-left: 4px solid #28a745;
        }
        
        .activity h4 {
          margin: 0 0 8px 0;
          color: #333;
        }
        
        .activity-meta {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 5px;
        }
        
        .costs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        
        .costs-table th,
        .costs-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .costs-table th {
          background: #667eea;
          color: white;
          font-weight: bold;
        }
        
        .costs-table tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .total-row {
          background: #e8f4f8 !important;
          font-weight: bold;
          border-top: 2px solid #667eea;
        }
        
        .footer {
          text-align: center;
          margin-top: 40px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          color: #666;
        }
        
        .generated-info {
          font-size: 0.9em;
          color: #888;
          margin-top: 20px;
        }
        
        @media print {
          .day-card {
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🌟 ${trip.title}</h1>
        <p>Reporte de Viaje Generado por TravelMate</p>
      </div>
      
      <div class="container">
        <div class="info-grid">
          <div class="info-card">
            <h3>📍 Destino</h3>
            <p><strong>${trip.destination}</strong></p>
          </div>
          
          <div class="info-card">
            <h3>📅 Fechas</h3>
            <p><strong>Inicio:</strong> ${startDate}</p>
            <p><strong>Fin:</strong> ${endDate}</p>
          </div>
          
          <div class="info-card">
            <h3>👥 Viajeros</h3>
            <p><strong>${trip.partySize} persona(s)</strong></p>
          </div>
          
          <div class="info-card">
            <h3>💰 Presupuesto Total</h3>
            <p><strong>$${totalBudget.toFixed(2)} USD</strong></p>
          </div>
        </div>
        
        ${trip.itinerary && trip.itinerary.length > 0 ? `
        <div class="section">
          <h2>📋 Itinerario Detallado</h2>
          ${trip.itinerary.map(day => `
            <div class="day-card">
              <div class="day-header">
                Día ${day.dayNumber}
              </div>
              ${day.notes ? `<p><em>${day.notes}</em></p>` : ''}
              ${day.activities && day.activities.length > 0 ? 
                day.activities.map(activity => `
                  <div class="activity">
                    <h4>${activity.title}</h4>
                    ${activity.startTime || activity.endTime ? 
                      `<div class="activity-meta">
                        ${activity.startTime ? `🕐 ${activity.startTime}` : ''} 
                        ${activity.endTime ? `- ${activity.endTime}` : ''}
                      </div>` : ''
                    }
                    ${activity.location ? `<div class="activity-meta">📍 ${activity.location}</div>` : ''}
                    ${activity.category ? `<div class="activity-meta">🏷️ ${activity.category}</div>` : ''}
                  </div>
                `).join('') : '<p><em>No hay actividades programadas para este día</em></p>'
              }
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${trip.costs && trip.costs.length > 0 ? `
        <div class="section">
          <h2>💳 Desglose de Costos</h2>
          <table class="costs-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${trip.costs.map(cost => `
                <tr>
                  <td>${cost.label}</td>
                  <td>${this.translateCostType(cost.type)}</td>
                  <td>${cost.quantity}</td>
                  <td>$${cost.amount.toFixed(2)} ${cost.currency}</td>
                  <td>$${(cost.amount * cost.quantity).toFixed(2)} ${cost.currency}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4"><strong>TOTAL GENERAL</strong></td>
                <td><strong>$${totalBudget.toFixed(2)} USD</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        ` : ''}
        
        <div class="footer">
          <p>¡Que tengas un excelente viaje! 🧳✈️</p>
          <div class="generated-info">
            <p>Reporte generado por TravelMate para <strong>${user.fullName}</strong></p>
            <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  },

  translateCostType(type) {
    const translations = {
      'lodging': '🏨 Alojamiento',
      'transport': '🚗 Transporte', 
      'activity': '🎯 Actividad',
      'other': '📦 Otros'
    };
    return translations[type] || type;
  },

  async deletePDFFile(filePath) {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Error eliminando archivo PDF:', error);
      return false;
    }
  },

  // Función para eliminar un archivo PDF específico
  async deletePDFFile(fileUrl) {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(process.cwd(), 'reports', fileName);
      await fs.unlink(filePath);
      console.log(`✅ PDF eliminado exitosamente: ${fileName}`);
      return true;
    } catch (error) {
      console.error(`❌ Error eliminando PDF ${fileUrl}:`, error.message);
      return false;
    }
  },

  // Función para limpiar PDFs huérfanos (opcional, para mantenimiento)
  async cleanOrphanedPDFs(existingReports = []) {
    try {
      const reportsDir = path.join(process.cwd(), 'reports');
      const files = await fs.readdir(reportsDir);
      const pdfFiles = files.filter(file => file.endsWith('.pdf'));
      
      const validFiles = existingReports.map(report => path.basename(report.fileUrl));
      const orphanedFiles = pdfFiles.filter(file => !validFiles.includes(file));
      
      let deletedCount = 0;
      for (const file of orphanedFiles) {
        try {
          await fs.unlink(path.join(reportsDir, file));
          deletedCount++;
        } catch (error) {
          console.warn(`⚠️ No se pudo eliminar PDF huérfano: ${file}`, error.message);
        }
      }
      
      console.log(`🧹 Limpieza completada: ${deletedCount} PDFs huérfanos eliminados`);
      return deletedCount;
    } catch (error) {
      console.error('Error durante la limpieza de PDFs:', error);
      return 0;
    }
  }
};

export default reportService;
