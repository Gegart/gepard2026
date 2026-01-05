// ==============================
// УМНЫЙ СЧЁТЧИК ПОСЕТИТЕЛЕЙ
// Версия 1.0
// ==============================

// Ждём, когда вся страница загрузится
window.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Счётчик начал работу...');
    
    // Находим блок для счётчика
    const counterElement = document.getElementById('visitor-counter');
    if (!counterElement) {
        console.error('❌ Ошибка: не найден элемент с id="visitor-counter"');
        return;
    }
    
    // Показываем сообщение о загрузке
    counterElement.innerHTML = '<div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px dashed #ccc;">⏳ Загружаем статистику...</div>';
    
    // Ждём 500ms для наглядности (можно убрать)
    setTimeout(function() {
        
        // ======================
        // ПРОВЕРЯЕМ: ТЫ РАЗРАБОТЧИК ИЛИ НЕТ?
        // ======================
        const isDeveloper = 
            // Локальные адреса
            window.location.hostname.includes('localhost') ||
            window.location.hostname === '127.0.0.1' ||
            // Файл открыт прямо с диска
            window.location.protocol === 'file:' ||
            // Порт для разработки
            ['3000', '8080', '5500'].includes(window.location.port) ||
            // Автоматические тесты
            navigator.webdriver === true ||
            // Особые браузеры для разработки
            /(Developer|Test|Bot)/i.test(navigator.userAgent);
        
        console.log('👤 Это разработчик?', isDeveloper);
        console.log('📍 Адрес:', window.location.hostname);
        console.log('🚪 Порт:', window.location.port);
        
        // ======================
        // ЕСЛИ ТЫ РАЗРАБОТЧИК
        // ======================
        if (isDeveloper) {
            console.log('🔧 Показан режим разработчика');
            
            counterElement.innerHTML = `
                <div style="background: #fff8e1; padding: 20px; border-radius: 10px; border: 2px solid #ffd54f; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;">
                        <span style="font-size: 24px; margin-right: 10px;">🔧</span>
                        <strong style="font-size: 18px; color: #e65100;">Режим разработчика</strong>
                    </div>
                    
                    <div style="color: #5d4037; margin-bottom: 15px; font-size: 14px;">
                        Твои посещения <strong>не считаются</strong> в статистику.
                        <br>На реальном хостинге здесь будет счётчик для посетителей.
                    </div>
                    
                    <div style="background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #ffcc80; margin-bottom: 15px;">
                        <div style="font-size: 13px; color: #666; margin-bottom: 5px;">Информация для отладки:</div>
                        <div style="font-family: monospace; font-size: 12px;">
                            Адрес: ${window.location.hostname}<br>
                            Порт: ${window.location.port || 'не указан'}<br>
                            Протокол: ${window.location.protocol}
                        </div>
                    </div>
                    
                    <button onclick="testAsVisitor()" 
                            style="width: 100%; padding: 10px; background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">
                        👥 Протестировать как посетитель
                    </button>
                    
                    <div style="margin-top: 10px; font-size: 11px; color: #888; text-align: center;">
                        Нажми, чтобы увидеть, что увидят реальные пользователи
                    </div>
                </div>
            `;
            
            // Сохраняем в sessionStorage, что мы разработчики
            sessionStorage.setItem('isSiteDeveloper', 'true');
            
        } else {
            // ======================
            // ЕСЛИ НЕ РАЗРАБОТЧИК
            // ======================
            console.log('👥 Проверяем, не замаскированный ли разработчик...');
            
            // Проверяем, не нажал ли ты кнопку "тестировать как посетитель"
            const disguisedDeveloper = sessionStorage.getItem('isSiteDeveloper') === 'true';
            
            if (disguisedDeveloper) {
                console.log('👤 Показан тестовый режим посетителя');
                
                counterElement.innerHTML = `
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; border: 2px solid #64b5f6; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <div style="display: flex; align-items: center; margin-bottom: 10px;">
                            <span style="font-size: 24px; margin-right: 10px;">👤</span>
                            <strong style="font-size: 18px; color: #1565c0;">Тестовый режим посетителя</strong>
                        </div>
                        
                        <div style="color: #0d47a1; margin-bottom: 15px; font-size: 14px;">
                            Ты сейчас видишь, что увидят <strong>реальные пользователи</strong>.
                            <br>Статистика обновляется для теста.
                        </div>
                        
                        <button onclick="resetTestMode()" 
                                style="width: 100%; padding: 10px; background: linear-gradient(135deg, #2196F3, #0D47A1); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">
                            ↩️ Вернуться в режим разработчика
                        </button>
                    </div>
                `;
                
                // Но всё равно считаем для теста
                updateRealCounter();
                
            } else {
                // ======================
                // РЕАЛЬНЫЙ ПОСЕТИТЕЛЬ!
                // ======================
                console.log('🎉 Реальный посетитель! Обновляем статистику...');
                updateRealCounter();
            }
        }
        
    }, 500); // Задержка 0.5 секунды
    
});

// ======================
// ФУНКЦИЯ ДЛЯ РЕАЛЬНЫХ ПОСЕТИТЕЛЕЙ
// ======================
function updateRealCounter() {
    console.log('📊 Обновление статистики...');
    
    // Получаем сегодняшнюю дату в формате ГГГГ-ММ-ДД
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 Сегодня:', today);
    
    // Получаем данные из LocalStorage или создаём новые
    let counterData;
    try {
        counterData = JSON.parse(localStorage.getItem('siteStats') || '{"total":0,"lastDate":"","visits":0}');
    } catch (e) {
        console.error('❌ Ошибка чтения данных:', e);
        counterData = { total: 0, lastDate: "", visits: 0 };
    }
    
    console.log('📈 Предыдущие данные:', counterData);
    
    // Если последнее посещение было не сегодня
    if (counterData.lastDate !== today) {
        console.log('✨ Новый день или новый посетитель!');
        counterData.visits = 1; // Сбрасываем счётчик на 1 (этот посетитель)
        counterData.lastDate = today;
        counterData.total++;
    } else {
        // Если уже был сегодня — увеличиваем счётчик
        console.log('➕ Уже были сегодня, увеличиваем счётчик');
        counterData.visits++;
        counterData.total++;
    }
    
    // Сохраняем обновлённые данные
    localStorage.setItem('siteStats', JSON.stringify(counterData));
    console.log('💾 Сохранены данные:', counterData);
    
    // Показываем на странице
    const counterElement = document.getElementById('visitor-counter');
    counterElement.innerHTML = `
        <div style="background: linear-gradient(135deg, #d4edda, #c3e6cb); padding: 20px; border-radius: 10px; border: 2px solid #4caf50; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 10px;">
                <span style="font-size: 28px;">👥</span>
            </div>
            
            <div style="text-align: center; margin-bottom: 15px;">
                <div style="font-size: 24px; font-weight: bold; color: #155724;">
                    ${counterData.visits}
                </div>
                <div style="font-size: 14px; color: #0d3c21;">
                    посетителей сегодня
                </div>
            </div>
            
            <div style="background: rgba(255,255,255,0.7); padding: 8px; border-radius: 6px; text-align: center; font-size: 12px; color: #333;">
                <div>📊 Всего посещений: <strong>${counterData.total}</strong></div>
                <div>📅 Дата: ${today}</div>
            </div>
            
            <div style="margin-top: 10px; font-size: 11px; color: #666; text-align: center;">
                Обновлено: ${new Date().toLocaleTimeString()}
            </div>
        </div>
    `;
}

// ======================
// ФУНКЦИЯ ДЛЯ ТЕСТИРОВАНИЯ
// ======================
function testAsVisitor() {
    console.log('🎭 Переход в режим тестирования как посетитель...');
    // Убираем пометку разработчика
    sessionStorage.removeItem('isSiteDeveloper');
    // Перезагружаем страницу
    location.reload();
}

function resetTestMode() {
    console.log('🔙 Возврат в режим разработчика...');
    // Добавляем пометку разработчика
    sessionStorage.setItem('isSiteDeveloper', 'true');
    // Перезагружаем страницу
    location.reload();
}

// ======================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
// ======================
function showCounterInfo() {
    const data = JSON.parse(localStorage.getItem('siteStats') || '{"total":0,"lastDate":"","visits":0}');
    alert(`Статистика сайта:\n\n👥 Посетителей сегодня: ${data.visits}\n📊 Всего посещений: ${data.total}\n📅 Последнее обновление: ${data.lastDate || 'никогда'}`);
}

// Добавляем глобальные функции для кнопок
window.testAsVisitor = testAsVisitor;
window.resetTestMode = resetTestMode;
window.showCounterInfo = showCounterInfo;

console.log('✅ Счётчик загружен и готов к работе!');
