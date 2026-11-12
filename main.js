// ==========================================
// DADOS INICIAIS E ESTADO DA APLICAÇÃO
// ==========================================

const defaultUser = {
  name: 'Camila Mendes',
  handle: '@camilamendes',
  bio: 'UI/UX Designer & Desenvolvedora Front-end. Apaixonada por tecnologia e café ☕',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

const defaultPosts = [
  {
    id: 1,
    authorName: 'Lucas Andrade',
    authorHandle: '@lucasdev',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    verified: true,
    timestamp: 'Há 2 horas',
    content: 'Acabei de finalizar a nova arquitetura de design system para o nosso aplicativo! Minimalismo e acessibilidade sempre em primeiro lugar. 🚀💻',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    likes: 42,
    liked: false,
    saved: false,
    isOwner: false,
    comments: [
      { author: 'Mariana Costa', text: 'Ficou incrível demais, Lucas! Parabéns pelo resultado.' }
    ]
  },
  {
    id: 2,
    authorName: 'Mariana Costa',
    authorHandle: '@maricosta',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verified: false,
    timestamp: 'Há 5 horas',
    content: 'Nada melhor do que começar a manhã com um café especial e uma vista inspiradora antes de codar. Bom dia, comunidade! ☀️☕',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    likes: 89,
    liked: true,
    saved: true,
    isOwner: false,
    comments: []
  }
];

const storiesData = [
  {
    name: 'Lucas Andrade',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    storyImg: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Mariana Costa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    storyImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Rafael Souza',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    storyImg: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80'
  },
  {
    name: 'Beatriz Lima',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    storyImg: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80'
  }
];

const suggestionsData = [
  { name: 'Rafael Souza', handle: '@rafasouza', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', following: false },
  { name: 'Beatriz Lima', handle: '@bialima', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', following: false },
  { name: 'Tech Insider BR', handle: '@techinsider', avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80', following: true }
];

// Carrega estado salvo no LocalStorage ou usa o padrão
let currentUser = JSON.parse(localStorage.getItem('nexus_user')) || defaultUser;
let posts = JSON.parse(localStorage.getItem('nexus_posts')) || defaultPosts;
let currentFilter = 'all';
let searchQuery = '';
let selectedImageBase64 = '';
let storyTimeout = null;

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  renderProfile();
  renderStories();
  renderSuggestions();
  renderPosts();
  setupEventListeners();
  lucide.createIcons();
});

function saveState() {
  localStorage.setItem('nexus_user', JSON.stringify(currentUser));
  localStorage.setItem('nexus_posts', JSON.stringify(posts));
}

// ==========================================
// TEMA CLARO / ESCURO
// ==========================================
function loadTheme() {
  const isDark = localStorage.getItem('nexus_dark_mode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
    document.getElementById('themeIcon').setAttribute('data-lucide', 'sun');
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('nexus_dark_mode', isDark);
  const icon = document.getElementById('themeIcon');
  icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  lucide.createIcons();
}

// ==========================================
// RENDERIZAÇÃO DE PERFIL, STORIES E SUGESTÕES
// ==========================================
function renderProfile() {
  document.getElementById('userNameDisplay').textContent = currentUser.name;
  document.getElementById('userHandleDisplay').textContent = currentUser.handle;
  document.getElementById('userBioDisplay').textContent = currentUser.bio;
  document.getElementById('postContent').placeholder = `No que você está pensando hoje, ${currentUser.name.split(' ')[0]}?`;

  const userPostsCount = posts.filter(p => p.isOwner).length;
  document.getElementById('postsCount').textContent = userPostsCount;
}

function renderStories() {
  const container = document.getElementById('storiesContainer');
  const existingStories = container.querySelectorAll('.dynamic-story');
  existingStories.forEach(el => el.remove());

  storiesData.forEach((story, index) => {
    const storyEl = document.createElement('div');
    storyEl.className = 'story-card dynamic-story';
    storyEl.innerHTML = `
      <img src="${story.storyImg}" alt="${story.name}">
      <img src="${story.avatar}" alt="${story.name}" class="story-avatar-badge">
      <span>${story.name}</span>
    `;
    storyEl.addEventListener('click', () => openStory(index));
    container.appendChild(storyEl);
  });
}

function renderSuggestions() {
  const container = document.getElementById('suggestionsList');
  container.innerHTML = '';

  suggestionsData.forEach((person, index) => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `
      <div class="suggestion-user">
        <img src="${person.avatar}" alt="${person.name}" class="avatar-sm">
        <div>
          <h5>${person.name}</h5>
          <span>${person.handle}</span>
        </div>
      </div>
      <button class="follow-btn ${person.following ? 'following' : ''}" data-index="${index}">
        ${person.following ? 'Seguindo' : 'Seguir'}
      </button>
    `;
    container.appendChild(item);
  });

  container.querySelectorAll('.follow-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.dataset.index;
      suggestionsData[idx].following = !suggestionsData[idx].following;
      renderSuggestions();
    });
  });
}

// ==========================================
// FEED DE PUBLICAÇÕES (CRUD + INTERAÇÕES)
// ==========================================
function renderPosts() {
  const feedContainer = document.getElementById('feedContainer');
  feedContainer.innerHTML = '';

  let filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (currentFilter === 'liked') return post.liked;
    if (currentFilter === 'saved') return post.saved;
    return true;
  });

  if (filteredPosts.length === 0) {
    feedContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 2.5rem 1rem; color: var(--text-secondary);">
        <p>Nenhuma publicação encontrada nesta seção.</p>
      </div>
    `;
    return;
  }

  filteredPosts.forEach(post => {
    const postEl = document.createElement('article');
    postEl.className = 'card post-card';

    const commentsHTML = post.comments.map(c => `
      <div class="comment-item">
        <strong>${escapeHTML(c.author)}</strong>
        <span>${escapeHTML(c.text)}</span>
      </div>
    `).join('');

    postEl.innerHTML = `
      <div class="post-header">
        <div class="post-author">
          <img src="${post.authorAvatar}" alt="${post.authorName}" class="avatar-sm">
          <div class="post-author-info">
            <h4>
              ${escapeHTML(post.authorName)}
              ${post.verified ? '<i data-lucide="badge-check" class="verified-badge"></i>' : ''}
            </h4>
            <span class="post-meta">${escapeHTML(post.authorHandle)} · ${post.timestamp}</span>
          </div>
        </div>
        ${post.isOwner ? `
          <button class="delete-post-btn" onclick="deletePost(${post.id})" title="Excluir publicação">
            <i data-lucide="trash-2"></i>
          </button>
        ` : ''}
      </div>

      <div class="post-body">${escapeHTML(post.content)}</div>

      ${post.image ? `<img src="${post.image}" alt="Imagem do post" class="post-image" loading="lazy">` : ''}

      <div class="post-footer">
        <div class="post-actions-group">
          <button class="post-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
            <i data-lucide="heart"></i>
            <span>${post.likes}</span>
          </button>

          <button class="post-action-btn" onclick="toggleCommentBox(${post.id})">
            <i data-lucide="message-circle"></i>
            <span>${post.comments.length}</span>
          </button>

          <button class="post-action-btn" onclick="sharePost('${escapeHTML(post.authorName)}')">
            <i data-lucide="share-2"></i>
          </button>
        </div>

        <button class="post-action-btn ${post.saved ? 'saved' : ''}" onclick="toggleSave(${post.id})" title="Salvar post">
          <i data-lucide="bookmark"></i>
        </button>
      </div>

      <div class="comments-section" id="comments-${post.id}">
        <form class="comment-input-box" onsubmit="addComment(event, ${post.id})">
          <input type="text" placeholder="Escreva um comentário..." required>
          <button type="submit" class="btn-primary" style="padding: 0.4rem 0.9rem; font-size: 0.8rem;">Enviar</button>
        </form>
        <div class="comment-list">
          ${commentsHTML}
        </div>
      </div>
    `;

    feedContainer.appendChild(postEl);
  });

  lucide.createIcons();
}

// Criar Nova Publicação
function createPost() {
  const contentInput = document.getElementById('postContent');
  const content = contentInput.value.trim();

  if (!content && !selectedImageBase64) {
    alert('Escreva algo ou adicione uma imagem antes de publicar!');
    return;
  }

  const newPost = {
    id: Date.now(),
    authorName: currentUser.name,
    authorHandle: currentUser.handle,
    authorAvatar: currentUser.avatar,
    verified: true,
    timestamp: 'Agora mesmo',
    content: content,
    image: selectedImageBase64,
    likes: 0,
    liked: false,
    saved: false,
    isOwner: true,
    comments: []
  };

  posts.unshift(newPost);
  saveState();

  // Limpa campos
  contentInput.value = '';
  clearImagePreview();

  renderProfile();
  renderPosts();
}

// Curtir / Descurtir
window.toggleLike = function(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  saveState();
  renderPosts();
};

// Salvar / Remover dos salvos
window.toggleSave = function(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  post.saved = !post.saved;
  saveState();
  renderPosts();
};

// Excluir Post
window.deletePost = function(postId) {
  if (!confirm('Deseja realmente excluir esta publicação?')) return;
  posts = posts.filter(p => p.id !== postId);
  saveState();
  renderProfile();
  renderPosts();
};

// Adicionar Comentário
window.addComment = function(event, postId) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  const text = input.value.trim();
  if (!text) return;

  const post = posts.find(p => p.id === postId);
  if (post) {
    post.comments.push({
      author: currentUser.name,
      text: text
    });
    saveState();
    renderPosts();
  }
};

window.toggleCommentBox = function(postId) {
  const input = document.querySelector(`#comments-${postId} input`);
  if (input) input.focus();
};

window.sharePost = function(author) {
  alert(`Link da publicação de ${author} copiado para a área de transferência!`);
};

// ==========================================
// UPLOAD E PREVIEW DE IMAGEM
// ==========================================
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    selectedImageBase64 = e.target.result;
    showImagePreview(selectedImageBase64);
  };
  reader.readAsDataURL(file);
}

function showImagePreview(src) {
  const container = document.getElementById('imagePreviewContainer');
  const img = document.getElementById('imagePreview');
  img.src = src;
  container.classList.remove('hidden');
}

function clearImagePreview() {
  selectedImageBase64 = '';
  document.getElementById('imageUpload').value = '';
  document.getElementById('imagePreviewContainer').classList.add('hidden');
}

// ==========================================
// MODAL DE PERFIL E VISUALIZADOR DE STORIES
// ==========================================
function openProfileModal() {
  document.getElementById('editName').value = currentUser.name;
  document.getElementById('editHandle').value = currentUser.handle;
  document.getElementById('editBio').value = currentUser.bio;
  document.getElementById('profileModal').classList.remove('hidden');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.add('hidden');
}

function saveProfileChanges(e) {
  e.preventDefault();
  currentUser.name = document.getElementById('editName').value.trim();
  let handle = document.getElementById('editHandle').value.trim();
  if (!handle.startsWith('@')) handle = '@' + handle;
  currentUser.handle = handle;
  currentUser.bio = document.getElementById('editBio').value.trim();

  // Atualiza nome nos posts do próprio usuário
  posts.forEach(p => {
    if (p.isOwner) {
      p.authorName = currentUser.name;
      p.authorHandle = currentUser.handle;
    }
  });

  saveState();
  renderProfile();
  renderPosts();
  closeProfileModal();
}

function openStory(index) {
  const story = storiesData[index];
  const modal = document.getElementById('storyModal');
  const bar = document.getElementById('storyProgressBar');

  document.getElementById('storyViewerAvatar').src = story.avatar;
  document.getElementById('storyViewerName').textContent = story.name;
  document.getElementById('storyViewerImage').src = story.storyImg;

  modal.classList.remove('hidden');
  bar.style.width = '0%';

  setTimeout(() => {
    bar.style.width = '100%';
  }, 50);

  clearTimeout(storyTimeout);
  storyTimeout = setTimeout(closeStory, 3100);
}

function closeStory() {
  clearTimeout(storyTimeout);
  document.getElementById('storyModal').classList.add('hidden');
}

// ==========================================
// EVENTOS GERAIS E SEGURANÇA (XSS)
// ==========================================
function setupEventListeners() {
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  document.getElementById('publishBtn').addEventListener('click', createPost);
  document.getElementById('imageUpload').addEventListener('change', handleImageUpload);
  document.getElementById('removeImageBtn').addEventListener('click', clearImagePreview);

  document.getElementById('addImageUrlBtn').addEventListener('click', () => {
    const url = prompt('Cole a URL da imagem:');
    if (url && url.trim() !== '') {
      selectedImageBase64 = url.trim();
      showImagePreview(selectedImageBase64);
    }
  });

  // Pesquisa em tempo real
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPosts();
  });

  // Filtros (Menu lateral e Abas)
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currentFilter = btn.dataset.filter;

      document.querySelectorAll('[data-filter]').forEach(el => el.classList.remove('active'));
      document.querySelectorAll(`[data-filter="${currentFilter}"]`).forEach(el => el.classList.add('active'));

      renderPosts();
    });
  });

  // Modal Perfil
  document.getElementById('editProfileBtn').addEventListener('click', openProfileModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeProfileModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeProfileModal);
  document.getElementById('editProfileForm').addEventListener('submit', saveProfileChanges);

  // Modal Story
  document.getElementById('closeStoryBtn').addEventListener('click', closeStory);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
      }
