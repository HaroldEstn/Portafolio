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
    'costs.title': 'Cost optimization across the stack',
    'costs.sub': 'Each category compared before and after optimization.',
    'costs.chartAlt': 'Grouped bars comparing cost before and after optimization in four categories.',
    'costs.before': 'Before',
    'costs.after': 'After',
    'costs.cat1': 'Voice\nagent',
    'costs.cat2': 'Queries',
    'costs.cat3': 'Log\nretention',
    'costs.cat4': 'Scheduled\nstop/start',
    'costs.note': 'Illustrative view: bar heights are proportional to each reduction, figures are not shown.',
    'pipeline.title': 'From push to production, with automatic rollback',
    'pipeline.sub': 'Unit tests, SonarQube and image builds, then Lambda deployments with gradual traffic shifting through CodeDeploy.',
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
    'pipeline.traffic.title': 'Traffic by version',
    'pipeline.role.current': 'Current',
    'pipeline.role.previous': 'Previous',
    'pipeline.role.new': 'New',
    'pipeline.role.none': 'Not deployed',
    'pipeline.role.failed': 'Rolled back',
    'pipeline.metric.title': 'Error rate (CloudWatch)',
    'pipeline.metric.threshold': 'Alarm threshold',
    'pipeline.alarm.ok': 'Alarm: OK',
    'pipeline.alarm.fire': 'Alarm: IN ALARM',
    'pipeline.msg.idle': 'Ready. The pipeline runs when this scene is in view.',
    'pipeline.msg.push': 'Code pushed to the repository.',
    'pipeline.msg.test': 'Running unit tests.',
    'pipeline.msg.sonar': 'Static analysis with SonarQube.',
    'pipeline.msg.build': 'Building the Docker image and pushing it to Amazon ECR.',
    'pipeline.msg.canary': 'The new version arrives: the current one becomes the previous one and traffic shifts gradually.',
    'pipeline.msg.monitor': 'Watching CloudWatch alarms.',
    'pipeline.msg.healthy': 'Deployed. The new version is now current and all alarms are OK. Try injecting a failure.',
    'pipeline.msg.spike': 'The error metric is spiking on the new version.',
    'pipeline.msg.alarm': 'Alarm fired. Rolling back automatically.',
    'pipeline.msg.rolledback': 'Rolled back: traffic is back on the previous version, which is current again, and the metric recovered.',
    'pipeline.note': 'Simulation: a simplified view of the real pipeline.',
    'iac.title': 'From code to cloud',
    'iac.sub': 'A few lines of CDK become a nested stack tree, deployed in dependency order and repeated across environments.',
    'iac.codeAlt': 'AWS CDK code that defines a network, a database, a load balancer, a container service and an alarm.',
    'iac.root': 'Parent stack',
    'iac.stack.network': 'Network',
    'iac.stack.compute': 'Compute',
    'iac.stack.data': 'Data',
    'iac.stack.monitoring': 'Monitoring',
    'iac.res.vpc': 'VPC',
    'iac.res.subnets': 'Subnets',
    'iac.res.ecs': 'ECS Fargate',
    'iac.res.lambda': 'Lambda',
    'iac.res.lb': 'Load balancer',
    'iac.res.rds': 'RDS',
    'iac.res.dynamo': 'DynamoDB',
    'iac.res.buckets': 'Buckets',
    'iac.res.alarms': 'CloudWatch alarms',
    'iac.msg.code': 'Write the infrastructure as code.',
    'iac.msg.deploy': 'Synthesize and deploy in dependency order: network, data, compute, monitoring.',
    'iac.msg.envs': 'Same definition, identical environments.',
    'iac.note': 'Simplified view: the real stacks are larger, the shape is the same.',
    'agent.title': 'Journey of a question',
    'agent.sub': 'A proof-of-concept agent on Amazon Bedrock AgentCore answers questions about expense data, with guardrails and model routing.',
    'agent.diagramAlt': 'Diagram of a question flowing from the chat through guardrails and a router to a fast Haiku lane or a deeper Sonnet lane, then to query tools and a data store, with agent memory alongside.',
    'agent.beats': 'Play one question type',
    'agent.btn.simple': 'Simple',
    'agent.btn.complex': 'Complex',
    'agent.btn.off': 'Off-topic',
    'agent.node.excel': 'Excel file',
    'agent.node.etl': 'Lambda ETL',
    'agent.node.chat': 'Chat',
    'agent.node.guard': 'Guardrails',
    'agent.node.router': 'Router',
    'agent.node.haiku': 'Haiku',
    'agent.node.sonnet': 'Sonnet',
    'agent.node.memory': 'Memory',
    'agent.node.data': 'Data store',
    'agent.guard.hint': 'Stays on expense data',
    'agent.guard.ok': 'Allowed',
    'agent.guard.block': 'Blocked',
    'agent.router.hint': 'By complexity',
    'agent.haiku.hint': 'fast and cheap',
    'agent.sonnet.hint': 'deeper reasoning',
    'agent.kicker.tool': 'Tool',
    'agent.tool.spend': 'Spend by category',
    'agent.tool.suppliers': 'Supplier trends',
    'agent.q.simple': 'What did we spend the most on this month?',
    'agent.q.complex': 'Compare suppliers and explain the trend.',
    'agent.q.off': 'What do you think about football?',
    'agent.a.simple': 'Cloud compute was your largest expense this month.',
    'agent.a.complex': 'Two suppliers drive most of the growth. Their spend climbed steadily as usage increased, while the rest stayed flat.',
    'agent.a.off': 'I can only answer questions about your expense data.',
    'agent.msg.idle': 'A question travels through guardrails, a router and the right model.',
    'agent.msg.ingest': 'Spreadsheets are cleaned by a serverless ETL and stored as structured data.',
    'agent.msg.simple': 'Simple question: Guardrails allow it, the router picks the fast Haiku lane and one tool call answers it.',
    'agent.msg.complex': 'Complex question: the router picks the deeper Sonnet lane, which recalls memory and calls two tools.',
    'agent.msg.off': 'Off-topic question: Guardrails block it before it reaches the router or any model.',
    'agent.msg.done': 'Three questions, three paths: a fast lane, a deep lane and a safe refusal.',
    'agent.note': 'Simplified view: sample questions and answers, no real data.',
    'tool.title': 'One toolbox, many assistants',
    'tool.sub': 'Custom skills and MCP servers built once for coding assistants cut token use and automate repetitive work.',
    'tool.diagramAlt': 'Diagram of a toolbox hub built from skills and MCP servers, connected to four coding assistants: Claude, Codex, Kiro and Antigravity.',
    'tool.before': 'Before: by hand',
    'tool.after': 'After: with the toolbox',
    'tool.box': 'The toolbox',
    'tool.task': 'Repetitive task',
    'tool.step.gather': 'Gather context',
    'tool.step.copy': 'Copy and adapt',
    'tool.step.configure': 'Configure',
    'tool.step.validate': 'Validate',
    'tool.skillrun': 'Skill run',
    'tool.time': 'Time',
    'tool.tokens': 'Token use',
    'tool.hours': 'Hours',
    'tool.minutes': 'Minutes',
    'tool.high': 'High',
    'tool.low': 'Low',
    'tool.hub': 'Toolbox',
    'tool.skills': 'Skills',
    'tool.mcp': 'MCP servers',
    'tool.connected': 'Connected',
    'tool.msg.idle': 'A repetitive task, a shared toolbox and the same task again.',
    'tool.msg.before': 'By hand: every step is manual, it takes hours and burns a lot of tokens.',
    'tool.msg.box': 'Build once: skills and MCP servers come together in one toolbox that every assistant can use.',
    'tool.msg.after': 'The same task, now handled by the toolbox.',
    'tool.msg.done': 'From hours to minutes, with fewer tokens.',
    'tool.note': 'Simplified view: the exact skills and servers vary by task.',
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
    'costs.title': 'Optimización de costos en toda la plataforma',
    'costs.sub': 'Cada categoría comparada antes y después de la optimización.',
    'costs.chartAlt': 'Barras agrupadas que comparan el costo antes y después de la optimización en cuatro categorías.',
    'costs.before': 'Antes',
    'costs.after': 'Después',
    'costs.cat1': 'Agente\nde voz',
    'costs.cat2': 'Consultas',
    'costs.cat3': 'Retención\nde logs',
    'costs.cat4': 'Apagado\nprogramado',
    'costs.note': 'Vista ilustrativa: la altura de las barras es proporcional a cada reducción, no se muestran cifras.',
    'pipeline.title': 'Del push a producción, con rollback automático',
    'pipeline.sub': 'Pruebas unitarias, SonarQube y build de imágenes, y luego despliegues de Lambda con cambio gradual de tráfico mediante CodeDeploy.',
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
    'pipeline.traffic.title': 'Tráfico por versión',
    'pipeline.role.current': 'Actual',
    'pipeline.role.previous': 'Anterior',
    'pipeline.role.new': 'Nueva',
    'pipeline.role.none': 'Sin desplegar',
    'pipeline.role.failed': 'Revertida',
    'pipeline.metric.title': 'Tasa de errores (CloudWatch)',
    'pipeline.metric.threshold': 'Umbral de alarma',
    'pipeline.alarm.ok': 'Alarma: OK',
    'pipeline.alarm.fire': 'Alarma: ACTIVA',
    'pipeline.msg.idle': 'Listo. El pipeline corre cuando esta escena está a la vista.',
    'pipeline.msg.push': 'Código enviado al repositorio.',
    'pipeline.msg.test': 'Ejecutando pruebas unitarias.',
    'pipeline.msg.sonar': 'Análisis estático con SonarQube.',
    'pipeline.msg.build': 'Construyendo la imagen Docker y subiéndola a Amazon ECR.',
    'pipeline.msg.canary': 'Llega la versión nueva: la actual pasa a ser la anterior y el tráfico cambia de forma gradual.',
    'pipeline.msg.monitor': 'Vigilando las alarmas de CloudWatch.',
    'pipeline.msg.healthy': 'Desplegado. La versión nueva ahora es la actual y todas las alarmas están en OK. Prueba inyectar un fallo.',
    'pipeline.msg.spike': 'La métrica de errores se dispara en la versión nueva.',
    'pipeline.msg.alarm': 'La alarma se activó. Haciendo rollback automático.',
    'pipeline.msg.rolledback': 'Rollback completado: el tráfico volvió a la versión anterior, que vuelve a ser la actual, y la métrica se recuperó.',
    'pipeline.note': 'Simulación: una vista simplificada del pipeline real.',
    'iac.title': 'Del código a la nube',
    'iac.sub': 'Unas pocas líneas de CDK se convierten en un árbol de stacks anidados, desplegado según sus dependencias y repetido en cada entorno.',
    'iac.codeAlt': 'Código de AWS CDK que define una red, una base de datos, un balanceador de carga, un servicio de contenedores y una alarma.',
    'iac.root': 'Stack padre',
    'iac.stack.network': 'Red',
    'iac.stack.compute': 'Cómputo',
    'iac.stack.data': 'Datos',
    'iac.stack.monitoring': 'Monitoreo',
    'iac.res.vpc': 'VPC',
    'iac.res.subnets': 'Subredes',
    'iac.res.ecs': 'ECS Fargate',
    'iac.res.lambda': 'Lambda',
    'iac.res.lb': 'Balanceador de carga',
    'iac.res.rds': 'RDS',
    'iac.res.dynamo': 'DynamoDB',
    'iac.res.buckets': 'Buckets',
    'iac.res.alarms': 'Alarmas de CloudWatch',
    'iac.msg.code': 'Escribe la infraestructura como código.',
    'iac.msg.deploy': 'Se sintetiza y se despliega según las dependencias: red, datos, cómputo, monitoreo.',
    'iac.msg.envs': 'Misma definición, entornos idénticos.',
    'iac.note': 'Vista simplificada: los stacks reales son más grandes, pero la forma es la misma.',
    'agent.title': 'El recorrido de una pregunta',
    'agent.sub': 'Un agente de prueba de concepto en Amazon Bedrock AgentCore responde preguntas sobre datos de gastos, con guardrails y enrutamiento de modelos.',
    'agent.diagramAlt': 'Diagrama de una pregunta que va del chat, por los guardrails y un enrutador, a un carril rápido de Haiku o a uno más profundo de Sonnet, y luego a las herramientas de consulta y al almacén de datos, con la memoria del agente al lado.',
    'agent.beats': 'Reproducir un tipo de pregunta',
    'agent.btn.simple': 'Simple',
    'agent.btn.complex': 'Compleja',
    'agent.btn.off': 'Fuera de tema',
    'agent.node.excel': 'Archivo Excel',
    'agent.node.etl': 'ETL en Lambda',
    'agent.node.chat': 'Chat',
    'agent.node.guard': 'Guardrails',
    'agent.node.router': 'Enrutador',
    'agent.node.haiku': 'Haiku',
    'agent.node.sonnet': 'Sonnet',
    'agent.node.memory': 'Memoria',
    'agent.node.data': 'Almacén de datos',
    'agent.guard.hint': 'Se limita a datos de gastos',
    'agent.guard.ok': 'Permitida',
    'agent.guard.block': 'Bloqueada',
    'agent.router.hint': 'Según la complejidad',
    'agent.haiku.hint': 'rápido y económico',
    'agent.sonnet.hint': 'razonamiento profundo',
    'agent.kicker.tool': 'Herramienta',
    'agent.tool.spend': 'Gasto por categoría',
    'agent.tool.suppliers': 'Tendencia de proveedores',
    'agent.q.simple': '¿En qué gastamos más este mes?',
    'agent.q.complex': 'Compara proveedores y explica la tendencia.',
    'agent.q.off': '¿Qué opinas del fútbol?',
    'agent.a.simple': 'El cómputo en la nube fue tu mayor gasto este mes.',
    'agent.a.complex': 'Dos proveedores explican la mayor parte del crecimiento. Su gasto subió de forma constante al aumentar el uso, mientras que el resto se mantuvo estable.',
    'agent.a.off': 'Solo puedo responder preguntas sobre tus datos de gastos.',
    'agent.msg.idle': 'Una pregunta pasa por los guardrails, un enrutador y el modelo adecuado.',
    'agent.msg.ingest': 'Las hojas de cálculo se limpian con un ETL sin servidores y se guardan como datos estructurados.',
    'agent.msg.simple': 'Pregunta simple: los guardrails la permiten, el enrutador elige el carril rápido de Haiku y una sola herramienta la responde.',
    'agent.msg.complex': 'Pregunta compleja: el enrutador elige el carril profundo de Sonnet, que consulta la memoria y llama a dos herramientas.',
    'agent.msg.off': 'Pregunta fuera de tema: los guardrails la bloquean antes de que llegue al enrutador o a cualquier modelo.',
    'agent.msg.done': 'Tres preguntas, tres caminos: un carril rápido, uno profundo y un rechazo seguro.',
    'agent.note': 'Vista simplificada: preguntas y respuestas de ejemplo, sin datos reales.',
    'tool.title': 'Una caja de herramientas, muchos asistentes',
    'tool.sub': 'Skills y servidores MCP propios, creados una sola vez para asistentes de código, reducen el consumo de tokens y automatizan el trabajo repetitivo.',
    'tool.diagramAlt': 'Diagrama de un hub de herramientas formado por skills y servidores MCP, conectado a cuatro asistentes de código: Claude, Codex, Kiro y Antigravity.',
    'tool.before': 'Antes: a mano',
    'tool.after': 'Después: con la caja de herramientas',
    'tool.box': 'La caja de herramientas',
    'tool.task': 'Tarea repetitiva',
    'tool.step.gather': 'Reunir contexto',
    'tool.step.copy': 'Copiar y adaptar',
    'tool.step.configure': 'Configurar',
    'tool.step.validate': 'Validar',
    'tool.skillrun': 'Ejecución de skill',
    'tool.time': 'Tiempo',
    'tool.tokens': 'Uso de tokens',
    'tool.hours': 'Horas',
    'tool.minutes': 'Minutos',
    'tool.high': 'Alto',
    'tool.low': 'Bajo',
    'tool.hub': 'Herramientas',
    'tool.skills': 'Skills',
    'tool.mcp': 'Servidores MCP',
    'tool.connected': 'Conectado',
    'tool.msg.idle': 'Una tarea repetitiva, una caja de herramientas compartida y la misma tarea otra vez.',
    'tool.msg.before': 'A mano: cada paso es manual, toma horas y consume muchos tokens.',
    'tool.msg.box': 'Se construye una vez: skills y servidores MCP se reúnen en una caja de herramientas que todos los asistentes pueden usar.',
    'tool.msg.after': 'La misma tarea, ahora resuelta por la caja de herramientas.',
    'tool.msg.done': 'De horas a minutos, con menos tokens.',
    'tool.note': 'Vista simplificada: las skills y los servidores exactos varían según la tarea.',
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
