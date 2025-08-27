# SECOP Consultas - Sistema de Licitaciones Públicas.

Sistema web para consulta y análisis de licitaciones públicas del SECOP (Sistema Electrónico de Contratación Pública) de Colombia, con una arquitectura moderna, segura y automatizada para despliegue en AWS.

---

## Características Principales

- **Autenticación Segura** con **Supabase**.
- **Visualización Avanzada**: tabla con paginación, filtros múltiples y búsqueda por texto.
- **Diseño Responsive** compatible con cualquier dispositivo.
- **UI Moderna** con animaciones, gradientes y componentes reutilizables.
- **Arquitectura Contenerizada**: despliegue con Docker y automatización vía Ansible.
- **Gestión Segura de Credenciales** mediante AWS IAM (para acceso seguro al Dashboard).
- **Monitoreo en Tiempo Real** con **Uptime Kuma** (sistema de alertas en tiempo real a Telegram).

---

## Arquitectura y Flujo de Despliegue

**1. Desarrollo y Backend Integrado**  
- Aplicación **Next.js** con API interna.  
- Autenticación y sesiones persistentes con **Supabase**.  
- Variables de entorno y claves gestionadas por **AWS IAM**.  

**2. Contenerización y Orquestación**  
- Imagen Docker construida desde el **Dockerfile** del repositorio.  
- Despliegue automatizado con **Ansible** vía **SSH** (.pem).  
- EC2 configurada con **grupos de seguridad** y **gestión de puertos**.  

**3. Monitoreo y Observabilidad**  
- **Uptime Kuma** para monitoreo de disponibilidad y tiempo de respuesta.  
- Alertas configuradas para caídas de servicio o alta latencia.  

**Mapa de Arquitectura:**

```mermaid
flowchart LR
    %% =========================
    %% BLOQUE 1: Desarrollo y Construccion
    %% =========================
    subgraph DEV["Desarrollo y Construccion"]
        B1[Construccion Deploy - Docker + Compose + Codigo]
        X[Commit y Push en Git - Repositorio listo para despliegue]
        F[Ansible - Playbook de Despliegue por SSH a EC2 -> Construye imagen con secretos embebidos]
        IAM[AWS IAM - Inyeccion de variables, llaves y secretos - cadena conexion Supabase en build]
        
        B1 --> X
        X --> F
        IAM --> F
    end

    %% =========================
    %% BLOQUE 2: Aplicacion en Produccion
    %% =========================
    subgraph APP["Aplicacion en Produccion"]
        CLIENTE[Cliente - fuera de Docker]
        
        subgraph DOCKER["Contenedor Docker - App con claves embebidas"]
            PASS[Password ingresado por cliente]
            DB[(Base de Datos Supabase)]
            TOKEN[Token valido]
            DASH[Dashboard]
            APIEXT[API externa SECOP]

            CLIENTE --> PASS
            PASS --> DB
            DB --> TOKEN
            TOKEN --> DASH
            DASH --> APIEXT
        end
    end

    %% =========================
    %% BLOQUE 3: Infraestructura
    %% =========================
    subgraph INFRA["Infraestructura"]
        EC2_APP[EC2 con Portainer y App]
        EC2_KUMA[EC2 con Uptime Kuma]

        PORTAINER[Portainer - Gestion de contenedores y metricas de la App en Docker]
        KUMA[Uptime Kuma - Verifica latencia y disponibilidad del servidor de la App]

        EC2_APP --> PORTAINER
        EC2_KUMA --> KUMA
    end

    %% =========================
    %% BLOQUE 4: Seguridad
    %% =========================
    subgraph SECURITY["Seguridad y Control de Acceso"]
        SG[Grupos de seguridad AWS - Reglas entrada y salida]
    end

    %% =========================
    %% Relaciones
    %% =========================
    F --> EC2_APP
    EC2_APP --> DOCKER
    EC2_KUMA --> EC2_APP

    SG --> EC2_APP
    SG --> EC2_KUMA



```

---
## Tecnologías Utilizadas

**Frontend:**  
- Next.js 15.2.4, React, TypeScript  
- Tailwind CSS v4, Radix UI, Lucide React  
- React Hook Form, Zod, Context API  

**Backend / API Interna:**  
- Next.js API Routes  
- Integración con datasets SECOP  

**Infraestructura y DevOps:**  
- Docker, Ansible, AWS EC2, AWS IAM  
- Supabase (Auth + DB)  
- Portainer (gestión local de contenedores)  
- Uptime Kuma (monitoreo y alertas)  

---

## Prerrequisitos

- Node.js 18+  
- pnpm (recomendado) o npm  
- Cuenta en Supabase  
- Acceso a AWS IAM y EC2 con clave `.pem`  

---

## Estructura del Proyecto

```
secop-consultas-next/
├── app/                    # App Router de Next.js
│   ├── api/                # Endpoints de API
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página de inicio
│   ├── login/              # Página de autenticación
│   └── panel/              # Panel principal (protegido)
├── components/             # Componentes reutilizables
├── hooks/                  # Hooks personalizados
├── lib/                    # Utilidades y clientes
├── Dockerfile              # Imagen para contenerización
├── ansible/                # Playbooks de despliegue
└── README.md
```

---

## Autenticación y Seguridad

- **Login**: Email y contraseña vía Supabase.  
- **Protección de rutas** con AuthGuard.  
- **Gestión de secretos**: AWS IAM.  
- **Grupos de seguridad EC2**:
  - Permitir **HTTP (80)**, **HTTPS (443)** y puerto de la app (ej. 3000).
  - Restringir **SSH (22)** solo a IPs autorizadas.  

---

## API y Datos

- **Dataset**: `jbjy-vk9h` (Licitaciones SECOP).  
- **Endpoint interno**: `/api/licitaciones`.  
- **Filtros**: entidad, estado, fecha, valor.  

---

## Automatización de Despliegue

1. Push de cambios a la rama correspondiente en **Git**.  
2. **Ansible** ejecuta:
   - `git pull`
   - `docker build`
   - `docker run` con mapeo de puertos.
3. Verificación de servicio y reinicio automático si falla.  

---

## Monitoreo y Gestión de Contenedores

- Uptime Kuma (en EC2 separada) para monitorear la disponibilidad y tiempo de respuesta de la aplicación desplegada en la EC2 App-SECOP.
- Alertas en tiempo real vía Telegram cuando el servicio no responde o presenta alta latencia.
- Portainer (instalado dentro de la EC2 de la App-SECOP) para administración local de contenedores Docker:
Visualizar contenedores activos.
Detener, reiniciar o eliminar contenedores.
Revisar logs y métricas básicas.
- Acceso a través del puerto 9000 protegido por credenciales.
---

## Despliegue en AWS

```bash
# Ejemplo de despliegue con Ansible
ansible-playbook -i hosts deploy.yml --key-file key.pem
```

---

## Licencia

MIT License.
