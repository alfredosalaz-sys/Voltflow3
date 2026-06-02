// ============ AYUDA CONTEXTUAL + MANUAL DEL ASISTENTE ============
(function () {
  'use strict';

  const HELP_BUILD = '2026.06.02.1400';
  const applied = new Set();

  const TOPICS = {
    dashboard: 'Panel principal. Resume leads, prioridad, actividad y la siguiente accion recomendada para trabajar sin perder tiempo.',
    commandCenter: 'Centro de mando diario. Decide la siguiente accion conectando cobertura, scraping y leads: continuar mision, importar resultados o revisar pipeline.',
    dailyCopilot: 'Copiloto diario. Genera una agenda practica con tareas de seguimiento, leads prioritarios y acciones de ventas basadas en tus datos.',
    search: 'Buscador inteligente. Introduce sector, zona o codigo postal y radio. Usa Google Places y enriquecimiento web para encontrar empresas reales.',
    searchControls: 'Controles de scraping. Sector y zona definen que se busca; radio y resultados controlan alcance; enriquecer decide cuanta informacion se intenta rescatar.',
    multiSearch: 'Multibusqueda. Permite lanzar varios sectores en la misma zona o codigo postal y registrar cobertura por cada CP/sector trabajado.',
    results: 'Resultados de scraping. Revisa empresas encontradas, selecciona las utiles y vuelcalas a leads. El sistema evita duplicados y prioriza las que tienen datos de contacto.',
    postScraping: 'Cierre post-scraping. Selecciona automaticamente resultados utiles, crea campana o importa leads recomendados sin repetir trabajo.',
    leads: 'Gestion de leads. Aqui se trabajan contactos ya importados: estado, score, siguiente contacto, emails, notas y trazabilidad de origen.',
    leadOrigin: 'Origen real del lead. Muestra cuantos leads mantienen CP/sector de procedencia para conectar scraping, cobertura y pipeline.',
    coverage: 'Cobertura. Controla que codigos postales y sectores ya buscaste, cuando, que salio bien y que queda pendiente.',
    coverageSearch: 'Buscador de cobertura. Escribe un CP para ver si ya se busco y que sectores estan completos, pendientes o con error.',
    coverageFunnel: 'Embudo por CP/sector. Compara encontrados, importados a leads y contactados para saber que zonas producen oportunidades reales.',
    map: 'Mapa operativo. Las chinchetas muestran cobertura por CP: completo, parcial, pendiente o con errores. Sirve para decidir donde buscar despues.',
    settings: 'Configuracion. Guarda perfil, API keys y opciones de datos. Las claves se conservan en este navegador/origen local.',
    health: 'Centro de salud. Comprueba build, datos locales, API keys, backups y eventos recientes sin borrar tu trabajo.',
    restore: 'Backups inteligentes. Crea puntos antes de busquedas, importaciones y campanas para poder restaurar el estado anterior.',
    chat: 'Asistente. Puede explicar cualquier pestaña, diagnosticar APIs, guiar scraping, interpretar cobertura, priorizar leads y resolver dudas de flujo.'
  };

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function addIcon(target, topic, mode) {
    if (!target || !topic || applied.has(target)) return;
    const text = TOPICS[topic] || topic;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'help-tip-btn';
    btn.textContent = '?';
    btn.setAttribute('aria-label', text);
    btn.setAttribute('data-help', text);
    btn.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      showHelpPopover(btn, topic, text);
    };
    if (mode === 'prepend') target.insertBefore(btn, target.firstChild);
    else target.appendChild(btn);
    applied.add(target);
  }

  function showHelpPopover(anchor, topic, text) {
    let pop = document.getElementById('help-popover');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'help-popover';
      pop.className = 'help-popover';
      document.body.appendChild(pop);
    }
    const actions = getTopicActions(topic);
    pop.innerHTML = `
      <button class="help-popover-close" onclick="document.getElementById('help-popover')?.remove()">x</button>
      <div class="help-popover-title">${esc(getTopicTitle(topic))}</div>
      <div class="help-popover-text">${esc(text)}</div>
      ${actions.length ? `<div class="help-popover-actions">${actions.map(action => `<button onclick="${esc(action.onclick)}">${esc(action.label)}</button>`).join('')}</div>` : ''}
    `;
    const rect = anchor.getBoundingClientRect();
    const top = Math.min(window.innerHeight - 120, rect.bottom + 8);
    const left = Math.min(window.innerWidth - 330, Math.max(12, rect.left - 12));
    pop.style.top = `${Math.max(12, top)}px`;
    pop.style.left = `${left}px`;
  }

  function getTopicTitle(topic) {
    const titles = {
      dashboard: 'Panel de control',
      commandCenter: 'Centro de mando',
      dailyCopilot: 'Copiloto diario',
      search: 'Buscador',
      searchControls: 'Controles de busqueda',
      multiSearch: 'Multibusqueda',
      results: 'Resultados',
      postScraping: 'Cierre post-scraping',
      leads: 'Gestion de leads',
      leadOrigin: 'Origen de leads',
      coverage: 'Cobertura',
      coverageSearch: 'Buscar CP',
      coverageFunnel: 'Embudo CP/sector',
      map: 'Mapa operativo',
      settings: 'Configuracion',
      health: 'Salud del sistema',
      restore: 'Backups',
      chat: 'Asistente'
    };
    return titles[topic] || 'Ayuda';
  }

  function getTopicActions(topic) {
    if (topic === 'coverage') return [
      { label: 'Abrir mapa', onclick: 'workflowOpenCoverageMap && workflowOpenCoverageMap()' },
      { label: 'Preguntar al asistente', onclick: "chatAsk('Explicame como usar la pestaña de cobertura')" }
    ];
    if (topic === 'search' || topic === 'searchControls') return [
      { label: 'Preguntar scraping', onclick: "chatAsk('Como hago una busqueda correcta y como importo los resultados?')" }
    ];
    if (topic === 'leads') return [
      { label: 'Priorizar leads', onclick: "chatExecute('topLeads')" },
      { label: 'Preguntar flujo', onclick: "chatAsk('Como gestiono leads desde scraping hasta pipeline?')" }
    ];
    if (topic === 'health' || topic === 'restore') return [
      { label: 'Crear backup', onclick: "workflowCreateRestorePoint && workflowCreateRestorePoint('manual_help')" },
      { label: 'Diagnostico', onclick: "chatRunCommand('diagnostics')" }
    ];
    if (topic === 'map') return [
      { label: 'Cobertura', onclick: "setMapMode && setMapMode('coverage')" },
      { label: 'Leads', onclick: "setMapMode && setMapMode('leads')" }
    ];
    return [
      { label: 'Preguntar', onclick: `chatAsk('Explicame ${getTopicTitle(topic).replace(/'/g, '')}')` }
    ];
  }

  function addHelpToStaticUi() {
    addIcon(document.querySelector('#dashboard-view .page-header h1'), 'dashboard');
    addIcon(document.querySelector('#daily-copilot-panel .panel-header h3'), 'dailyCopilot');
    addIcon(document.querySelector('#planner-view .page-header h1'), 'search');
    addIcon(document.querySelector('#planner-view .search-engine-bar'), 'searchControls', 'prepend');
    addIcon(document.querySelector('#search-results-panel .panel-header h3'), 'results');
    addIcon(document.querySelector('#leads-view .page-header h1'), 'leads');
    addIcon(document.querySelector('#coverage-view .page-header h1'), 'coverage');
    addIcon(document.querySelector('#map-view .map-command-panel strong'), 'map');
    addIcon(document.querySelector('#settings-view .page-header h1'), 'settings');
    addIcon(document.querySelector('#chat-window .chat-header-info strong'), 'chat');
  }

  function addHelpToDynamicUi() {
    addIcon(document.querySelector('#workflow-command-center .ops-header h3'), 'commandCenter');
    addIcon(document.querySelector('#workflow-post-scraping-panel .ops-header h3'), 'postScraping');
    addIcon(document.querySelector('#workflow-coverage-funnel-board .ops-header h3'), 'coverageFunnel');
    addIcon(document.querySelector('#workflow-lead-origin-summary .ops-header h3'), 'leadOrigin');
    addIcon(document.querySelector('#workflow-system-health .ops-header h3'), 'health');
    addIcon(document.querySelector('#workflow-restore-panel .ops-header h3'), 'restore');
    const coverageSearch = document.querySelector('#coverage-root input[type="search"], #coverage-root input[placeholder*="CP"], #coverage-root input[placeholder*="codigo"]');
    if (coverageSearch && coverageSearch.parentElement) addIcon(coverageSearch.parentElement, 'coverageSearch');
  }

  function buildOperationalManual() {
    const coverage = (() => {
      try { return typeof getCoverageEntries === 'function' ? getCoverageEntries() : JSON.parse(localStorage.getItem('gordi_search_coverage') || '[]'); } catch { return []; }
    })();
    const restorePoints = (() => {
      try { return JSON.parse(localStorage.getItem('gordi_workflow_restore_points') || '[]'); } catch { return []; }
    })();
    const activeMission = (() => {
      try { return typeof getCoverageActiveMission === 'function' ? getCoverageActiveMission() : JSON.parse(localStorage.getItem('gordi_coverage_active_mission') || 'null'); } catch { return null; }
    })();
    return `

MANUAL OPERATIVO ACTUAL DE LA APP, BUILD ${HELP_BUILD}:
- Flujo principal: 1) Cobertura decide CP/sector a trabajar. 2) Buscador hace scraping individual o multisector. 3) Resultados se revisan y se vuelcan a leads. 4) Leads se gestionan con estado, score, email IA y pipeline. 5) Mapa muestra visualmente CP buscados y pendientes.
- Centro de mando diario: esta en Dashboard. Recomienda la siguiente accion: continuar mision, buscar pendiente, importar resultados utiles o revisar pipeline.
- Busqueda individual: sector + zona/CP + radio + max resultados. Guarda cobertura CP/sector y permite importar seleccionados.
- Multibusqueda: varios sectores sobre una zona/CP. Debe registrar cada sector en cobertura y fusionar duplicados.
- No repetir trabajo: si una zona/sector ya fue buscada, el sistema avisa y ofrece abrir cobertura, mapa o buscar igualmente.
- Resultados: importar recomendadas selecciona empresas no duplicadas con email/telefono/web y score suficiente. Volcar a leads crea contactos trazables.
- Gestion de leads: cada lead debe conservar origen real si viene de scraping/cobertura. Estados: Pendiente, Contactado, Respuesta del cliente, Visita, Entrega de presupuesto, Cerrado.
- Cobertura: muestra que CP/sector estan completos, parciales, con error o pendientes; sirve para decidir que buscar y para filtrar leads por origen.
- Mapa: modo Cobertura usa chinchetas por CP/estado; modo Leads muestra contactos. Es una vista visual del trabajo hecho y pendiente.
- Configuracion: perfil, API keys y datos. Google Places es clave para buscar; Gemini para asistente/emails; Hunter/Apollo mejoran enriquecimiento.
- Persistencia local: los datos viven en localStorage del mismo navegador y mismo origen exacto. No cambiar de file:// a localhost/GitHub Pages si se quieren ver los mismos datos.
- Backups inteligentes: se crean antes de busquedas/importaciones/campanas y se restauran desde Configuracion. No borran API keys ni leads al actualizar.
- Si el usuario pregunta donde esta algo, responde con la pestana exacta y una accion concreta. Si pregunta si perdera datos, explica origen/localStorage y backups.`;
  }

  function installAssistantKnowledge() {
    if (typeof buildRichAppContext !== 'function' || buildRichAppContext.__helpWrapped) return;
    const original = buildRichAppContext;
    buildRichAppContext = function () {
      return original.apply(this, arguments) + buildOperationalManual();
    };
    buildRichAppContext.__helpWrapped = true;
  }

  function addChatSuggestions() {
    const el = document.getElementById('chat-suggestions');
    if (!el || el.__helpSuggestions) return;
    el.__helpSuggestions = true;
    const btn = document.createElement('button');
    btn.className = 'chat-sug';
    btn.textContent = 'Ayuda app';
    btn.onclick = () => chatAsk('Explicame el flujo completo de la herramienta y que pestaña debo usar segun lo que quiera hacer');
    el.insertBefore(btn, el.firstChild);
  }

  function renderHelpSystem() {
    addHelpToStaticUi();
    addHelpToDynamicUi();
    installAssistantKnowledge();
    addChatSuggestions();
  }

  function bootHelp() {
    renderHelpSystem();
    setInterval(renderHelpSystem, 1200);
    document.addEventListener('click', event => {
      const pop = document.getElementById('help-popover');
      if (!pop) return;
      if (event.target.closest('.help-tip-btn') || event.target.closest('#help-popover')) return;
      pop.remove();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bootHelp);
  else bootHelp();

  window.renderHelpSystem = renderHelpSystem;
  window.buildOperationalHelpManual = buildOperationalManual;
})();
