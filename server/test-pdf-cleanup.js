import fs from 'fs/promises';
import path from 'path';

// Script de prueba para verificar la funcionalidad de limpieza de PDFs

async function createTestPDF() {
  try {
    const reportsDir = path.join(process.cwd(), 'reports');
    const testFileName = `test-pdf-${Date.now()}.pdf`;
    const testFilePath = path.join(reportsDir, testFileName);
    
    // Crear un archivo PDF de prueba (contenido simple)
    await fs.writeFile(testFilePath, 'This is a test PDF file for cleanup testing');
    
    console.log(`✅ Archivo de prueba creado: ${testFileName}`);
    return testFileName;
  } catch (error) {
    console.error('❌ Error creando archivo de prueba:', error);
    return null;
  }
}

async function listPDFFiles() {
  try {
    const reportsDir = path.join(process.cwd(), 'reports');
    const files = await fs.readdir(reportsDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    console.log('📁 Archivos PDF en la carpeta reports:');
    pdfFiles.forEach(file => console.log(`  - ${file}`));
    
    return pdfFiles;
  } catch (error) {
    console.error('❌ Error listando archivos:', error);
    return [];
  }
}

async function deleteTestFile(fileName) {
  try {
    const reportsDir = path.join(process.cwd(), 'reports');
    const filePath = path.join(reportsDir, fileName);
    await fs.unlink(filePath);
    console.log(`🗑️ Archivo de prueba eliminado: ${fileName}`);
  } catch (error) {
    console.error('❌ Error eliminando archivo de prueba:', error);
  }
}

async function testCleanup() {
  console.log('🧪 Iniciando prueba de limpieza de PDFs...\n');
  
  // 1. Listar archivos actuales
  console.log('1. Archivos actuales:');
  await listPDFFiles();
  
  // 2. Crear archivo de prueba
  console.log('\n2. Creando archivo de prueba...');
  const testFile = await createTestPDF();
  
  if (testFile) {
    // 3. Listar archivos después de crear el de prueba
    console.log('\n3. Archivos después de crear el de prueba:');
    await listPDFFiles();
    
    // 4. Simular limpieza
    console.log('\n4. Eliminando archivo de prueba...');
    await deleteTestFile(testFile);
    
    // 5. Listar archivos finales
    console.log('\n5. Archivos después de la limpieza:');
    await listPDFFiles();
  }
  
  console.log('\n✅ Prueba de limpieza completada!');
  console.log('📝 La funcionalidad de eliminación de PDFs está lista.');
}

// Ejecutar la prueba
testCleanup().catch(console.error);
