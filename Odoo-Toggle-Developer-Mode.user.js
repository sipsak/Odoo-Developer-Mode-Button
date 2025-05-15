// ==UserScript==
// @name            Odoo Toggle Developer Mode
// @name:tr         Odoo Geliştirici Moduna Geçme
// @namespace       https://github.com/sipsak
// @version         1.2
// @description     Adds a button to enable developer mode in the Odoo menu
// @description:tr  Odoo menüsüne geliştirici modunu etkinleştirme butonu ekler
// @author          Burak Şipşak
// @match           https://portal.bskhvac.com.tr/*
// @match           https://*.odoo.com/*
// @grant           none
// @icon            https://raw.githubusercontent.com/sipsak/odoo-image-enlarger/refs/heads/main/icon.png
// @updateURL       https://raw.githubusercontent.com/sipsak/Odoo-Toggle-Developer-Mode/main/Odoo-Toggle-Developer-Mode.user.js
// @downloadURL     https://raw.githubusercontent.com/sipsak/Odoo-Toggle-Developer-Mode/main/Odoo-Toggle-Developer-Mode.user.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForSystrayAndInsert() {
        const systray = document.querySelector('.o_menu_systray');
        if (!systray) return setTimeout(waitForSystrayAndInsert, 500);
        if (document.querySelector('#dev-mode-button')) return;

        const url = new URL(window.location.href);
        const debugParam = url.searchParams.get('debug') || '';
        const normalized = decodeURIComponent(debugParam).replace(/\s/g, '').toLowerCase();
        const currentDebug = normalized || 'none';

        const debugOptions = [
            { label: 'Geliştirici modu devre dışı', value: 'none' },
            { label: 'Geliştirici modu', value: '1' },
            { label: 'Geliştirici modu (varlıklarla birlikte)', value: 'assets' },
            { label: 'Geliştirici modu (varlıklarla testle birlikte)', value: 'assets,tests' },
        ];

        const outerDiv = document.createElement('div');
        outerDiv.className = 'o-dropdown dropdown o-mail-DiscussSystray-class o-dropdown--no-caret';
        outerDiv.style.position = 'relative';

        const btn = document.createElement('button');
        btn.id = 'dev-mode-button';
        btn.className = 'dropdown-toggle fw-normal';
        btn.title = 'Geliştirici modu yönetimi';
        btn.tabIndex = 0;
        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'false');

        const icon = document.createElement('i');
        icon.className = 'fa fa-lg fa-code';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', 'Developer Mode');
        if (currentDebug !== 'none') icon.classList.add('text-success');
        btn.appendChild(icon);
        outerDiv.appendChild(btn);

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu show';
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.top = '100%';
        dropdownMenu.style.zIndex = '9999';
        dropdownMenu.style.display = 'none';
        dropdownMenu.style.minWidth = 'max-content';
        dropdownMenu.style.whiteSpace = 'nowrap';

        debugOptions.forEach((opt, index) => {
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

        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const rect = btn.getBoundingClientRect();
            const isNearRightEdge = rect.right + 250 > window.innerWidth;
            dropdownMenu.style.left = isNearRightEdge ? 'auto' : '0';
            dropdownMenu.style.right = isNearRightEdge ? '0' : 'auto';

            const isOpen = dropdownMenu.style.display === 'block';
            dropdownMenu.style.display = isOpen ? 'none' : 'block';

            if (isOpen) {
                outerDiv.classList.remove('show');
            } else {
                outerDiv.classList.add('show');
            }
        });

        document.addEventListener('click', () => {
            dropdownMenu.style.display = 'none';
            outerDiv.classList.remove('show');
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

    waitForSystrayAndInsert();
})();
