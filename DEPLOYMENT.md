# 🚀 INSTRUCCIONES DE DEPLOYMENT

## 📋 Checklist Pre-Deployment

### 1. Configurar Base de Datos MySQL

```bash
# Iniciar MySQL
# Windows: Inicia XAMPP o MySQL Workbench
# Linux: sudo service mysql start

# Crear la base de datos
mysql -u root -p
```

```sql
CREATE DATABASE pwa_encuestas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. Configurar Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto:

```bash
# Copia el ejemplo
cp .env.example .env
```

Edita `.env` con tus datos:

```env
# Database - IMPORTANTE: Actualiza con tus credenciales
DATABASE_URL="mysql://root:tu_password@localhost:3306/pwa_encuestas"

# JWT Secret - IMPORTANTE: Cambia esto por un secreto único
JWT_SECRET_KEY="un_secreto_super_seguro_cambiar_en_produccion"

# VAPID Keys - Estas ya están generadas, o genera nuevas con: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY="BJZHUJeVuvFqJ51oirBVhAVYZLEBREHikfsdAV5q1A6W-1dIRu6MFRfIh4cbgUkV4z-48ekc13Q0GfM1mqu3a1Y"
VAPID_PRIVATE_KEY="1T_qZVbrv4Hdx1JT39Caz14GxxEPke0oMgPHphbrry4"

# Server
PORT=3000
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar Migraciones de Prisma

```bash
# Esto creará todas las tablas en la base de datos
npx prisma migrate dev --name add_pwa_features

# Generar el Prisma Client
npx prisma generate
```

### 5. Seed de Datos Iniciales (Opcional)

Crea el archivo `prisma/seed.ts`:

```typescript
import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear roles
  const adminRole = await prisma.roles.create({
    data: {
      name: 'admin',
      description: 'Administrador del sistema',
    },
  });

  const userRole = await prisma.roles.create({
    data: {
      name: 'user',
      description: 'Usuario regular',
    },
  });

  console.log('✅ Roles creados');

  // Crear usuario admin
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.users.create({
    data: {
      email: 'admin@pwaencuestas.com',
      firstName: 'Admin',
      lastName: 'System',
      password: hashedPassword,
      method_login: 'email',
      roleId: adminRole.id,
    },
  });

  console.log('✅ Usuario admin creado:', admin.email);

  // Crear usuario de prueba
  const userPassword = await bcrypt.hash('User123!', 10);
  const testUser = await prisma.users.create({
    data: {
      email: 'user@test.com',
      firstName: 'Test',
      lastName: 'User',
      password: userPassword,
      method_login: 'email',
      roleId: userRole.id,
    },
  });

  console.log('✅ Usuario de prueba creado:', testUser.email);

  // Crear una encuesta de ejemplo
  const poll = await prisma.polls.create({
    data: {
      title: 'Encuesta de Satisfacción',
      description: '¿Qué te pareció el servicio?',
      status: 'active',
      creatorId: admin.id,
    },
  });

  console.log('✅ Encuesta creada:', poll.title);

  // Crear pregunta
  const question = await prisma.questions.create({
    data: {
      type: 'multiple-choice',
      pollId: poll.id,
      title: '¿Cómo calificarías nuestro servicio?',
    },
  });

  console.log('✅ Pregunta creada');

  // Crear opciones
  await prisma.options.createMany({
    data: [
      { questionId: question.id, text: 'Excelente' },
      { questionId: question.id, text: 'Bueno' },
      { questionId: question.id, text: 'Regular' },
      { questionId: question.id, text: 'Malo' },
    ],
  });

  console.log('✅ Opciones creadas');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Agrega el script en `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

Ejecuta el seed:

```bash
npm run seed
```

### 6. Verificar la Instalación

```bash
# Abrir Prisma Studio para ver los datos
npx prisma studio

# Esto abrirá http://localhost:5555 donde puedes ver todas las tablas
```

### 7. Iniciar el Servidor

```bash
# Modo desarrollo
npm run dev

# El servidor estará en http://localhost:3000
```

### 8. Probar la API

```bash
# Test 1: Health check (crea un endpoint primero)
curl http://localhost:3000/

# Test 2: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pwaencuestas.com",
    "password": "Admin123!"
  }'

# Guarda el token que retorna
TOKEN="el_token_que_retorna"

# Test 3: Obtener todas las encuestas
curl http://localhost:3000/api/polls \
  -H "Authorization: Bearer $TOKEN"

# Test 4: Obtener clave pública VAPID
curl http://localhost:3000/api/push/public-key
```

## 🔧 Troubleshooting

### Error: Can't reach database server

```bash
# Verifica que MySQL esté corriendo
# Windows (XAMPP): Inicia MySQL desde el panel
# Linux: sudo service mysql status

# Verifica la conexión
mysql -u root -p -e "SELECT 1;"
```

### Error: P3009 - Database already exists

```bash
# La base de datos ya existe
# Solo ejecuta:
npx prisma migrate dev
```

### Error: Module not found '../generated/prisma'

```bash
# Genera el Prisma Client
npx prisma generate
```

### Error: JWT_SECRET_KEY is undefined

```bash
# Verifica que el archivo .env existe y tiene JWT_SECRET_KEY
cat .env | grep JWT_SECRET_KEY
```

## 📊 Verificar que Todo Funciona

### 1. Verificar Tablas en MySQL

```sql
USE pwa_encuestas;

SHOW TABLES;
-- Deberías ver:
-- - users
-- - roles
-- - polls
-- - questions
-- - options
-- - responses
-- - notifications
-- - _prisma_migrations

SELECT * FROM roles;
SELECT email, firstName, lastName, roleId FROM users;
```

### 2. Verificar Endpoints

Usa Postman o Thunder Client en VS Code para probar todos los endpoints del README.md

### 3. Verificar CORS

```javascript
// Desde la consola del navegador
fetch('http://localhost:3000/api/push/public-key')
  .then(r => r.json())
  .then(console.log);
```

## 🚀 Deploy a Producción

### Opción 1: VPS (DigitalOcean, AWS EC2, etc.)

```bash
# En el servidor
git clone tu-repo
cd PWA
npm install
npm run build

# Configurar .env en producción
# IMPORTANTE: Cambia JWT_SECRET_KEY y VAPID_KEYS

# Ejecutar migraciones
npx prisma migrate deploy

# Usar PM2 para mantener el servidor vivo
npm install -g pm2
pm2 start npm --name "pwa-api" -- start
pm2 save
pm2 startup
```

### Opción 2: Heroku

```bash
# Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Crear app
heroku create pwa-encuestas-api

# Agregar MySQL addon
heroku addons:create jawsdb:kitefin

# Configurar variables de entorno
heroku config:set JWT_SECRET_KEY="tu_secreto"
heroku config:set VAPID_PUBLIC_KEY="tu_clave_publica"
heroku config:set VAPID_PRIVATE_KEY="tu_clave_privada"

# Deploy
git push heroku main

# Ejecutar migraciones
heroku run npx prisma migrate deploy
```

### Opción 3: Railway

```bash
# 1. Conecta tu repo a Railway.app
# 2. Railway detectará automáticamente Node.js
# 3. Agrega MySQL database en Railway
# 4. Configura las variables de entorno
# 5. Railway hará deploy automáticamente
```

## 🔒 Seguridad en Producción

### 1. Variables de Entorno

```bash
# NUNCA subas el archivo .env al repositorio
# Asegúrate de que está en .gitignore

echo ".env" >> .gitignore
```

### 2. Generar Nuevos Secretos

```bash
# Nuevo JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Nuevas claves VAPID
npx web-push generate-vapid-keys
```

### 3. HTTPS

```bash
# En producción, usa HTTPS siempre
# Usa Let's Encrypt para certificados gratuitos
# O usa servicios como Cloudflare
```

### 4. Rate Limiting

Instala rate limiting:

```bash
npm install express-rate-limit
```

```typescript
// En index.ts
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por IP
});

app.use(limiter);
```

## 📈 Monitoreo

### Logs con PM2

```bash
# Ver logs
pm2 logs pwa-api

# Monitorear
pm2 monit
```

### Prisma Studio en Producción

```bash
# NO expongas Prisma Studio en producción
# Úsalo solo localmente con SSH tunnel
ssh -L 5555:localhost:5555 user@tu-servidor
npx prisma studio
```

## ✅ Checklist Final

- [ ] MySQL instalado y corriendo
- [ ] Base de datos creada
- [ ] Archivo .env configurado
- [ ] Dependencias instaladas
- [ ] Migraciones ejecutadas
- [ ] Prisma Client generado
- [ ] Seed ejecutado (opcional)
- [ ] Servidor iniciado
- [ ] Endpoints probados
- [ ] CORS verificado
- [ ] Usuario admin creado
- [ ] Documentación leída

## 🎉 ¡Listo!

Tu backend API está listo para recibir peticiones del frontend Angular + Ionic.

Próximos pasos:
1. Desarrollar el frontend
2. Implementar Service Worker
3. Crear manifest.json
4. Configurar WebAuthn
5. ¡Probar la PWA completa!

---

**Cualquier problema, revisa el README.md o los logs del servidor.**
