document.addEventListener('DOMContentLoaded', () => {

    // 1. Menu Mobile (Hamburger)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    // 2. Active Link no Scroll (Spy)
    const sections = document.querySelectorAll('section, footer');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Galeria de Fotos (Carrossel com Dots Dinâmicos)
    const galleryCarousel = document.getElementById('galleryCarousel');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const indicatorsContainer = document.getElementById('galleryIndicators');
    const slides = document.querySelectorAll('.gallery-slide');
    
    let currentIndex = 0;
    
    // Calcula quantos itens aparecem na tela
    function getVisibleCount() {
        if(window.innerWidth <= 768) return 1;
        if(window.innerWidth <= 992) return 2;
        return 3;
    }

    // Calcula total de "páginas/movimentos" possíveis
    function getMaxIndex() {
        return slides.length - getVisibleCount();
    }

    // Cria as bolinhas (dots) dinamicamente baseada na quantidade de slides
    function setupIndicators() {
        indicatorsContainer.innerHTML = '';
        const max = getMaxIndex();
        
        for(let i = 0; i <= max; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if(i === currentIndex) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateGallery();
            });
            indicatorsContainer.appendChild(dot);
        }
    }

    function updateGallery() {
        // Largura de um slide (incluindo padding)
        const slideWidth = slides[0].clientWidth;
        galleryCarousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Atualiza a classe ativa nos dots
        const dots = document.querySelectorAll('.gallery-indicators .dot');
        dots.forEach((dot, index) => {
            if(index === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    nextBtn.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop para o início
        }
        updateGallery();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = getMaxIndex(); // Loop para o final
        }
        updateGallery();
    });

    // Recalcula tamanho e recria dots ao redimensionar a janela
    window.addEventListener('resize', () => {
        // Previne que o índice fique fora dos limites no redimensionamento
        if(currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
        setupIndicators();
        updateGallery();
    });

    // Inicializa a Galeria
    setupIndicators();
    updateGallery();


    // 4. Accordion (FAQ - Fiel ao Print)
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Alterna a classe 'active' no header clicado (gira a setinha via CSS)
            this.classList.toggle('active');
            
            const content = this.nextElementSibling;
            
            // Abre ou fecha o conteúdo animando o max-height
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

// ==========================================
    // ANIMAÇÃO DE REVELAR SEÇÕES NO SCROLL
    // ==========================================
    
    // Seleciona todas as tags <section> da página
    const secoes = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        threshold: 0.15, // A animação dispara quando 15% da seção estiver na tela
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe 'visivel' na seção que entrou na tela
                entry.target.classList.add('visivel');
                
                // Para de observar esta seção para que a animação aconteça só uma vez
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Inicia a observação para cada seção, ignorando a 'home' que já está visível
    secoes.forEach(secao => {
        if (secao.id !== 'home') {
            sectionObserver.observe(secao);
        }
    });