import cron from 'node-cron';
import userService from '../services/userService.js';
import logger from '../utils/logger.js';

/**
 * Tarea programada para procesar eliminaciones de cuentas
 * Se ejecuta diariamente a las 2:00 AM
 */
export function startScheduledDeletionTask() {
  // Ejecutar todos los días a las 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info('Iniciando procesamiento de eliminaciones programadas...');
      
      const deletedUsers = await userService.processScheduledDeletions();
      
      if (deletedUsers.length > 0) {
        logger.info(`Se eliminaron ${deletedUsers.length} cuentas programadas:`, {
          deletedUsers: deletedUsers.map(user => ({
            id: user.id,
            email: user.email,
            scheduledDate: user.scheduledDate
          }))
        });
      } else {
        logger.info('No hay cuentas programadas para eliminación en este momento');
      }
      
    } catch (error) {
      logger.error('Error procesando eliminaciones programadas:', error);
    }
  }, {
    timezone: "America/Argentina/Buenos_Aires"
  });
  
  logger.info('Tarea de eliminaciones programadas iniciada - se ejecutará diariamente a las 2:00 AM');
}

/**
 * Función manual para probar el procesamiento de eliminaciones
 */
export async function processScheduledDeletionsNow() {
  try {
    logger.info('Procesando eliminaciones programadas manualmente...');
    const deletedUsers = await userService.processScheduledDeletions();
    
    logger.info(`Procesamiento manual completado. ${deletedUsers.length} cuentas eliminadas.`);
    return deletedUsers;
  } catch (error) {
    logger.error('Error en procesamiento manual de eliminaciones:', error);
    throw error;
  }
}
