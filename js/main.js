// Entry point: wires up each module once the DOM is ready (module scripts
// are deferred, so the DOM is already parsed here).

import { initI18n } from './i18n.js';
import { assembleContact } from './contact.js';
import { loadCertifications } from './certs.js';
import { initCounters } from './counters.js';

initI18n();
assembleContact();
initCounters();
loadCertifications();
