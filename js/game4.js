// Игра 4 — Лупа
// водишь лупой по Пухляшу и ищешь микроорганизмов
// они скрыты и видны только через стекло

(function() {

    // данные по микроорганизмам
    var microbes = {
        enibus: {
            name: 'энибус',
            desc: 'Живёт в\u00A0верхнем слое кожи космозверя. Ищет тепло и\u00A0свет, поэтому часто выбирается на\u00A0поверхность.'
        },
        shirobus: {
            name: 'широбус',
            desc: 'Обитает в\u00A0складках космозверя. Любит тёмные и\u00A0тёплые места, питается космическими частицами.'
        },
        beribus: {
            name: 'берибус',
            desc: 'Прячется глубоко в\u00A0шерсти космозверя. Очень маленький, но\u00A0заметен при\u00A0свете звёзд.'
        },
        erobus: {
            name: 'еробус',
            desc: 'Самый подвижный из\u00A0микробов. Быстро перемещается по\u00A0телу зверька Пухляша.'
        }
    };

    var gameInner = document.getElementById('game4-inner');
    var magnifier = document.getElementById('game4-magnifier');
    var infoPanel = document.getElementById('game4-info');
    var infoName = document.getElementById('game4-info-name');
    var infoDesc = document.getElementById('game4-info-desc');
    var zones = document.querySelectorAll('.game4__zone');

    // параметры линзы Замет
    // центр стекла и его радиус в долях от размера лупы
    var LENS_CX_RATIO = 108.882 / 300;
    var LENS_CY_RATIO = 108.882 / 307;
    var LENS_R_RATIO = 73.3265 / 300;

    // смещение лупы (css transform translate -30% -30%)
    var MAG_OFFSET_X = 0.3;
    var MAG_OFFSET_Y = 0.3;

    // двигаем лупу за курсором/пальцем и проверяем пересечение с микроорганизмами
    function moveMagnifier(clientX, clientY) {
        var rect = gameInner.getBoundingClientRect();
        var posX = clientX - rect.left;
        var posY = clientY - rect.top;

        // ставим лупу туда где курсор/палец
        magnifier.style.left = posX + 'px';
        magnifier.style.top = posY + 'px';
        magnifier.style.display = 'block';

        // считаем где центр линзы в координатах игровой области
        var magW = magnifier.offsetWidth;
        var magH = magnifier.offsetHeight;
        var lensCenterX = posX - MAG_OFFSET_X * magW + LENS_CX_RATIO * magW;
        var lensCenterY = posY - MAG_OFFSET_Y * magH + LENS_CY_RATIO * magH;
        var lensRadius = LENS_R_RATIO * magW;

        // проверяем каждую зону с микроорганизмом
        var foundMicrobe = null;

        zones.forEach(function(zone) {
            var zoneRect = zone.getBoundingClientRect();
            var zoneLeft = zoneRect.left - rect.left;
            var zoneTop = zoneRect.top - rect.top;
            var zoneW = zoneRect.width;
            var zoneH = zoneRect.height;

            // центр линзы относительно зоны микроорганизма
            var relX = lensCenterX - zoneLeft;
            var relY = lensCenterY - zoneTop;

            // обрезаем картинку кругом линзы — видно только то что попало в лупу
            zone.style.clipPath = 'circle(' + lensRadius + 'px at ' + relX + 'px ' + relY + 'px)';

            // если центр микроорганизма достаточно близко к центру линзы — показываем инфу
            var zoneCenterX = zoneLeft + zoneW / 2;
            var zoneCenterY = zoneTop + zoneH / 2;
            var dx = zoneCenterX - lensCenterX;
            var dy = zoneCenterY - lensCenterY;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < lensRadius * 0.6) {
                foundMicrobe = zone.dataset.microbe;
            }
        });

        // показываем или прячем панель с описанием
        if (foundMicrobe && microbes[foundMicrobe]) {
            var data = microbes[foundMicrobe];
            infoName.textContent = data.name;
            infoDesc.textContent = data.desc;
            infoPanel.classList.add('visible');
        } else {
            infoPanel.classList.remove('visible');
        }
    }

    function hideMagnifier() {
        magnifier.style.display = 'none';
        infoPanel.classList.remove('visible');
        zones.forEach(function(zone) {
            zone.style.clipPath = 'circle(0% at 50% 50%)';
        });
    }

    // мышь
    gameInner.addEventListener('mousemove', function(e) {
        moveMagnifier(e.clientX, e.clientY);
    });

    // когда мышка ушла из области игры — всё прячем
    gameInner.addEventListener('mouseleave', hideMagnifier);

    // касание
    gameInner.addEventListener('touchstart', function(e) {
        e.preventDefault();
        var touch = e.touches[0];
        moveMagnifier(touch.clientX, touch.clientY);
    }, { passive: false });

    gameInner.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var touch = e.touches[0];
        moveMagnifier(touch.clientX, touch.clientY);
    }, { passive: false });

    gameInner.addEventListener('touchend', hideMagnifier);

})();
