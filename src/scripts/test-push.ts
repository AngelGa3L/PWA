import PollService from '../api/services/PollService';

async function main() {
  console.log('🚀 Creando encuesta de prueba para disparar notificaciones...');
  
  try {
    // Usamos el ID 8 que vimos en tus logs que existe y tiene suscripción
    const creatorId = 8; 

    // NOTA: Angular Service Worker espera que el objeto tenga una propiedad "notification"
    const payload = {
      notification: {
        title: '¡Nueva encuesta disponible!',
        body: 'Esta es una encuesta de prueba (Formato Angular)',
        icon: '/assets/icon/favicon.png',
        vibrate: [100, 50, 100],
        data: {
          url: `/tabs/encuestas`
        }
      }
    };

    // Simulamos lo que hace el PollService internamente para probar el formato
    // Pero como el script usa PollService.createPoll, debemos confiar en que PollService ya fue corregido.
    // Sin embargo, para probar SOLO el envío, podríamos llamar al servicio de push directo, 
    // pero seguiremos usando createPoll para probar el flujo completo.

    const poll = await PollService.createPoll({
      title: 'Encuesta de Prueba Angular 🅰️',
      description: 'Probando formato compatible con ngsw-worker',
      status: 'active',
      creatorId: creatorId 
    });
    
    console.log('✅ Encuesta creada con ID:', poll.id);
    console.log('👀 Revisa tu celular/navegador, deberías recibir la notificación en unos instantes.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main();