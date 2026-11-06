$(function () {
    const $win = $(window);
    const offset = () => $('.site-header').outerHeight() || 0;

    // Header shadow + back-to-top
    $win.on('scroll', function () {
        const y = $win.scrollTop();
        $('.site-header').toggleClass('is-scrolled', y > 20);
        $('.to-top').toggleClass('show', y > 600);
    }).trigger('scroll');

    $('.to-top').on('click', () => $('html, body').animate({ scrollTop: 0 }, 400));

    // Smooth in-page anchors (works for "/#id" links on the home page)
    $(document).on('click', 'a[href*="#"]', function (e) {
        const url = new URL(this.href, location.href);
        if (url.pathname !== location.pathname || !url.hash || url.hash === '#') return;
        const $t = $(url.hash);
        if (!$t.length) return;
        e.preventDefault();
        const nav = bootstrap.Collapse.getInstance(document.getElementById('mainNav')); if (nav) nav.hide();
        $('html, body').animate({ scrollTop: $t.offset().top - offset() }, 450);
        history.replaceState(null, '', url.hash);
    });

    // Hero entrance: one orchestrated moment
    $('.roof-wrap .pillar').each(function (i) {
        $(this).css('animation-delay', (0.25 + i * 0.18) + 's');
    });

    // Form: prevent double submit, show progress
    $('.js-form').on('submit', function () {
        const $b = $(this).find('button[type="submit"]');
        $b.prop('disabled', true).text('Sending...');
    });

    // Scroll to the contact section after a submit (status or errors)
    if ($('#contact .alert-success, #contact .is-invalid').length) {
        $('html, body').scrollTop($('#contact').offset().top - offset());
    }
});

// ===== Motion layer =====
$(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    // Scroll reveal, staggered within each row/grid
    $('.section-title, .panel, .flow-node, .svc, .stat, .person, .accordion-item, .contact-list li, .form-card, .lead-soft').each(function () {
        const idx = $(this).parent().children().index(this);
        $(this).addClass('reveal').css('--d', Math.min(idx, 5) * 0.09 + 's');
    });

    // Count-up for numeric stats (skips years like 2017)
    $('.stat-value').each(function () {
        const m = $(this).text().trim().match(/^(\d+)(.*)$/);
        if (!m || +m[1] >= 1000) return;
        $(this).data({ target: +m[1], suffix: m[2] }).text('0' + m[2]);
    });

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            const $el = $(e.target).addClass('in');
            io.unobserve(e.target);
            const $v = $el.find('.stat-value');
            if ($v.length && $v.data('target') !== undefined) {
                $({ n: 0 }).animate({ n: $v.data('target') }, {
                    duration: 1400, easing: 'swing',
                    step: function (now) { $v.text(Math.round(now) + $v.data('suffix')); },
                    complete: function () { $v.text($v.data('target') + $v.data('suffix')); }
                });
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    $('.reveal').each(function () { io.observe(this); });
});