// Игра 3 — Слот-машина
// дёргаешь рычаг, крутятся части тел, собирается животное


(function() {

    // все существа с описаниями и путями к картинкам
    var creatures = [
        {
            name: 'лумви',
            desc: 'Живёт на\u00A0луне Лум. Питается тёплым светом, любит тихо шуршать в\u00A0траве и\u00A0прятать следы.',
            head: 'images/lumvi-head.svg',
            body: 'images/lumvi-body.svg',
            legs: 'images/lumvi-legs.svg',
            full: 'images/lumvi-full.svg'
        },
        {
            name: 'мирсо',
            desc: 'Живёт на\u00A0планете Мир. Питается лунной росой, умеет собирать туман в\u00A0маленькие облака.',
            head: 'images/mirso-head.svg',
            body: 'images/mirso-body.svg',
            legs: 'images/mirso-legs.svg',
            full: 'images/mirso-full.svg'
        },
        {
            name: 'олери',
            desc: 'Живёт на\u00A0планете Олер. Питается пыльцой комет, может долго не\u00A0спать и\u00A0беречь чужой сон.',
            head: 'images/oleri-head.svg',
            body: 'images/oleri-body.svg',
            legs: 'images/oleri-legs.svg',
            full: 'images/oleri-full.svg'
        },
        {
            name: 'вапут',
            desc: 'Живет на\u00A0планете Вап. Питается звездными хвостами, умеет быстро затягивать озоновую дыру и\u00A0светиться',
            head: 'images/vaput-head.svg',
            body: 'images/vaput-body.svg',
            legs: 'images/vaput-legs.svg',
            full: 'images/vaput-full.svg'
        },
        {
            name: 'селли',
            desc: 'Живёт на\u00A0луне Сел. Питается искрами звёзд, умеет находить дорогу даже в\u00A0полной темноте.',
            head: 'images/selli-head.svg',
            body: 'images/selli-body.svg',
            legs: 'images/selli-legs.svg',
            full: 'images/selli-full.svg'
        }
    ];

    // заранее подгружаем все картинки чтобы не было пустых мест при прокрутке
    creatures.forEach(function(c) {
        ['head', 'body', 'legs', 'full'].forEach(function(part) {
            var img = new Image();
            img.src = c[part];
        });
    });

    var currentCreatureIndex = 0; // какое существо выпадет следующим
    var isSpinning = false;       // чтобы нельзя было дёргать рычаг пока крутится
    var lever = document.getElementById('game3-lever');
    var SPIN_COUNT = 15; // чем больше — тем дольше крутится, 15 норм

    // собираем ленту барабана для одного окошка
    function buildDrum(slotEl, part, targetCreature) {
        var windowW = slotEl.offsetWidth;
        var windowH = slotEl.offsetHeight;

        var drum = document.createElement('div');
        drum.className = 'game3__drum';

        // сначала набрасываем случайные части
        for (var i = 0; i < SPIN_COUNT; i++) {
            var item = document.createElement('div');
            item.className = 'game3__drum-item';
            item.style.width = windowW + 'px';
            item.style.minWidth = windowW + 'px';
            item.style.height = windowH + 'px';

            var img = document.createElement('img');
            img.src = creatures[Math.floor(Math.random() * creatures.length)][part];
            img.alt = '';
            item.appendChild(img);
            drum.appendChild(item);
        }

        // последний элемент — правильная часть, на ней остановится
        var targetItem = document.createElement('div');
        targetItem.className = 'game3__drum-item';
        targetItem.style.width = windowW + 'px';
        targetItem.style.minWidth = windowW + 'px';
        targetItem.style.height = windowH + 'px';

        var targetImg = document.createElement('img');
        targetImg.src = targetCreature[part];
        targetImg.alt = '';
        targetItem.appendChild(targetImg);
        drum.appendChild(targetItem);

        // вставляем барабан в окошко
        slotEl.innerHTML = '';
        slotEl.style.justifyContent = 'flex-start';
        slotEl.appendChild(drum);
        return drum;
    }

    // анимация прокрутки — едет влево до последнего элемента
    function animateDrum(drum, slotEl, duration, callback) {
        var windowW = slotEl.offsetWidth;
        var totalItems = drum.children.length;
        var scrollDist = windowW * (totalItems - 1);

        // сброс позиции
        drum.style.transition = 'none';
        drum.style.transform = 'translateX(0)';
        drum.offsetHeight; // принудительный reflow

        // плавная прокрутка, в конце замедляется как настоящий автомат
        drum.style.transition = 'transform ' + duration + 'ms cubic-bezier(0.15, 0.6, 0.25, 1)';
        drum.style.transform = 'translateX(-' + scrollDist + 'px)';

        if (callback) {
            setTimeout(callback, duration);
        }
    }

    // клик по рычагу
    lever.addEventListener('click', function() {
        if (isSpinning) return;
        isSpinning = true;

        // анимация наклона рычага
        lever.classList.add('pulled');
        setTimeout(function() {
            lever.classList.remove('pulled');
        }, 500);

        // берём следующее существо по очереди
        var creature = creatures[currentCreatureIndex];
        currentCreatureIndex = (currentCreatureIndex + 1) % creatures.length;

        // небольшая задержка перед началом прокрутки
        setTimeout(function() {
            spinSlots(creature);
        }, 300);
    });

    // запуск прокрутки всех трёх окошек с задержкой между ними
    function spinSlots(creature) {
        var headSlot = document.getElementById('slot-head');
        var bodySlot = document.getElementById('slot-body');
        var legsSlot = document.getElementById('slot-legs');

        var headDrum = buildDrum(headSlot, 'head', creature);
        var bodyDrum = buildDrum(bodySlot, 'body', creature);
        var legsDrum = buildDrum(legsSlot, 'legs', creature);

        // голова стартует первой
        animateDrum(headDrum, headSlot, 2500, null);

        // тело чуть позже
        setTimeout(function() {
            animateDrum(bodyDrum, bodySlot, 2500, null);
        }, 400);

        // ноги последние, после них показываем результат
        setTimeout(function() {
            animateDrum(legsDrum, legsSlot, 2500, function() {
                setTimeout(function() {
                    showCreature(creature);
                    isSpinning = false;
                }, 600);
            });
        }, 800);
    }

    // показываем собранное существо на правой панели
    function showCreature(creature) {
        // прячем смайлик
        document.getElementById('game3-smiley').style.display = 'none';

        // показываем картинку существа
        var creatureDiv = document.getElementById('game3-creature');
        creatureDiv.style.display = 'flex';
        var img = document.getElementById('game3-creature-img');
        img.src = creature.full;

        // у мирсо в свг пустое место сверху, поэтому опускаем
        img.style.marginTop = creature.name === 'мирсо' ? '6.25vw' : '0';

        // обновляем название и описание
        document.getElementById('game3-creature-name').textContent = creature.name;
        document.getElementById('game3-creature-desc').textContent = creature.desc;
    }

})();
