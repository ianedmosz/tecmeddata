# TecMed Data

Plataforma web para que los ingenieros y tecnicos biomedicos de **TecSalud**
sepan, en segundos, si un equipo medico esta calibrado y en condiciones de
operar — sin depender de papel que se actualiza tarde o se pierde.

No maneja datos clinicos de pacientes bajo ninguna circunstancia. Es una
herramienta interna para el area de ingenieria biomedica.

## Stack

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS**
- **Supabase**: Postgres + Row Level Security, Auth (email/password, sin
  registro publico), Storage (buckets privados `manuals` y
  `maintenance-docs`), Realtime (cambios de estado reflejados al instante en
  todas las pantallas conectadas)
- **PWA** (`next-pwa`): el catalogo de manuales y el estado ya cargado de los
  equipos siguen disponibles sin conexion; una cola local (IndexedDB)
  sincroniza los reportes de estado y comentarios capturados sin señal en
  cuanto vuelve la conexion
- **qrcode.react** para generar el QR de cada equipo, **html5-qrcode** para
  leerlo con la camara
- Despliegue en **Vercel**, conectado al repo, deploy automatico en cada push
  a `main`

## Arquitectura en un vistazo

```
src/
  app/
    login/                    # Auth (email/password)
    (app)/                    # Rutas protegidas por middleware + AppShell
      dashboard/               # 1. Listado de equipos
      equipment/[id]/          # 2. Detalle + reportar estado + QR
      equipment/new/
      maintenance/              # 3. Historial (ambos caminos de captura)
      maintenance/new/
      maintenance/[id]/
      manuals/                  # Catalogo de manuales (ambos caminos)
      manuals/new/
      scan/                     # Lector de QR
    api/ocr/route.ts           # OCR -> LLM -> JSON estructurado
  components/                  # UI por dominio (equipment, maintenance, manuals, ocr, comments, layout, ui)
  hooks/                       # useRealtimeList, useOfflineSync
  lib/                         # Supabase clients, ocr.ts, offline-queue.ts, storage.ts, utils.ts
  types/database.ts            # Tipos que reflejan el esquema de Postgres
supabase/migrations/           # Esquema, RLS, storage (en orden)
scripts/seed.mjs               # Datos de prueba (usuarios + equipos + fichas)
```

## Poner el proyecto a correr (< 15 minutos)

### 1. Clona e instala

```bash
git clone <tu-repo> tecmed-data
cd tecmed-data
npm install
```

### 2. Crea el proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**.
2. Cuando este listo, ve a **Settings → API** y copia:
   - `Project URL`
   - `anon public` key
   - `service_role` key (solo se usa en el servidor)

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Llena al menos `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y
`SUPABASE_SERVICE_ROLE_KEY`. Las variables de OCR/LLM son opcionales — sin
ellas, los botones "Escanear..." quedan visibles pero deshabilitados y la app
funciona completa con los formularios manuales.

### 4. Corre las migraciones

Con la [CLI de Supabase](https://supabase.com/docs/guides/cli):

```bash
npx supabase login
npx supabase link --project-ref <tu-project-ref>
npx supabase db push
```

Esto aplica, en orden, `0001_schema.sql` → `0002_rls.sql` → `0003_storage.sql`.

**Alternativa sin CLI:** abre el **SQL Editor** del dashboard de Supabase y
pega el contenido de cada archivo de `supabase/migrations/`, en orden.

### 5. Habilita Realtime (si no quedo activo con la migracion)

Dashboard → **Database → Replication** → confirma que `equipment`,
`maintenance_records`, `equipment_comments` y `maintenance_comments` esten
agregadas a la publicacion `supabase_realtime` (la migracion `0001_schema.sql`
ya las agrega, esto es solo para verificar).

### 6. Datos de prueba (opcional pero recomendado)

```bash
npm run seed
```

Crea 3 usuarios demo y equipo/manuales/mantenimientos de ejemplo. Al final
imprime el correo y contraseña de cada usuario en la terminal.

### 7. Corre en local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y entra con uno de los
usuarios del seed (o crea uno manualmente, ver abajo).

### 8. Deploy a Vercel

1. Sube el repo a GitHub.
2. En [vercel.com](https://vercel.com) → **New Project** → importa el repo.
3. Agrega las mismas variables de entorno de `.env.local` en **Settings →
   Environment Variables** (incluye `NEXT_PUBLIC_APP_URL` con el dominio real
   una vez que Vercel te lo asigne — se usa para armar la URL que codifica
   cada QR).
4. Deploy. Cada push a `main` vuelve a desplegar automaticamente.

## Crear usuarios (no hay registro publico)

Los usuarios los da de alta un administrador, no hay pantalla de "crear
cuenta". Dos formas:

- **Dashboard de Supabase** → Authentication → Add user. Despues, en la
  tabla `public.users`, ajusta el `role` (`ingeniero_biomedico`, `tecnico` o
  `admin`) si no quieres el default `tecnico`.
- **Con el script de seed** como referencia (`scripts/seed.mjs`) usando la
  Admin API — util si quieres automatizar altas masivas.

## Flujo de escaneo (OCR)

1. El archivo (foto o PDF) se sube al bucket privado de Storage
   correspondiente.
2. `POST /api/ocr` descarga el archivo del lado del servidor y extrae texto
   con **Google Cloud Vision** (por defecto, solo necesita la API key) o
   **AWS Textract** (opcional: `npm install @aws-sdk/client-textract` si vas
   a usarlo).
3. El texto se manda a un LLM (**Anthropic** o **OpenAI**, configurable por
   variable de entorno) que devuelve JSON estructurado.
4. Ese JSON pre-llena el formulario de ficha de mantenimiento o de manual —
   **nunca se guarda directo**, el usuario siempre revisa y confirma.
5. Si falta cualquiera de las dos credenciales (OCR o LLM), el boton de
   escanear aparece deshabilitado con una nota explicando por que, y los
   formularios manuales cubren el flujo completo sin degradar la experiencia.

**Limitacion conocida del MVP:** el escaneo automatico procesa fotos
(JPG/PNG). Para PDFs de varias paginas, usa "Subir manual (PDF)" o "Crear
ficha manualmente" — no se pierde informacion, solo cambia el camino de
captura.

## Seguridad

- Row Level Security en todas las tablas: lectura abierta a autenticados,
  escritura autenticados, **borrado solo `admin`**.
- Los buckets de Storage son **privados**; las descargas usan URLs firmadas
  de corta duracion generadas al momento, nunca URLs publicas guardadas en la
  base de datos.
- La `service_role` key **nunca** se expone al cliente; solo se usa en
  `scripts/seed.mjs` y quedaria disponible para futuras rutas de
  administracion server-side.

## Offline (PWA)

- El service worker (`next-pwa`) cachea el listado de equipos, los detalles
  ya visitados y los archivos de Storage ya abiertos, para que sigan
  disponibles sin conexion.
- Reportar el estado de un equipo o dejar un comentario sin conexion los
  guarda en IndexedDB (`src/lib/offline-queue.ts`) y los sincroniza solo al
  reconectar — se ve un aviso en la parte superior mientras hay cambios
  pendientes.

## Scripts

| Comando           | Que hace                                             |
| ------------------ | ----------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                                |
| `npm run build`     | Build de produccion                                    |
| `npm run start`     | Sirve el build de produccion                           |
| `npm run lint`      | ESLint                                                 |
| `npm run typecheck` | `tsc --noEmit`                                         |
| `npm run seed`      | Usuarios y datos de prueba (requiere `.env.local`)     |

## Notas de diseño

Sistema de diseño fijo por spec: teal `#0F766E` como color primario, fondo
`#F7F8FA`, tarjetas blancas con borde `#EFF1F4`, tipografia `system-ui` (es
una herramienta de trabajo, no un sitio de marketing). Layout real de app web:
sidebar fijo en escritorio (≥ 880px) y barra inferior en movil, con vistas de
detalle a dos columnas en escritorio (info + panel de comentarios sticky) que
colapsan a una columna en movil.
