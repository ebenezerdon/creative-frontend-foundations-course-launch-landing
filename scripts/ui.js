(function(){
  // Namespace and core rendering
  window.App = window.App || {};

  // Data model
  const data = {
    cohorts: [
      { id: 'jan', name: 'January 2026', start: '2026-01-15T17:00:00Z' },
      { id: 'mar', name: 'March 2026', start: '2026-03-10T17:00:00Z' },
      { id: 'may', name: 'May 2026', start: '2026-05-12T17:00:00Z' }
    ],
    curriculum: [
      { id: 'm1', title: 'Foundations of Delightful UI', summary: 'Design systems, tokens, accessibility-first components.', lessons: ['Visual hierarchy and spacing', 'Accessible interactive patterns', 'Color systems and states', 'Typography for product UIs'] },
      { id: 'm2', title: 'Modern Frontend Workflows', summary: 'Tooling, DX, and performance mindset.', lessons: ['Bundlers and modern patterns', 'State organization strategies', 'Runtime performance and audits', 'API integration and error handling'] },
      { id: 'm3', title: 'UX Routines and Collaboration', summary: 'Feedback loops, reviews, and communication.', lessons: ['Working with designers', 'Code reviews that teach', 'Documentation that scales', 'Design critiques for devs'] },
      { id: 'm4', title: 'Capstone Project', summary: 'Ship a real, portfolio-ready app.', lessons: ['Brief selection and scoping', 'Build sprints and checkpoints', 'Polish and performance', 'Demo day and reflection'] }
    ],
    testimonials: [
      { name: 'Leo Hernandez', role: 'Front-end Developer @ Bookly', text: 'I stopped copy-pasting UI and started designing. The project I built got me three interviews in two weeks.', color: 'bg-sky/10', initials: 'LH' },
      { name: 'Mina Cho', role: 'Design Engineer @ Pixta', text: 'Aria taught me to think in systems. My components are accessible and my team noticed.', color: 'bg-saffron/15', initials: 'MC' },
      { name: 'James Okoro', role: 'Junior Dev @ Carely', text: 'The weekly feedback loops kept me accountable. Demo day was the push I needed.', color: 'bg-terracotta/10', initials: 'JO' },
      { name: 'Sofia Rossi', role: 'Career Switcher', text: 'I landed my first dev role. The capstone became the centerpiece of my portfolio.', color: 'bg-sky/10', initials: 'SR' }
    ],
    pricing: [
      { id: 'basic', name: 'Starter', tagline: 'Self-paced plus cohort', price: 299, monthly: 119, months: 3, accent: 'border-sky/40', includes: ['Cohort access', 'Live Q&A', 'Capstone feedback'] },
      { id: 'pro', name: 'Mentor', tagline: 'Best for career switchers', price: 599, monthly: 229, months: 3, featured: true, accent: 'border-terracotta/40', includes: ['Everything in Starter', '1:1 mentor sessions', 'Mock interview', 'Career review'] },
      { id: 'team', name: 'Team Pack', tagline: 'Train 3 teammates', price: 1999, monthly: 749, months: 3, accent: 'border-saffron/40', includes: ['3 seats', 'Private office hours', 'Team review'] }
    ]
  };

  // Initial state
  window.App.state = window.App.state || {
    selectedCohortId: 'jan',
    billingMonthly: false,
    chosenPlanId: null,
    expandedModules: {},
    waitlist: [],
    checkouts: []
  };

  function getCohortById(id){ return data.cohorts.find(c => c.id === id) || data.cohorts[0]; }

  function formatDate(d){
    try { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d); } catch(e){ return d.toDateString(); }
  }

  function computeTimeline(startDate){
    // Milestones relative to start
    const ms = (days) => new Date(startDate.getTime() + days * 86400000);
    return [
      { label: 'Kickoff', date: ms(0), detail: 'Meet the cohort and set your project goals.' },
      { label: 'Project Pitch', date: ms(7), detail: 'Share your scope and get feedback.' },
      { label: 'Build Sprint', date: ms(14), detail: 'Heads down building with mentor check-ins.' },
      { label: 'Demo Day', date: ms(35), detail: 'Present your work and get portfolio-ready feedback.' },
      { label: 'Graduation', date: ms(42), detail: 'Reflect, iterate, and celebrate your momentum.' }
    ];
  }

  function renderCohorts(){
    const state = window.App.util.getState();
    const $sel = $('#cohortSelect').empty();
    data.cohorts.forEach(c => {
      const opt = $(`<option value="${c.id}">${c.name}</option>`);
      if (state.selectedCohortId === c.id) opt.attr('selected', true);
      $sel.append(opt);
    });

    // Update hero label
    const cohort = getCohortById(state.selectedCohortId);
    const label = formatDate(new Date(cohort.start));
    $('#nextCohortLabel').text(label);
  }

  function renderTimeline(){
    const state = window.App.util.getState();
    const cohort = getCohortById(state.selectedCohortId);
    const start = new Date(cohort.start);
    const items = computeTimeline(start);
    const $list = $('#timelineList').empty();

    items.forEach(it => {
      const $item = $(`
        <li class="timeline-item reveal">
          <span class="timeline-dot" aria-hidden="true"></span>
          <div class="bg-white border border-black/5 rounded-lg p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <p class="font-semibold">${it.label}</p>
              <span class="badge">${formatDate(it.date)}</span>
            </div>
            <p class="mt-1 text-sm text-midnight/80">${it.detail}</p>
          </div>
        </li>
      `);
      $list.append($item);
    });

    // ICS for kickoff
    const icsHref = window.App.util.buildICS({
      title: `Cohort Kickoff - ${cohort.name}`,
      description: 'Your six-week journey starts now.',
      location: 'Online',
      start: start,
      end: new Date(start.getTime() + 60 * 60 * 1000)
    });
    $('#icsKickoff').attr('href', icsHref);
  }

  function renderCurriculum(){
    const state = window.App.util.getState();
    const $root = $('#curriculumList').empty();
    data.curriculum.forEach((m, idx) => {
      const open = !!state.expandedModules[m.id];
      const $item = $(`
        <div class="accordion-item reveal" data-module="${m.id}">
          <button class="accordion-header" aria-expanded="${open}" aria-controls="panel-${m.id}" id="header-${m.id}">
            <span class="flex items-center gap-3"><span class="badge">Week ${idx + 1}</span> ${m.title}</span>
            <svg class="h-5 w-5 text-midnight/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div id="panel-${m.id}" class="accordion-panel" role="region" aria-labelledby="header-${m.id}">
            <p class="mt-2">${m.summary}</p>
            <ul class="mt-3 list-disc pl-6 space-y-1">
              ${m.lessons.map(l => `<li>${l}</li>`).join('')}
            </ul>
          </div>
        </div>
      `);
      if (open) $item.find('.accordion-panel').show();
      $root.append($item);
    });
  }

  function renderTestimonials(){
    const $track = $('#testimonialTrack').empty();
    data.testimonials.forEach(t => {
      const $card = $(`
        <article class="min-w-[280px] sm:min-w-[360px] ${t.color} card p-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-midnight text-white flex items-center justify-center text-sm font-bold">${t.initials}</div>
            <div>
              <p class="font-semibold">${t.name}</p>
              <p class="text-xs text-midnight/70">${t.role}</p>
            </div>
          </div>
          <p class="mt-4 text-sm leading-relaxed">${t.text}</p>
        </article>
      `);
      $track.append($card);
    });
    $track.data('index', 0);
    updateTestimonialTrack(0);
  }

  function updateTestimonialTrack(delta){
    const $track = $('#testimonialTrack');
    const count = $track.children().length;
    const view = Math.max(1, Math.floor($('#testimonialTrack').parent().width() / 340));
    let idx = $track.data('index') || 0;
    idx = Math.max(0, Math.min(idx + delta, Math.max(0, count - view)));
    $track.data('index', idx);
    const x = -(idx * 340);
    if (window.App.util.prefersReducedMotion()) {
      $track.css('transform', `translateX(${x}px)`);
    } else {
      $track.css('transform', `translateX(${x}px)`);
    }
  }

  function renderPricing(){
    const state = window.App.util.getState();
    const $grid = $('#pricingGrid').empty();
    data.pricing.forEach(p => {
      const priceNumber = state.billingMonthly ? p.monthly : p.price;
      const priceNote = state.billingMonthly ? `${p.months} monthly payments` : 'one-time';
      const featured = !!p.featured;
      const $card = $(`
        <div class="card p-6 border-2 ${p.accent} ${featured ? 'ring-2 ring-terracotta' : ''} reveal">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm uppercase tracking-wide text-midnight/70">${p.tagline}</p>
              <h4 class="text-xl font-bold mt-1">${p.name}</h4>
            </div>
            ${featured ? '<span class="chip bg-terracotta/10">Popular</span>' : ''}
          </div>
          <div class="mt-4">
            <div class="price">${window.App.util.formatMoney(priceNumber)}</div>
            <div class="price-note">${priceNote}</div>
          </div>
          <ul class="mt-4 space-y-2">
            ${p.includes.map(f => `<li class="feature"><span aria-hidden="true">✅</span><span>${f}</span></li>`).join('')}
          </ul>
          <div class="mt-5">
            <button class="btn-primary choose-plan nowrap" data-plan="${p.id}">Choose ${p.name}</button>
          </div>
        </div>
      `);
      $grid.append($card);
    });
  }

  function bindEvents(){
    // Smooth anchor navigation
    $('a[href^="#"]').on('click', function(e){
      const href = $(this).attr('href');
      if (href && href.length > 1) {
        e.preventDefault();
        window.App.util.smoothScrollTo(href);
      }
    });

    // Curriculum accordion
    $('#curriculumList').on('click', '.accordion-header', function(){
      const $item = $(this).closest('.accordion-item');
      const id = $item.data('module');
      const $panel = $item.find('.accordion-panel');
      const expanded = $(this).attr('aria-expanded') === 'true';
      if (expanded) {
        $(this).attr('aria-expanded', 'false');
        $panel.slideUp(160);
      } else {
        $(this).attr('aria-expanded', 'true');
        $panel.slideDown(200);
      }
      const state = window.App.util.getState();
      state.expandedModules = state.expandedModules || {};
      state.expandedModules[id] = !expanded;
      window.App.util.setState(state);
    });

    $('#expandAll').on('click', function(){
      $('#curriculumList .accordion-item').each(function(){
        const $h = $(this).find('.accordion-header');
        if ($h.attr('aria-expanded') !== 'true') $h.trigger('click');
      });
    });
    $('#collapseAll').on('click', function(){
      $('#curriculumList .accordion-item').each(function(){
        const $h = $(this).find('.accordion-header');
        if ($h.attr('aria-expanded') !== 'false') $h.trigger('click');
      });
    });

    // Cohort select
    $('#cohortSelect').on('change', function(){
      const state = window.App.util.getState();
      window.App.util.setState(Object.assign({}, state, { selectedCohortId: $(this).val() }));
      renderCohorts();
      renderTimeline();
    });

    // Testimonials
    $('#prevTestimonial').on('click', function(){ updateTestimonialTrack(-1); });
    $('#nextTestimonial').on('click', function(){ updateTestimonialTrack(1); });
    $(window).on('resize', function(){ updateTestimonialTrack(0); });

    // Billing toggle
    $('#billingToggle').on('change', function(){
      const state = window.App.util.getState();
      window.App.util.setState(Object.assign({}, state, { billingMonthly: $(this).is(':checked') }));
      renderPricing();
    });

    // Choose plan -> modal
    $('#pricingGrid').on('click', '.choose-plan', function(){
      const planId = $(this).data('plan');
      const plan = data.pricing.find(p => p.id === planId);
      const state = window.App.util.getState();
      window.App.util.setState(Object.assign({}, state, { chosenPlanId: planId }));
      $('#checkoutPlan').val(`${plan.name} - ${state.billingMonthly ? `${plan.months} x ${window.App.util.formatMoney(plan.monthly)}` : window.App.util.formatMoney(plan.price)}`);
      $('#modal').addClass('show');
      $('#checkoutEmail').trigger('focus');
    });

    $('#closeModal, #cancelCheckout').on('click', function(){ $('#modal').removeClass('show'); });
    $('#modal').on('click', function(e){ if (e.target === this) $('#modal').removeClass('show'); });

    // Checkout form
    $('#checkoutForm').on('submit', function(e){
      e.preventDefault();
      const email = String($('#checkoutEmail').val() || '').trim();
      const name = String($('#checkoutName').val() || '').trim();
      if (!window.App.util.validateEmail(email)) {
        alert('Please enter a valid email.');
        return;
      }
      const s = window.App.util.getState();
      const entry = { id: window.App.util.uid('chk_'), planId: s.chosenPlanId, email, name, date: new Date().toISOString() };
      const checkouts = Array.isArray(s.checkouts) ? s.checkouts.slice() : [];
      checkouts.push(entry);
      window.App.util.setState(Object.assign({}, s, { checkouts }));
      $('#checkoutMsg').removeClass('hidden');
      setTimeout(() => { $('#modal').removeClass('show'); $('#checkoutMsg').addClass('hidden'); $('#checkoutForm')[0].reset(); }, 900);
    });

    // Waitlist form
    $('#heroWaitlist').on('submit', function(e){
      e.preventDefault();
      const email = String($('#waitlistEmail').val() || '').trim();
      const role = $('#waitlistRole').val() || '';
      if (!window.App.util.validateEmail(email)) { alert('Please enter a valid email.'); return; }
      const s = window.App.util.getState();
      const waitlist = Array.isArray(s.waitlist) ? s.waitlist.slice() : [];
      waitlist.push({ id: window.App.util.uid('wl_'), email, role, date: new Date().toISOString() });
      window.App.util.setState(Object.assign({}, s, { waitlist }));
      $('#waitlistMsg').removeClass('hidden');
      setTimeout(() => { $('#waitlistMsg').addClass('hidden'); }, 2000);
      $('#heroWaitlist')[0].reset();
    });

    // Scroll reveal
    const reveal = function(){
      const wh = $(window).height();
      const st = $(window).scrollTop();
      $('.reveal').each(function(){
        const $el = $(this);
        if ($el.hasClass('in')) return;
        const top = $el.offset().top;
        if (top < st + wh - 80) { $el.addClass('in'); }
      });
    };
    $(window).on('scroll', reveal);
    setTimeout(reveal, 50);
  }

  function initialRevealSetup(){
    // mark reveal targets
    $('[data-animate], .accordion-item, .timeline-item, #pricingGrid > *').addClass('reveal');
  }

  // Public API
  window.App.data = data;
  window.App.init = function(){
    // Merge persisted state
    const persisted = window.App.util.getState();
    window.App.util.setState(persisted);
    bindEvents();
    initialRevealSetup();
  };
  window.App.render = function(){
    renderCohorts();
    renderTimeline();
    renderCurriculum();
    renderTestimonials();
    renderPricing();
  };
})();
