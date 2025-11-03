# 📱 PWA de Encuestas Digitales - API Backend

API REST para una Progressive Web App de encuestas digitales con autenticación biométrica y notificaciones push.

## 🚀 Características Implementadas

### ✅ Funcionalidades Completadas

- **Autenticación y Autorización**
  - Login tradicional con JWT
  - Login con autenticación biométrica (WebAuthn)
  - Middleware de verificación de token
  - Middleware de verificación de roles (Admin/User)
  - Todas las rutas protegidas

- **Gestión de Encuestas**
  - CRUD completo de encuestas (Polls)
  - CRUD completo de preguntas (Questions)
  - CRUD completo de opciones (Options)
  - CRUD completo de respuestas (Responses)
  - Relaciones entre modelos

- **Sistema de Usuarios y Roles**
  - CRUD de usuarios
  - CRUD de roles
  - Validaciones de datos

- **Notificaciones Push**
  - Sistema de notificaciones con Web Push
  - Suscripción/cancelación de notificaciones
  - Envío de notificaciones individuales y masivas
  - Gestión de notificaciones en BD

- **Autenticación Biométrica**
  - Habilitar/deshabilitar biometría por usuario
  - Login con huella dactilar (preparado para WebAuthn)
  - Almacenamiento seguro de claves públicas

## 📋 Requisitos Previos

- Node.js >= 16
- MySQL >= 8
- npm o yarn

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd PWA
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones:
```env
DATABASE_URL="mysql://user:password@localhost:3306/pwa_encuestas"
JWT_SECRET_KEY="tu_secret_key_super_segura"
VAPID_PUBLIC_KEY="tu_clave_publica_vapid"
VAPID_PRIVATE_KEY="tu_clave_privada_vapid"
PORT=3000
```

Para generar claves VAPID:
```bash
npx web-push generate-vapid-keys
```

4. **Ejecutar migraciones de base de datos**
```bash
npx prisma migrate dev
```

5. **Generar Prisma Client**
```bash
npx prisma generate
```

## 🏃‍♂️ Ejecutar el Proyecto

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm run build
npm start
```

## 📚 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/login` | Login tradicional | No | - |
| POST | `/biometric/login` | Login con biometría | No | - |
| GET | `/biometric/status` | Estado de biometría del usuario | Sí | User |
| POST | `/biometric/enable` | Habilitar biometría | Sí | User |
| POST | `/biometric/disable` | Deshabilitar biometría | Sí | User |

**Ejemplo - Login:**
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Ejemplo - Login Biométrico:**
```bash
POST /api/auth/biometric/login
{
  "email": "user@example.com",
  "credential": "credential_from_webauthn"
}
```

### 👥 Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Obtener todos los usuarios | Sí | Admin |
| GET | `/:id` | Obtener usuario por ID | Sí | Owner/Admin |
| POST | `/` | Crear nuevo usuario | Sí | Admin |
| PUT | `/:id` | Actualizar usuario | Sí | Owner/Admin |
| DELETE | `/:id` | Eliminar usuario | Sí | Admin |
| GET | `/:id/polls` | Obtener encuestas del usuario | Sí | Owner/Admin |
| GET | `/:id/responses` | Obtener respuestas del usuario | Sí | Owner/Admin |

### 📊 Encuestas (`/api/polls`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Obtener todas las encuestas | Sí | User |
| GET | `/:id` | Obtener encuesta por ID | Sí | User |
| POST | `/` | Crear nueva encuesta | Sí | Admin |
| PUT | `/:id` | Actualizar encuesta | Sí | Admin |
| DELETE | `/:id` | Eliminar encuesta | Sí | Admin |
| GET | `/:id/questions` | Obtener preguntas de encuesta | Sí | User |
| GET | `/:id/responses` | Obtener respuestas de encuesta | Sí | Admin |
| GET | `/user/:userId` | Obtener encuestas por usuario | Sí | Admin |

**Ejemplo - Crear Encuesta:**
```bash
POST /api/polls
Headers: { Authorization: "Bearer <token>" }
{
  "title": "Encuesta de Satisfacción",
  "description": "¿Qué tal estuvo el servicio?",
  "status": "active",
  "creatorId": 1
}
```

### ❓ Preguntas (`/api/questions`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Obtener todas las preguntas | Sí | User |
| GET | `/:id` | Obtener pregunta por ID | Sí | User |
| POST | `/` | Crear nueva pregunta | Sí | Admin |
| PUT | `/:id` | Actualizar pregunta | Sí | Admin |
| DELETE | `/:id` | Eliminar pregunta | Sí | Admin |
| GET | `/:id/options` | Obtener opciones de pregunta | Sí | User |
| GET | `/:id/responses` | Obtener respuestas de pregunta | Sí | Admin |

### ✅ Opciones (`/api/options`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Obtener todas las opciones | Sí | User |
| GET | `/:id` | Obtener opción por ID | Sí | User |
| POST | `/` | Crear nueva opción | Sí | Admin |
| PUT | `/:id` | Actualizar opción | Sí | Admin |
| DELETE | `/:id` | Eliminar opción | Sí | Admin |
| GET | `/:id/responses` | Obtener respuestas de opción | Sí | Admin |

### 💬 Respuestas (`/api/responses`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Obtener todas las respuestas | Sí | Admin |
| GET | `/:id` | Obtener respuesta por ID | Sí | User |
| POST | `/` | Crear nueva respuesta | Sí | User |
| PUT | `/:id` | Actualizar respuesta | Sí | User |
| DELETE | `/:id` | Eliminar respuesta | Sí | Admin |
| GET | `/poll/:pollId` | Obtener respuestas por encuesta | Sí | Admin |
| GET | `/user/:userId` | Obtener respuestas por usuario | Sí | User |

### 🔔 Notificaciones (`/api/notifications`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| POST | `/` | Crear notificación | Sí | Admin |
| GET | `/` | Obtener todas las notificaciones | Sí | Admin |
| GET | `/user/:userId` | Obtener notificaciones de usuario | Sí | User |
| GET | `/pending` | Obtener notificaciones pendientes | Sí | Admin |
| PATCH | `/:id/sent` | Marcar como enviada | Sí | Admin |
| DELETE | `/:id` | Eliminar notificación | Sí | Admin |

**Ejemplo - Crear Notificación:**
```bash
POST /api/notifications
Headers: { Authorization: "Bearer <token>" }
{
  "pollId": 1,
  "title": "Nueva encuesta disponible",
  "body": "¡Tienes una nueva encuesta para responder!",
  "userId": null // null = todos los usuarios
}
```

### 📲 Push Notifications (`/api/push`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/public-key` | Obtener clave pública VAPID | No | - |
| POST | `/subscribe` | Suscribirse a notificaciones | Sí | User |
| POST | `/unsubscribe` | Cancelar suscripción | Sí | User |
| POST | `/send-to-user` | Enviar push a usuario | Sí | Admin |
| POST | `/send-to-all` | Enviar push a todos | Sí | Admin |

**Ejemplo - Suscribirse:**
```bash
POST /api/push/subscribe
Headers: { Authorization: "Bearer <token>" }
{
  "subscription": {
    "endpoint": "https://...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

**Ejemplo - Enviar Push:**
```bash
POST /api/push/send-to-all
Headers: { Authorization: "Bearer <token>" }
{
  "title": "¡Nueva encuesta!",
  "body": "Hay una nueva encuesta disponible",
  "data": {
    "pollId": 1,
    "url": "/polls/1"
  }
}
```

### 🎭 Roles (`/api/roles`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/` | Obtener todos los roles | Sí | Admin |
| GET | `/:id` | Obtener rol por ID | Sí | Admin |
| POST | `/` | Crear nuevo rol | Sí | Admin |
| PUT | `/:id` | Actualizar rol | Sí | Admin |
| DELETE | `/:id` | Eliminar rol | Sí | Admin |

## 🗄️ Modelo de Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema
  - Campos PWA: `biometricEnabled`, `biometricPublicKey`, `pushSubscription`
- **roles** - Roles de usuario (Admin, User)
- **polls** - Encuestas
- **questions** - Preguntas de las encuestas
- **options** - Opciones de respuesta
- **responses** - Respuestas de usuarios
- **notifications** - Notificaciones del sistema

## 🔒 Seguridad

### Roles del Sistema

1. **Admin (roleId = 1)**
   - Crear/editar/eliminar encuestas
   - Ver todas las respuestas y estadísticas
   - Gestionar usuarios
   - Enviar notificaciones

2. **User (roleId = 2)**
   - Ver encuestas disponibles
   - Responder encuestas
   - Ver sus propias respuestas
   - Recibir notificaciones

### Headers Requeridos

Para rutas protegidas, incluir:
```
Authorization: Bearer <tu_token_jwt>
```

## 🔄 Flujo de Trabajo PWA

### 1. Registro e Instalación
```
Usuario se registra → Login → Habilita biometría → Suscribe a push
```

### 2. Uso Diario
```
Admin crea encuesta → Sistema envía notificación push → 
Usuario recibe notif → Usuario responde (online/offline) → 
Sincroniza cuando hay internet
```

### 3. Autenticación Biométrica
```
Usuario abre app → Solicita huella dactilar → 
Backend valida credential → Retorna JWT token
```

## 📱 Integración con Angular + Ionic

### Service Worker (Frontend)
El frontend debe implementar:
- Cache de assets y datos
- IndexedDB para almacenamiento offline
- Sincronización en background
- Registro de Service Worker

### Push Notifications (Frontend)
```typescript
// Obtener clave pública
const response = await fetch('http://localhost:3000/api/push/public-key');
const { data } = await response.json();

// Suscribirse
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: data.publicKey
});

// Guardar suscripción
await fetch('http://localhost:3000/api/push/subscribe', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ subscription })
});
```

### Autenticación Biométrica (Frontend)
```typescript
// WebAuthn - Registro
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: new Uint8Array(32),
    rp: { name: "PWA Encuestas" },
    user: {
      id: new Uint8Array(16),
      name: email,
      displayName: name
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required"
    }
  }
});

// Guardar credential
await fetch('http://localhost:3000/api/auth/biometric/enable', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 
    publicKey: credential.response.publicKey 
  })
});

// Login con biometría
const loginCredential = await navigator.credentials.get({
  publicKey: {
    challenge: new Uint8Array(32),
    userVerification: "required"
  }
});

const response = await fetch('http://localhost:3000/api/auth/biometric/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: email,
    credential: loginCredential
  })
});
```

## 🧪 Testing

### Probar endpoints con cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

**Crear Encuesta:**
```bash
curl -X POST http://localhost:3000/api/polls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title":"Encuesta de Prueba",
    "description":"Descripción",
    "status":"active",
    "creatorId":1
  }'
```

## 📦 Dependencias Principales

```json
{
  "express": "^5.1.0",
  "@prisma/client": "^6.16.3",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^6.0.0",
  "web-push": "^3.6.6",
  "cors": "^2.8.5",
  "express-validator": "^7.2.1"
}
```

## 📝 Notas Importantes

1. **Antes de iniciar el servidor**, asegúrate de:
   - Tener MySQL corriendo
   - Haber ejecutado las migraciones
   - Tener configurado el archivo `.env`
   - Tener al menos un usuario admin en la base de datos

2. **Crear usuario admin inicial:**
```sql
INSERT INTO roles (name, description) VALUES 
  ('admin', 'Administrador del sistema'),
  ('user', 'Usuario regular');

INSERT INTO users (email, firstName, lastName, password, method_login, roleId) VALUES
  ('admin@example.com', 'Admin', 'User', '$2b$10$hashedpassword', 'email', 1);
```

3. **Generar nuevas claves VAPID** si vas a producción:
```bash
npx web-push generate-vapid-keys
```

## 🎯 Próximos Pasos

- [ ] Implementar frontend en Angular + Ionic
- [ ] Configurar Service Worker
- [ ] Implementar IndexedDB para offline
- [ ] Configurar manifest.json
- [ ] Implementar WebAuthn completo
- [ ] Agregar tests unitarios
- [ ] Agregar documentación con Swagger
- [ ] Deploy a producción

## 📄 Licencia

ISC

## 👨‍💻 Autor

AngelGa3L
