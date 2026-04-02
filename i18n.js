const TRANSLATIONS = {
  en: {
    'page.title':       'Harold Gamboa · DevOps | Cloud | Backend Engineer',
    'page.description': 'Systems Engineer with 4 years of experience in AWS architecture, serverless development, and DevOps automation.',

    'nav.experience':     'Experience',
    'nav.projects':       'Projects',
    'nav.certifications': 'Certifications',
    'nav.skills':         'Skills',
    'nav.about':          'About',
    'nav.contact':        'Contact',

    'hero.tag':    'DevOps · Cloud · Backend · AWS',
    'hero.title1': 'Building scalable',
    'hero.title2': 'cloud infrastructure',
    'hero.sub':    'Systems Engineer with 4 years of experience in AWS architecture, serverless development, and DevOps automation.',
    'hero.cta1':   'View Experience',
    'hero.cta2':   'Get in Touch',

    'exp.title':   'Experience',
    'exp.role':    'Cloud and Development Engineer',
    'exp.date':    'March 2022 – Present',
    'exp.stat1':   'CloudFormation Templates',
    'exp.stat2':   'CI/CD Pipelines',
    'exp.stat3':   'Docker Images',
    'exp.stat4':     'AWS Accounts Managed',
    'exp.stat4.num': 'Multiple',
    'exp.li1': 'Core developer of <strong>Geofy</strong> (geolocation platform) and <strong>2Delivery</strong> (route optimization platform) — 3+ years in production with HERE Technologies APIs.',
    'exp.li2': 'IaC with <strong>CloudFormation</strong> (100+ templates), <strong>AWS SAM</strong>, and <strong>AWS CDK with Python</strong> (VPC, S3, CloudFront, Lambda).',
    'exp.li3': 'CI/CD automation with <strong>CodePipeline, CodeBuild, CodeDeploy</strong>. Deployment strategies: Blue/Green, Canary, Linear. GitHub Actions workflows (QA, Staging, Production) and GitLab CI.',
    'exp.li4': 'EC2 with autoscaling, <strong>ECS/Fargate</strong> with multiple services, ELB/ALB load balancers. Serverless microservices with Lambda and EventBridge.',
    'exp.li5': 'Security and governance: <strong>IAM</strong> policies and roles from scratch, IAM Identity Center, AWS Organizations with <strong>SCPs across multiple accounts</strong>, OIDC with AWS for GitHub Actions.',
    'exp.li6': 'Secrets management with <strong>Secrets Manager</strong> and Parameter Store. Cognito User Pools configuration for authentication across multiple projects.',

    'projects.title':       'Projects',
    'proj.delivery.desc':   'Route optimization platform that assigns orders to users based on weight, distance, and availability. Advanced integration with HERE Tourplanning API and Waypoints Sequence for optimized route planning. Led AWS infrastructure deployment and developed the core routing assignment engine API.',
    'proj.geofy.desc':      'Geolocation platform that converts XLSX files with coordinates into addresses and vice versa. Integration with HERE Batch API for automated cloud processing. Responsible for cloud infrastructure design and RESTful API development.',
    'proj.hanoi.desc':      'Text-based implementation of the classic Tower of Hanoi puzzle. Algorithm design for efficient puzzle solving with configurable difficulty levels.',
    'proj.cards.desc':      'Memory matching game built as a first personal project. Features a timer, move counter, and score tracking with a clean user interface.',

    'cert.title': 'Certifications',

    'skills.title':     'Technical Skills',
    'skill.cloud':      'Cloud · AWS',
    'skill.devops':     'IaC & DevOps',
    'skill.security':   'Security & Governance',
    'skill.backend':    'Backend',
    'skill.db':         'Databases',
    'skill.containers': 'Containers & OS',

    'about.title': 'About Me',
    'about.p1':    'Systems Engineer with 4 years of experience in backend development, cloud architecture (AWS), and DevOps practices. Specialist in serverless Lambda functions, Infrastructure as Code (CloudFormation, SAM, CDK), and external API integrations. I have led the implementation of geolocation and route planning solutions in production environments, with emphasis on infrastructure automation, advanced CI/CD, and cloud governance.',
    'about.p2':    'Proactive, adaptable, and highly motivated self-learner. I enjoy technical challenges and am always looking for innovative solutions. I work responsibly, communicate effectively, and collaborate well within multidisciplinary teams. Experience in technical support and customer training.',
    'about.edu.degree': 'B.Sc. in Systems Engineering',
    'about.edu.school': 'Corporación Universitaria Minuto de Dios · 2017 – 2022',

    'contact.title': "Let's Connect",
    'contact.sub':   'Open to new opportunities and collaborations.',
    'contact.email': 'Email',
  },

  es: {
    'page.title':       'Harold Gamboa · Ingeniero DevOps | Cloud | Backend',
    'page.description': 'Ingeniero de Sistemas con 4 años de experiencia en arquitectura AWS, desarrollo serverless y automatización DevOps.',

    'nav.experience':     'Experiencia',
    'nav.projects':       'Proyectos',
    'nav.certifications': 'Certificaciones',
    'nav.skills':         'Habilidades',
    'nav.about':          'Acerca de',
    'nav.contact':        'Contacto',

    'hero.tag':    'DevOps · Cloud · Backend · AWS',
    'hero.title1': 'Construyendo infraestructura',
    'hero.title2': 'cloud escalable',
    'hero.sub':    'Ingeniero de Sistemas con 4 años de experiencia en arquitectura AWS, desarrollo serverless y automatización DevOps.',
    'hero.cta1':   'Ver Experiencia',
    'hero.cta2':   'Contáctame',

    'exp.title':   'Experiencia',
    'exp.role':    'Ingeniero de Cloud y Desarrollo',
    'exp.date':    'Marzo 2022 – Presente',
    'exp.stat1':   'Plantillas CloudFormation',
    'exp.stat2':   'Pipelines CI/CD',
    'exp.stat3':   'Imágenes Docker',
    'exp.stat4':     'Cuentas AWS Gestionadas',
    'exp.stat4.num': 'Múltiples',
    'exp.li1': 'Desarrollador principal de <strong>Geofy</strong> (plataforma de geolocalización) y <strong>2Delivery</strong> (plataforma de optimización de rutas) — 3+ años en producción con las APIs de HERE Technologies.',
    'exp.li2': 'IaC con <strong>CloudFormation</strong> (100+ plantillas), <strong>AWS SAM</strong> y <strong>AWS CDK con Python</strong> (VPC, S3, CloudFront, Lambda).',
    'exp.li3': 'Automatización CI/CD con <strong>CodePipeline, CodeBuild, CodeDeploy</strong>. Estrategias de despliegue: Blue/Green, Canary, Linear. Workflows de GitHub Actions (QA, Staging, Producción) y GitLab CI.',
    'exp.li4': 'EC2 con autoescalado, <strong>ECS/Fargate</strong> con múltiples servicios, balanceadores ELB/ALB. Microservicios serverless con Lambda y EventBridge.',
    'exp.li5': 'Seguridad y gobernanza: políticas y roles <strong>IAM</strong> desde cero, IAM Identity Center, AWS Organizations con <strong>SCPs en múltiples cuentas</strong>, OIDC con AWS para GitHub Actions.',
    'exp.li6': 'Gestión de secretos con <strong>Secrets Manager</strong> y Parameter Store. Configuración de Cognito User Pools para autenticación en múltiples proyectos.',

    'projects.title':     'Proyectos',
    'proj.delivery.desc': 'Plataforma de optimización de rutas que asigna pedidos a usuarios según peso, distancia y disponibilidad. Integración avanzada con HERE Tourplanning API y Waypoints Sequence para planificación óptima de rutas. Responsable del despliegue de infraestructura AWS y el desarrollo de la API del motor de asignación de rutas.',
    'proj.geofy.desc':    'Plataforma de geolocalización que convierte archivos XLSX con coordenadas a direcciones y viceversa. Integración con HERE Batch API para procesamiento automatizado en la nube. Responsable del diseño de infraestructura cloud y desarrollo de APIs REST.',
    'proj.hanoi.desc':    'Implementación por terminal del clásico puzzle Torre de Hanói. Diseño de algoritmo para resolución eficiente con niveles de dificultad configurables.',
    'proj.cards.desc':    'Juego de memoria desarrollado como primer proyecto personal. Incluye temporizador, contador de movimientos y registro de puntuación con una interfaz limpia.',

    'cert.title': 'Certificaciones',

    'skills.title':     'Habilidades Técnicas',
    'skill.cloud':      'Nube · AWS',
    'skill.devops':     'IaC y DevOps',
    'skill.security':   'Seguridad y Gobernanza',
    'skill.backend':    'Backend',
    'skill.db':         'Bases de Datos',
    'skill.containers': 'Contenedores y SO',

    'about.title': 'Sobre Mí',
    'about.p1':    'Ingeniero de Sistemas con 4 años de experiencia en desarrollo backend, arquitectura cloud (AWS) y prácticas DevOps. Especialista en funciones serverless con Lambda, Infraestructura como Código (CloudFormation, SAM, CDK) e integraciones con APIs externas. He liderado la implementación de soluciones de geolocalización y planificación de rutas en entornos de producción, con énfasis en automatización de infraestructura, CI/CD avanzado y gobernanza cloud.',
    'about.p2':    'Proactivo, adaptable y autodidacta con alta motivación. Disfruto los retos técnicos y siempre busco soluciones innovadoras. Trabajo de manera responsable, me comunico de forma efectiva y colaboro bien en equipos multidisciplinarios. Experiencia en soporte técnico y capacitación a clientes.',
    'about.edu.degree': 'Ing. en Sistemas de Información',
    'about.edu.school': 'Corporación Universitaria Minuto de Dios · 2017 – 2022',

    'contact.title': 'Conectemos',
    'contact.sub':   'Abierto a nuevas oportunidades y colaboraciones.',
    'contact.email': 'Correo',
  },
};

function applyLanguage(lang) {
  const t = TRANSLATIONS[lang];

  // Plain text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Elements with inner HTML (bold tags, etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.title = t['page.title'];
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = t['page.description'];
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem('lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });

  const saved = localStorage.getItem('lang') || 'en';
  applyLanguage(saved);
});
