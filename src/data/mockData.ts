import { UserProfile, Course, CertificateRecord, LessonComment, AuthAccount, StudentEnrollment } from '../types';

export const SUPPORT_WHATSAPP_NUMBER = '+593989012515';
export const SUPPORT_WHATSAPP_CLEAN = '593989012515';

export const OFFICIAL_SERTECEP_LOGO = '/assets/aistudio/image_4414231c.png';
export const OFFICIAL_SERTECEP_PORTADA = '/assets/aistudio/image_1bbd5ab0.png';

// Exact Admin Credentials:
// Usuario: admin
// Password: MIaPilozo1983#
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'MIaPilozo1983#';

export const defaultAdminAccount: AuthAccount = {
  id: 'usr-admin-01',
  username: ADMIN_USERNAME,
  email: 'admin@sertecep.edu.ec',
  password: ADMIN_PASSWORD,
  role: 'admin',
  fullName: 'Ing. Arturo de la Cruz',
  avatarUrl: OFFICIAL_SERTECEP_LOGO,
  title: 'Administrador General & Director Académico',
  docNumber: '2100348911',
  phone: SUPPORT_WHATSAPP_NUMBER,
};

export const defaultStudentAccount: AuthAccount = {
  id: 'usr-pilozo-777',
  username: 'miapilozo777',
  email: 'miapilozo777@gmail.com',
  password: '123',
  role: 'student',
  fullName: 'EDINSON FLORESMILO PILOZO MURILLO',
  avatarUrl: '/assets/aistudio/image_f29cb282.png',
  title: 'Estudiante Matriculado',
  docNumber: '2100404355',
  phone: '+593989012515',
};

export const initialUserProfile: UserProfile = {
  id: 'usr-pilozo-777',
  role: 'student',
  username: 'miapilozo777',
  firstName: 'EDINSON',
  secondName: 'FLORESMILO',
  firstLastName: 'PILOZO',
  secondLastName: 'MURILLO',
  email: 'miapilozo777@gmail.com',
  phone: '+593989012515',
  country: 'Ecuador',
  docType: 'Cédula',
  docNumber: '2100404355',
  photoUrl: '/assets/aistudio/image_f29cb282.png',
  city: 'Shushufindi',
  province: 'Sucumbíos',
  academicLevel: 'Tecnología Superior & Desarrollo de Software',
  streakDays: 14,
};

// Exactly requested 4 courses:
// 1. Ofimática
// 2. Diseño y Desarrollo Web
// 3. Marketing Digital para Emprendedores
// 4. Paso en Mía Académico
export const sampleCourses: Course[] = [
  {
    id: 'course-ofimatica',
    title: 'Ofimática',
    badgeTitle: 'OFIMÁTICA EMPRESARIAL',
    tagline: 'Excel avanzado, macros VBA, Word profesional, PowerPoint interactivo y herramientas en la nube para empresas e instituciones.',
    description: 'Capacitación integral práctica orientada a la productividad administrativa y corporativa: manejo experto de tablas dinámicas, automatización de planillas y balances con macros, gestión documental oficial y tableros de control.',
    category: 'Ofimática & BI',
    level: 'Principiante a Avanzado',
    coverImage: '/src/assets/images/course_excel_bi_1793675125209.jpg',
    instructor: {
      name: 'Lic. Mónica Benalcázar',
      role: 'Consultora en Gestión de Datos y Ofimática',
      avatar: OFFICIAL_SERTECEP_LOGO,
    },
    totalHours: 120,
    totalModules: 3,
    totalLessons: 18,
    progressPercent: 45,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    hasCertificate: true,
    certificateCode: 'ECN-CERT-2026-OFIMATICA',
    modules: [
      {
        id: 'of-mod-1',
        moduleNumber: 1,
        title: 'Excel Intermedio y Fórmulas Lógicas Avanzadas',
        description: 'Búsquedas matriciales, validación de datos condicional y consolidación.',
        lessons: [
          {
            id: 'of-les-1',
            moduleOrder: 1,
            lessonNumber: 1,
            title: 'Fórmulas Lógicas, BUSCARX y Cruces de Datos Empresariales',
            duration: '18:20',
            durationSeconds: 1100,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            youtubeUrl: 'https://youtube.com',
            summary: 'Aprende a cruzar información de planillas de inventario y nómina utilizando BUSCARX y combinación matricial sin errores.',
            keyPoints: ['Búsqueda bidireccional', 'Validación de listas dependientes', 'Manejo de errores con SI.ERROR'],
            completed: true,
            resources: [
              { id: 'res-of-1', title: 'Plantilla_Planilla_Excel_Pro.xlsx', type: 'doc', size: '1.8 MB', downloadUrl: '#' }
            ],
            quiz: []
          },
          {
            id: 'of-les-2',
            moduleOrder: 1,
            lessonNumber: 2,
            title: 'Tablas Dinámicas y Tableros (Dashboards) Ejecutivos',
            duration: '24:15',
            durationSeconds: 1455,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            summary: 'Construcción de dashboards con segmentadores de datos, gráficos dinámicos sincronizados y cálculo de KPIs.',
            keyPoints: ['Campos calculados en tablas dinámicas', 'Conexión de filtros múltiples', 'Diseño de reportes visuales'],
            completed: true,
            resources: [],
            quiz: []
          }
        ]
      },
      {
        id: 'of-mod-2',
        moduleNumber: 2,
        title: 'Automatización con Macros VBA y Formularios',
        description: 'Creación de scripts para automatizar tareas repetitivas y formularios de ingreso.',
        lessons: [
          {
            id: 'of-les-3',
            moduleOrder: 2,
            lessonNumber: 3,
            title: 'Grabación y Edición de Macros en Visual Basic para Aplicaciones',
            duration: '32:10',
            durationSeconds: 1930,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            summary: 'Estructura del editor de VBA, creación de botones interactivos y ejecución de macros de exportación automática.',
            keyPoints: ['Módulos y procedimientos Sub', 'Instrucciones condicionales If-Then en VBA', 'Asignación de botones'],
            completed: false,
            resources: [],
            quiz: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-web-design',
    title: 'Diseño y Desarrollo Web',
    badgeTitle: 'DISEÑO Y DESARROLLO WEB',
    tagline: 'Crea sitios web modernos, tiendas online, interfaces UI/UX responsivas y sistemas web con tecnologías de vanguardia.',
    description: 'Aprende desde los fundamentos visuales con Figma, HTML5 semántico, CSS3, Tailwind CSS y JavaScript moderno, hasta el desarrollo de aplicaciones web interactivas con React, bases de datos y despliegue en la nube.',
    category: 'Sistemas Web',
    level: 'Principiante a Avanzado',
    coverImage: '/src/assets/images/course_sistemas_cloud_1793675125521.jpg',
    instructor: {
      name: 'Ing. Arturo de la Cruz',
      role: 'Director Académico & Docente Principal',
      avatar: OFFICIAL_SERTECEP_LOGO,
    },
    totalHours: 240,
    totalModules: 4,
    totalLessons: 24,
    progressPercent: 30,
    startDate: '2026-04-10',
    endDate: '2026-08-30',
    hasCertificate: true,
    certificateCode: 'ECN-CERT-2026-0475D707',
    modules: [
      {
        id: 'web-mod-1',
        moduleNumber: 1,
        title: 'Fundamentos de Diseño Web UI/UX & Maquetación',
        description: 'Diseño de interfaces atractivas, jerarquía visual y maquetación responsiva con CSS y Flexbox.',
        lessons: [
          {
            id: 'web-les-1',
            moduleOrder: 1,
            lessonNumber: 1,
            title: 'Arquitectura Web Moderna y Maquetación Responsiva',
            duration: '19:40',
            durationSeconds: 1180,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            youtubeUrl: 'https://youtube.com',
            summary: 'Conoce cómo se estructuran las plataformas web profesionales de alto rendimiento, viewport adaptativo para móviles y buenas prácticas de código.',
            keyPoints: ['HTML5 semántico y accesibilidad', 'Flexbox y CSS Grid', 'Mobile First Design'],
            completed: true,
            resources: [
              { id: 'res-web-1', title: 'Guia_Diseno_Web_Sertecep.pdf', type: 'pdf', size: '2.5 MB', downloadUrl: '#' }
            ],
            quiz: []
          },
          {
            id: 'web-les-2',
            moduleOrder: 1,
            lessonNumber: 2,
            title: 'Componentes Interactivos con JavaScript Moderno y React',
            duration: '28:15',
            durationSeconds: 1695,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            summary: 'Desarrollo de componentes reutilizables, hooks de estado y consumo de APIs externas en tiempo real.',
            keyPoints: ['Estructura de componentes en React', 'useState y useEffect', 'Consumo de servicios REST con fetch'],
            completed: true,
            resources: [],
            quiz: []
          }
        ]
      },
      {
        id: 'web-mod-2',
        moduleNumber: 2,
        title: 'Bases de Datos, Servidores y Despliegue en la Nube',
        description: 'Conexión a bases de datos relacionales y publicación de proyectos en servidores cloud.',
        lessons: [
          {
            id: 'web-les-3',
            moduleOrder: 2,
            lessonNumber: 3,
            title: 'Publicación de Sitios Web con Dominio Propio y Certificado SSL',
            duration: '22:50',
            durationSeconds: 1370,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            summary: 'Paso a paso para configurar servidores web, registros DNS, correos corporativos y certificados SSL de seguridad.',
            keyPoints: ['Configuración DNS (A, CNAME)', 'Certificados HTTPS gratuitos', 'Despliegue continuo'],
            completed: false,
            resources: [],
            quiz: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-marketing',
    title: 'Marketing Digital para Emprendedores',
    badgeTitle: 'MARKETING DIGITAL PARA EMPRENDEDORES',
    tagline: 'Estrategias de ventas por internet, anuncios en Facebook & Instagram, creación de contenidos con IA y cierre comercial por WhatsApp.',
    description: 'Curso práctico enfocado en emprendedores, comercios y profesionales de la región amazónica y Ecuador que desean aumentar sus ventas: diseño publicitario rápido, campañas de Meta Ads, copywriting con inteligencia artificial y embudos de prospección.',
    category: 'Inteligencia Artificial',
    level: 'Principiante a Avanzado',
    coverImage: '/src/assets/images/course_flutter_ai_1793675124066.jpg',
    instructor: {
      name: 'Lic. David Morales',
      role: 'Especialista en Marketing Digital y Crecimiento Comercial',
      avatar: OFFICIAL_SERTECEP_LOGO,
    },
    totalHours: 100,
    totalModules: 3,
    totalLessons: 15,
    progressPercent: 20,
    startDate: '2026-05-01',
    endDate: '2026-07-15',
    hasCertificate: true,
    certificateCode: 'ECN-CERT-2026-MKT-EMP',
    modules: [
      {
        id: 'mkt-mod-1',
        moduleNumber: 1,
        title: 'Estrategia de Marca, Identidad y Creación de Contenido con IA',
        description: 'Cómo definir la propuesta de valor y generar contenido visual y textos persuasivos.',
        lessons: [
          {
            id: 'mkt-les-1',
            moduleOrder: 1,
            lessonNumber: 1,
            title: 'Generación de Copys y Guiones de Venta con Inteligencia Artificial',
            duration: '16:45',
            durationSeconds: 1005,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            youtubeUrl: 'https://youtube.com',
            summary: 'Técnicas de redacción publicitaria asistida por IA para publicaciones que conectan con los clientes y generan consultas directas.',
            keyPoints: ['Estructura AIDA (Atención, Interés, Deseo, Acción)', 'Prompts de redacción comercial', 'Calendario de publicaciones'],
            completed: true,
            resources: [
              { id: 'res-mkt-1', title: 'Guia_Prompts_Marketing_Empresarial.pdf', type: 'pdf', size: '3.1 MB', downloadUrl: '#' }
            ],
            quiz: []
          },
          {
            id: 'mkt-les-2',
            moduleOrder: 1,
            lessonNumber: 2,
            title: 'Configuración de Campañas de Anuncios en Meta Ads (Facebook e Instagram)',
            duration: '26:30',
            durationSeconds: 1590,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            summary: 'Paso a paso para crear anuncios segmentados geográficamente en Sucumbíos, Orellana y todo el Ecuador con bajo presupuesto.',
            keyPoints: ['Segmentación geográfica y de intereses', 'Presupuestos diarios óptimos', 'Medición de métricas (CPA, CTR)'],
            completed: false,
            resources: [],
            quiz: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-mia-academico',
    title: 'Paso en Mía Académico',
    badgeTitle: 'PASO EN MÍA ACADÉMICO',
    tagline: 'Programa de inducción, nivelación formativa, tutoría personalizada y metodología académica exclusiva de Sertecep Amazónico.',
    description: 'Espacio académico de acompañamiento continuo para todos los estudiantes: herramientas de estudio digital, técnicas de aprendizaje acelerado, seguimiento de proyectos y asesoría docente personalizada para garantizar tu certificación.',
    category: 'Inteligencia Artificial',
    level: 'Principiante a Avanzado',
    coverImage: '/src/assets/images/hero_sertecep_campus_1793675123377.jpg',
    instructor: {
      name: 'Dirección Académica Sertecep',
      role: 'Tutoría y Soporte al Estudiante',
      avatar: OFFICIAL_SERTECEP_LOGO,
    },
    totalHours: 80,
    totalModules: 2,
    totalLessons: 10,
    progressPercent: 50,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    hasCertificate: true,
    certificateCode: 'ECN-CERT-2026-MIA-ACAD',
    modules: [
      {
        id: 'mia-mod-1',
        moduleNumber: 1,
        title: 'Inducción al Campus y Metodología Sertecep',
        description: 'Conoce cómo aprovechar al máximo tu aula virtual, foros, tutorías y evaluaciones.',
        lessons: [
          {
            id: 'mia-les-1',
            moduleOrder: 1,
            lessonNumber: 1,
            title: 'Bienvenida a Academia Sertecep Amazónico y Hoja de Ruta',
            duration: '14:20',
            durationSeconds: 860,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            youtubeUrl: 'https://youtube.com',
            summary: 'Conoce las políticas académicas, tutorías docentes en vivo, requisitos para la emisión del certificado oficial y canales de soporte directo.',
            keyPoints: ['Metodología teórico-práctica', 'Requisitos de asistencia y proyectos', 'Línea de soporte WhatsApp'],
            completed: true,
            resources: [
              { id: 'res-mia-1', title: 'Reglamento_Academico_Sertecep_2026.pdf', type: 'pdf', size: '1.4 MB', downloadUrl: '#' }
            ],
            quiz: []
          },
          {
            id: 'mia-les-2',
            moduleOrder: 1,
            lessonNumber: 2,
            title: 'Técnicas de Estudio Efectivo y Desarrollo de Proyectos Reales',
            duration: '21:10',
            durationSeconds: 1270,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
            summary: 'Estrategias para organizar tus horas de estudio semanal, resolver dudas con tu docente y preparar tu proyecto final.',
            keyPoints: ['Bloques de estudio concentrado', 'Uso del cuaderno inteligente de apuntes', 'Preparación para el diploma'],
            completed: false,
            resources: [],
            quiz: []
          }
        ]
      }
    ]
  }
];

export const sampleStudentsList: StudentEnrollment[] = [
  {
    id: 'st-1',
    username: 'miapilozo777',
    password: '123',
    studentName: 'EDINSON FLORESMILO PILOZO MURILLO',
    email: 'miapilozo777@gmail.com',
    docNumber: '2100404355',
    phone: '+593989012515',
    courseId: 'course-web-design',
    courseTitle: 'Diseño y Desarrollo Web',
    progressPercent: 35,
    completedLessons: 7,
    totalLessons: 24,
    certificateApproved: true,
    registrationDate: '04/04/2026',
  },
  {
    id: 'st-2',
    username: 'mcedeno',
    password: '123',
    studentName: 'MARÍA FERNANDA CEDEÑO ZAMBRANO',
    email: 'mcedeno@gmail.com',
    docNumber: '2100984512',
    phone: '+593987123456',
    courseId: 'course-ofimatica',
    courseTitle: 'Ofimática',
    progressPercent: 90,
    completedLessons: 16,
    totalLessons: 18,
    certificateApproved: true,
    registrationDate: '08/04/2026',
  },
  {
    id: 'st-3',
    username: 'bquishpe',
    password: '123',
    studentName: 'BRYAN ALEXANDER QUISHPE MOREIRA',
    email: 'bquishpe@hotmail.com',
    docNumber: '2100561289',
    phone: '+593991287452',
    courseId: 'course-marketing',
    courseTitle: 'Marketing Digital para Emprendedores',
    progressPercent: 20,
    completedLessons: 3,
    totalLessons: 15,
    certificateApproved: false,
    registrationDate: '22/07/2026',
  },
  {
    id: 'st-4',
    username: 'cloor',
    password: '123',
    studentName: 'CARMEN ROCÍO LOOR ALVARADO',
    email: 'cloor@gmail.com',
    docNumber: '2100874123',
    phone: '+593994561238',
    courseId: 'course-mia-academico',
    courseTitle: 'Paso en Mía Académico',
    progressPercent: 60,
    completedLessons: 6,
    totalLessons: 10,
    certificateApproved: true,
    registrationDate: '01/09/2026',
  }
];

export const sampleCertificates: CertificateRecord[] = [
  {
    id: 'cert-1',
    code: 'ECN-CERT-2026-WEB-0475',
    courseId: 'course-web-design',
    courseTitle: 'Diseño y Desarrollo Web',
    specialty: 'Diseño y Desarrollo Web Profesional & Sistemas Cloud',
    academicHours: 240,
    issueDate: '2026-08-24 19:48:20',
    startDate: '10/04/2026',
    endDate: '30/08/2026',
    studentName: 'EDINSON FLORESMILO PILOZO MURILLO',
    studentDoc: '2100404355',
    studentPhoto: '/assets/aistudio/image_f29cb282.png',
    institution: 'Academia Sertecep Amazónico S.A.S.',
    institutionCity: 'Shushufindi, Sucumbíos - Ecuador',
    verificationUrl: 'https://sertecep-amazonico.edu.ec/verificar/ECN-CERT-2026-WEB-0475',
    qrPayload: 'https://sertecep-amazonico.edu.ec/verificar/ECN-CERT-2026-WEB-0475',
    instructorName: 'Ing. Arturo de la Cruz',
    instructorTitle: 'Docente Especialista',
    directorName: 'Gerencia General Sertecep',
    directorTitle: 'Dirección Académica Regional'
  },
  {
    id: 'cert-2',
    code: 'ECN-CERT-2026-OFIMATICA-88',
    courseId: 'course-ofimatica',
    courseTitle: 'Ofimática',
    specialty: 'Ofimática Empresarial, Excel Avanzado y Macros',
    academicHours: 120,
    issueDate: '2026-06-23 19:13:34',
    startDate: '01/04/2026',
    endDate: '30/06/2026',
    studentName: 'EDINSON FLORESMILO PILOZO MURILLO',
    studentDoc: '2100404355',
    studentPhoto: '/assets/aistudio/image_f29cb282.png',
    institution: 'Academia Sertecep Amazónico S.A.S.',
    institutionCity: 'Shushufindi, Sucumbíos - Ecuador',
    verificationUrl: 'https://sertecep-amazonico.edu.ec/verificar/ECN-CERT-2026-OFIMATICA-88',
    qrPayload: 'https://sertecep-amazonico.edu.ec/verificar/ECN-CERT-2026-OFIMATICA-88',
    instructorName: 'Lic. Mónica Benalcázar',
    instructorTitle: 'Docente del Curso',
    directorName: 'Gerencia General Sertecep',
    directorTitle: 'RUC 2191754820001'
  }
];

export const sampleComments: LessonComment[] = [
  {
    id: 'c-1',
    lessonId: 'web-les-1',
    authorName: 'Edinson Pilozo',
    authorAvatar: '/assets/aistudio/image_f29cb282.png',
    isInstructor: false,
    timeAgo: 'Hace 2 horas',
    text: 'Muy clara la explicación de la arquitectura web y maquetación. Todo funcionando correctamente en mi proyecto.',
    likes: 4
  },
  {
    id: 'c-2',
    lessonId: 'web-les-1',
    authorName: 'Ing. Arturo de la Cruz',
    authorAvatar: OFFICIAL_SERTECEP_LOGO,
    isInstructor: true,
    timeAgo: 'Hace 1 hora',
    text: '¡Excelente Edinson! En la siguiente clase veremos cómo desplegar en servidor con SSL.',
    likes: 7
  }
];
