# 🐆 Amigo Jaguar — Portal Estudiantil FMAT UADY

**Amigo Jaguar** es una plataforma web interactiva de orientación, consulta y central de recursos diseñada para estudiantes del Campus de Ciencias Exactas e Ingenierías (FMAT - UADY). Permite a los alumnos de nuevo ingreso (o de cualquier semestre en general) enviar dudas de manera 100% anónima, consultar el avance de sus preguntas mediante un código de seguimiento único (`#JAG-XXXX`) y leer respuestas redactadas y empapadas de la sabiduría de estudiantes de semestres avanzados.


## 🚀 Tecnologías Utilizadas

* **Framework:** Next.js (App Router) con React y TypeScript.
* **Estilos:** CSS Modules aislados (`*.module.css`) con la paleta de colores oficial UADY ( #002E5F, #D97706, #F8FAFC).
* **Base de Datos & Autenticación:** Supabase (PostgreSQL) con políticas Row Level Security (RLS) y Supabase Auth.
* **Seguridad & Anti-Spam:** Cloudflare Turnstile (Captcha invisible en servidor) + Filtro customizado de lenguaje (Profanity).
* **Interfaz & Utilidades:** Lucide React (iconografía adaptativa) y React Markdown.


## 📋 Requisitos Previos

Antes de clonar e instalar el proyecto, asegúrate de contar con:
* **Node.js**: Versión 18.17.0 o superior.
* **Git**: Para el control de versiones.
* **Un editor de código**: Recomendado Visual Studio Code.


## 🛠️ Instalación y Configuración Local

Sigue estos pasos según el sistema operativo que utilices (**macOS**, **Linux** o **Windows**):

### 1. Clonar el repositorio y acceder a la carpeta
Abre tu terminal (Terminal en macOS/Linux, Git Bash o PowerShell en Windows) y ejecuta:

```
git clone [https://github.com/criscnsn/amigo-jaguar.git]
cd amigo-jaguar
```
### 2. Instalar las dependencias
```
npm install
```
### 3. Configurar variables de entorno (.env.local)
El proyecto requiere claves de conexión a Supabase y Cloudflare Turnstile. Copia la plantilla .env.example para generar tu archivo .env.local:

+ **En macOS / Linux / Git Bash:**
```
cp .env.example .env.local
```

+ **En Windows (CMD / D.O.S.):**
```
copy .env.example .env.local
```

+ **En Windows (PowerShell):**
```
Copy-Item .env.example .env.local
```

+ **Método Manual (Cualquier Sistema Operativo):** \
Crea un archivo nuevo en la raíz del proyecto llamado ``.env.local`` y copia dentro el contenido de ``.env.example.``
Abre ``.env.local`` en tu editor de código y completa los valores con las claves proporcionadas por el administrador del proyecto:

```
NEXT_PUBLIC_SUPABASE_URL=[https://tu-proyecto.supabase.co]
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
NEXT_PUBLIC_TURNSTILE_SITE_KEY=tu-site-key-aqui
TURNSTILE_SECRET_KEY=tu-secret-key-aqui
```
### 4. Iniciar el servidor de desarrollo
``` 
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abre http://localhost:3000 en tu navegador para ver la aplicación corriendo localmente.


# 📜 Reglas de Contribución para Colaboradores
## 1. Ramas:

+ main: Código estable de producción. No hacer commits directos sobre esta rama.

+ dev: Rama activa de desarrollo. Todos los cambios deben integrarse mediante Pull Requests dirigidos a dev.


## Filtraciones:

+ Jamás incluir credenciales reales ni subir el archivo .env.local al repositorio PORFAVOR.

## pendiente
+ sigo pensando en reglas kkk