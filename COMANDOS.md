# 🛠️ COMANDOS ÚTILES - PWA Encuestas API

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env
# Edita .env con tus credenciales

# 3. Crear base de datos
mysql -u root -p -e "CREATE DATABASE pwa_encuestas;"

# 4. Ejecutar migración
npx prisma migrate dev

# 5. Generar Prisma Client
npx prisma generate

# 6. Seed de datos (opcional)
npm run seed

# 7. Iniciar servidor
npm run dev
```

---

## 📦 NPM Scripts

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm run build
npm start

# Seed de base de datos
npm run seed

# Tests (por implementar)
npm test
```

---

## 🗄️ Prisma Commands

```bash
# Ver base de datos en navegador (http://localhost:5555)
npx prisma studio

# Generar Prisma Client (después de cambiar schema)
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones en producción
npx prisma migrate deploy

# Reset de base de datos (CUIDADO!)
npx prisma migrate reset

# Ver estado de migraciones
npx prisma migrate status

# Formatear schema.prisma
npx prisma format

# Validar schema
npx prisma validate
```

---

## 🔔 Web Push Commands

```bash
# Generar nuevas claves VAPID
npx web-push generate-vapid-keys

# Ejemplo de salida:
# Public Key: BJZHUJe...
# Private Key: 1T_qZVb...
```

---

## 🧪 Testing con cURL

### Login
```bash
# Login tradicional
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pwaencuestas.com",
    "password": "Admin123!"
  }'

# Guardar el token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Users
```bash
# Obtener todos los usuarios (admin)
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"

# Obtener usuario por ID
curl http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer $TOKEN"

# Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@test.com",
    "firstName": "Nuevo",
    "lastName": "Usuario",
    "password": "Password123!",
    "roleId": 2
  }'
```

### Polls
```bash
# Obtener todas las encuestas
curl http://localhost:3000/api/polls \
  -H "Authorization: Bearer $TOKEN"

# Crear encuesta (admin)
curl -X POST http://localhost:3000/api/polls \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva Encuesta",
    "description": "Descripción de la encuesta",
    "status": "active",
    "creatorId": 1
  }'

# Obtener encuesta por ID
curl http://localhost:3000/api/polls/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Push Notifications
```bash
# Obtener clave pública VAPID (público)
curl http://localhost:3000/api/push/public-key

# Suscribirse a push
curl -X POST http://localhost:3000/api/push/subscribe \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subscription": {
      "endpoint": "https://fcm.googleapis.com/fcm/send/...",
      "keys": {
        "p256dh": "...",
        "auth": "..."
      }
    }
  }'

# Enviar push a todos (admin)
curl -X POST http://localhost:3000/api/push/send-to-all \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "¡Nueva encuesta!",
    "body": "Hay una nueva encuesta disponible",
    "data": {
      "pollId": 1,
      "url": "/polls/1"
    }
  }'
```

### Notifications
```bash
# Crear notificación (admin)
curl -X POST http://localhost:3000/api/notifications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pollId": 1,
    "title": "Nueva encuesta",
    "body": "¡Responde ahora!",
    "userId": null
  }'

# Obtener notificaciones de un usuario
curl http://localhost:3000/api/notifications/user/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Biometric
```bash
# Obtener estado de biometría
curl http://localhost:3000/api/auth/biometric/status \
  -H "Authorization: Bearer $TOKEN"

# Habilitar biometría
curl -X POST http://localhost:3000/api/auth/biometric/enable \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "publicKey": "public_key_from_webauthn"
  }'

# Login con biometría
curl -X POST http://localhost:3000/api/auth/biometric/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "credential": "credential_from_webauthn"
  }'
```

---

## 🗄️ MySQL Commands

```bash
# Conectar a MySQL
mysql -u root -p

# Crear base de datos
CREATE DATABASE pwa_encuestas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Usar base de datos
USE pwa_encuestas;

# Ver tablas
SHOW TABLES;

# Ver estructura de tabla
DESCRIBE users;

# Ver datos
SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM polls;
SELECT * FROM notifications;

# Contar registros
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM polls;

# Ver usuarios con sus roles
SELECT u.id, u.email, u.firstName, u.lastName, r.name as role
FROM users u
JOIN roles r ON u.roleId = r.id;

# Ver encuestas con creador
SELECT p.id, p.title, p.status, u.email as creator
FROM polls p
JOIN users u ON p.creatorId = u.id;

# Ver notificaciones
SELECT n.id, n.title, n.sent, p.title as poll, u.email as user
FROM notifications n
LEFT JOIN users u ON n.userId = u.id
JOIN polls p ON n.pollId = p.id;

# Eliminar base de datos (CUIDADO!)
DROP DATABASE pwa_encuestas;
```

---

## 🔧 Git Commands

```bash
# Ver estado
git status

# Ver cambios
git diff

# Agregar archivos
git add .

# Commit
git commit -m "feat: implementar sistema de notificaciones push"

# Push
git push origin main

# Ver historial
git log --oneline

# Ver ramas
git branch

# Crear rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main
```

---

## 🐳 Docker (Opcional)

```bash
# Crear Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOF

# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: pwa_encuestas
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  api:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    environment:
      DATABASE_URL: mysql://root:root@mysql:3306/pwa_encuestas
      JWT_SECRET_KEY: your_secret_key
      VAPID_PUBLIC_KEY: your_public_key
      VAPID_PRIVATE_KEY: your_private_key

volumes:
  mysql_data:
EOF

# Iniciar con Docker
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

---

## 📊 Postman Collection

```bash
# Importar esta colección en Postman:
# File > Import > Raw text

{
  "info": {
    "name": "PWA Encuestas API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@pwaencuestas.com\",\n  \"password\": \"Admin123!\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🛠️ Troubleshooting

```bash
# Error: Can't reach database server
# Solución: Verificar que MySQL esté corriendo
sudo service mysql status  # Linux
# Iniciar MySQL desde XAMPP (Windows)

# Error: Module not found '../generated/prisma'
# Solución: Generar Prisma Client
npx prisma generate

# Error: P3009 - Database already exists
# Solución: Solo aplicar migraciones
npx prisma migrate dev

# Error: JWT_SECRET_KEY is undefined
# Solución: Verificar archivo .env
cat .env | grep JWT_SECRET_KEY

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Ver puertos en uso (Linux/Mac)
lsof -i :3000

# Ver puertos en uso (Windows)
netstat -ano | findstr :3000

# Matar proceso en puerto 3000 (Linux/Mac)
kill -9 $(lsof -ti:3000)

# Matar proceso en puerto 3000 (Windows)
# Encuentra el PID con netstat y luego:
taskkill /PID <PID> /F
```

---

## 📝 Variables de Entorno

```bash
# Ver todas las variables
printenv

# Ver variable específica
echo $DATABASE_URL

# Exportar variable temporal
export DATABASE_URL="mysql://root:password@localhost:3306/pwa_encuestas"

# Editar .env
nano .env
# o
vim .env
# o
code .env
```

---

## 🔍 Logs y Debugging

```bash
# Ver logs en tiempo real
npm run dev

# Agregar debug en código
console.log('Debug:', variable);
console.error('Error:', error);
console.table(array);

# Node.js debugging
node --inspect index.js

# Con nodemon
nodemon --inspect index.ts
```

---

## 📦 Actualizaciones

```bash
# Ver paquetes desactualizados
npm outdated

# Actualizar un paquete específico
npm update prisma

# Actualizar todos los paquetes (cuidado!)
npm update

# Instalar versión específica
npm install prisma@6.16.3

# Desinstalar paquete
npm uninstall package-name

# Limpiar caché de npm
npm cache clean --force
```

---

## 🎯 Quick Reference

```bash
# Iniciar todo desde cero
mysql -u root -p -e "CREATE DATABASE pwa_encuestas;"
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma generate
npm run seed
npm run dev

# Resetear base de datos
npx prisma migrate reset
npm run seed

# Ver base de datos
npx prisma studio

# Test rápido
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pwaencuestas.com","password":"Admin123!"}'
```

---

**💡 Tip**: Guarda este archivo en favoritos para referencia rápida.
