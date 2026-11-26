// i18n: English (default) and Spanish. Static text uses data-i18n attributes;
// scenes that build text at runtime use t() and subscribe with onLangChange().

export const LANGS = ['en', 'es'];
export const DEFAULT_LANG = 'en';

export const DICTIONARY = {
  en: {
    'page.title': 'Harold Gamboa · Cloud AWS & DevOps Engineer',
    'page.description':
      'Cloud AWS & DevOps Engineer: infrastructure as code, CI/CD and generative AI. Almost 5 years building and running AWS solutions in production.',

    'skip': 'Skip to content',
    'nav.label': 'Main navigation',
    'nav.hero': 'Home',
    'nav.impact': 'Impact',
    'nav.experience': 'Experience',
    'nav.skills': 'Skills',
    'nav.certifications': 'Certifications',
    'nav.contact': 'Contact',
    'lang.switch': 'Language',

    'hero.eyebrow': 'Hi, I am',
    'hero.title': 'Cloud AWS & DevOps Engineer',
    'hero.tagline': 'Infrastructure as code · CI/CD · Generative AI',
    'hero.summary':
      'Systems Engineer with almost 5 years building and running AWS solutions in production. I automate infrastructure with CDK, CloudFormation and SAM, ship it through CI/CD pipelines, and build generative AI agents on Amazon Bedrock AgentCore.',
    'hero.location': 'Zipaquirá, Colombia (near Bogotá)',
    'hero.cta1': 'See the impact',
    'hero.cta2': 'Get in touch',
    'hero.hint': 'Tip: press ? for keyboard shortcuts.',
    'stat.years': 'Years on AWS in production',
    'stat.certs': 'Certifications',
    'stat.stacks': 'Production IaC stacks',
    'stat.images': 'Docker images in production',

    'impact.title': 'Impact, in motion',
    'impact.lead':
      'Pick a scene or use the keyboard. Each one is a real piece of work, simplified so you can watch it happen.',
    'impact.tablist': 'Impact scenes',
    'scene.costs': 'Costs',
    'scene.cicd': 'CI/CD',
    'scene.iac': 'IaC',
    'scene.agent': 'GenAI agent',
    'scene.tooling': 'AI tooling',
    'scene.soon': 'This scene is coming soon.',

    'exp.title': 'Experience',
    'exp.role': 'Cloud and DevOps Engineer',
    'exp.company': 'CNID',
    'exp.meta': 'Bogotá · March 2022 – Present',
    'exp.contract': 'Contract title: Technical Support, with development and DevOps/Cloud duties.',
    'exp.li1':
      'Lead developer of Geofy (bulk geocoding of XLSX files with the HERE Batch API; Python, FastAPI, Lambda) and 2Delivery (route optimization and order assignment with HERE Tour Planning; Flask, ECS/Fargate), with 3+ years in production.',
    'exp.li2':
      'Design and deploy AWS infrastructure as code with CDK, CloudFormation, SAM and Serverless Framework.',
    'exp.li3':
      'Build services and APIs in Python, TypeScript and C# (.NET) on Lambda, API Gateway and ECS/Fargate.',
    'exp.li4':
      'Shipped production features for a client CMS, including an in-browser rich text editor and the business logic the client asked for (Python backend, Vue 3 frontend).',
    'exp.li5':
      'Build generative AI agents with Amazon Bedrock AgentCore: a cost-data query agent (proof of concept) and a voice agent (in development).',
    'exp.li6':
      'Build CI/CD pipelines in GitHub Actions and GitLab, with production Lambda Canary deployments through CodeDeploy. Apply least-privilege IAM and configured SCPs in AWS Organizations (allowed regions and mandatory tags).',
    'edu.title': 'Education and languages',
    'edu.degree': 'Systems Engineering',
    'edu.school': 'UNIMINUTO · 2017–2022',
    'edu.es': 'Spanish: native',
    'edu.en': 'English: intermediate (B1–B2)',

    'skills.title': 'Skills',
    'skills.cloud': 'Cloud',
    'skills.iac': 'Infrastructure as code',
    'skills.cicd': 'CI/CD and containers',
    'skills.ai': 'Generative AI',
    'skills.lang': 'Languages',
    'skills.sys': 'Systems',
    'skills.learning': 'learning',
    'skills.advanced': 'AWS (advanced)',
    'skills.gcp': 'GCP (basic)',
    'skills.k8s': 'Kubernetes on EKS (basic)',
    'skills.routing': 'Model routing (Claude Haiku and Sonnet)',
    'skills.voice': 'Voice (Transcribe, Polly, Nova)',
    'skills.assistants': 'Code assistants (Claude, Codex, Kiro, Antigravity)',
    'skills.mcp': 'Custom MCP servers and skills',
    'skills.vector': 'Vector databases',
    'skills.networking': 'Networking',
    'skills.security': 'Security',

    'certs.title': 'Certifications',
    'certs.lead': 'AWS, AWS Partner, GitLab and Google Cloud credentials, all verifiable on Credly.',
    'certs.link': 'View profile on Credly',
    'certs.loading': 'Loading certifications',
    'certs.error': 'Could not load certifications.',

    'contact.title': 'Let’s connect',
    'contact.sub': 'Open to new opportunities and collaborations.',
    'status.hint': 'for keys',
    'help.title': 'Keyboard shortcuts',
    'help.close': 'Close',
    'help.sections': 'Next / previous section',
    'help.scenes': 'Previous / next scene',
    'help.jump': 'Jump to scene',
    'help.replay': 'Replay the current scene',
    'help.fail': 'Inject a failure (CI/CD scene)',
    'help.topbottom': 'Top / bottom of the page',
    'help.lang': 'Toggle English / Spanish',
    'help.help': 'Open / close this help',
    'help.note': 'Shortcuts are optional: everything also works with mouse and touch.',
    'stage.replay': 'Replay',
    'costs.title': 'Voice agent cost, step by step',
    'costs.sub': 'Each optimization swapped an expensive component for a cheaper one.',
    'costs.kpi': 'Estimated voice-agent cost reduction',
    'costs.baseline': 'Initial cost',
    'costs.chartAlt': 'Line chart: the voice agent cost steps down from 100% to about 20% across four optimizations.',
    'costs.step1': 'Amazon Nova Sonic',
    'costs.step2': 'Transcribe + Nova Micro + Polly',
    'costs.step3': 'Open-source speech-to-text model',
    'costs.step4': 'Pre-recorded audio + deterministic logic for closed answers (AWS services as fallback)',
    'costs.tag.baseline': 'baseline',
    'costs.tag.illustrative': 'illustrative',
    'costs.tag.real': 'estimated, real',
    'costs.note': '* Intermediate values are illustrative. Only the final reduction of about 80% is a real (estimated) figure.',
    'costs.card1.title': 'Inefficient database queries',
    'costs.card1.desc': 'Abnormal database consumption traced to inefficient queries. After the fix, the client team cut its cost by about USD 600 a month.',
    'costs.perMonth': '/ month',
    'costs.card2.title': 'EC2 auto on/off schedule',
    'costs.card2.desc': 'Instances switch on and off automatically, so they stop costing money while idle.',
    'costs.card2.tag': 'illustrative schedule',
    'costs.card3.title': 'Log retention tuning',
    'costs.card3.desc': 'Retention is tuned so log storage stops growing without limit.',
    'pipeline.title': 'From push to production, with automatic rollback',
    'pipeline.sub': 'Unit tests, SonarQube and image builds, then Lambda canary deployments with CodeDeploy.',
    'pipeline.inject': 'Inject failure',
    'pipeline.diagramAlt': 'Pipeline diagram: Push, Unit tests, SonarQube, Build and push to ECR, Canary deploy and Monitoring, with a rollback path from Monitoring back to Canary deploy.',
    'pipeline.n1': 'Push',
    'pipeline.n2': 'Unit tests',
    'pipeline.n3': 'SonarQube',
    'pipeline.n4': 'Build & push\nto ECR',
    'pipeline.n5': 'Canary\ndeploy',
    'pipeline.n6': 'Monitoring',
    'pipeline.s1': 'GitHub Actions',
    'pipeline.s4': 'Docker image',
    'pipeline.s5': 'CodeDeploy · Lambda',
    'pipeline.s6': 'CloudWatch alarms',
    'pipeline.rollback': 'Rollback',
    'pipeline.traffic.title': 'Canary traffic split',
    'pipeline.traffic.new': 'New version',
    'pipeline.traffic.old': 'Previous version',
    'pipeline.metric.title': 'Error rate (CloudWatch)',
    'pipeline.metric.threshold': 'Alarm threshold',
    'pipeline.alarm.ok': 'Alarm: OK',
    'pipeline.alarm.fire': 'Alarm: IN ALARM',
    'pipeline.msg.idle': 'Ready. The pipeline runs when this scene is in view.',
    'pipeline.msg.push': 'Code pushed to the repository.',
    'pipeline.msg.test': 'Running unit tests.',
    'pipeline.msg.sonar': 'Static analysis with SonarQube.',
    'pipeline.msg.build': 'Building the Docker image and pushing it to Amazon ECR.',
    'pipeline.msg.canary': 'Canary deploy: 10% of traffic first, then 100%.',
    'pipeline.msg.monitor': 'Watching CloudWatch alarms.',
    'pipeline.msg.healthy': 'Deployed. All alarms are OK. Try injecting a failure.',
    'pipeline.msg.spike': 'The error metric is spiking on the new version.',
    'pipeline.msg.alarm': 'Alarm fired. Rolling back automatically.',
    'pipeline.msg.rolledback': 'Rolled back: traffic is back on the previous version and the metric recovered.',
    'pipeline.note': 'Simulation: a simplified view of the real pipeline.',
    'footer.note': 'Built with vanilla HTML, CSS and JavaScript. No frameworks.',
  },

  es: {
    'page.title': 'Harold Gamboa · Ingeniero Cloud AWS y DevOps',
    'page.description':
      'Ingeniero Cloud AWS y DevOps: infraestructura como código, CI/CD e IA generativa. Casi 5 años construyendo y operando soluciones en AWS en producción.',

    'skip': 'Saltar al contenido',
    'nav.label': 'Navegación principal',
    'nav.hero': 'Inicio',
    'nav.impact': 'Impacto',
    'nav.experience': 'Experiencia',
    'nav.skills': 'Habilidades',
    'nav.certifications': 'Certificaciones',
    'nav.contact': 'Contacto',
    'lang.switch': 'Idioma',

    'hero.eyebrow': 'Hola, soy',
    'hero.title': 'Ingeniero Cloud AWS y DevOps',
    'hero.tagline': 'Infraestructura como código · CI/CD · IA generativa',
    'hero.summary':
      'Ingeniero de Sistemas con casi 5 años construyendo y operando soluciones en AWS en producción. Automatizo infraestructura con CDK, CloudFormation y SAM, la entrego con pipelines de CI/CD y construyo agentes de IA generativa con Amazon Bedrock AgentCore.',
    'hero.location': 'Zipaquirá, Colombia (cerca de Bogotá)',
    'hero.cta1': 'Ver el impacto',
    'hero.cta2': 'Contáctame',
    'hero.hint': 'Tip: presiona ? para ver los atajos de teclado.',
    'stat.years': 'Años en AWS en producción',
    'stat.certs': 'Certificaciones',
    'stat.stacks': 'Stacks de IaC en producción',
    'stat.images': 'Imágenes Docker en producción',

    'impact.title': 'Impacto en movimiento',
    'impact.lead':
      'Elige una escena o usa el teclado. Cada una es un trabajo real, simplificado para que puedas verlo suceder.',
    'impact.tablist': 'Escenas de impacto',
    'scene.costs': 'Costos',
    'scene.cicd': 'CI/CD',
    'scene.iac': 'IaC',
    'scene.agent': 'Agente de IA',
    'scene.tooling': 'Herramientas de IA',
    'scene.soon': 'Esta escena estará disponible pronto.',

    'exp.title': 'Experiencia',
    'exp.role': 'Ingeniero Cloud y DevOps',
    'exp.company': 'CNID',
    'exp.meta': 'Bogotá · marzo 2022 – presente',
    'exp.contract': 'Cargo contractual: Soporte Técnico, con funciones de desarrollo y DevOps/Cloud.',
    'exp.li1':
      'Desarrollador principal de Geofy (geocodificación masiva de archivos XLSX con la API HERE Batch; Python, FastAPI, Lambda) y 2Delivery (optimización de rutas y asignación de pedidos con HERE Tour Planning; Flask, ECS/Fargate), con más de 3 años en producción.',
    'exp.li2':
      'Diseño y despliego infraestructura en AWS como código con CDK, CloudFormation, SAM y Serverless Framework.',
    'exp.li3':
      'Desarrollo servicios y APIs en Python, TypeScript y C# (.NET) sobre Lambda, API Gateway y ECS/Fargate.',
    'exp.li4':
      'Desarrollé funcionalidades en producción para el CMS de un cliente, incluido un editor de texto enriquecido en el navegador y la lógica de negocio que pedía el cliente (backend en Python, frontend en Vue 3).',
    'exp.li5':
      'Construyo agentes de IA generativa con Amazon Bedrock AgentCore: uno de consulta de datos de costos (prueba de concepto) y uno de voz (en desarrollo).',
    'exp.li6':
      'Construyo pipelines de CI/CD en GitHub Actions y GitLab, con despliegues Canary de Lambda con CodeDeploy en producción. Aplico mínimo privilegio en IAM y configuré SCPs en AWS Organizations (regiones permitidas y etiquetas obligatorias).',
    'edu.title': 'Educación e idiomas',
    'edu.degree': 'Ingeniería de Sistemas',
    'edu.school': 'UNIMINUTO · 2017–2022',
    'edu.es': 'Español: nativo',
    'edu.en': 'Inglés: intermedio (B1–B2)',

    'skills.title': 'Habilidades',
    'skills.cloud': 'Nube',
    'skills.iac': 'Infraestructura como código',
    'skills.cicd': 'CI/CD y contenedores',
    'skills.ai': 'IA generativa',
    'skills.lang': 'Lenguajes',
    'skills.sys': 'Sistemas',
    'skills.learning': 'en aprendizaje',
    'skills.advanced': 'AWS (avanzado)',
    'skills.gcp': 'GCP (básico)',
    'skills.k8s': 'Kubernetes en EKS (básico)',
    'skills.routing': 'Enrutamiento de modelos (Claude Haiku y Sonnet)',
    'skills.voice': 'Voz (Transcribe, Polly, Nova)',
    'skills.assistants': 'Asistentes de código (Claude, Codex, Kiro, Antigravity)',
    'skills.mcp': 'Servidores MCP y skills propios',
    'skills.vector': 'Bases de datos vectoriales',
    'skills.networking': 'Redes',
    'skills.security': 'Seguridad',

    'certs.title': 'Certificaciones',
    'certs.lead': 'Credenciales de AWS, AWS Partner, GitLab y Google Cloud, todas verificables en Credly.',
    'certs.link': 'Ver perfil en Credly',
    'certs.loading': 'Cargando certificaciones',
    'certs.error': 'No se pudieron cargar las certificaciones.',

    'contact.title': 'Conectemos',
    'contact.sub': 'Abierto a nuevas oportunidades y colaboraciones.',
    'status.hint': 'para atajos',
    'help.title': 'Atajos de teclado',
    'help.close': 'Cerrar',
    'help.sections': 'Sección siguiente / anterior',
    'help.scenes': 'Escena anterior / siguiente',
    'help.jump': 'Ir a una escena',
    'help.replay': 'Repetir la escena actual',
    'help.fail': 'Inyectar un fallo (escena CI/CD)',
    'help.topbottom': 'Inicio / final de la página',
    'help.lang': 'Cambiar entre inglés y español',
    'help.help': 'Abrir / cerrar esta ayuda',
    'help.note': 'Los atajos son opcionales: todo funciona también con mouse y táctil.',
    'stage.replay': 'Repetir',
    'costs.title': 'Costo del agente de voz, paso a paso',
    'costs.sub': 'Cada optimización reemplazó un componente costoso por uno más económico.',
    'costs.kpi': 'Reducción estimada del costo del agente de voz',
    'costs.baseline': 'Costo inicial',
    'costs.chartAlt': 'Gráfico de líneas: el costo del agente de voz baja de 100% a cerca de 20% en cuatro optimizaciones.',
    'costs.step1': 'Amazon Nova Sonic',
    'costs.step2': 'Transcribe + Nova Micro + Polly',
    'costs.step3': 'Modelo open source de voz a texto',
    'costs.step4': 'Audios pregrabados + lógica determinista para respuestas cerradas (servicios de AWS como respaldo)',
    'costs.tag.baseline': 'base',
    'costs.tag.illustrative': 'ilustrativo',
    'costs.tag.real': 'estimado, real',
    'costs.note': '* Los valores intermedios son ilustrativos. Solo la reducción final de cerca de 80% es una cifra real (estimada).',
    'costs.card1.title': 'Consultas ineficientes en base de datos',
    'costs.card1.desc': 'Consumo anormal en una base de datos causado por consultas ineficientes. Con la corrección, el equipo del cliente redujo su costo en cerca de USD 600 al mes.',
    'costs.perMonth': '/ mes',
    'costs.card2.title': 'Encendido y apagado automático de EC2',
    'costs.card2.desc': 'Las instancias se encienden y se apagan solas, así que no generan costo mientras están inactivas.',
    'costs.card2.tag': 'horario ilustrativo',
    'costs.card3.title': 'Ajuste de retención de logs',
    'costs.card3.desc': 'La retención se ajusta para que el almacenamiento de logs no crezca sin límite.',
    'pipeline.title': 'Del push a producción, con rollback automático',
    'pipeline.sub': 'Pruebas unitarias, SonarQube y build de imágenes, y luego despliegues Canary de Lambda con CodeDeploy.',
    'pipeline.inject': 'Inyectar fallo',
    'pipeline.diagramAlt': 'Diagrama del pipeline: Push, Pruebas unitarias, SonarQube, Build y push a ECR, Despliegue Canary y Monitoreo, con una ruta de rollback desde Monitoreo hacia el despliegue Canary.',
    'pipeline.n1': 'Push',
    'pipeline.n2': 'Pruebas\nunitarias',
    'pipeline.n3': 'SonarQube',
    'pipeline.n4': 'Build y push\na ECR',
    'pipeline.n5': 'Despliegue\nCanary',
    'pipeline.n6': 'Monitoreo',
    'pipeline.s1': 'GitHub Actions',
    'pipeline.s4': 'Imagen Docker',
    'pipeline.s5': 'CodeDeploy · Lambda',
    'pipeline.s6': 'Alarmas de CloudWatch',
    'pipeline.rollback': 'Rollback',
    'pipeline.traffic.title': 'Reparto de tráfico Canary',
    'pipeline.traffic.new': 'Versión nueva',
    'pipeline.traffic.old': 'Versión anterior',
    'pipeline.metric.title': 'Tasa de errores (CloudWatch)',
    'pipeline.metric.threshold': 'Umbral de alarma',
    'pipeline.alarm.ok': 'Alarma: OK',
    'pipeline.alarm.fire': 'Alarma: ACTIVA',
    'pipeline.msg.idle': 'Listo. El pipeline corre cuando esta escena está a la vista.',
    'pipeline.msg.push': 'Código enviado al repositorio.',
    'pipeline.msg.test': 'Ejecutando pruebas unitarias.',
    'pipeline.msg.sonar': 'Análisis estático con SonarQube.',
    'pipeline.msg.build': 'Construyendo la imagen Docker y subiéndola a Amazon ECR.',
    'pipeline.msg.canary': 'Despliegue Canary: primero 10% del tráfico, luego 100%.',
    'pipeline.msg.monitor': 'Vigilando las alarmas de CloudWatch.',
    'pipeline.msg.healthy': 'Desplegado. Todas las alarmas están en OK. Prueba inyectar un fallo.',
    'pipeline.msg.spike': 'La métrica de errores se dispara en la versión nueva.',
    'pipeline.msg.alarm': 'La alarma se activó. Haciendo rollback automático.',
    'pipeline.msg.rolledback': 'Rollback completado: el tráfico volvió a la versión anterior y la métrica se recuperó.',
    'pipeline.note': 'Simulación: una vista simplificada del pipeline real.',
    'footer.note': 'Hecho con HTML, CSS y JavaScript puros. Sin frameworks.',
  },
};

const STORAGE_KEY = 'lang';
const listeners = new Set();
let current = DEFAULT_LANG;

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return LANGS.includes(v) ? v : null;
  } catch {
    return null;
  }
}

function writeStored(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable: ignore */
  }
}

export const getLang = () => current;

/** Translate a key; falls back to English, then to the key itself. */
export function t(key) {
  return DICTIONARY[current]?.[key] ?? DICTIONARY[DEFAULT_LANG][key] ?? key;
}

/** Apply translations to every data-i18n* element under `root`. */
export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}

function applyDocument() {
  applyTranslations(document);
  document.title = t('page.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('page.description'));
  document.documentElement.lang = current;
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const active = btn.dataset.lang === current;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

export function setLang(lang, { persist = true } = {}) {
  if (!LANGS.includes(lang)) return;
  current = lang;
  if (persist) writeStored(lang);
  applyDocument();
  listeners.forEach((fn) => fn(lang));
}

export const toggleLang = () => setLang(current === 'en' ? 'es' : 'en');

/** Subscribe to language changes. Returns an unsubscribe function. */
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function initI18n() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  setLang(readStored() ?? DEFAULT_LANG, { persist: false });
}
