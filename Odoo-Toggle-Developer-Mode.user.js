// ==UserScript==
// @name            Odoo Toggle Developer Mode
// @name:tr         Odoo Geliştirici Moduna Geçme
// @namespace       https://github.com/sipsak
// @version         1.0
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
        if (!systray) {
            return setTimeout(waitForSystrayAndInsert, 500);
        }

        // Önceden eklenmişse tekrar ekleme
        if (document.querySelector('#dev-mode-button')) return;

        const url = new URL(window.location.href);
        const isDebugActive = url.searchParams.get('debug') === '1';

        // Dinamik title
        const titleText = isDebugActive
            ? 'Geliştirici modunu devre dışı bırak'
            : 'Geliştirici modunu etkinleştir';

        // Yeni buton
        const newButton = document.createElement('button');
        newButton.id = 'dev-mode-button';
        newButton.title = titleText;
        newButton.type = 'button';
        newButton.className = 'dropdown-toggle';
        newButton.tabIndex = 0;
        newButton.setAttribute('aria-expanded', 'false');

        // İkon: fa-code
        const icon = document.createElement('i');
        icon.className = 'fa fa-lg fa-code';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-label', 'Developer Mode');
        if (isDebugActive) {
            icon.classList.add('text-success');
        }
        newButton.appendChild(icon);

        // Tıklama işlevi
        newButton.addEventListener('click', () => {
            const currentUrl = new URL(window.location.href);
            if (currentUrl.searchParams.has('debug')) {
                currentUrl.searchParams.delete('debug');
            } else {
                currentUrl.searchParams.set('debug', '1');
            }

            if (currentUrl.href.includes('#')) {
                const [base, hash] = currentUrl.href.split('#');
                window.location.href = `${base}#${hash}`;
            } else {
                window.location.href = currentUrl.toString();
            }
        });

        // Odoo systray yapısına uygun dış div
        const outerDiv = document.createElement('div');
        outerDiv.className = 'o-dropdown dropdown o-mail-DiscussSystray-class o-dropdown--no-caret';
        outerDiv.appendChild(newButton);

        // Mesajlar ikonunu bul (fa-comments)
        const children = Array.from(systray.children);
        const messagesDiv = children.find(div =>
            div.querySelector('i.fa-comments')
        );

        // Butonu Mesajlar ikonunun soluna yerleştir
        if (messagesDiv) {
            systray.insertBefore(outerDiv, messagesDiv);
        } else {
            systray.appendChild(outerDiv); // fallback
        }
    }

    waitForSystrayAndInsert();
})();
