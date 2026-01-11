// ========================================
// GERENCIAMENTO DE DADOS
// ========================================

class DataManager {
  constructor() {
    this.flashcards = [];
    this.folders = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    this.loadFlashcards();
    this.loadFolders();
    this.initialized = true;
    console.log('✅ DataManager inicializado');
  }

  loadFlashcards() {
    try {
      const data = localStorage.getItem('flashcards');
      this.flashcards = data ? JSON.parse(data) : [];
      console.log('📚 Flashcards carregados:', this.flashcards.length);
    } catch (error) {
      console.error('❌ Erro ao carregar:', error);
      this.flashcards = [];
    }
  }

  loadFolders() {
    try {
      const data = localStorage.getItem('folders');
      this.folders = data ? JSON.parse(data) : [];
      console.log('📁 Pastas carregadas:', this.folders.length);
    } catch (error) {
      console.error('❌ Erro ao carregar pastas:', error);
      this.folders = [];
    }
  }

  saveFlashcards() {
    try {
      localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
      console.log('💾 Flashcards salvos:', this.flashcards.length);
      this.logDataToConsole();
    } catch (error) {
      console.error('❌ Erro ao salvar flashcards:', error);
    }
  }

  saveFolders() {
    try {
      localStorage.setItem('folders', JSON.stringify(this.folders));
      console.log('💾 Pastas salvas:', this.folders.length);
      this.logDataToConsole();
    } catch (error) {
      console.error('❌ Erro ao salvar pastas:', error);
    }
  }

  logDataToConsole() {
    const dados = {
      name: "Flashcards Musicais",
      short_name: "Flashcards",
      start_url: "./index.html",
      display: "standalone",
      background_color: "#f4f0ff",
      theme_color: "#9f7aea",
      data: {
        flashcards: this.flashcards,
        folders: this.folders,
        ultimaAtualizacao: new Date().toISOString(),
        versao: '1.0',
        totalFlashcards: this.flashcards.length,
        totalPastas: this.folders.length
      }
    };
    
    console.log('📄 Dados atuais (copie para data.json):');
    console.log(JSON.stringify(dados, null, 2));
  }

  exportJSON() {
    try {
      const dados = {
        name: "Flashcards Musicais",
        short_name: "Flashcards",
        start_url: "./index.html",
        display: "standalone",
        background_color: "#f4f0ff",
        theme_color: "#9f7aea",
        data: {
          flashcards: this.flashcards,
          folders: this.folders,
          ultimaAtualizacao: new Date().toISOString(),
          versao: '1.0',
          totalFlashcards: this.flashcards.length,
          totalPastas: this.folders.length
        }
      };
      
      const json = JSON.stringify(dados, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('✅ Arquivo data.json exportado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar JSON:', error);
    }
  }

  addFlashcard(flashcard) {
    this.flashcards.push(flashcard);
    console.log('➕ Flashcard adicionado. Total:', this.flashcards.length);
    this.saveFlashcards();
  }

  deleteFlashcard(id) {
    const lengthBefore = this.flashcards.length;
    this.flashcards = this.flashcards.filter(f => f.id !== id);
    console.log(`🗑️ Flashcard deletado. Total: ${lengthBefore} → ${this.flashcards.length}`);
    this.saveFlashcards();
  }

  toggleFavorite(id) {
    const flashcard = this.flashcards.find(f => f.id === id);
    if (flashcard) {
      flashcard.favorito = !flashcard.favorito;
      console.log(`⭐ Favorito alterado: ${flashcard.titulo} → ${flashcard.favorito}`);
      this.saveFlashcards();
    }
  }

  deleteFolder(folderName) {
    this.folders = this.folders.filter(f => f.nome !== folderName);
    console.log(`🗑️ Pasta deletada: ${folderName}`);
    
    this.flashcards.forEach(flashcard => {
      if (flashcard.pasta === folderName) {
        flashcard.pasta = '';
        flashcard.corPasta = '';
      }
    });
    
    this.saveFolders();
    this.saveFlashcards();
  }

  addFolder(folder) {
    const existente = this.folders.find(f => f.nome === folder.nome);
    if (!existente) {
      this.folders.push(folder);
      console.log('📁 Pasta adicionada:', folder.nome);
      this.saveFolders();
    } else {
      console.log('📁 Pasta já existe:', folder.nome);
    }
  }

  getFlashcardsByFolder(folderName) {
    return this.flashcards.filter(f => f.pasta === folderName);
  }

  getFavorites() {
    return this.flashcards.filter(f => f.favorito);
  }

  getFolderByName(name) {
    return this.folders.find(f => f.nome === name);
  }
}

// ========================================
// GERENCIAMENTO DE VIEWS
// ========================================

class ViewManager {
  constructor() {
    this.currentView = 'home';
    this.setupNavigation();
  }

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        console.log('🔄 Mudando para view:', view);
        this.showView(view);
        
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (window.app) {
          window.app.render();
        }
      });
    });
  }

  showView(viewName) {
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    const view = document.getElementById(viewName);
    if (view) {
      view.classList.add('active');
      this.currentView = viewName;
      console.log('👁️ View ativa:', viewName);
    } else {
      console.error('❌ View não encontrada:', viewName);
    }
  }
}

// ========================================
// RENDERIZAÇÃO DE CARDS
// ========================================

class CardRenderer {
  constructor(dataManager) {
    this.dataManager = dataManager;
  }

  renderFlashcard(flashcard) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const tituloSafe = this.escapeHtml(flashcard.titulo);
    const artistaSafe = this.escapeHtml(flashcard.artista);
    const pastaSafe = flashcard.pasta ? this.escapeHtml(flashcard.pasta) : '';
    
    card.innerHTML = `
      <h3 class="card-title">${tituloSafe}</h3>
      <p class="card-artist">${artistaSafe}</p>
      ${flashcard.pasta ? `<span class="card-tag" style="background-color: ${flashcard.corPasta}">${pastaSafe}</span>` : ''}
      <p class="card-info">${flashcard.cards.length} frases</p>
      <div class="card-actions">
        <button class="btn-study" data-id="${flashcard.id}">
          <span class="icon">▶️</span>
          Estudar
        </button>
        <button class="btn-icon ${flashcard.favorito ? 'favorito' : ''}" data-action="favorite" data-id="${flashcard.id}">
          ${flashcard.favorito ? '⭐' : '☆'}
        </button>
        <button class="btn-icon delete" data-action="delete" data-id="${flashcard.id}">
          🗑️
        </button>
      </div>
    `;

    const studyBtn = card.querySelector('.btn-study');
    studyBtn.addEventListener('click', async () => {
      studyBtn.disabled = true;
      studyBtn.innerHTML = '<span class="icon">⏳</span> Preparando...';
      
      await app.startStudy(flashcard.id);
      
      studyBtn.disabled = false;
      studyBtn.innerHTML = '<span class="icon">▶️</span> Estudar';
    });

    const favoriteBtn = card.querySelector('[data-action="favorite"]');
    favoriteBtn.addEventListener('click', () => {
      this.dataManager.toggleFavorite(flashcard.id);
      app.render();
    });

    const deleteBtn = card.querySelector('[data-action="delete"]');
    deleteBtn.addEventListener('click', () => {
      if (confirm('Deseja realmente excluir este flashcard?')) {
        this.dataManager.deleteFlashcard(flashcard.id);
        app.render();
      }
    });

    return card;
  }

  renderFolder(folder, flashcardsCount) {
    const card = document.createElement('div');
    card.className = 'pasta-card';
    card.style.backgroundColor = folder.cor;
    
    card.innerHTML = `
      <button class="btn-delete-folder" data-folder="${this.escapeHtml(folder.nome)}" title="Excluir pasta">
        ✕
      </button>
      <span class="icon">📁</span>
      <h3>${this.escapeHtml(folder.nome)}</h3>
      <p>${flashcardsCount} flashcard${flashcardsCount !== 1 ? 's' : ''}</p>
      ${flashcardsCount === 0 ? '<small class="pasta-vazia">Pasta vazia</small>' : ''}
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-delete-folder')) {
        app.showFolderContent(folder.nome);
      }
    });

    const deleteBtn = card.querySelector('.btn-delete-folder');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const mensagem = flashcardsCount > 0
        ? `Deseja realmente excluir a pasta "${folder.nome}"?\n\n` +
          `Esta pasta contém ${flashcardsCount} flashcard${flashcardsCount !== 1 ? 's' : ''}.\n` +
          `Os flashcards NÃO serão excluídos, apenas ficarão sem pasta.`
        : `Deseja excluir a pasta "${folder.nome}"?`;
      
      if (window.confirm(mensagem)) {
        this.dataManager.deleteFolder(folder.nome);
        app.render();
      }
    });

    return card;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ========================================
// MODO DE ESTUDO
// ========================================

class StudyMode {
  constructor() {
    this.currentFlashcard = null;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.isPlaying = false;
    this.utterance = null;
    this.allCards = [];
    this.originalCards = [];
  }

  async start(flashcard) {
    this.currentFlashcard = flashcard;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.isPlaying = false;

    this.originalCards = [...flashcard.cards];
    
    this.allCards = [];
    const palavrasUnicas = new Set();
    
    for (const card of flashcard.cards) {
      const wordsEn = card.ingles.split(/\s+/).filter(w => w.trim());
      
      for (const word of wordsEn) {
        const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
        
        if (cleanWord && !palavrasUnicas.has(cleanWord)) {
          palavrasUnicas.add(cleanWord);
          const traducao = await this.translateWord(word);
          this.allCards.push({
            ingles: word,
            portugues: traducao,
            tipo: 'palavra'
          });
        }
      }
    }
    
    this.originalCards.forEach(card => {
      this.allCards.push({
        ingles: card.ingles,
        portugues: card.portugues,
        tipo: 'frase'
      });
    });

    console.log('📖 Iniciando estudo:', flashcard.titulo);
    console.log(`📊 Total: ${this.allCards.length} cards (${palavrasUnicas.size} palavras únicas + ${this.originalCards.length} frases)`);

    document.getElementById('studyTitulo').textContent = flashcard.titulo;
    document.getElementById('studyArtista').textContent = flashcard.artista;
    
    this.setupSpotifyPlayer(flashcard.spotifyLink);
    
    this.updateCard();
    this.updateProgress();
    this.setupControls();

    viewManager.showView('estudar');
  }

  setupSpotifyPlayer(musicLink) {
    const playerContainer = document.getElementById('spotifyPlayerContainer');
    
    if (!musicLink || musicLink.trim() === '') {
      playerContainer.style.display = 'none';
      return;
    }
    
    let videoId = '';
    
    // Detecta YouTube
    if (musicLink.includes('youtube.com') || musicLink.includes('youtu.be')) {
      if (musicLink.includes('youtube.com/watch?v=')) {
        videoId = musicLink.split('v=')[1].split('&')[0];
      } else if (musicLink.includes('youtu.be/')) {
        videoId = musicLink.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        playerContainer.style.display = 'block';
        playerContainer.innerHTML = `
          <iframe 
            style="width: 100%; height: 350px; border-radius: 12px; border: none;" 
            src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
        console.log('🎵 Player do YouTube carregado:', videoId);
        return;
      }
    }
    
    // Detecta Spotify
    let spotifyId = '';
    if (musicLink.includes('spotify.com/track/')) {
      spotifyId = musicLink.split('track/')[1].split('?')[0];
    } else if (musicLink.includes('spotify:track:')) {
      spotifyId = musicLink.split('spotify:track:')[1];
    }
    
    if (spotifyId) {
      playerContainer.style.display = 'block';
      playerContainer.innerHTML = `
        <iframe 
          style="border-radius:12px; border: none;" 
          src="https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0" 
          width="100%" 
          height="152" 
          allowfullscreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy">
        </iframe>
      `;
      console.log('🎵 Player do Spotify carregado:', spotifyId);
      return;
    }
    
    playerContainer.style.display = 'none';
    console.log('⚠️ Link de música inválido (use YouTube ou Spotify)');
  }

  async translateWord(word) {
    const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase().trim();
    
    if (!cleanWord) return word;
    
    // Dicionário local para palavras comuns (tradução perfeita)
    const dicionarioComum = {
      'i': 'eu',
      'you': 'você',
      'he': 'ele',
      'she': 'ela',
      'it': 'isso/aquilo',
      'we': 'nós',
      'they': 'eles/elas',
      'am': 'sou/estou',
      'is': 'é/está',
      'are': 'são/estão',
      'was': 'era/estava',
      'were': 'eram/estavam',
      'be': 'ser/estar',
      'been': 'sido/estado',
      'have': 'ter',
      'has': 'tem',
      'had': 'tinha',
      'do': 'fazer',
      'does': 'faz',
      'did': 'fez',
      'will': 'vai/irá',
      'would': 'faria',
      'can': 'pode/consegue',
      'could': 'poderia',
      'may': 'pode/talvez',
      'might': 'poderia',
      'must': 'deve',
      'shall': 'deverá',
      'should': 'deveria',
      'the': 'o/a',
      'a': 'um/uma',
      'an': 'um/uma',
      'this': 'este/esta/isso',
      'that': 'aquele/aquela/aquilo',
      'these': 'estes/estas',
      'those': 'aqueles/aquelas',
      'my': 'meu/minha',
      'your': 'seu/sua',
      'his': 'dele',
      'her': 'dela',
      'its': 'dele/dela (coisa)',
      'our': 'nosso/nossa',
      'their': 'deles/delas',
      'and': 'e',
      'or': 'ou',
      'but': 'mas',
      'because': 'porque',
      'if': 'se',
      'when': 'quando',
      'where': 'onde',
      'why': 'por que',
      'how': 'como',
      'what': 'o que',
      'who': 'quem',
      'which': 'qual',
      'all': 'todo/toda',
      'some': 'algum/alguns',
      'any': 'qualquer',
      'no': 'não/nenhum',
      'not': 'não',
      'yes': 'sim',
      'about': 'sobre',
      'after': 'depois',
      'before': 'antes',
      'with': 'com',
      'without': 'sem',
      'for': 'para',
      'from': 'de',
      'to': 'para',
      'in': 'em',
      'on': 'em/sobre',
      'at': 'em',
      'by': 'por',
      'of': 'de',
      'up': 'para cima',
      'down': 'para baixo',
      'out': 'fora',
      'over': 'sobre',
      'under': 'sob',
      'again': 'novamente',
      'then': 'então',
      'there': 'lá/ali',
      'here': 'aqui',
      'now': 'agora',
      'today': 'hoje',
      'tomorrow': 'amanhã',
      'yesterday': 'ontem',
      'time': 'tempo',
      'day': 'dia',
      'year': 'ano',
      'way': 'caminho/jeito',
      'life': 'vida',
      'work': 'trabalho',
      'world': 'mundo',
      'love': 'amor',
      'know': 'saber/conhecer',
      'get': 'obter/conseguir',
      'make': 'fazer',
      'go': 'ir',
      'come': 'vir',
      'take': 'pegar/levar',
      'see': 'ver',
      'look': 'olhar',
      'want': 'querer',
      'give': 'dar',
      'use': 'usar',
      'find': 'encontrar',
      'tell': 'dizer/contar',
      'ask': 'perguntar',
      'feel': 'sentir',
      'try': 'tentar',
      'leave': 'sair/deixar',
      'call': 'chamar/ligar',
      'good': 'bom/boa',
      'new': 'novo/nova',
      'first': 'primeiro/primeira',
      'last': 'último/última',
      'long': 'longo/longa',
      'great': 'grande/ótimo',
      'little': 'pequeno/pouco',
      'own': 'próprio/própria',
      'other': 'outro/outra',
      'old': 'velho/velha',
      'right': 'certo/direita',
      'big': 'grande',
      'high': 'alto/alta',
      'different': 'diferente',
      'small': 'pequeno/pequena',
      'large': 'grande',
      'next': 'próximo/próxima',
      'early': 'cedo',
      'young': 'jovem',
      'important': 'importante',
      'few': 'poucos/poucas',
      'public': 'público/pública',
      'bad': 'ruim/mau',
      'same': 'mesmo/mesma',
      'able': 'capaz'
    };
    
    // Verifica no dicionário local primeiro
    if (dicionarioComum[cleanWord]) {
      console.log('📚 Dicionário:', cleanWord, '→', dicionarioComum[cleanWord]);
      return dicionarioComum[cleanWord];
    }
    
    // Tentativa 1: Google Translate (MELHOR)
    try {
      const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(cleanWord)}`;
      console.log('🌐 Google Translate:', cleanWord);
      
      const response = await fetch(googleUrl);
      const data = await response.json();
      
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        const traducao = data[0][0][0];
        // Não retorna se for igual à palavra original
        if (traducao.toLowerCase() !== cleanWord) {
          console.log('✅ Google:', cleanWord, '→', traducao);
          return traducao;
        }
      }
    } catch (error) {
      console.log('⚠️ Google falhou');
    }
    
    // Tentativa 2: MyMemory
    try {
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=en|pt-BR`;
      console.log('🌐 MyMemory:', cleanWord);
      
      const response = await fetch(myMemoryUrl);
      const data = await response.json();
      
      if (data.responseData && data.responseData.translatedText) {
        const traducao = data.responseData.translatedText;
        if (traducao.toLowerCase() !== cleanWord) {
          console.log('✅ MyMemory:', cleanWord, '→', traducao);
          return traducao;
        }
      }
    } catch (error) {
      console.log('⚠️ MyMemory falhou');
    }
    
    // Se tudo falhar, retorna palavra + aviso
    console.log('❌ Não traduzido:', cleanWord);
    return `${word} (?)`;
  }
  setupControls() {
    const flashcardContainer = document.getElementById('flashcardContainer');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnProximo = document.getElementById('btnProximo');
    const btnAudio = document.getElementById('btnAudio');
    const btnFechar = document.getElementById('btnFecharEstudo');

    flashcardContainer.replaceWith(flashcardContainer.cloneNode(true));
    const newContainer = document.getElementById('flashcardContainer');
    
    newContainer.addEventListener('click', () => this.flipCard());

    btnAnterior.onclick = () => this.previousCard();
    btnProximo.onclick = () => this.nextCard();
    btnAudio.onclick = () => this.toggleAudio();
    btnFechar.onclick = () => {
      this.stop();
      viewManager.showView('home');
    };
  }

  updateCard() {
    const card = this.allCards[this.currentCardIndex];
    const flashcardText = document.getElementById('flashcardText');
    
    // Mostra o texto correto (inglês ou português)
    if (this.isFlipped) {
      flashcardText.textContent = card.portugues;
      flashcardText.style.color = '#8b5cf6'; // Cor roxa para português
    } else {
      flashcardText.textContent = card.ingles;
      flashcardText.style.color = '#1f2937'; // Cor escura para inglês
    }

    const flipHint = document.querySelector('.flip-hint span:last-child');
    if (this.isFlipped) {
      flipHint.textContent = 'Clique para ver em inglês';
    } else {
      flipHint.textContent = 'Clique para ver tradução';
    }
    
    // Atualiza informação do tipo
    const progressText = document.getElementById('progressText');
    const tipo = card.tipo === 'palavra' ? 'Palavra' : 'Frase';
    progressText.textContent = `${tipo} ${this.currentCardIndex + 1} de ${this.allCards.length}`;

    document.getElementById('btnAnterior').disabled = this.currentCardIndex === 0;
    document.getElementById('btnProximo').disabled = this.currentCardIndex === this.allCards.length - 1;
  }

  updateProgress() {
    const total = this.allCards.length;
    const current = this.currentCardIndex + 1;
    const percent = Math.round((current / total) * 100);

    const card = this.allCards[this.currentCardIndex];
    const tipo = card.tipo === 'palavra' ? 'Palavra' : 'Frase';

    document.getElementById('progressText').textContent = `${tipo} ${current} de ${total}`;
    document.getElementById('progressPercent').textContent = `${percent}%`;
    document.getElementById('progressFill').style.width = `${percent}%`;
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    console.log('🔄 Card virado:', this.isFlipped ? 'Português' : 'Inglês');
    this.updateCard();
  }

  nextCard() {
    if (this.currentCardIndex < this.allCards.length - 1) {
      this.currentCardIndex++;
      this.isFlipped = false;
      this.stopAudio();
      this.updateCard();
      this.updateProgress();
      console.log('➡️ Próximo card:', this.currentCardIndex + 1);
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.isFlipped = false;
      this.stopAudio();
      this.updateCard();
      this.updateProgress();
      console.log('⬅️ Card anterior:', this.currentCardIndex + 1);
    }
  }

  toggleAudio() {
    if (this.isPlaying) {
      this.stopAudio();
    } else {
      this.playAudio();
    }
  }

  playAudio() {
    const card = this.allCards[this.currentCardIndex];
    const textToSpeak = card.ingles === '...' ? '' : card.ingles;
    
    if (!textToSpeak) {
      console.log('⚠️ Nenhum texto para reproduzir');
      return;
    }
    
    if ('speechSynthesis' in window) {
      this.utterance = new SpeechSynthesisUtterance(textToSpeak);
      this.utterance.lang = 'en-US';
      this.utterance.rate = card.tipo === 'palavra' ? 0.50 : 0.60;
      
      this.utterance.onend = () => {
        this.isPlaying = false;
        this.updateAudioButton();
      };

      speechSynthesis.speak(this.utterance);
      this.isPlaying = true;
      this.updateAudioButton();
      console.log('🔊 Reproduzindo áudio:', textToSpeak);
    } else {
      alert('Seu navegador não suporta síntese de voz.');
    }
  }

  stopAudio() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      this.isPlaying = false;
      this.updateAudioButton();
      console.log('⏸️ Áudio pausado');
    }
  }

  updateAudioButton() {
    const btnAudio = document.getElementById('btnAudio');
    const audioIcon = document.getElementById('audioIcon');
    
    if (this.isPlaying) {
      btnAudio.classList.add('playing');
      audioIcon.textContent = '⏸️';
    } else {
      btnAudio.classList.remove('playing');
      audioIcon.textContent = '🔊';
    }
  }

  stop() {
    this.stopAudio();
    this.currentFlashcard = null;
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.allCards = [];
    this.originalCards = [];
    console.log('⏹️ Estudo finalizado');
  }
}

// ========================================
// APLICAÇÃO PRINCIPAL
// ========================================

class App {
  constructor() {
    this.dataManager = new DataManager();
    this.cardRenderer = new CardRenderer(this.dataManager);
    this.studyMode = new StudyMode();
    
    this.init();
  }

  async init() {
    await this.dataManager.init();
    this.setupFormHandlers();
    this.setupPastaSelector();
    this.render();
    console.log('🚀 App inicializado com sucesso!');
  }

  setupFormHandlers() {
    document.getElementById('btnCriar').addEventListener('click', () => {
      this.updatePastaSelector();
      viewManager.showView('criar');
    });

    document.getElementById('btnCriarEmpty').addEventListener('click', () => {
      this.updatePastaSelector();
      viewManager.showView('criar');
    });

    document.getElementById('btnSalvar').addEventListener('click', () => {
      this.saveFlashcard();
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
      this.clearForm();
      viewManager.showView('home');
    });

    document.getElementById('btnVoltarPastas').addEventListener('click', () => {
      viewManager.showView('pastas');
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        this.dataManager.exportJSON();
      }
    });
  }

  setupPastaSelector() {
    const selectPasta = document.getElementById('selectPasta');
    const novaPastaGroup = document.getElementById('novaPastaGroup');
    const corPastaGroup = document.getElementById('corPastaGroup');

    selectPasta.addEventListener('change', (e) => {
      const value = e.target.value;
      
      if (value === '__nova__') {
        novaPastaGroup.style.display = 'block';
        corPastaGroup.style.display = 'block';
      } else {
        novaPastaGroup.style.display = 'none';
        corPastaGroup.style.display = 'none';
      }
    });
  }

  updatePastaSelector() {
    const selectPasta = document.getElementById('selectPasta');
    const folders = this.dataManager.folders;
    
    while (selectPasta.options.length > 2) {
      selectPasta.remove(2);
    }
    
    folders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder.nome;
      option.textContent = folder.nome;
      selectPasta.appendChild(option);
    });
  }

  async saveFlashcard() {
    const titulo = document.getElementById('inputTitulo').value.trim();
    const artista = document.getElementById('inputArtista').value.trim();
    const spotifyLink = document.getElementById('inputSpotify').value.trim();
    const selectPasta = document.getElementById('selectPasta').value;
    const novaPasta = document.getElementById('inputNovaPasta').value.trim();
    const corPasta = document.getElementById('inputCor').value;
    const letra = document.getElementById('inputLetra').value.trim();

    if (!titulo || !artista || !letra) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    let pastaNome = '';
    let pastaCorFinal = '';
    
    if (selectPasta === '__nova__') {
      if (!novaPasta) {
        alert('Por favor, digite o nome da nova pasta!');
        return;
      }
      pastaNome = novaPasta;
      pastaCorFinal = corPasta;
    } else if (selectPasta) {
      pastaNome = selectPasta;
      const pastaExistente = this.dataManager.getFolderByName(selectPasta);
      pastaCorFinal = pastaExistente ? pastaExistente.cor : '#b197fc';
    }

    const linhas = letra.split('\n').filter(l => l.trim());
    
    if (linhas.length < 2) {
      alert('Por favor, adicione pelo menos uma frase em inglês e uma em português!');
      return;
    }

    if (linhas.length % 2 !== 0) {
      alert('O número de linhas deve ser par!\n\nCada par de linhas representa:\nLinha ímpar = Inglês\nLinha par = Português');
      return;
    }

    const cards = [];
    for (let i = 0; i < linhas.length; i += 2) {
      cards.push({
        ingles: linhas[i].trim(),
        portugues: linhas[i + 1].trim()
      });
    }

    const flashcard = {
      id: Date.now(),
      titulo: titulo,
      artista: artista,
      spotifyLink: spotifyLink,
      pasta: pastaNome,
      corPasta: pastaCorFinal,
      cards: cards,
      favorito: false,
      criadoEm: new Date().toISOString()
    };

    console.log('💾 Salvando flashcard:', flashcard);
    this.dataManager.addFlashcard(flashcard);

    if (pastaNome) {
      this.dataManager.addFolder({
        id: Date.now(),
        nome: pastaNome,
        cor: pastaCorFinal
      });
    }

    this.clearForm();
    viewManager.showView('historico');
    this.render();

    alert(`✅ Flashcard criado com sucesso!\n\n${cards.length} par(es) de frases adicionado(s).\n\nNo modo estudo: primeiro palavra por palavra (tradução automática), depois frase completa!`);
  }

  clearForm() {
    document.getElementById('inputTitulo').value = '';
    document.getElementById('inputArtista').value = '';
    document.getElementById('inputSpotify').value = '';
    document.getElementById('selectPasta').value = '';
    document.getElementById('inputNovaPasta').value = '';
    document.getElementById('inputCor').value = '#b197fc';
    document.getElementById('inputLetra').value = '';
    
    document.getElementById('novaPastaGroup').style.display = 'none';
    document.getElementById('corPastaGroup').style.display = 'none';
  }

  render() {
    console.log('🎨 Renderizando todas as views...');
    this.renderHome();
    this.renderHistorico();
    this.renderPastas();
  }

  renderHome() {
    const container = document.getElementById('favoritosList');
    const emptyState = document.getElementById('emptyFavoritos');
    const favoritos = this.dataManager.getFavorites();

    if (!container || !emptyState) return;

    container.innerHTML = '';

    if (favoritos.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      container.style.display = 'grid';
      
      favoritos.forEach(flashcard => {
        const card = this.cardRenderer.renderFlashcard(flashcard);
        container.appendChild(card);
      });
    }
    
    console.log('❤️ Home renderizado:', favoritos.length, 'favoritos');
  }

  renderHistorico() {
    const container = document.getElementById('historicoList');
    const emptyState = document.getElementById('emptyHistorico');
    const contador = document.getElementById('contadorTotal');
    
    if (!container || !emptyState || !contador) return;

    container.innerHTML = '';
    const flashcards = [...this.dataManager.flashcards].reverse();
    contador.textContent = `${this.dataManager.flashcards.length} flashcards criados`;

    if (flashcards.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      container.style.display = 'grid';
      
      flashcards.forEach(flashcard => {
        const card = this.cardRenderer.renderFlashcard(flashcard);
        container.appendChild(card);
      });
    }
  }

  renderPastas() {
    const container = document.getElementById('pastasList');
    const emptyState = document.getElementById('emptyPastas');
    const folders = this.dataManager.folders;

    if (!container || !emptyState) return;

    container.innerHTML = '';

    if (folders.length === 0) {
      emptyState.style.display = 'block';
      container.style.display = 'none';
    } else {
      emptyState.style.display = 'none';
      container.style.display = 'grid';
      
      folders.forEach(folder => {
        const flashcardsCount = this.dataManager.getFlashcardsByFolder(folder.nome).length;
        const card = this.cardRenderer.renderFolder(folder, flashcardsCount);
        container.appendChild(card);
      });
    }
    
    console.log('📁 Pastas renderizadas:', folders.length);
  }

  showFolderContent(folderName) {
    const container = document.getElementById('pastaConteudoList');
    const titulo = document.getElementById('pastaNome');
    const flashcards = this.dataManager.getFlashcardsByFolder(folderName);

    container.innerHTML = '';
    titulo.textContent = folderName;

    flashcards.forEach(flashcard => {
      const card = this.cardRenderer.renderFlashcard(flashcard);
      container.appendChild(card);
    });

    viewManager.showView('pastaConteudo');
    console.log('📂 Exibindo pasta:', folderName, '-', flashcards.length, 'flashcards');
  }

  async startStudy(flashcardId) {
    const flashcard = this.dataManager.flashcards.find(f => f.id === flashcardId);
    if (flashcard) {
      await this.studyMode.start(flashcard);
    }
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

let viewManager;
let app;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎵 Inicializando aplicativo...');
  viewManager = new ViewManager();
  app = new App();
  
  window.app = app;
  window.viewManager = viewManager;
  
  console.log('🎵 Aplicativo de Flashcards Musicais carregado!');
});