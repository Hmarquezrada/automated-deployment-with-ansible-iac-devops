from pathlib import Path

# Contenido del README actualizado
readme_content = """# SECOP Consultas - Sistema de Licitaciones Públicas.

Sistema web para consulta y análisis de licitaciones públicas del SECOP (Sistema Electrónico de Contratación Pública) de Colombia, con una arquitectura moderna, segura y automatizada para despliegue en AWS.

---

## Características Principales

- **Autenticación Segura** con **Supabase**.
- **Visualización Avanzada**: tabla con paginación, filtros múltiples y búsqueda por texto.
- **Diseño Responsive** compatible con cualquier dispositivo.
- **UI Moderna** con animaciones, gradientes y componentes reutilizables.
- **Arquitectura Contenerizada**: despliegue con Docker y automatización vía Ansible.
- **Gestión Segura de Credenciales** mediante AWS IAM.
- **Monitoreo en Tiempo Real** con **Uptime Kuma** (alertas a Telegram) y gestión de contenedores con **Portainer**.

---

## Arquitectura y Flujo de Despliegue

**1. Desarrollo y Backend Integrado**  
- Aplicación **Next.js** con API interna.  
- Autenticación y sesiones persistentes con **Supabase**.  
- Variables de entorno y claves gestionadas por **AWS IAM** para acceso seguro al **dashboard**.  

**2. Contenerización y Orquestación**  
- Imagen Docker construida desde el **Dockerfile** del repositorio.  
- Despliegue automatizado con **Ansible** vía **SSH** (.pem).  
- EC2 configurada con **grupos de seguridad** y **gestión de puertos**.  
- **Portainer** instalado localmente en la EC2 de la app para gestión de contenedores.  

**3. Monitoreo y Observabilidad**  
- **Uptime Kuma** instalado en una **EC2 independiente** monitorea la EC2 principal (App-SECOP).  
- Alertas configuradas para caídas de servicio o alta latencia.  

**Mapa de Arquitectura:**

```mermaid
flowchart LR
    subgraph DEV[Desarrollo y Preparación]
        B1[Construcción: Dockerfile + Docker Compose + Código]
        X[Commit y Push en Git]
        E[Repositorio Git con Código y Configuración]
        F[Ansible - Playbook de Despliegue Local]
    end

    subgraph APP[Aplicación en Producción]
        A[Next.js App]
        D[API Interna: endpoint api/licitaciones]
        B[Supabase: Auth y Base de Datos]
        C["AWS IAM: Acceso seguro al panel de visualización - Dashboard"]
        S[API SECOP: Datos Públicos]
    end

    subgraph INFRA[Infraestructura]
        G[EC2 App-SECOP + Docker: App desplegada]
        PK[Portainer: Gestión local de contenedores en EC2 App-SECOP]
        UK[Uptime Kuma: Monitoreo remoto de EC2 App-SECOP]
        G2[EC2 Uptime Kuma]
    end

    subgraph SECURITY[Seguridad y Control de Acceso]
        SG[Grupos de Seguridad AWS: Reglas de entrada/salida]
        P[Puertos habilitados -> 80 HTTP, 443 HTTPS, 3000 App, 9000 Portainer, 3001 Kuma]
    end

    %% Flujo de construcción y despliegue
    B1 --> X
    X --> E
    E --> F
    F --> G

    %% Conexiones de la App
    G --> A
    A --> D
    D --> S
    A --> C
    C --> B

    %% Portainer local
    G --> PK

    %% Uptime Kuma en EC2 separada
    G2 --> UK
    UK --> G

    %% Seguridad
    SG --> P
    P --> G
    P --> G2
