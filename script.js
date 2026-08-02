// 1. Відкриття конверту
function openInvitation() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    
    // Збільшено затримку до 2000 мс (2 секунди)
    setTimeout(() => {
        document.getElementById('envelope-overlay').style.opacity = '0';
        document.getElementById('envelope-overlay').style.transform = 'translateY(-100vh)';
        
        // Ініціалізація анімацій прокрутки AOS
        AOS.init({ duration: 1000, once: true });
        
        // Автоматичний запуск музики за бажанням
        // document.getElementById('bg-music').play();
    }, 2000); 
}

// 2. Таймер зворотного відліку
const weddingDate = new Date(2026, 7, 23, 14, 0, 0).getTime(); // 23 серпня 2026

setInterval(function() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}, 1000);

// 3. Перемикач світлої/темної теми
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const icon = themeToggle.querySelector('i');
    if(document.body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
});

// 4. Керування фоновою музикою
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.style.animation = 'pulse 1s infinite';
    } else {
        bgMusic.pause();
        musicToggle.style.animation = 'none';
    }
});

// 5. Ефект падаючих пелюсток (Оптимізовано для мобільних)
const isMobile = window.innerWidth < 768;

function createPetal() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    // Якщо пристрій мобільний, обмежуємо максимальну кількість активних елементів
    if (isMobile && container.children.length > 15) {
        return;
    }
    
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.width = Math.random() * 12 + 8 + 'px';
    petal.style.height = Math.random() * 12 + 8 + 'px';
    petal.style.animationDuration = Math.random() * 3 + 4 + 's';
    petal.style.opacity = Math.random() * 0.6 + 0.3;
    
    container.appendChild(petal);
    
    setTimeout(() => {
        petal.remove();
    }, 6000);
}

// Запускаємо генерацію пелюсток рідше на мобільних телефонах
setInterval(createPetal, isMobile ? 500 : 300);

// 6. Асинхронне відправлення форми RSVP без перезавантаження сторінки
const rsvpForm = document.getElementById('wedding-rsvp-form');
const formFields = document.getElementById('form-fields');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Запобігаємо стандартному переходу браузера
        
        // Візуальний зворотний зв'язок: блокуємо кнопку та змінюємо текст
        submitBtn.disabled = true;
        submitBtn.innerText = 'Надсилання...';
        
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: rsvpForm.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Приховуємо поля вводу та відображаємо блок подяки
                formFields.style.display = 'none';
                formSuccess.style.display = 'block';
                // Плавно скролимо до повідомлення про успіх
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // Якщо сервер Formspree відхилив запит
                alert('Ой! Щось пішло не так. Спробуйте ще раз або повідомте молодят особисто.');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Надіслати відповідь';
            }
        } catch (error) {
            // У разі відсутності інтернету чи інших збоїв мережі
            alert('Помилка з\'єднання. Будь ласка, перевірте підключення до мережі.');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Надіслати відповідь';
        }
    });
}
