// ==UserScript==
// @name            Odoo Toggle Developer Mode
// @name:tr         Odoo Geliştirici Moduna Geçme
// @namespace       https://github.com/sipsak
// @version         1.1
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
        const debugValue = url.searchParams.get('debug') || '';
        const normalized = decodeURIComponent(debugValue).replace(/\s/g, '').toLowerCase();
        const isDebug = ['1', 'assets', 'assets,tests', 'assets%2Ctests'].includes(normalized);

        const titleText = isDebug
            ? 'Geliştirici modunu devre dışı bırak'
            : 'Geliştirici modunu etkinleştir';

        const outerDiv = document.createElement('div');
        outerDiv.className = 'o-dropdown dropdown o-mail-DiscussSystray-class o-dropdown--no-caret';
        outerDiv.style.position = 'relative';

        const btn = document.createElement('button');
        btn.id = 'dev-mode-button';
        btn.className = 'dropdown-toggle fw-normal';
        btn.title = titleText;
        btn.tabIndex = 0;
        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'false');

        const icon = document.createElement('i');
        icon.className = 'fa fa-lg fa-code';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', 'Developer Mode');
        if (isDebug) icon.classList.add('text-success');
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

        const options = [
            { label: 'Geliştirici modunu etkinleştir', value: '1' },
            { label: 'Geliştirici modunu etkinleştir (varlıklarla birlikte)', value: 'assets' },
            { label: 'Geliştirici modunu etkinleştir (varlıklarla testle birlikte)', value: 'assets,tests' },
        ];

        options.forEach(opt => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'dropdown-item';
            a.href = '#';
            a.innerText = opt.label;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('debug', opt.value);
                if (currentUrl.href.includes('#')) {
                    const [base, hash] = currentUrl.href.split('#');
                    window.location.href = `${base}#${hash}`;
                } else {
                    window.location.href = currentUrl.toString();
                }
            });
            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });

        outerDiv.appendChild(dropdownMenu);

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isDebug) {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.delete('debug');
                if (currentUrl.href.includes('#')) {
                    const [base, hash] = currentUrl.href.split('#');
                    window.location.href = `${base}#${hash}`;
                } else {
                    window.location.href = currentUrl.toString();
                }
            } else {
                // Pozisyona göre dropdown yönü belirle
                const rect = btn.getBoundingClientRect();
                const isNearRightEdge = rect.right + 250 > window.innerWidth;
                dropdownMenu.style.left = isNearRightEdge ? 'auto' : '0';
                dropdownMenu.style.right = isNearRightEdge ? '0' : 'auto';
                dropdownMenu.style.display = 'block';
            }
        });

        document.addEventListener('click', () => {
            dropdownMenu.style.display = 'none';
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
