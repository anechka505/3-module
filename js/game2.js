// Игра 2 — Капсулы
// перетаскиваем пилюльки к нужным приёмникам, они летят по трубкам на планету


(function() {
    function isMobile() { return window.innerWidth <= 780; }

    // размеры капсулы (меняются в init())
    var CAPSULE_W, CAPSULE_H, CONTAINER_W, CONTAINER_H;

    // ─── ДЕСКТОП ─────────────────────────────────────────────────────────────
    var desktopCapsuleData = [
        // статичные (уже на планете)
        { type: 'yellow',  x: 826.93,  y: 290.846, rot: 118.888,  draggable: false },
        { type: 'yellow',  x: 798.931, y: 433.846, rot: 118.888,  draggable: false },
        { type: 'pink',    x: 770.047, y: 234.02,  rot: 134.915,  draggable: false },
        { type: 'pink',    x: 722.84,  y: 490.893, rot: -173.839, draggable: false },
        { type: 'pink',    x: 819.056, y: 572.999, rot: 134.863,  draggable: false },
        { type: 'pinkdot', x: 876.198, y: 364.973, rot: -178.565, draggable: false },
        { type: 'pinkdot', x: 876.764, y: 411.713, rot: 94.838,   draggable: false },
        // перетаскиваемые
        { type: 'yellow',  x: 227.617, y: 493.999, rot: 118.888,  draggable: true, finalX: 779.931, finalY: 356.543, finalRot: 118.888 },
        { type: 'yellow',  x: 267.274, y: 672.08,  rot: -146.778, draggable: true, finalX: 882.906, finalY: 531.984, finalRot: -146.778 },
        { type: 'yellow',  x: 255.301, y: 309.932, rot: 89.421,   draggable: true, finalX: 873.172, finalY: 253,     finalRot: 89.421 },
        { type: 'yellow',  x: 117.629, y: 613.718, rot: 147.948,  draggable: true, finalX: 812.203, finalY: 490.27,  finalRot: 147.948 },
        { type: 'pink',    x: 326.387, y: 457.335, rot: 158.905,  draggable: true, finalX: 845.429, finalY: 207.018, finalRot: 158.905 },
        { type: 'pink',    x: 112.391, y: 511.957, rot: 113.002,  draggable: true, finalX: 763.516, finalY: 533.572, finalRot: 113.002 },
        { type: 'pink',    x: 183.473, y: 611.473, rot: -143.349, draggable: true, finalX: 689.208, finalY: 443.873, finalRot: -143.349 },
        { type: 'pink',    x: 165.516, y: 428.155, rot: 134.915,  draggable: true, finalX: 710.047, finalY: 339.717, finalRot: 134.915 },
        { type: 'pink',    x: 322.047, y: 309.717, rot: 134.915,  draggable: true, finalX: 747.049, finalY: 283.717, finalRot: 134.915 },
        { type: 'pink',    x: 333.121, y: 589.774, rot: -172.374, draggable: true, finalX: 890.023, finalY: 608.571, finalRot: -172.374 },
        { type: 'pinkdot', x: 158.723, y: 341.11,  rot: -178.565, draggable: true, finalX: 839.192, finalY: 391.67,  finalRot: -178.565 },
        { type: 'pinkdot', x: 273.262, y: 542.357, rot: 94.838,   draggable: true, finalX: 896.764, finalY: 442.713, finalRot: 94.838 },
        { type: 'pinkdot', x: 246.324, y: 377.743, rot: 94.838,   draggable: true, finalX: 890.766, finalY: 377.714, finalRot: 94.838 },
        { type: 'pinkdot', x: 57.738,  y: 428.604, rot: -152.63,  draggable: true, finalX: 881.938, finalY: 329.86,  finalRot: -152.63 }
    ];

    var desktopTubeRoutes = {
        pink: [
            { x: 46.76, y: 14.42 },
            { x: 48.89, y: 14.67 },
            { x: 73.73, y: 14.67 },
            { x: 73.73, y: 22.56 }
        ],
        yellow: [
            { x: 46.74, y: 50.35 },
            { x: 46.74, y: 50.68 },
            { x: 66.49, y: 51.44 }
        ],
        pinkdot: [
            { x: 46.74, y: 85.12 },
            { x: 45.98, y: 84.48 },
            { x: 71.55, y: 84.48 },
            { x: 71.55, y: 55.86 }
        ]
    };

 

    var mobileCapsuleData = [
        // статичные — на планете 
        { type: 'yellow',  x: 199.8, y: 446.8, rot: 118.888,  draggable: false },
        { type: 'yellow',  x: 187.7, y: 508.7, rot: 118.888,  draggable: false },
        { type: 'pink',    x: 175.2, y: 423.8, rot: 134.915,  draggable: false },
        { type: 'pink',    x: 152.0, y: 538.7, rot: -173.839, draggable: false },
        { type: 'pink',    x: 196.4, y: 570.4, rot: 134.863,  draggable: false },
        { type: 'pinkdot', x: 218.7, y: 484.1, rot: -178.565, draggable: false },
        { type: 'pinkdot', x: 220.7, y: 496.9, rot: 94.838,   draggable: false },
        // перетаскиваемые — в верхней панели 
        { type: 'yellow',  x: 183.4, y: 168.7, rot: -26.06,  draggable: true, finalX: 179.5, finalY: 475.2, finalRot: 118.888 },
        { type: 'yellow',  x: 300.7, y: 96.4,  rot: -120.39, draggable: true, finalX: 218.7, finalY: 557.2, finalRot: -146.778 },
        { type: 'yellow',  x: 36.4,  y: 118.9, rot: 3.41,    draggable: true, finalX: 218.9, finalY: 427.8, finalRot: 89.421 },
        { type: 'yellow',  x: 288.7, y: 215.3, rot: -55.12,  draggable: true, finalX: 193.1, finalY: 535.8, finalRot: 147.948 },
        { type: 'pink',    x: 150.5, y: 123.1, rot: -66.08,  draggable: true, finalX: 206.9, finalY: 414.3, finalRot: 158.905 },
        { type: 'pink',    x: 215.3, y: 217.4, rot: -20.17,  draggable: true, finalX: 172.3, finalY: 551.2, finalRot: 113.002 },
        { type: 'pink',    x: 286.1, y: 156.4, rot: -123.82, draggable: true, finalX: 134.6, finalY: 519.1, finalRot: -143.349 },
        { type: 'pink',    x: 126.0, y: 182.3, rot: -42.09,  draggable: true, finalX: 149.2, finalY: 469.5, finalRot: 134.915 },
        { type: 'pink',    x: 33.8,  y: 68.5,  rot: -42.09,  draggable: true, finalX: 165.2, finalY: 445.3, finalRot: 134.915 },
        { type: 'pink',    x: 263.0, y: 102.4, rot: -94.8,   draggable: true, finalX: 224.1, finalY: 589.7, finalRot: -172.374 },
        { type: 'pinkdot', x: 34.6,  y: 188.9, rot: -88.61,  draggable: true, finalX: 202.7, finalY: 495.6, finalRot: -178.565 },
        { type: 'pinkdot', x: 209.2, y: 124.9, rot: -2.01,   draggable: true, finalX: 229.3, finalY: 510.3, finalRot: 94.838 },
        { type: 'pinkdot', x: 73.8,  y: 146.7, rot: -2.01,   draggable: true, finalX: 226.8, finalY: 482.2, finalRot: 94.838 },
        { type: 'pinkdot', x: 97.0,  y: 241.9, rot: -114.54, draggable: true, finalX: 218.9, finalY: 469.7, finalRot: -152.63 }
    ];

    
    // Маршруты 
    var mobileTubeRoutes = {
        pink: [
            { x: 21.2, y: 56.4 },
            { x: 24.2, y: 56.5 },
            { x: 59.0, y: 56.5 },
            { x: 59.0, y: 60.4 }
        ],
        yellow: [
            { x: 21.2, y: 74.5 },
            { x: 21.2, y: 74.6 },
            { x: 48.8, y: 74.9 }
        ],
        pinkdot: [
            { x: 20.1, y: 91.3 },
            { x: 55.9, y: 91.3 },
            { x: 55.9, y: 77.1 }
        ]
    };


    var capsuleData, tubeRoutes;
    var placedCount = 0;
    var totalDraggable = 14;
    var container = document.getElementById('game2-inner');
    var capsulesDiv = document.getElementById('game2-capsules');
    var dragging = null;

    // считаем центр повёрнутой капсулы
    function getCapsuleCenter(c) {
        var rad = c.rot * Math.PI / 180;
        var dx = CAPSULE_W / 2;
        var dy = CAPSULE_H / 2;
        var cx = c.x + dx * Math.cos(rad) - dy * Math.sin(rad);
        var cy = c.y + dx * Math.sin(rad) + dy * Math.cos(rad);
        return { x: cx / CONTAINER_W * 100, y: cy / CONTAINER_H * 100 };
    }

    function init() {
        var mobile = isMobile();

        // задаём размеры под режим
        if (mobile) {
            CAPSULE_W = 15;   CAPSULE_H = 23;
            CONTAINER_W = 370; CONTAINER_H = 654;
            capsuleData = mobileCapsuleData;
            tubeRoutes  = mobileTubeRoutes;
            // SVG кроп-квадрат: планета — круг, заполняет правую часть дроп-зоны
            var bgSvg = container.querySelector('.game2__bg');
            if (bgSvg) {
                bgSvg.setAttribute('viewBox', '320 -60 830 830');
                bgSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            }
        } else {
            CAPSULE_W = 20.2025; CAPSULE_H = 32.1743;
            CONTAINER_W = 1196;  CONTAINER_H = 755;
            capsuleData = desktopCapsuleData;
            tubeRoutes  = desktopTubeRoutes;
            // сбрасываем viewBox на оригинальный (на случай если до этого был мобильный)
            var bgSvg = container.querySelector('.game2__bg');
            if (bgSvg) {
                bgSvg.setAttribute('viewBox', '0 0 1196 755');
                bgSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            }
        }

        capsulesDiv.innerHTML = '';
        placedCount = 0;
        document.getElementById('game2-success').classList.remove('visible');
        document.getElementById('game2-restart').classList.remove('visible');

        capsuleData.forEach(function(data, i) {
            var el = document.createElement('div');
            var center = getCapsuleCenter(data);

            el.className = 'game2__capsule game2__capsule--' + data.type;
            if (data.draggable) {
                el.className += ' game2__capsule--draggable';
            } else {
                el.className += ' game2__capsule--static';
            }

            el.style.left = center.x + '%';
            el.style.top  = center.y + '%';
            el.style.transform = 'translate(-50%, -50%) rotate(' + data.rot + 'deg)';

            el.dataset.index = i;
            el.dataset.type  = data.type;

            if (data.draggable) {
                el.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    startDrag(el, data, e);
                });
                el.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    startDrag(el, data, e.touches[0]);
                }, { passive: false });
            }

            capsulesDiv.appendChild(el);
        });
    }

    function startDrag(el, data, e) {
        if (el.classList.contains('placed')) return;

        var containerRect = container.getBoundingClientRect();
        var elLeft  = parseFloat(el.style.left);
        var elTop   = parseFloat(el.style.top);
        var mouseX  = (e.clientX - containerRect.left)  / containerRect.width  * 100;
        var mouseY  = (e.clientY - containerRect.top)   / containerRect.height * 100;

        dragging = {
            el: el, data: data,
            offsetX: mouseX - elLeft,
            offsetY: mouseY - elTop
        };

        el.classList.add('dragging');
    }

    function onMove(e) {
        if (!dragging) return;
        var containerRect = container.getBoundingClientRect();
        var clientX = e.clientX || (e.touches && e.touches[0].clientX);
        var clientY = e.clientY || (e.touches && e.touches[0].clientY);

        var x = (clientX - containerRect.left)  / containerRect.width  * 100;
        var y = (clientY - containerRect.top)   / containerRect.height * 100;

        dragging.el.style.left = (x - dragging.offsetX) + '%';
        dragging.el.style.top  = (y - dragging.offsetY) + '%';
    }

    function onEnd(e) {
        if (!dragging) return;

        var el   = dragging.el;
        var data = dragging.data;
        el.classList.remove('dragging');

        var receivers = document.querySelectorAll('.game2__receiver');
        var dropped   = false;

        receivers.forEach(function(receiver) {
            if (dropped) return;
            var rRect    = receiver.getBoundingClientRect();
            var elRect   = el.getBoundingClientRect();
            var centerX  = elRect.left + elRect.width  / 2;
            var centerY  = elRect.top  + elRect.height / 2;
            var hitPad   = rRect.width * 0.5;

            if (centerX > rRect.left - hitPad && centerX < rRect.right  + hitPad &&
                centerY > rRect.top  - hitPad && centerY < rRect.bottom + hitPad) {
                if (receiver.dataset.type === data.type) {
                    dropped = true;
                    el.classList.add('placed');
                    animateAlongTube(el, data);
                    placedCount++;
                }
            }
        });

        if (!dropped) {
            var center = getCapsuleCenter(data);
            el.style.transition = 'left 0.3s ease, top 0.3s ease';
            el.style.left = center.x + '%';
            el.style.top  = center.y + '%';
            setTimeout(function() { el.style.transition = ''; }, 300);
        }

        dragging = null;
    }

    // капсула летит по трубке к планете
    function animateAlongTube(el, data) {
        var route = tubeRoutes[data.type];
        var step  = 0;
        var stepDurations = [];

        for (var i = 0; i < route.length - 1; i++) {
            var dx   = route[i + 1].x - route[i].x;
            var dy   = route[i + 1].y - route[i].y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            stepDurations.push(Math.max(250, dist * 22));
        }

        el.style.transition = 'left 0.4s ease, top 0.4s ease, transform 0.4s ease';
        el.style.left  = route[0].x + '%';
        el.style.top   = route[0].y + '%';
        el.style.transform = 'translate(-50%, -50%) rotate(' + data.rot + 'deg) scale(0.8)';

        var delay = 450;

        function nextStep() {
            if (step >= route.length - 1) {
                setTimeout(function() {
                    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    el.style.opacity    = '0';
                    el.style.transform  = 'translate(-50%, -50%) scale(0.3)';

                    setTimeout(function() {
                        var finalCenter = getCapsuleCenter({
                            x: data.finalX, y: data.finalY, rot: data.finalRot
                        });
                        el.style.transition = 'none';
                        el.style.left  = finalCenter.x + '%';
                        el.style.top   = finalCenter.y + '%';
                        el.style.transform = 'translate(-50%, -50%) rotate(' + data.finalRot + 'deg)';

                        requestAnimationFrame(function() {
                            el.style.transition = 'opacity 0.4s ease';
                            el.style.opacity    = '1';
                        });

                        if (placedCount >= totalDraggable) {
                            setTimeout(showSuccess, 500);
                        }
                    }, 550);
                }, 100);
                return;
            }

            var duration = stepDurations[step];
            el.style.transition = 'left ' + duration + 'ms linear, top ' + duration + 'ms linear';
            el.style.left = route[step + 1].x + '%';
            el.style.top  = route[step + 1].y + '%';

            step++;
            setTimeout(nextStep, duration);
        }

        setTimeout(nextStep, delay);
    }

    function showSuccess() {
        document.getElementById('game2-success').classList.add('visible');
        document.getElementById('game2-restart').classList.add('visible');
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', function(e) {
        if (dragging) { e.preventDefault(); onMove(e); }
    }, { passive: false });
    document.addEventListener('mouseup',   onEnd);
    document.addEventListener('touchend',  onEnd);

    document.getElementById('game2-restart').addEventListener('click', function() {
        init();
    });

    // переинициализация при переходе через 780px (десктоп ↔ мобилка)
    var lastMobile = isMobile();
    window.addEventListener('resize', function() {
        var nowMobile = isMobile();
        if (nowMobile !== lastMobile) {
            lastMobile = nowMobile;
            init();
        }
    });

    init();
})();
