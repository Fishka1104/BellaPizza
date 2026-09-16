
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id) {
        loadNewsDetail(id);
        loadComments(id);
    } else {
        document.getElementById("detail-title").textContent = "Новину не знайдено";
        document.getElementById("detail-content").textContent = "Помилка: не вказано ID новини в URL.";
    }

    setupLikeButton(id);
    setupCommentForm(id);
});

async function loadNewsDetail(id) {
    try {
        const { data: promo } = await apiFetch(`/api/promotions/${id}`);
        
        document.getElementById("detail-title").textContent = promo.title;
        document.title = `${promo.title} - BellaPizza`;
        
        document.getElementById("detail-content").textContent = promo.description;
        document.getElementById("like-count").textContent = promo.likes || 0;

        if (promo.imageurl) {
            const img = document.getElementById("detail-image");
            img.src = API_BASE + "/" + promo.imageurl.replace(/^\//, '');
            img.style.display = 'block';
        }

        const statusEl = document.getElementById("detail-status");
        if (promo.isactive) {
            statusEl.textContent = "Активно";
            statusEl.className = "badge bg-success me-2";
        } else {
            statusEl.textContent = "Завершено";
            statusEl.className = "badge bg-secondary me-2";
        }

        let dateStr = "";
        if (promo.startdate && promo.enddate) dateStr = `Період дії: з ${promo.startdate} по ${promo.enddate}`;
        else if (promo.startdate) dateStr = `Діє з ${promo.startdate}`;
        else if (promo.enddate) dateStr = `Діє до ${promo.enddate}`;
        else dateStr = "Постійна акція";
        
        document.getElementById("detail-dates").innerHTML = `<i class="bi-calendar"></i> ${dateStr}`;

    } catch (error) {
        console.error("Error loading detail:", error);
    }
}

async function loadComments(id) {
    const list = document.getElementById("comments-list");
    const count = document.getElementById("comments-count");
    try {
        const { data } = await apiFetch(`/api/promotions/${id}/comments`);
        count.textContent = data.length;
        
        if (data.length === 0) {
            list.innerHTML = '<p class="text-muted">Ще немає коментарів. Будьте першим!</p>';
            return;
        }

        list.innerHTML = data.map(c => {
            const date = new Date(c.createdat).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });
            return `
            <div class="d-flex mb-3 border-bottom pb-3">
              <div class="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style="width: 45px; height: 45px; font-weight: bold; flex-shrink: 0;">
                ${c.User.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div class="mb-1"><strong>${c.User.name}</strong> <span class="text-muted small ms-2">${date}</span></div>
                <div style="white-space: pre-wrap;">${c.text}</div>
              </div>
            </div>
            `;
        }).join('');
    } catch (error) {
        list.innerHTML = '<p class="text-danger">Помилка завантаження коментарів.</p>';
    }
}

function setupLikeButton(id) {
    const btn = document.getElementById("like-btn");
    if(!btn || !id) return;
    
    // allow clicking like multiple times, simple demo
    btn.addEventListener('click', async () => {
        try {
            const { data } = await apiFetch(`/api/promotions/${id}/like`, { method: 'POST' });
            document.getElementById("like-count").textContent = data.likes;
            btn.classList.remove('btn-outline-danger');
            btn.classList.add('btn-danger');
            const icon = btn.querySelector('i');
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill');
        } catch(e) {
            showToast("Не вдалося поставити лайк", "error");
        }
    });
}

function setupCommentForm(id) {
    const form = document.getElementById("comment-form");
    const warning = document.getElementById("comment-auth-warning");
    
    if(!localStorage.getItem('token')) {
        form.querySelector('textarea').disabled = true;
        form.querySelector('button').disabled = true;
        warning.classList.remove('d-none');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = document.getElementById('comment-text').value.trim();
        if(!text) return;

        try {
            await apiFetch(`/api/promotions/${id}/comments`, {
                method: 'POST',
                body: JSON.stringify({ text })
            });
            document.getElementById('comment-text').value = '';
            showToast("Коментар додано!", "success");
            loadComments(id);
        } catch(err) {
            showToast("Помилка додавання коментаря. Можливо, ви не авторизовані.", "error");
        }
    });
}
