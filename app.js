(function () {
  const songs = MAX_MARTIN_SONGS.map((s, i) => ({ id: i, ...s }));

  const libraryEl = document.getElementById('library');
  const statsBar = document.getElementById('statsBar');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const groupSelect = document.getElementById('groupSelect');
  const orderSelect = document.getElementById('orderSelect');
  const roleSelect = document.getElementById('roleSelect');
  const triviaOnly = document.getElementById('triviaOnly');

  const songModalOverlay = document.getElementById('songModalOverlay');
  const songModalBody = document.getElementById('songModalBody');
  const songModalClose = document.getElementById('songModalClose');

  const triviaBtn = document.getElementById('triviaBtn');
  const triviaModalOverlay = document.getElementById('triviaModalOverlay');
  const triviaModalClose = document.getElementById('triviaModalClose');
  const triviaList = document.getElementById('triviaList');

  const themeBtn = document.getElementById('themeBtn');
  const interviewsList = document.getElementById('interviewsList');
  const interviewsBtn = document.getElementById('interviewsBtn');
  const interviewsModalOverlay = document.getElementById('interviewsModalOverlay');
  const interviewsModalClose = document.getElementById('interviewsModalClose');

  const julietBtn = document.getElementById('julietBtn');
  const julietModalOverlay = document.getElementById('julietModalOverlay');
  const julietModalClose = document.getElementById('julietModalClose');
  const julietBody = document.getElementById('julietBody');

  // ---- Theme ----
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('mm-theme', theme); } catch (e) {}
  }
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('mm-theme') || 'dark'; } catch (e) {}
  applyTheme(savedTheme);
  themeBtn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });

  // ---- Stats ----
  function renderStats() {
    const artists = new Set(songs.map(s => s.a));
    const years = songs.map(s => s.y);
    statsBar.innerHTML = `
      <div><strong>${songs.length}</strong>songs credited</div>
      <div><strong>${artists.size}</strong>different artists</div>
      <div><strong>${Math.min(...years)}–${Math.max(...years)}</strong>years spanned</div>
    `;
  }

  // ---- Badges ----
  function roleBadges(roles) {
    return roles.map(r => {
      const cls = r === 'Writer' ? 'badge-writer' : r === 'Producer' ? 'badge-producer' : 'badge-artist';
      return `<span class="badge ${cls}">${r}</span>`;
    }).join('');
  }

  // ---- Filtering ----
  function getFiltered() {
    const q = searchInput.value.trim().toLowerCase();
    return songs.filter(s => {
      if (triviaOnly.checked && !s.trivia) return false;
      if (roleSelect.value && !s.role.includes(roleSelect.value)) return false;
      if (!q) return true;
      const hay = [s.t, s.a, s.alb, ...(s.collab || [])].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  // ---- Grouping ----
  // Splits an artist credit into the individual artists it should be grouped under.
  // "feat./ft./featuring" guests are dropped (song stays under the main artist only);
  // "&", "and", "w/", and "," join co-equal artists, so the song appears under each of them.
  function splitArtists(raw) {
    const core = raw.split(/\s+(?:feat\.?|featuring|ft\.?)\s+/i)[0];
    const parts = core
      .split(/\s*(?:,|&|\bw\/|\band\b)\s*/i)
      .map(p => p.trim())
      .filter(Boolean);
    return [...new Set(parts.length ? parts : [core.trim()])];
  }

  function groupSongs(list) {
    const groupBy = groupSelect.value;
    const order = orderSelect.value;
    const groups = new Map();

    list.forEach(s => {
      if (groupBy === 'year') {
        const key = String(s.y);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(s);
      } else {
        splitArtists(s.a).forEach(key => {
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(s);
        });
      }
    });

    let keys = [...groups.keys()];
    if (groupBy === 'year') {
      keys.sort((a, b) => order === 'desc' ? b - a : a - b);
    } else {
      keys.sort((a, b) => order === 'desc' ? a.localeCompare(b) : b.localeCompare(a));
    }

    keys.forEach(k => {
      groups.get(k).sort((a, b) => {
        if (groupBy === 'year') return a.t.localeCompare(b.t);
        return order === 'desc' ? b.y - a.y : a.y - b.y;
      });
    });

    return { keys, groups };
  }

  // ---- Render ----
  function render() {
    const filtered = getFiltered();
    libraryEl.innerHTML = '';

    if (filtered.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    const { keys, groups } = groupSongs(filtered);

    keys.forEach(key => {
      const items = groups.get(key);
      const section = document.createElement('section');
      section.className = 'group-section';

      const heading = document.createElement('h2');
      heading.className = 'group-heading';
      heading.innerHTML = `${key}<span class="group-count">${items.length} song${items.length === 1 ? '' : 's'}</span>`;
      section.appendChild(heading);

      const grid = document.createElement('div');
      grid.className = 'song-grid';

      items.forEach(s => {
        const card = document.createElement('button');
        card.className = 'song-card';
        card.type = 'button';
        card.innerHTML = `
          <div class="song-title">${escapeHtml(s.t)}</div>
          <div class="song-artist">${escapeHtml(s.a)}</div>
          <div class="song-meta">
            <div class="badges">${roleBadges(s.role)}${s.trivia ? '<span class="badge badge-trivia">✨ trivia</span>' : ''}${getSpotifyCredits(s) ? '<span class="badge badge-spotify">🎧 full credits</span>' : ''}</div>
            <div class="song-year">${s.y}</div>
          </div>
        `;
        card.addEventListener('click', () => openSongModal(s));
        grid.appendChild(card);
      });

      section.appendChild(grid);
      libraryEl.appendChild(section);
    });
  }

  function getSpotifyCredits(s) {
    if (typeof MAX_MARTIN_SPOTIFY_CREDITS === 'undefined') return null;
    return MAX_MARTIN_SPOTIFY_CREDITS[`${s.t} · ${s.a}`] || null;
  }

  const SECTION_ORDER = ['Composition & Lyrics', 'Production & Engineering', 'Performers', 'Other Roles'];
  function renderSpotifyCredits(credits) {
    const sections = SECTION_ORDER
      .filter(name => credits.sections[name] && credits.sections[name].length)
      .map(name => `
        <div class="spotify-section">
          <span class="label">${escapeHtml(name)}</span>
          <ul class="spotify-people">
            ${credits.sections[name].map(p => `<li><strong>${escapeHtml(p.name)}</strong><span class="spotify-roles">${escapeHtml(p.roles.join(' · '))}</span></li>`).join('')}
          </ul>
        </div>
      `).join('');
    return `
      <div class="spotify-box">
        <div class="spotify-box-heading">🎧 Full Spotify credits${credits.source ? ` <span class="dim">— ${escapeHtml(credits.source)}</span>` : ''}</div>
        ${sections}
      </div>
    `;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---- Song modal ----
  function openSongModal(s) {
    const collabHtml = (s.collab && s.collab.length)
      ? `<div class="collab-list">${s.collab.map(c => `<button class="collab-chip" data-name="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div>`
      : `<span class="dim">Solo credit — no other collaborators listed</span>`;

    const spotify = getSpotifyCredits(s);
    const spotifyHtml = spotify ? renderSpotifyCredits(spotify) : '';

    songModalBody.innerHTML = `
      <h2>${escapeHtml(s.t)}</h2>
      <p class="detail-artist">${escapeHtml(s.a)} · ${s.y}</p>
      <div class="detail-badges badges">${roleBadges(s.role)}</div>
      <div class="detail-row">
        <span class="label">Album / release</span>
        ${escapeHtml(s.alb || '—')}
      </div>
      <div class="detail-row">
        <span class="label">Collaborators</span>
        ${collabHtml}
      </div>
      ${s.trivia ? `<div class="trivia-box">🎶 ${escapeHtml(s.trivia)}</div>` : ''}
      ${spotifyHtml}
    `;

    songModalBody.querySelectorAll('.collab-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        closeSongModal();
        searchInput.value = chip.dataset.name;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    songModalOverlay.hidden = false;
  }
  function closeSongModal() { songModalOverlay.hidden = true; }
  songModalClose.addEventListener('click', closeSongModal);
  songModalOverlay.addEventListener('click', e => { if (e.target === songModalOverlay) closeSongModal(); });

  // ---- Trivia modal ----
  function renderTrivia() {
    triviaList.innerHTML = MAX_MARTIN_TRIVIA.map(t => `<li>${escapeHtml(t)}</li>`).join('');
  }
  function openTriviaModal() { triviaModalOverlay.hidden = false; }
  function closeTriviaModal() { triviaModalOverlay.hidden = true; }
  triviaBtn.addEventListener('click', () => { renderTrivia(); openTriviaModal(); });
  triviaModalClose.addEventListener('click', closeTriviaModal);
  triviaModalOverlay.addEventListener('click', e => { if (e.target === triviaModalOverlay) closeTriviaModal(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeSongModal(); closeTriviaModal(); closeInterviewsModal(); closeJulietModal(); }
  });

  // ---- Interviews ----
  const TYPE_ICON = { Video: '▶', Radio: '📻', Written: '📰' };
  function renderInterviews() {
    if (!interviewsList || typeof MAX_MARTIN_INTERVIEWS === 'undefined') return;
    interviewsList.innerHTML = MAX_MARTIN_INTERVIEWS.map(iv => `
      <a class="interview-card" href="${escapeHtml(iv.url)}" target="_blank" rel="noopener noreferrer">
        <div class="interview-service">
          <span class="interview-type-icon type-${iv.type.toLowerCase()}">${TYPE_ICON[iv.type] || '🔗'}</span>
          <span class="interview-service-name">${escapeHtml(iv.service)}</span>
          <span class="interview-type-label">${escapeHtml(iv.type)}</span>
        </div>
        <div class="interview-title">${escapeHtml(iv.title)}</div>
        <div class="interview-meta">${escapeHtml(iv.outlet)} · ${iv.year}</div>
        ${iv.note ? `<div class="interview-note">${escapeHtml(iv.note)}</div>` : ''}
      </a>
    `).join('');
  }
  function openInterviewsModal() { interviewsModalOverlay.hidden = false; }
  function closeInterviewsModal() { interviewsModalOverlay.hidden = true; }
  interviewsBtn.addEventListener('click', () => { renderInterviews(); openInterviewsModal(); });
  interviewsModalClose.addEventListener('click', closeInterviewsModal);
  interviewsModalOverlay.addEventListener('click', e => { if (e.target === interviewsModalOverlay) closeInterviewsModal(); });

  // ---- & Juliet ----
  function renderJuliet() {
    if (!julietBody || typeof MAX_MARTIN_JULIET === 'undefined') return;
    const j = MAX_MARTIN_JULIET;
    julietBody.innerHTML = `
      <p class="juliet-intro">${escapeHtml(j.intro)}</p>
      ${j.officialUrl ? `<a href="${escapeHtml(j.officialUrl)}" target="_blank" rel="noopener noreferrer" class="juliet-link juliet-link-top">Official worldwide site →</a>` : ''}
      <div class="juliet-grid">
        ${j.productions.map(p => `
          <div class="juliet-card">
            <div class="juliet-card-top">
              ${p.url
                ? `<a class="juliet-place" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.place)}</a>`
                : `<span class="juliet-place">${escapeHtml(p.place)}</span>`}
              <span class="juliet-status juliet-status-${p.status}">${escapeHtml(p.statusLabel)}</span>
            </div>
            <div class="juliet-venue">${escapeHtml(p.venue)}</div>
            <div class="juliet-dates">${escapeHtml(p.dates)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
  function openJulietModal() { renderJuliet(); julietModalOverlay.hidden = false; }
  function closeJulietModal() { julietModalOverlay.hidden = true; }
  julietBtn.addEventListener('click', openJulietModal);
  julietModalClose.addEventListener('click', closeJulietModal);
  julietModalOverlay.addEventListener('click', e => { if (e.target === julietModalOverlay) closeJulietModal(); });

  // ---- Wire up controls ----
  searchInput.addEventListener('input', render);
  groupSelect.addEventListener('change', render);
  orderSelect.addEventListener('change', render);
  roleSelect.addEventListener('change', render);
  triviaOnly.addEventListener('change', render);

  // ---- Init ----
  renderStats();
  render();
})();
