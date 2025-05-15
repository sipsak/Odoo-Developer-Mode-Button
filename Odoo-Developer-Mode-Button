// ==UserScript==
// @name            Odoo Developer Mode Button
// @name:tr         Odoo Geliştirici Modu Butonu
// @namespace       https://github.com/sipsak
// @version         1.3
// @description     Adds a button to the Odoo menu to switch between developer modes.
// @description:tr  Odoo menüsüne geliştirici modları arasında geçiş yapmaya yarayan bir buton ekler.
// @author          Burak Şipşak
// @match           https://portal.bskhvac.com.tr/*
// @match           https://*.odoo.com/*
// @grant           none
// @icon            https://raw.githubusercontent.com/sipsak/odoo-image-enlarger/refs/heads/main/icon.png
// @updateURL       https://raw.githubusercontent.com/sipsak/Odoo-Developer-Mode-Button/main/Odoo-Developer-Mode-Button.user.js
// @downloadURL     https://raw.githubusercontent.com/sipsak/Odoo-Developer-Mode-Button/main/Odoo-Developer-Mode-Button.user.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForSystrayAndInsert() {
        const systray = document.querySelector('.o_menu_systray');
        if (!systray) return setTimeout(waitForSystrayAndInsert, 500);
        if (document.querySelector('#dev-mode-button')) return;

        let isTurkish = false;

        try {
            if (window.odoo && window.odoo.__session_info__ && window.odoo.__session_info__.user_context) {
                const lang = window.odoo.__session_info__.user_context.lang;
                if (lang && lang.startsWith('tr')) {
                    isTurkish = true;
                }
            }
        } catch (e) {}

        if (!isTurkish) {
            try {
                const scriptTags = document.querySelectorAll('script');
                for (const script of scriptTags) {
                    if (script.textContent && script.textContent.includes('odoo.__session_info__')) {
                        if (script.textContent.includes('"lang": "tr')) {
                            isTurkish = true;
                            break;
                        }
                    }
                }
            } catch (e) {}
        }

        if (!isTurkish) {
            try {
                const htmlTag = document.querySelector('html');
                if (htmlTag && htmlTag.getAttribute('lang') && htmlTag.getAttribute('lang').startsWith('tr')) {
                    isTurkish = true;
                }
            } catch (e) {}
        }

        if (!isTurkish) {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const langParam = urlParams.get('lang');
                if (langParam && langParam.startsWith('tr')) {
                    isTurkish = true;
                }
            } catch (e) {}
        }

        const translations = {
            title: isTurkish ? 'Geliştirici modu yönetimi' : 'Developer mode management',
            options: [
                {
                    label: isTurkish ? 'Geliştirici modu devre dışı' : 'Developer mode disabled',
                    value: 'none'
                },
                {
                    label: isTurkish ? 'Geliştirici modu' : 'Developer mode',
                    value: '1'
                },
                {
                    label: isTurkish ? 'Geliştirici modu (varlıklarla birlikte)' : 'Developer mode (with assets)',
                    value: 'assets'
                },
                {
                    label: isTurkish ? 'Geliştirici modu (varlıklarla testle birlikte)' : 'Developer mode (with tests assets)',
                    value: 'assets,tests'
                },
            ]
        };

        const url = new URL(window.location.href);
        const debugParam = url.searchParams.get('debug') || '';
        const normalized = decodeURIComponent(debugParam).replace(/\s/g, '').toLowerCase();
        const currentDebug = normalized || 'none';

        const outerDiv = document.createElement('div');
        outerDiv.className = 'o-dropdown dropdown o-mail-DiscussSystray-class o-dropdown--no-caret';
        outerDiv.style.position = 'relative';
        outerDiv.id = 'dev-mode-container';

        const btn = document.createElement('button');
        btn.id = 'dev-mode-button';
        btn.className = 'dropdown-toggle fw-normal';
        btn.title = translations.title;
        btn.tabIndex = 0;
        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'false');

        const icon = document.createElement('i');
        icon.className = 'fa fa-lg fa-code';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', translations.title);
        if (currentDebug !== 'none') icon.classList.add('text-success');
        btn.appendChild(icon);
        outerDiv.appendChild(btn);

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.top = '100%';
        dropdownMenu.style.zIndex = '9999';
        dropdownMenu.style.display = 'none';
        dropdownMenu.style.minWidth = 'max-content';
        dropdownMenu.style.whiteSpace = 'nowrap';

        translations.options.forEach((opt, index) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item d-flex align-items-center gap-2';
            a.href = '#';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.className = 'form-check-input o_radio_input';
            radio.name = 'debug-mode-radio';
            radio.id = 'radio-debug-' + index;
            radio.dataset.value = opt.value;
            radio.checked = (opt.value === currentDebug);
            radio.style.cursor = 'pointer';

            const span = document.createElement('span');
            span.textContent = opt.label;

            a.appendChild(radio);
            a.appendChild(span);

            a.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const currentUrl = new URL(window.location.href);
                if (opt.value === 'none') {
                    currentUrl.searchParams.delete('debug');
                } else {
                    currentUrl.searchParams.set('debug', opt.value);
                }

                const finalUrl = currentUrl.href.includes('#')
                    ? currentUrl.origin + currentUrl.pathname + currentUrl.search + window.location.hash
                    : currentUrl.toString();

                window.location.href = finalUrl;
            });

            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });

        outerDiv.appendChild(dropdownMenu);

        function toggleOurMenu(e) {
            e.stopPropagation();
            e.preventDefault();

            const rect = btn.getBoundingClientRect();
            const isNearRightEdge = rect.right + 250 > window.innerWidth;
            dropdownMenu.style.left = isNearRightEdge ? 'auto' : '0';
            dropdownMenu.style.right = isNearRightEdge ? '0' : 'auto';

            const isOpen = dropdownMenu.style.display === 'block';

            if (isOpen) {
                dropdownMenu.style.display = 'none';
                dropdownMenu.classList.remove('show');
                outerDiv.classList.remove('show');
                btn.setAttribute('aria-expanded', 'false');
            } else {
                dropdownMenu.style.display = 'block';
                dropdownMenu.classList.add('show');
                outerDiv.classList.add('show');
                btn.setAttribute('aria-expanded', 'true');
            }
        }

        btn.addEventListener('click', toggleOurMenu);

        document.addEventListener('click', (event) => {
            if (!outerDiv.contains(event.target)) {
                dropdownMenu.style.display = 'none';
                dropdownMenu.classList.remove('show');
                outerDiv.classList.remove('show');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.target !== outerDiv) {
                    if (mutation.addedNodes.length) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.classList &&
                                   (node.classList.contains('dropdown-menu') ||
                                    node.classList.contains('modal') ||
                                    node.classList.contains('o_dialog') ||
                                    node.querySelector('.dropdown-menu'))) {

                                    if (dropdownMenu.style.display === 'block') {
                                        dropdownMenu.style.display = 'none';
                                        dropdownMenu.classList.remove('show');
                                        outerDiv.classList.remove('show');
                                        btn.setAttribute('aria-expanded', 'false');
                                    }
                                }
                            }
                        }
                    }
                }

                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.target !== outerDiv &&
                    !outerDiv.contains(mutation.target)) {

                    if (mutation.target.classList &&
                        mutation.target.classList.contains('show') &&
                        dropdownMenu.style.display === 'block') {

                        dropdownMenu.style.display = 'none';
                        dropdownMenu.classList.remove('show');
                        outerDiv.classList.remove('show');
                        btn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        const messagesDiv = Array.from(systray.children).find(div =>
            div.querySelector('i.fa-comments')
        );
        if (messagesDiv) {
            systray.insertBefore(outerDiv, messagesDiv);
        } else {
            systray.appendChild(outerDiv);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForSystrayAndInsert);
    } else {
        setTimeout(waitForSystrayAndInsert, 300);
    }
})();
