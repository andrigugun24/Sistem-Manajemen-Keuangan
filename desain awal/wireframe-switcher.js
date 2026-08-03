(function() {
    // Inject the CSS for the switcher panel and themes
    const style = document.createElement('style');
    style.textContent = `
        /* --- Style Switcher Panel --- */
        .wf-style-switcher-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
        }

        .wf-style-switcher {
            display: flex;
            gap: 8px;
            background: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
            padding: 8px 12px;
            border-radius: 30px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: right bottom;
            opacity: 1;
        }

        .wf-style-switcher.collapsed {
            transform: scale(0.8) translateY(20px);
            opacity: 0;
            pointer-events: none;
        }

        .wf-style-switcher-toggle {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #6366f1;
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            z-index: 10000;
        }
        
        .wf-style-switcher-toggle:hover {
            transform: scale(1.05);
            background: #4f46e5;
        }

        .switcher-btn {
            border: none;
            background: transparent;
            color: #94a3b8;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .switcher-btn:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.1);
        }

        .switcher-btn.active {
            background: #6366f1;
            color: #ffffff;
        }
        
        /* Clean Wireframe Theme Variables */
        body.style-clean-wireframe {
            --wf-primary: #555555;
            --wf-primary-light: #888888;
            --wf-primary-dark: #333333;
            --wf-bg: #ffffff;
            --wf-surface: #ffffff;
            --wf-border: #64748b;
            --wf-border-light: #cbd5e1;
            --wf-text-primary: #0f172a;
            --wf-text-secondary: #475569;
            --wf-text-muted: #94a3b8;
            --wf-success: #64748b;
            --wf-warning: #64748b;
            --wf-danger: #475569;
            --wf-info: #64748b;
            --wf-radius: 4px;
            --wf-radius-sm: 4px;
            --wf-radius-lg: 4px;
            --wf-shadow: none;
            --wf-shadow-sm: none;
            --wf-shadow-md: none;
        }

        body.style-clean-wireframe .wf-sidebar,
        body.style-clean-wireframe .wf-header {
            background: #ffffff;
            border-color: var(--wf-border);
        }

        body.style-clean-wireframe .wf-sidebar-brand,
        body.style-clean-wireframe .wf-sidebar-footer,
        body.style-clean-wireframe .wf-card-header,
        body.style-clean-wireframe .wf-page-header {
            border-color: var(--wf-border-light);
        }

        body.style-clean-wireframe .wf-sidebar-logo,
        body.style-clean-wireframe .wf-sidebar-avatar,
        body.style-clean-wireframe .wf-welcome-avatar,
        body.style-clean-wireframe .wf-stat-icon {
            background: #f1f5f9;
            border: 1px solid var(--wf-border);
            color: var(--wf-text-primary);
        }

        body.style-clean-wireframe .wf-nav-item:hover {
            background: #f1f5f9;
        }

        body.style-clean-wireframe .wf-nav-item.active {
            background: #cbd5e1;
            border: 1px solid var(--wf-border);
            color: var(--wf-text-primary);
        }

        body.style-clean-wireframe .wf-welcome-card,
        body.style-clean-wireframe .wf-stat-card,
        body.style-clean-wireframe .wf-card,
        body.style-clean-wireframe .wf-header-btn,
        body.style-clean-wireframe .wf-year-tag {
            border: 1px solid var(--wf-border);
            box-shadow: none;
        }
        
        body.style-clean-wireframe .wf-welcome-meta .status::before {
            background: var(--wf-border);
        }

        body.style-clean-wireframe .wf-timeline-item::before {
            background: #ffffff;
            border: 2px solid var(--wf-border);
        }

        /* Sketchy Wireframe Theme Variables */
        @import url('https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap');
        
        body.style-sketchy-wireframe {
            --wf-primary: #1e1e1e;
            --wf-primary-light: #444444;
            --wf-primary-dark: #000000;
            --wf-bg: #faf6ee;
            --wf-surface: #fffefb;
            --wf-border: #1e1e1e;
            --wf-border-light: #dcd5c6;
            --wf-text-primary: #1e1e1e;
            --wf-text-secondary: #333333;
            --wf-text-muted: #666666;
            --wf-success: #1e1e1e;
            --wf-warning: #1e1e1e;
            --wf-danger: #1e1e1e;
            --wf-info: #1e1e1e;
            --wf-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
            --wf-radius-sm: 255px 10px 225px 10px/10px 225px 10px 255px;
            --wf-radius-lg: 255px 15px 225px 15px/15px 225px 15px 255px;
            --wf-shadow: none;
            --wf-shadow-sm: none;
            --wf-shadow-md: none;
            font-family: 'Architects Daughter', 'Comic Sans MS', cursive, sans-serif;
        }

        body.style-sketchy-wireframe .wf-sidebar,
        body.style-sketchy-wireframe .wf-header {
            background: #faf6ee;
            border-color: var(--wf-border);
            border-width: 2.5px;
        }

        body.style-sketchy-wireframe .wf-sidebar-brand,
        body.style-sketchy-wireframe .wf-sidebar-footer,
        body.style-sketchy-wireframe .wf-card-header,
        body.style-sketchy-wireframe .wf-page-header {
            border-color: var(--wf-border);
            border-width: 2.5px;
        }

        body.style-sketchy-wireframe .wf-sidebar-logo,
        body.style-sketchy-wireframe .wf-sidebar-avatar,
        body.style-sketchy-wireframe .wf-welcome-avatar,
        body.style-sketchy-wireframe .wf-stat-icon {
            background: #f3edd7;
            border: 2.5px solid var(--wf-border);
            color: var(--wf-text-primary);
        }

        body.style-sketchy-wireframe .wf-nav-item:hover {
            background: #f3edd7;
        }

        body.style-sketchy-wireframe .wf-nav-item.active {
            background: #eae0c9;
            border: 2.5px solid var(--wf-border);
            color: var(--wf-text-primary);
        }

        body.style-sketchy-wireframe .wf-welcome-card,
        body.style-sketchy-wireframe .wf-stat-card,
        body.style-sketchy-wireframe .wf-card,
        body.style-sketchy-wireframe .wf-header-btn,
        body.style-sketchy-wireframe .wf-year-tag {
            border: 2.5px solid var(--wf-border);
            box-shadow: none;
        }
        
        body.style-sketchy-wireframe .wf-welcome-meta .status::before {
            background: var(--wf-border);
        }

        body.style-sketchy-wireframe .wf-timeline-item::before {
            background: #fffefb;
            border: 2.5px solid var(--wf-border);
        }
    `;
    document.head.appendChild(style);

    // Inject the HTML for the switcher panel
    const container = document.createElement('div');
    container.className = 'wf-style-switcher-container';
    container.innerHTML = `
        <div class="wf-style-switcher collapsed" id="wfStyleSwitcherPanel">
            <button class="switcher-btn active" data-style="prototype">
                <span class="material-symbols-outlined" style="font-size:16px">palette</span> Prototype
            </button>
            <button class="switcher-btn" data-style="clean-wireframe">
                <span class="material-symbols-outlined" style="font-size:16px">grid_view</span> Wireframe
            </button>
            <button class="switcher-btn" data-style="sketchy-wireframe">
                <span class="material-symbols-outlined" style="font-size:16px">draw</span> Sketsa
            </button>
        </div>
        <button class="wf-style-switcher-toggle" id="wfStyleSwitcherToggle" title="Pilih Tema">
            <span class="material-symbols-outlined" style="font-size:24px">settings</span>
        </button>
    `;
    document.body.appendChild(container);

    // JavaScript logic for switcher
    const body = document.body;
    const buttons = document.querySelectorAll('.switcher-btn');
    const toggleBtn = document.getElementById('wfStyleSwitcherToggle');
    const panel = document.getElementById('wfStyleSwitcherPanel');

    // Toggle Panel
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        const icon = toggleBtn.querySelector('.material-symbols-outlined');
        if (panel.classList.contains('collapsed')) {
            icon.textContent = 'settings';
        } else {
            icon.textContent = 'close';
        }
    });

    // Load saved theme style from localStorage if present
    const savedStyle = localStorage.getItem('wf-style');
    if (savedStyle) {
        applyStyle(savedStyle);
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const styleName = btn.getAttribute('data-style');
            applyStyle(styleName);
            localStorage.setItem('wf-style', styleName);
        });
    });

    function applyStyle(styleName) {
        // Remove styles
        body.classList.remove('style-clean-wireframe', 'style-sketchy-wireframe');
        buttons.forEach(b => b.classList.remove('active'));

        // Apply new style class
        if (styleName === 'clean-wireframe') {
            body.classList.add('style-clean-wireframe');
            const btn = document.querySelector('[data-style="clean-wireframe"]');
            if(btn) btn.classList.add('active');
        } else if (styleName === 'sketchy-wireframe') {
            body.classList.add('style-sketchy-wireframe');
            const btn = document.querySelector('[data-style="sketchy-wireframe"]');
            if(btn) btn.classList.add('active');
        } else {
            const btn = document.querySelector('[data-style="prototype"]');
            if(btn) btn.classList.add('active');
        }
    }
})();
