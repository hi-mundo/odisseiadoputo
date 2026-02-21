/**
 * Newsletter — Odisseia do Puto
 * - Modal aparece em cada post novo aberto (por sessão, por URL)
 * - Se viu em mais de 1 post, exibe a piada de re-visita
 * - Bloco estático no fim do post / na página apoie
 * - Cookie permanente ao assinar; sem cookie de dismissal (reaparece sempre)
 */
(function () {
    'use strict';

    /* ── CONFIG ───────────────────────────────────────────────── */
    var WEBHOOK_URL = 'https://n8n.raimundopessoa.com/webhook/447ec040-e429-47b6-b255-7ade8e7001a6';
    var COOKIE_SUBSCRIBED = 'nl_subscribed';
    var COOKIE_DISMISS_COUNT = 'nl_dismiss_count';
    var SESSION_KEY = 'nl_seen_posts';
    var MODAL_DELAY_MS = 2000;
    var COOLDOWN_HOURS = 2; // Cooldown após o segundo descarte

    /* ── COPIES — primeira vez ─────────────────────────────────── */
    var COPIES_FIRST = [
        {
            icon: '🌡️', title: 'Quer receber quentinho no email?',
            en_title: 'Want fresh updates in your inbox?',
            desc: 'Cada novo post vai direto pra sua caixa. Sem precisar ficar voltando aqui pra ver se saiu algo.',
            en_desc: 'Every new post goes straight to your inbox. No need to keep checking back to see if something is out.'
        },
        {
            icon: '📬', title: 'Para de depender do algoritmo.',
            en_title: 'Stop depending on the algorithm.',
            desc: 'Assina a newsletter e os posts chegam quentinhos, direto no email que você cadastrar.',
            en_desc: 'Subscribe to the newsletter and posts arrive fresh, directly to the email you register.'
        },
        {
            icon: '☕', title: 'Novos posts direto na sua caixa.',
            en_title: 'New posts straight to your inbox.',
            desc: 'Assinou uma vez, pronto. Não precisa mais ficar acompanhando o site.',
            en_desc: 'Subscribe once, and you\'re done. No need to keep tracking the site.'
        },
        {
            icon: '📡', title: 'Quer ser avisado quando sair algo novo?',
            en_title: 'Want to be notified of new posts?',
            desc: 'Coloca seu email aí. Cada post novo chega quentinho, sem depender de rede social nenhuma.',
            en_desc: 'Put your email in. Every new post arrives fresh, without depending on any social network.'
        },
        {
            icon: '🔔', title: 'Não perde mais nenhum.',
            en_title: 'Don\'t miss a single one.',
            desc: 'Um email, simples assim. Quando sair post novo, você recebe. Sem enrolação.',
            en_desc: 'One email, simple as that. When a new post is out, you get it. No hassle.'
        },
        {
            icon: '🕹️', title: 'Quer o próximo post antes de todo mundo?',
            en_title: 'Want the next post before everyone else?',
            desc: 'Assina a newsletter. Chega quentinho, sem feed, sem stories, sem besteira.',
            en_desc: 'Subscribe to the newsletter. It arrives fresh, no feed, no stories, no bullshit.'
        },
        {
            icon: '✉️', title: 'Email ainda é o meio mais honesto.',
            en_title: 'Email is still the most honest medium.',
            desc: 'Sem algoritmo pra esconder. Quando sair algo novo, chega direto pra você.',
            en_desc: 'No algorithm to hide it. When something new comes out, it reaches you directly.'
        },
    ];

    /* ── COPIES — re-visita (piada) ────────────────────────────── */
    var COPIES_REPEAT = [
        {
            icon: '😐', title: 'Oi. De novo.',
            en_title: 'Hi. Again.',
            desc: 'Chato né? Aparece em todo post. Sabe como para? Assina. Promessa.',
            en_desc: 'Annoying, right? Appears in every post. Know how to stop it? Subscribe. Promise.'
        },
        {
            icon: '👋', title: 'Eu de novo. Surpresa.',
            en_title: 'Me again. Surprise.',
            desc: 'Poderia não aparecer mais. Bastaria um email. Só um. Pensa nisso.',
            en_desc: 'I could stop showing up. Just an email. Just one. Think about it.'
        },
        {
            icon: '🪲', title: 'Isso não é bug, é feature.',
            en_title: 'This isn\'t a bug, it\'s a feature.',
            desc: 'Aparece em todo post que você ler. A solução tem uma caixa de texto ali embaixo.',
            en_desc: 'Appears in every post you read. The solution is in that text box down there.'
        },
        {
            icon: '📎', title: 'Lembra de mim?',
            en_title: 'Remember me?',
            desc: 'Eu me lembro de você. Vejo você em todo post. Assina e me aposenta, pelo amor.',
            en_desc: 'I remember you. I see you in every post. Subscribe and retire me, for God\'s sake.'
        },
        {
            icon: '🔁', title: 'Volta e meia eu apareço. Literalmente.',
            en_title: 'Every now and then I show up. Literally.',
            desc: 'Toda vez que você trocar de post, sou eu aqui. Tem solução: aquela caixa de email.',
            en_desc: 'Every time you switch posts, here I am. There\'s a solution: that email box.'
        },
    ];

    /* ── COOKIES ──────────────────────────────────────────────── */
    function setCookie(name, value, hours) {
        var expires = '';
        if (hours) {
            var d = new Date();
            d.setTime(d.getTime() + (hours * 60 * 60 * 1000));
            expires = '; expires=' + d.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
    }

    function getCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
        }
        return null;
    }

    function isSubscribed() { return getCookie(COOKIE_SUBSCRIBED) === '1'; }
    function isDismissed() {
        var count = parseInt(getCookie(COOKIE_DISMISS_COUNT) || '0');
        return count >= 2;
    }

    /* ── SESSÃO: quais posts já mostramos o modal ─────────────── */
    function getSeenPosts() {
        try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]'); }
        catch (e) { return []; }
    }

    function markPostSeen(url) {
        var seen = getSeenPosts();
        if (seen.indexOf(url) === -1) seen.push(url);
        try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(seen)); } catch (e) { }
    }

    function isRepeatVisit() {
        // Já viu o modal em pelo menos 1 post anterior nessa sessão
        return getSeenPosts().length >= 1;
    }

    /* ── COPY ALEATÓRIO ───────────────────────────────────────── */
    function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function pickCopy() {
        return isRepeatVisit() ? randomFrom(COPIES_REPEAT) : randomFrom(COPIES_FIRST);
    }

    /* ── WEBHOOK ──────────────────────────────────────────────── */
    function subscribeEmail(email, cb) {
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email }),
        })
            .then(function (r) { cb(r.ok || r.status === 200 || r.status === 202 ? null : new Error(r.status)); })
            .catch(cb);
    }

    /* ── GERENCIADOR DE IDIOMA ─────────────────────────────────── */
    function checkIsEn() {
        return document.documentElement.classList.contains('site-lang-en') ||
            document.documentElement.getAttribute('lang') === 'en';
    }

    /* ── ESTADO INSCRITO: esconde tudo ───────────────────────── */
    function markSubscribedUI() {
        setCookie(COOKIE_SUBSCRIBED, '1', 87600); // 10 anos
        var endBlock = document.getElementById('nl-end-block');
        if (endBlock) {
            // Se for na home/apoie/sobre, apenas esconde o form e mostra sucesso
            // Se for no fim de um post normal, pode esconder o bloco todo ou apenas o form
            var form = endBlock.querySelector('.nl-inline-form');
            var success = endBlock.querySelector('.nl-inline-success');
            if (form) form.hidden = true;
            if (success) success.hidden = false;
        }
        closeModal(false);
        var modalSuc = document.getElementById('nl-modal-success');
        if (modalSuc) {
            modalSuc.hidden = false;
            document.body.classList.add('nl-modal-open');
        }
    }

    /* ── MODAL ───────────────────────────────────────────────── */
    function openModal() {
        var modal = document.getElementById('nl-modal');
        if (!modal) return;
        var copy = pickCopy();
        var isEn = checkIsEn();

        var el = function (id) { return document.getElementById(id); };
        var icon = el('nl-modal-icon');
        var title = el('nl-modal-title');
        var desc = el('nl-modal-desc');

        if (icon) icon.textContent = copy.icon;
        if (title) title.textContent = isEn ? copy.en_title : copy.title;
        if (desc) desc.textContent = isEn ? copy.en_desc : copy.desc;
        modal.hidden = false;
        document.body.classList.add('nl-modal-open');
        setTimeout(function () {
            var inp = el('nl-modal-email');
            if (inp) inp.focus();
        }, 300);
    }

    function closeModal(isDismiss) {
        var modal = document.getElementById('nl-modal');
        if (modal) modal.hidden = true;
        document.body.classList.remove('nl-modal-open');

        if (isDismiss) {
            var current = parseInt(getCookie(COOKIE_DISMISS_COUNT) || '0');
            var next = current + 1;
            if (next >= 2) {
                // Segundo descarte: 2h de silêncio
                setCookie(COOKIE_DISMISS_COUNT, '2', COOLDOWN_HOURS);
            } else {
                // Primeiro descarte: persiste por 24h mas ainda não bloqueia
                setCookie(COOKIE_DISMISS_COUNT, '1', 24);
            }
        }
    }

    /* ── FORM: helper genérico ────────────────────────────────── */
    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    function showError(el, msg) {
        if (!el) return;
        el.textContent = msg;
        el.hidden = false;
    }

    function setLoading(btn, loading) {
        var txt = btn.querySelector('.nl-btn-text');
        var sp = btn.querySelector('.nl-btn-spinner');
        btn.disabled = loading;
        if (txt) txt.hidden = loading;
        if (sp) sp.hidden = !loading;
    }

    /* ── BIND: modal form ─────────────────────────────────────── */
    function bindModalForm() {
        var form = document.getElementById('nl-modal-form');
        var input = document.getElementById('nl-modal-email');
        var btn = document.getElementById('nl-modal-submit');
        var errorEl = document.getElementById('nl-modal-error');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = (input ? input.value : '').trim();
            var isEn = checkIsEn();
            if (!isValidEmail(email)) {
                showError(errorEl, isEn ? 'Invalid email. Try again?' : 'Email inválido. Tenta de novo?');
                return;
            }
            setLoading(btn, true);
            if (errorEl) errorEl.hidden = true;
            subscribeEmail(email, function (err) {
                if (err) {
                    setLoading(btn, false); // Ensure spinner stops on error
                    showError(errorEl, isEn ? 'Something went wrong. Try again later.' : 'Algo deu errado. Tenta em instantes.');
                    return;
                }
                setLoading(btn, false); // Ensure spinner stops on success
                markSubscribedUI();
            });
        });
    }

    /* ── BIND: end-of-post / apoie form ──────────────────────── */
    function bindEndForm() {
        var form = document.getElementById('nl-end-form');
        var input = document.getElementById('nl-end-email');
        var btn = document.getElementById('nl-end-submit');
        var errorEl = document.getElementById('nl-end-error');
        var successEl = document.getElementById('nl-end-success');
        if (!form) return;

        // Se já inscrito, esconde o bloco inteiro (EXCETO em Apoie, Sobre e Home)
        var currentUrl = window.location.pathname;
        var isApoie = currentUrl.indexOf('/apoie') !== -1;
        var isSobre = currentUrl.indexOf('/about') !== -1;
        var isHome = currentUrl === '/' || currentUrl === '/index.html' || currentUrl.indexOf('/index.html') !== -1;

        if (isSubscribed() && !isApoie && !isSobre && !isHome) {
            var block = document.getElementById('nl-end-block');
            if (block) block.style.display = 'none';
            return;
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = (input ? input.value : '').trim();
            var isEn = checkIsEn();
            if (!isValidEmail(email)) {
                showError(errorEl, isEn ? 'Invalid email.' : 'Email inválido.');
                return;
            }
            setLoading(btn, true);
            if (errorEl) errorEl.hidden = true;
            subscribeEmail(email, function (err) {
                if (err) {
                    setLoading(btn, false);
                    showError(errorEl, isEn ? 'Error. Try again.' : 'Erro. Tenta de novo.');
                    return;
                }
                setLoading(btn, false);
                markSubscribedUI();
            });
        });
    }

    /* ── BIND: fechar modal ───────────────────────────────────── */
    function bindModalClose() {
        var closeBtn = document.getElementById('nl-modal-close');
        var backdrop = document.getElementById('nl-modal-backdrop');
        var dismissBtn = document.getElementById('nl-modal-dismiss');
        var successClose = document.getElementById('nl-success-close');

        if (closeBtn) closeBtn.addEventListener('click', function () { closeModal(true); });
        if (backdrop) backdrop.addEventListener('click', function () { closeModal(true); });
        if (dismissBtn) dismissBtn.addEventListener('click', function () { closeModal(true); });
        if (successClose) successClose.addEventListener('click', function () {
            var suc = document.getElementById('nl-modal-success');
            if (suc) suc.hidden = true;
            document.body.classList.remove('nl-modal-open');
        });

        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            var suc = document.getElementById('nl-modal-success');
            if (suc && !suc.hidden) {
                suc.hidden = true;
                document.body.classList.remove('nl-modal-open');
            } else {
                closeModal(true);
            }
        });
    }

    /* ── INIT ─────────────────────────────────────────────────── */
    function init() {
        var currentUrl = window.location.pathname;
        var isPost = !!document.querySelector('.post-body');
        var isApoie = currentUrl.indexOf('/apoie') !== -1;
        var isSobre = currentUrl.indexOf('/about') !== -1;
        var isHome = currentUrl === '/' || currentUrl === '/index.html' || currentUrl.indexOf('/index.html') !== -1;
        var isSpecialPage = isApoie || isSobre || isHome;

        bindEndForm();
        bindModalClose();
        bindModalForm();

        // Modal em posts OU páginas especiais (Sobre/Apoie)
        // Se for página especial, ignora o isSubscribed (sempre mostra se não estiver em cooldown)
        var shouldShowModal = (isPost && !isSubscribed()) || isSpecialPage;

        if (shouldShowModal && !isDismissed()) {
            // Marca como visto ANTES de abrir (assim na próxima página já é repeat)
            var alreadySeen = getSeenPosts().indexOf(currentUrl) !== -1;
            markPostSeen(currentUrl);

            if (!alreadySeen) {
                // Primeira vez nessa página: abre modal após delay
                setTimeout(openModal, MODAL_DELAY_MS);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
