        function navigateTo(pageId) {
            const pages = document.querySelectorAll('.page-section');
            pages.forEach(page => {
                page.classList.remove('active');
                setTimeout(() => {
                    if(!page.classList.contains('active')) {
                        page.style.display = 'none';
                    }
                }, 600); 
            });

            const targetPage = document.getElementById('page-' + pageId);
            if (targetPage) {
                targetPage.style.display = 'block';
                void targetPage.offsetWidth; 
                targetPage.classList.add('active');
            }

            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.dataset.target === pageId) {
                    link.classList.add('text-white');
                    link.classList.remove('text-gray-400');
                    link.querySelector('span').classList.add('w-full');
                    link.querySelector('span').classList.remove('w-0');
                } else {
                    link.classList.remove('text-white');
                    link.classList.add('text-gray-400');
                    link.querySelector('span').classList.remove('w-full');
                    link.querySelector('span').classList.add('w-0');
                }
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(() => {
                observeElements();
            }, 100);
        }

        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        function toggleMobileMenu() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                document.body.style.overflow = 'auto';
            }
        }
        
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        let observer;
        
        function observeElements() {
            const faders = document.querySelectorAll('.page-section.active .fade-in-up');
            
            const appearOptions = {
                threshold: 0.15,
                rootMargin: "0px 0px -50px 0px"
            };

            if (observer) {
                observer.disconnect();
            }

            observer = new IntersectionObserver(function(entries, observer) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                    }
                });
            }, appearOptions);

            faders.forEach(fader => {
                fader.classList.remove('appear');
                observer.observe(fader);
            });
        }

        window.onload = function() {
            initThreeJS();
            navigateTo('home');

            const mapWrap = document.getElementById('world-map-wrap');
            if (mapWrap) {
                const mapObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            mapWrap.classList.add('in-view');
                            mapObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.25 });
                mapObserver.observe(mapWrap);
            }

            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('bg-black/90', 'backdrop-blur-lg', 'border-gray-800');
                    navbar.classList.remove('border-transparent');
                } else {
                    navbar.classList.remove('bg-black/90', 'backdrop-blur-lg', 'border-gray-800');
                    navbar.classList.add('border-transparent');
                }
            });
        };
