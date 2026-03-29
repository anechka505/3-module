// Игра 1 — Звёзды и созвездия
// сначала кликаешь по звёздам, потом соединяешь точки в созвездия

(function() {
    var starsClicked = 0;
    var totalStars = 3;

    function isMobile() { return window.innerWidth <= 780; }

    // координаты точек из макета (в процентах от секции 1196x642)
    var constellations = [
        {
            name: 'enibus',
            resultId: 'result-enibus',
            dots: [
                { x: 12.98, y: 46.50 },
                { x: 19.05, y: 35.98 },
                { x: 24.96, y: 46.50 },
                { x: 19.40, y: 57.17 }
            ],
            connections: [[0,1],[1,2],[2,3],[3,0]] // квадратик
        },
        {
            name: 'beribus',
            resultId: 'result-beribus',
            dots: [
                { x: 40.11, y: 37.26 },
                { x: 36.95, y: 42.36 },
                { x: 38.23, y: 48.10 },
                { x: 42.42, y: 51.61 },
                { x: 46.70, y: 49.85 },
                { x: 44.82, y: 37.26 },
                { x: 47.90, y: 42.68 }
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,6],[6,5],[5,0]] // такая загогулина
        },
        {
            name: 'erobus',
            resultId: 'result-erobus',
            dots: [
                { x: 58.91, y: 42.73 },
                { x: 64.82, y: 49.90 },
                { x: 68.32, y: 38.43 }
            ],
            connections: [[0,1],[1,2],[2,0]] // треугольни
        },
        {
            name: 'shirobus',
            resultId: 'result-shirobus',
            dots: [
                { x: 80.02, y: 35.47 },
                { x: 84.33, y: 52.72 }
            ],
            connections: [[0,1]] // одна линия
        }
    ];

    // координаты точек для мобильного макета (в процентах от 362x763)
    var mobileConstellations = [
        {
            name: 'enibus',
            resultId: 'result-enibus',
            dots: [
                { x: 12.71, y: 34.80 },
                { x: 27.12, y: 28.44 },
                { x: 41.12, y: 34.80 },
                { x: 27.93, y: 41.25 }
            ],
            connections: [[0,1],[1,2],[2,3],[3,0]]
        },
        {
            name: 'beribus',
            resultId: 'result-beribus',
            dots: [
                { x: 67.18, y: 31.59 },
                { x: 59.67, y: 34.67 },
                { x: 62.71, y: 38.13 },
                { x: 72.66, y: 40.25 },
                { x: 82.81, y: 39.19 },
                { x: 78.34, y: 31.59 },
                { x: 85.65, y: 34.86 }
            ],
            connections: [[0,1],[1,2],[2,3],[3,4],[4,6],[6,5],[5,0]]
        },
        {
            name: 'erobus',
            resultId: 'result-erobus',
            dots: [
                { x: 13.54, y: 68.00 },
                { x: 27.54, y: 72.33 },
                { x: 35.86, y: 65.40 }
            ],
            connections: [[0,1],[1,2],[2,0]]
        },
        {
            name: 'shirobus',
            resultId: 'result-shirobus',
            dots: [
                { x: 69.91, y: 64.70 },
                { x: 80.12, y: 75.13 }
            ],
            connections: [[0,1]]
        }
    ];

    var activeConstellations = constellations;
    var completedConstellations = 0;
    var constellationStates = [];
    var dragState = {
        active: false,
        constellation: null,
        dot: null,
        tempLine: null
    };

    // кликаем по звёздам
    var stars = document.querySelectorAll('.game1__star');
    stars.forEach(function(star) {
        star.addEventListener('click', function() {
            if (this.classList.contains('clicked')) return;
            this.classList.add('clicked');
            starsClicked++;
            if (starsClicked >= totalStars) {
                // все нажаты — переходим к созвездиям
                setTimeout(function() {
                    showState2();
                }, 600);
            }
        });
    });

    function showState2() {
        document.getElementById('game1-state1').style.display = 'none';
        var state2 = document.getElementById('game1-state2');
        state2.classList.add('active');
        if (isMobile()) {
            document.querySelector('.game1__inner').classList.add('game1--state2-active');
        }
        initConstellations();
    }

    // создаём точки и пунктирные подсказки
    function initConstellations() {
        var container = document.getElementById('game1-constellations');
        var svgLines = document.getElementById('game1-lines');
        container.innerHTML = '';
        svgLines.innerHTML = '';
        completedConstellations = 0;
        constellationStates = [];

        activeConstellations = isMobile() ? mobileConstellations : constellations;

        // пунктирные линии-подсказки
        activeConstellations.forEach(function(c, ci) {
            c.connections.forEach(function(conn, li) {
                var dotFrom = c.dots[conn[0]];
                var dotTo = c.dots[conn[1]];
                var guide = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                guide.setAttribute('x1', dotFrom.x + '%');
                guide.setAttribute('y1', dotFrom.y + '%');
                guide.setAttribute('x2', dotTo.x + '%');
                guide.setAttribute('y2', dotTo.y + '%');
                guide.setAttribute('stroke', '#4B5A5E');
                guide.setAttribute('stroke-width', '1');
                guide.setAttribute('stroke-dasharray', '4 8');
                guide.setAttribute('data-guide', ci + '-' + li);
                svgLines.appendChild(guide);
            });
        });

        // ставим жёлтые точки
        activeConstellations.forEach(function(c, ci) {
            var state = {
                selectedDot: null,
                completedLines: [],
                totalLines: c.connections.length,
                done: false
            };
            constellationStates.push(state);

            c.dots.forEach(function(dot, di) {
                var el = document.createElement('div');
                el.className = 'game1__dot';
                el.style.left = dot.x + '%';
                el.style.top = dot.y + '%';
                el.dataset.constellation = ci;
                el.dataset.dot = di;

                el.addEventListener('mousedown', function(e) {
                    e.preventDefault();
                    startDrag(ci, di, e);
                });
                el.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    var touch = e.touches[0];
                    startDrag(ci, di, touch);
                }, { passive: false });

                container.appendChild(el);
            });
        });

        // слушаем движение мыши и отпускание
        var inner = document.querySelector('.game1__inner');
        inner.addEventListener('mousemove', onDragMove);
        inner.addEventListener('touchmove', function(e) {
            if (dragState.active) {
                e.preventDefault();
                onDragMove(e.touches[0]);
            }
        }, { passive: false });
        inner.addEventListener('mouseup', onDragEnd);
        inner.addEventListener('touchend', function(e) {
            if (dragState.active) {
                var touch = e.changedTouches[0];
                onDragEnd(touch);
            }
        });
    }

    // начинаем тянуть линию от точки
    function startDrag(ci, di, e) {
        var state = constellationStates[ci];
        if (state.done) return;

        dragState.active = true;
        dragState.constellation = ci;
        dragState.dot = di;

        highlightDot(ci, di, true);

        // временная линия которая тянется за мышкой
        var svg = document.getElementById('game1-lines');
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        var dot = activeConstellations[ci].dots[di];
        line.setAttribute('x1', dot.x + '%');
        line.setAttribute('y1', dot.y + '%');
        line.setAttribute('x2', dot.x + '%');
        line.setAttribute('y2', dot.y + '%');
        line.style.opacity = '0.5';
        svg.appendChild(line);
        dragState.tempLine = line;
    }

    // линия следует за курсором
    function onDragMove(e) {
        if (!dragState.active || !dragState.tempLine) return;

        var svg = document.getElementById('game1-lines');
        var rect = svg.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;

        dragState.tempLine.setAttribute('x2', x + '%');
        dragState.tempLine.setAttribute('y2', y + '%');
    }

    // отпустили — проверяем попали ли на другую точку
    function onDragEnd(e) {
        if (!dragState.active) return;

        var ci = dragState.constellation;
        var fromDi = dragState.dot;

        // убираем временную линию
        if (dragState.tempLine) {
            dragState.tempLine.remove();
            dragState.tempLine = null;
        }

        highlightDot(ci, fromDi, false);

        // ищем точку под курсором
        var svg = document.getElementById('game1-lines');
        var rect = svg.getBoundingClientRect();
        var ex = e.clientX;
        var ey = e.clientY;

        var targetDi = findDotAt(ci, ex, ey, rect);

        if (targetDi !== null && targetDi !== fromDi) {
            var validConnection = checkConnection(ci, fromDi, targetDi);
            if (validConnection && !isLineDrawn(ci, fromDi, targetDi)) {
                drawLine(ci, fromDi, targetDi);
                removeGuide(ci, fromDi, targetDi);
                var state = constellationStates[ci];
                state.completedLines.push([fromDi, targetDi]);

                // созвездие собрано!
                if (state.completedLines.length >= state.totalLines) {
                    state.done = true;
                    completedConstellations++;
                    showCreatureResult(ci);

                    if (completedConstellations >= activeConstellations.length) {
                        showRestartButton();
                    }
                }
            }
        }

        dragState.active = false;
        dragState.constellation = null;
        dragState.dot = null;
    }

    // ищем точку рядом с позицией курсора
    function findDotAt(ci, clientX, clientY, svgRect) {
        var c = activeConstellations[ci];
        var hitRadius = 25; // пиксели, область попадания

        for (var di = 0; di < c.dots.length; di++) {
            var dotX = svgRect.left + (c.dots[di].x / 100) * svgRect.width;
            var dotY = svgRect.top + (c.dots[di].y / 100) * svgRect.height;
            var dist = Math.sqrt(Math.pow(clientX - dotX, 2) + Math.pow(clientY - dotY, 2));
            if (dist < hitRadius) {
                return di;
            }
        }
        return null;
    }

    // есть ли такое соединение в массиве connections
    function checkConnection(ci, from, to) {
        var connections = activeConstellations[ci].connections;
        for (var i = 0; i < connections.length; i++) {
            var c = connections[i];
            if ((c[0] === from && c[1] === to) || (c[0] === to && c[1] === from)) {
                return true;
            }
        }
        return false;
    }

    // уже рисовали эту линию?
    function isLineDrawn(ci, from, to) {
        var lines = constellationStates[ci].completedLines;
        for (var i = 0; i < lines.length; i++) {
            if ((lines[i][0] === from && lines[i][1] === to) ||
                (lines[i][0] === to && lines[i][1] === from)) {
                return true;
            }
        }
        return false;
    }

    // подсвечиваем активную точку
    function highlightDot(ci, di, active) {
        var dots = document.querySelectorAll('.game1__dot');
        dots.forEach(function(dot) {
            if (parseInt(dot.dataset.constellation) === ci && parseInt(dot.dataset.dot) === di) {
                if (active) {
                    dot.style.boxShadow = '0 0 15px var(--yellow)';
                    dot.style.transform = 'translate(-50%, -50%) scale(1.3)';
                } else {
                    dot.style.boxShadow = '';
                    dot.style.transform = 'translate(-50%, -50%)';
                }
            }
        });
    }

    // убираем пунктирную подсказку когда линия нарисована
    function removeGuide(ci, from, to) {
        var c = activeConstellations[ci];
        for (var i = 0; i < c.connections.length; i++) {
            var conn = c.connections[i];
            if ((conn[0] === from && conn[1] === to) || (conn[0] === to && conn[1] === from)) {
                var guide = document.querySelector('[data-guide="' + ci + '-' + i + '"]');
                if (guide) {
                    guide.style.transition = 'opacity 0.3s';
                    guide.style.opacity = '0';
                    setTimeout(function() { guide.remove(); }, 300);
                }
                break;
            }
        }
    }

    // рисуем постоянную линию между точками
    function drawLine(ci, from, to) {
        var svg = document.getElementById('game1-lines');
        var c = activeConstellations[ci];
        var dotFrom = c.dots[from];
        var dotTo = c.dots[to];

        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', dotFrom.x + '%');
        line.setAttribute('y1', dotFrom.y + '%');
        line.setAttribute('x2', dotTo.x + '%');
        line.setAttribute('y2', dotTo.y + '%');
        line.style.opacity = '0';
        svg.appendChild(line);

        requestAnimationFrame(function() {
            line.style.transition = 'opacity 0.5s ease';
            line.style.opacity = '1';
        });
    }

    // показываем существо когда созвездие собрано
    function showCreatureResult(ci) {
        var c = activeConstellations[ci];
        var result = document.getElementById(c.resultId);
        if (result) {
            result.classList.add('visible');
        }
    }

    function showRestartButton() {
        var btn = document.getElementById('game1-restart');
        btn.classList.add('visible');
    }

    // перезапуск — всё сначала
    document.getElementById('game1-restart').addEventListener('click', function() {
        this.classList.remove('visible');

        var results = document.querySelectorAll('.game1__creature-result');
        results.forEach(function(r) { r.classList.remove('visible'); });

        document.getElementById('game1-state2').classList.remove('active');
        document.getElementById('game1-state1').style.display = '';

        starsClicked = 0;
        stars.forEach(function(star) {
            star.classList.remove('clicked');
        });

        var inner = document.querySelector('.game1__inner');
        inner.classList.remove('game1--state2-active');
        inner.removeEventListener('mousemove', onDragMove);
    });
})();
