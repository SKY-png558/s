document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // ANIMAÇÃO AO SCROLL
    // ==========================

    const elementos = document.querySelectorAll(`
        .item,
        .card-evolucao,
        .card,
        .card-grande,
        .tv-pequena,
        .tv-grande,
        .monitor-pequeno,
        .monitor-grande,
        .eletro-card,
        .acessorio-card,
        .quadro
    `);

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){

                entry.target.classList.add("aparecer");

            }

        });

    }, {
        threshold: 0.15
    });

    elementos.forEach(elemento => {
        observer.observe(elemento);
    });

    // ==========================
    // EFEITO 3D NOS CARDS
    // ==========================

    const cards = document.querySelectorAll(`
        .card,
        .card-grande,
        .tv-pequena,
        .tv-grande,
        .monitor-pequeno,
        .monitor-grande,
        .eletro-card,
        .acessorio-card,
        .card-evolucao
    `);

    cards.forEach(card => {

        card.addEventListener("mousemove", (e) => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 16;
            const rotateX = ((y / rect.height) - 0.5) * -16;

            card.style.transform =
                `perspective(1000px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 scale(1.03)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) scale(1)";

        });

    });

    // ==========================
    // ZOOM NAS IMAGENS
    // ==========================

    const imagens = document.querySelectorAll("img");

    imagens.forEach(img => {

        img.addEventListener("mouseenter", () => {

            img.style.transition = "0.5s";
            img.style.transform = "scale(1.08)";

        });

        img.addEventListener("mouseleave", () => {

            img.style.transform = "scale(1)";

        });

    });

    // ==========================
    // PARALLAX
    // ==========================

    window.addEventListener("scroll", () => {

        const scroll = window.pageYOffset;

        document.querySelectorAll(".conteudo1 img").forEach(img => {

            img.style.transform =
                `translateY(${scroll * 0.08}px)`;

        });

    });

    // ==========================
    // BOTÃO VOLTAR AO TOPO
    // ==========================

    const topo = document.createElement("button");

    topo.innerHTML = "↑";

    topo.classList.add("btn-topo");

    document.body.appendChild(topo);

    window.addEventListener("scroll", () => {

        if(window.scrollY > 500){

            topo.classList.add("mostrar");

        }else{

            topo.classList.remove("mostrar");

        }

    });

    topo.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    // ==========================
    // EFEITO BRILHO
    // ==========================

    cards.forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background =
            `
            radial-gradient(
            circle at ${x}px ${y}px,
            rgba(255,255,255,0.35),
            transparent 45%
            )
            ,
            #0b78ff
            `;

        });

        card.addEventListener("mouseleave", () => {

            card.style.background = "#0b78ff";

        });

    });

    // ==========================
    // DIGITAÇÃO DO TÍTULO
    // ==========================

    const titulo = document.querySelector(".conteudo2 h1");

    if(titulo){

        const textoOriginal = titulo.innerText;

        titulo.innerText = "";

        let i = 0;

        function escrever(){

            if(i < textoOriginal.length){

                titulo.innerText += textoOriginal.charAt(i);

                i++;

                setTimeout(escrever, 80);

            }

        }

        escrever();

    }

});