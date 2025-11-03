import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...\n');

  // Limpiar datos existentes (opcional - comentar si no quieres borrar)
  console.log('🗑️  Limpiando datos existentes...');
  await prisma.responses.deleteMany();
  await prisma.options.deleteMany();
  await prisma.questions.deleteMany();
  await prisma.notifications.deleteMany();
  await prisma.polls.deleteMany();
  await prisma.users.deleteMany();
  await prisma.roles.deleteMany();
  console.log('✅ Datos limpiados\n');

  // Crear roles
  console.log('👥 Creando roles...');
  const adminRole = await prisma.roles.create({
    data: {
      name: 'admin',
      description: 'Administrador del sistema con acceso completo',
    },
  });

  const userRole = await prisma.roles.create({
    data: {
      name: 'user',
      description: 'Usuario regular que puede responder encuestas',
    },
  });
  console.log('✅ Roles creados:', adminRole.name, ',', userRole.name, '\n');

  // Crear usuarios
  console.log('👤 Creando usuarios...');
  
  // Admin
  const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.users.create({
    data: {
      email: 'admin@pwaencuestas.com',
      firstName: 'Admin',
      lastName: 'System',
      password: hashedAdminPassword,
      method_login: 'email',
      roleId: adminRole.id,
      biometricEnabled: false,
    },
  });
  console.log('✅ Admin creado:', admin.email, '/ Password: Admin123!');

  // Usuario de prueba 1
  const hashedUserPassword = await bcrypt.hash('User123!', 10);
  const user1 = await prisma.users.create({
    data: {
      email: 'user1@test.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      password: hashedUserPassword,
      method_login: 'email',
      roleId: userRole.id,
      biometricEnabled: false,
    },
  });
  console.log('✅ Usuario 1 creado:', user1.email, '/ Password: User123!');

  // Usuario de prueba 2
  const user2 = await prisma.users.create({
    data: {
      email: 'user2@test.com',
      firstName: 'María',
      lastName: 'García',
      password: hashedUserPassword,
      method_login: 'email',
      roleId: userRole.id,
      biometricEnabled: true,
      biometricPublicKey: 'fake_public_key_for_testing',
    },
  });
  console.log('✅ Usuario 2 creado:', user2.email, '/ Password: User123! (Biometría habilitada)\n');

  // Crear encuestas
  console.log('📊 Creando encuestas...');
  
  // Encuesta 1: Satisfacción del servicio
  const poll1 = await prisma.polls.create({
    data: {
      title: 'Encuesta de Satisfacción',
      description: 'Ayúdanos a mejorar nuestro servicio',
      status: 'active',
      creatorId: admin.id,
    },
  });
  console.log('✅ Encuesta 1:', poll1.title);

  // Pregunta 1 de Encuesta 1
  const q1p1 = await prisma.questions.create({
    data: {
      type: 'multiple-choice',
      pollId: poll1.id,
      title: '¿Cómo calificarías nuestro servicio?',
    },
  });

  await prisma.options.createMany({
    data: [
      { questionId: q1p1.id, text: 'Excelente' },
      { questionId: q1p1.id, text: 'Bueno' },
      { questionId: q1p1.id, text: 'Regular' },
      { questionId: q1p1.id, text: 'Malo' },
      { questionId: q1p1.id, text: 'Muy malo' },
    ],
  });

  // Pregunta 2 de Encuesta 1
  const q2p1 = await prisma.questions.create({
    data: {
      type: 'multiple-choice',
      pollId: poll1.id,
      title: '¿Recomendarías nuestro servicio?',
    },
  });

  await prisma.options.createMany({
    data: [
      { questionId: q2p1.id, text: 'Definitivamente sí' },
      { questionId: q2p1.id, text: 'Probablemente sí' },
      { questionId: q2p1.id, text: 'No estoy seguro' },
      { questionId: q2p1.id, text: 'Probablemente no' },
      { questionId: q2p1.id, text: 'Definitivamente no' },
    ],
  });

  // Encuesta 2: Feedback de la app
  const poll2 = await prisma.polls.create({
    data: {
      title: 'Feedback de la Aplicación',
      description: 'Tu opinión sobre la PWA',
      status: 'active',
      creatorId: admin.id,
    },
  });
  console.log('✅ Encuesta 2:', poll2.title);

  // Pregunta 1 de Encuesta 2
  const q1p2 = await prisma.questions.create({
    data: {
      type: 'multiple-choice',
      pollId: poll2.id,
      title: '¿Qué te parece la interfaz de la app?',
    },
  });

  await prisma.options.createMany({
    data: [
      { questionId: q1p2.id, text: 'Muy intuitiva' },
      { questionId: q1p2.id, text: 'Fácil de usar' },
      { questionId: q1p2.id, text: 'Normal' },
      { questionId: q1p2.id, text: 'Complicada' },
      { questionId: q1p2.id, text: 'Muy confusa' },
    ],
  });

  // Pregunta 2 de Encuesta 2
  const q2p2 = await prisma.questions.create({
    data: {
      type: 'multiple-choice',
      pollId: poll2.id,
      title: '¿Usarías la autenticación biométrica?',
    },
  });

  const optionsQ2P2 = await prisma.options.createMany({
    data: [
      { questionId: q2p2.id, text: 'Sí, es muy conveniente' },
      { questionId: q2p2.id, text: 'Tal vez' },
      { questionId: q2p2.id, text: 'No, prefiero contraseña' },
    ],
  });

  // Encuesta 3: Inactiva
  const poll3 = await prisma.polls.create({
    data: {
      title: 'Encuesta Cerrada',
      description: 'Esta encuesta ya finalizó',
      status: 'closed',
      creatorId: admin.id,
    },
  });
  console.log('✅ Encuesta 3:', poll3.title, '(cerrada)\n');

  // Crear algunas respuestas de ejemplo
  console.log('💬 Creando respuestas de ejemplo...');
  
  // Obtener opciones para crear respuestas
  const options = await prisma.options.findMany();
  
  // Usuario 1 responde a la primera pregunta
  await prisma.responses.create({
    data: {
      pollId: poll1.id,
      questionId: q1p1.id,
      userId: user1.id,
      optionId: options[0].id, // Excelente
      response: 'Excelente',
    },
  });

  // Usuario 2 responde a la primera pregunta
  await prisma.responses.create({
    data: {
      pollId: poll1.id,
      questionId: q1p1.id,
      userId: user2.id,
      optionId: options[1].id, // Bueno
      response: 'Bueno',
    },
  });
  console.log('✅ Respuestas creadas\n');

  // Crear notificaciones de ejemplo
  console.log('🔔 Creando notificaciones...');
  
  await prisma.notifications.create({
    data: {
      userId: null, // Notificación global
      pollId: poll1.id,
      title: '¡Nueva encuesta disponible!',
      body: 'Responde la encuesta de satisfacción',
      sent: true,
    },
  });

  await prisma.notifications.create({
    data: {
      userId: user1.id, // Notificación específica
      pollId: poll2.id,
      title: 'Tu opinión es importante',
      body: 'No olvides responder la encuesta de feedback',
      sent: false,
    },
  });
  console.log('✅ Notificaciones creadas\n');

  // Resumen
  console.log('📊 RESUMEN DE DATOS CREADOS:');
  console.log('================================');
  
  const rolesCount = await prisma.roles.count();
  const usersCount = await prisma.users.count();
  const pollsCount = await prisma.polls.count();
  const questionsCount = await prisma.questions.count();
  const optionsCount = await prisma.options.count();
  const responsesCount = await prisma.responses.count();
  const notificationsCount = await prisma.notifications.count();

  console.log(`✅ Roles: ${rolesCount}`);
  console.log(`✅ Usuarios: ${usersCount}`);
  console.log(`✅ Encuestas: ${pollsCount}`);
  console.log(`✅ Preguntas: ${questionsCount}`);
  console.log(`✅ Opciones: ${optionsCount}`);
  console.log(`✅ Respuestas: ${responsesCount}`);
  console.log(`✅ Notificaciones: ${notificationsCount}`);
  console.log('================================\n');

  console.log('🎉 SEED COMPLETADO EXITOSAMENTE\n');
  
  console.log('📝 CREDENCIALES DE ACCESO:');
  console.log('================================');
  console.log('👨‍💼 ADMIN:');
  console.log('   Email: admin@pwaencuestas.com');
  console.log('   Password: Admin123!');
  console.log('');
  console.log('👤 USUARIOS DE PRUEBA:');
  console.log('   Email: user1@test.com');
  console.log('   Password: User123!');
  console.log('');
  console.log('   Email: user2@test.com');
  console.log('   Password: User123!');
  console.log('   (Biometría habilitada)');
  console.log('================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
