/* =========================================================
   ESTADO DO JOGO
========================================================= */

let reinoAtual = "";
let reinoInimigo = "";

let resistencia = 10;
let soldados = 300;

let ouro = 0;
let prata = 0;

let posicao = 1;

let movendo = false;

let cartaAtual = null;
let tipoCartaAtual = "";

let decisaoEscolhida = null;

let rodadaGuerra = 1;

let dadoMeu = null;
let dadoInimigo = null;

let vitoriasMeu = 0;
let vitoriasInimigo = 0;

let guerraFinalizada = false;

let vencedorGuerra = null;


/* =========================================================
   FUNÇÕES BÁSICAS
========================================================= */

function elemento(id) {
    return document.getElementById(id);
}


function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function mostrarTela(id) {

    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    const tela = elemento(id);

    if (tela) {
        tela.classList.add("ativa");
    }
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function mostrarRegras() {
    mostrarTela("telaRegras");
}


function mostrarEscolhaReino() {
    mostrarTela("telaEscolhaReino");
}


function voltarInicio() {

    resetarJogo();

    mostrarTela("telaInicio");
}


function voltarTabuleiro() {

    if (guerraFinalizada) {
        return;
    }

    mostrarTela("telaJogo");

    atualizarStatus();

    atualizarPeao();

    mostrarMensagem(
        "Você voltou ao tabuleiro."
    );
}


/* =========================================================
   RESET
========================================================= */

function resetarJogo() {

    reinoAtual = "";
    reinoInimigo = "";

    resistencia = 10;
    soldados = 300;

    ouro = 0;
    prata = 0;

    posicao = 1;

    movendo = false;

    cartaAtual = null;
    tipoCartaAtual = "";

    decisaoEscolhida = null;

    rodadaGuerra = 1;

    dadoMeu = null;
    dadoInimigo = null;

    vitoriasMeu = 0;
    vitoriasInimigo = 0;

    guerraFinalizada = false;
    vencedorGuerra = null;

    atualizarStatus();
}


/* =========================================================
   ESCOLHER REINO
========================================================= */

function escolherReino(reino) {

    if (
        reino !== "ingles" &&
        reino !== "frances"
    ) {
        return;
    }

    reinoAtual = reino;

    reinoInimigo =
        reino === "ingles"
            ? "frances"
            : "ingles";


    resistencia = 10;
    soldados = 300;

    ouro = 0;
    prata = 0;

    posicao = 1;


    /* 8 barras iniciais
       Prata tem maior chance */

    for (let i = 0; i < 8; i++) {

        if (Math.random() < 0.7) {
            prata++;
        } else {
            ouro++;
        }
    }


    if (reinoAtual === "ingles") {

        elemento("nomeReino").textContent =
            "Reino da Inglaterra";

    } else {

        elemento("nomeReino").textContent =
            "Reino da França";
    }


    atualizarStatus();

    criarTabuleiro();

    mostrarTela("telaJogo");

    mostrarMensagem(
        "Seu reino está pronto! Role o dado para começar."
    );
}


/* =========================================================
   STATUS
========================================================= */

function atualizarStatus() {

    elemento("resistencia").textContent =
        resistencia;

    elemento("soldados").textContent =
        soldados;

    elemento("ouro").textContent =
        ouro;

    elemento("prata").textContent =
        prata;


    if (elemento("soldadosGuerraMeu")) {

        elemento("soldadosGuerraMeu").textContent =
            soldados;
    }
}


function diminuirResistencia() {

    if (resistencia <= 0) {
        return;
    }

    resistencia--;

    atualizarStatus();

    if (resistencia <= 0) {
        derrotarReino();
    }
}


function aumentarResistencia(valor) {

    resistencia += valor;

    atualizarStatus();
}


function perderResistencia(valor) {

    resistencia -= valor;

    if (resistencia < 0) {
        resistencia = 0;
    }

    atualizarStatus();

    if (resistencia <= 0) {
        derrotarReino();
    }
}


function adicionarSoldados(valor) {

    soldados += valor;

    if (soldados < 0) {
        soldados = 0;
    }

    atualizarStatus();
}


function adicionarBarras(valor) {

    for (let i = 0; i < valor; i++) {

        if (Math.random() < 0.7) {
            prata++;
        } else {
            ouro++;
        }
    }

    atualizarStatus();
}


function removerBarras(valor) {

    for (let i = 0; i < valor; i++) {

        if (ouro + prata <= 0) {
            break;
        }

        if (ouro > 0 && prata > 0) {

            if (Math.random() < 0.3) {
                ouro--;
            } else {
                prata--;
            }

        } else if (ouro > 0) {

            ouro--;

        } else {

            prata--;
        }
    }

    atualizarStatus();
}


/* =========================================================
   TABULEIRO
========================================================= */

const casasEspeciais = {

    5: "sorte",
    8: "guerra",

    11: "decisao",
    14: "sorte",

    17: "guerra",
    20: "decisao",

    23: "sorte",
    26: "guerra",

    29: "decisao",
    32: "sorte",

    35: "guerra",
    38: "decisao"
};


function tipoDaCasa(numero) {
    return casasEspeciais[numero] || null;
}


function criarTabuleiro() {

    const tabuleiro =
        elemento("tabuleiro");

    tabuleiro.innerHTML = "";


    for (
        let numero = 1;
        numero <= 40;
        numero++
    ) {

        const casa =
            document.createElement("div");

        casa.className = "casa";


        const tipo =
            tipoDaCasa(numero);


        if (tipo) {
            casa.classList.add("especial");
        }


        /* NÚMERO */

        const numeroCasa =
            document.createElement("span");

        numeroCasa.className =
            "numero-casa";

        numeroCasa.textContent =
            numero;

        casa.appendChild(numeroCasa);


        /* ÍCONE */

        if (tipo) {

            const icone =
                document.createElement("span");

            icone.className =
                "icone-casa";


            if (tipo === "sorte") {
                icone.textContent = "🍀";
            }

            if (tipo === "decisao") {
                icone.textContent = "👑";
            }

            if (tipo === "guerra") {
                icone.textContent = "⚔️";
            }


            casa.appendChild(icone);
        }


        tabuleiro.appendChild(casa);
    }


    criarPeao();

    /* Espera o navegador terminar
       de desenhar o tabuleiro antes
       de calcular a posição. */

    requestAnimationFrame(() => {
        atualizarPeao();
    });
}


/* =========================================================
   CRIAR PEÃO
========================================================= */

function criarPeao() {

    const tabuleiro =
        elemento("tabuleiro");


    const antigo =
        elemento("peaoJogador");


    if (antigo) {
        antigo.remove();
    }


    const peao =
        document.createElement("div");

    peao.id =
        "peaoJogador";

    peao.className =
        "peao";


    peao.textContent =
        reinoAtual === "ingles"
            ? "👑"
            : "⚜️";


    tabuleiro.appendChild(peao);
}


/* =========================================================
   POSICIONAR PEÃO
========================================================= */

function atualizarPeao() {

    const peao =
        elemento("peaoJogador");

    const tabuleiro =
        elemento("tabuleiro");

    const casas =
        document.querySelectorAll(".casa");


    if (
        !peao ||
        !tabuleiro ||
        !casas[posicao - 1]
    ) {
        return;
    }


    const casa =
        casas[posicao - 1];


    /*
       offsetLeft/offsetTop dão a posição
       da casa dentro do próprio tabuleiro.
    */

    const centroX =
        casa.offsetLeft +
        casa.offsetWidth / 2;


    const centroY =
        casa.offsetTop +
        casa.offsetHeight / 2;


    /*
       Como o CSS usa
       transform: translate(-50%, -50%),
       left e top apontam exatamente
       para o centro do peão.
    */

    peao.style.left =
        centroX + "px";

    peao.style.top =
        centroY + "px";
}


/* =========================================================
   DADO
========================================================= */

function rolarDado() {

    if (movendo) {
        return;
    }


    movendo = true;

    elemento("botaoDado").disabled =
        true;


    const resultado =
        Math.floor(
            Math.random() * 6
        ) + 1;


    elemento("resultadoDado").textContent =
        "🎲 " + resultado;


    moverCasas(resultado);
}


/* =========================================================
   MOVIMENTO
========================================================= */

async function moverCasas(quantidade) {

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {

        posicao++;

        if (posicao > 40) {
            posicao = 1;
        }


        atualizarPeao();

        await esperar(350);
    }


    movendo = false;

    elemento("botaoDado").disabled =
        false;


    chegarNaCasa();
}


function voltarCasas(quantidade) {

    posicao -= quantidade;


    while (posicao < 1) {
        posicao += 40;
    }


    atualizarPeao();
}


/* =========================================================
   CASAS
========================================================= */

function mostrarMensagem(texto) {

    elemento("mensagemCasa").innerHTML =
        texto;
}


function chegarNaCasa() {

    const tipo =
        tipoDaCasa(posicao);


    if (tipo === "sorte") {

        mostrarMensagem(
            "🍀 Pegue uma carta de Sorte ou Azar."
        );


        mostrarBotaoOKMensagem(
            () => abrirCarta("sorte")
        );

        return;
    }


    if (tipo === "decisao") {

        mostrarMensagem(
            "👑 Pegue uma carta de Decisão."
        );


        mostrarBotaoOKMensagem(
            () => abrirCarta("decisao")
        );

        return;
    }


    if (tipo === "guerra") {

        mostrarMensagem(
            "⚔️ Você entrou em uma Guerra!"
        );


        mostrarBotaoOKMensagem(
            () => abrirGuerra()
        );

        return;
    }


    mostrarMensagem(
        "Casa " +
        posicao +
        " — Você não encontrou nenhum evento nesta casa."
    );
}


function mostrarBotaoOKMensagem(acao) {

    const antigo =
        elemento("okCasa");


    if (antigo) {
        antigo.remove();
    }


    const botao =
        document.createElement("button");


    botao.id =
        "okCasa";

    botao.className =
        "botao-ok";

    botao.textContent =
        "OK";


    botao.onclick = function () {

        botao.remove();

        acao();
    };


    elemento("mensagemCasa")
        .appendChild(botao);
}


/* =========================================================
   CARTAS DE SORTE / AZAR
========================================================= */

const cartasSorte = [

    {
        titulo: "Boa colheita",
        texto: "A produção agrícola aumentou. Avance 3 casas.",
        efeito: () => moverCasas(3)
    },

    {
        titulo: "Crise econômica",
        texto: "O comércio entrou em crise. Perca 1 ponto de resistência.",
        efeito: () => perderResistencia(1)
    },

    {
        titulo: "Exército fortalecido",
        texto: "Seu reino conseguiu novos soldados. Receba 200 soldados.",
        efeito: () => adicionarSoldados(200)
    },

    {
        titulo: "Revolta social",
        texto: "A sociedade se revoltou contra os impostos. Perca 1 ponto de resistência.",
        efeito: () => perderResistencia(1)
    },

    {
        titulo: "Riqueza do comércio",
        texto: "O comércio do reino cresceu! Receba 2 barras aleatórias.",
        efeito: () => adicionarBarras(2)
    },

    {
        titulo: "Ataque inimigo",
        texto: "Um reino rival atacou suas terras. Perca 100 soldados.",
        efeito: () => adicionarSoldados(-100)
    },

    {
        titulo: "Impostos bem arrecadados",
        texto: "Os impostos aumentaram a riqueza do reino. Receba 2 barras.",
        efeito: () => adicionarBarras(2)
    },

    {
        titulo: "Paz no reino",
        texto: "Uma guerra foi evitada. Recupere 1 ponto de resistência.",
        efeito: () => aumentarResistencia(1)
    },

    {
        titulo: "Descoberta de riquezas",
        texto: "Novas riquezas chegaram ao reino. Receba 3 barras.",
        efeito: () => adicionarBarras(3)
    },

    {
        titulo: "Comércio prejudicado",
        texto: "Uma rota comercial foi bloqueada. Perca 1 barra.",
        efeito: () => removerBarras(1)
    },

    {
        titulo: "Impostos insuficientes",
        texto: "O rei arrecadou menos do que esperava. Perca 1 barra.",
        efeito: () => removerBarras(1)
    },

    {
        titulo: "Perda de território",
        texto: "Seu exército foi derrotado. Volte 3 casas.",
        efeito: () => voltarCasas(3)
    },

    {
        titulo: "Guerra inesperada",
        texto: "Seu reino entrou em uma guerra. Você perdeu 200 soldados.",
        efeito: () => adicionarSoldados(-200)
    },

    {
        titulo: "Apoio da burguesia",
        texto: "A burguesia apoiou o rei. Receba 2 barras aleatórias.",
        efeito: () => adicionarBarras(2)
    },

    {
        titulo: "Boa colheita",
        texto: "O reino teve uma excelente colheita. Receba 3 barras aleatórias.",
        efeito: () => adicionarBarras(3)
    },

    {
        titulo: "Conflito religioso",
        texto: "Uma disputa religiosa causou problemas no reino. Perca 4 pontos de resistência.",
        efeito: () => perderResistencia(4)
    },

    {
        titulo: "Expansão comercial",
        texto: "Seus comerciantes conseguiram novos mercados. Receba 3 barras.",
        efeito: () => adicionarBarras(3)
    },

    {
        titulo: "Traição de um nobre",
        texto: "Um nobre abandonou o reino. Perca 100 soldados.",
        efeito: () => adicionarSoldados(-100)
    },

    {
        titulo: "Aliança poderosa",
        texto: "Você fez uma importante aliança. Avance 3 casas.",
        efeito: () => moverCasas(3)
    },

    {
        titulo: "Má colheita",
        texto: "A produção agrícola caiu. Perca 3 barras aleatórias.",
        efeito: () => removerBarras(3)
    }

];


/* =========================================================
   CARTAS DE DECISÃO
========================================================= */

const cartasDecisao = [

    {
        titulo: "Reforçar o exército",

        opcoes: [

            {
                texto: "A) +300 soldados, -2 barras",
                efeito: () => {
                    adicionarSoldados(300);
                    removerBarras(2);
                }
            },

            {
                texto: "B) +100 soldados, -1 resistência",
                efeito: () => {
                    adicionarSoldados(100);
                    perderResistencia(1);
                }
            }

        ]
    },


    {
        titulo: "Novos impostos",

        opcoes: [

            {
                texto: "A) +3 barras, -2 resistência",
                efeito: () => {
                    adicionarBarras(3);
                    perderResistencia(2);
                }
            },

            {
                texto: "B) +1 barra, -100 soldados",
                efeito: () => {
                    adicionarBarras(1);
                    adicionarSoldados(-100);
                }
            }

        ]
    },


    {
        titulo: "Nova rota comercial",

        opcoes: [

            {
                texto: "A) +4 barras, -2 barras",
                efeito: () => {
                    adicionarBarras(4);
                    removerBarras(2);
                }
            },

            {
                texto: "B) +2 barras, -1 resistência",
                efeito: () => {
                    adicionarBarras(2);
                    perderResistencia(1);
                }
            }

        ]
    },


    {
        titulo: "Má colheita",

        opcoes: [

            {
                texto: "A) +1 resistência, -3 barras",
                efeito: () => {
                    aumentarResistencia(1);
                    removerBarras(3);
                }
            },

            {
                texto: "B) +2 barras, -200 soldados",
                efeito: () => {
                    adicionarBarras(2);
                    adicionarSoldados(-200);
                }
            }

        ]
    },


    {
        titulo: "Defesa das fronteiras",

        opcoes: [

            {
                texto: "A) +2 resistência, -3 barras",
                efeito: () => {
                    aumentarResistencia(2);
                    removerBarras(3);
                }
            },

            {
                texto: "B) +200 soldados, -1 resistência",
                efeito: () => {
                    adicionarSoldados(200);
                    perderResistencia(1);
                }
            }

        ]
    },


    {
        titulo: "Nobres descontentes",

        opcoes: [

            {
                texto: "A) +2 barras, -1 resistência",
                efeito: () => {
                    adicionarBarras(2);
                    perderResistencia(1);
                }
            },

            {
                texto: "B) +200 soldados, -2 barras",
                efeito: () => {
                    adicionarSoldados(200);
                    removerBarras(2);
                }
            }

        ]
    },


    {
        titulo: "Conflito religioso",

        opcoes: [

            {
                texto: "A) +2 resistência, -3 barras",
                efeito: () => {
                    aumentarResistencia(2);
                    removerBarras(3);
                }
            },

            {
                texto: "B) +200 soldados, -2 resistência",
                efeito: () => {
                    adicionarSoldados(200);
                    perderResistencia(2);
                }
            }

        ]
    },


    {
        titulo: "Cofres do reino",

        opcoes: [

            {
                texto: "A) +4 barras, -3 resistência",
                efeito: () => {
                    adicionarBarras(4);
                    perderResistencia(3);
                }
            },

            {
                texto: "B) +1 resistência, -200 soldados",
                efeito: () => {
                    aumentarResistencia(1);
                    adicionarSoldados(-200);
                }
            }

        ]
    },


    {
        titulo: "Exército enfraquecido",

        opcoes: [

            {
                texto: "A) +300 soldados, -4 barras",
                efeito: () => {
                    adicionarSoldados(300);
                    removerBarras(4);
                }
            },

            {
                texto: "B) +1 resistência, -200 soldados",
                efeito: () => {
                    aumentarResistencia(1);
                    adicionarSoldados(-200);
                }
            }

        ]
    },


    {
        titulo: "Revolta dos camponeses",

        opcoes: [

            {
                texto: "A) +2 resistência, -3 barras",
                efeito: () => {
                    aumentarResistencia(2);
                    removerBarras(3);
                }
            },

            {
                texto: "B) +3 barras, -2 resistência",
                efeito: () => {
                    adicionarBarras(3);
                    perderResistencia(2);
                }
            }

        ]
    },


    {
        titulo: "Comerciantes pedem ajuda",

        opcoes: [

            {
                texto: "A) +4 barras, -2 barras",
                efeito: () => {
                    adicionarBarras(4);
                    removerBarras(2);
                }
            },

            {
                texto: "B) +2 barras, -1 resistência",
                efeito: () => {
                    adicionarBarras(2);
                    perderResistencia(1);
                }
            }

        ]
    },


    {
        titulo: "Aliança estrangeira",

        opcoes: [

            {
                texto: "A) +200 soldados, -2 barras",
                efeito: () => {
                    adicionarSoldados(200);
                    removerBarras(2);
                }
            },

            {
                texto: "B) +3 barras, -100 soldados",
                efeito: () => {
                    adicionarBarras(3);
                    adicionarSoldados(-100);
                }
            }

        ]
    },


    {
        titulo: "Construção de navios",

        opcoes: [

            {
                texto: "A) +5 barras, -4 barras",
                efeito: () => {
                    adicionarBarras(5);
                    removerBarras(4);
                }
            },

            {
                texto: "B) +2 barras, -100 soldados",
                efeito: () => {
                    adicionarBarras(2);
                    adicionarSoldados(-100);
                }
            }

        ]
    },


    {
        titulo: "Nova região rica",

        opcoes: [

            {
                texto: "A) +5 barras, -2 resistência",
                efeito: () => {
                    adicionarBarras(5);
                    perderResistencia(2);
                }
            },

            {
                texto: "B) +2 barras, -100 soldados",
                efeito: () => {
                    adicionarBarras(2);
                    adicionarSoldados(-100);
                }
            }

        ]
    },


    {
        titulo: "Recrutamento militar",

        opcoes: [

            {
                texto: "A) +400 soldados, -2 resistência",
                efeito: () => {
                    adicionarSoldados(400);
                    perderResistencia(2);
                }
            },

            {
                texto: "B) +200 soldados, -2 barras",
                efeito: () => {
                    adicionarSoldados(200);
                    removerBarras(2);
                }
            }

        ]
    },


    {
        titulo: "Nova lei",

        opcoes: [

            {
                texto: "A) +2 resistência, -3 barras",
                efeito: () => {
                    aumentarResistencia(2);
                    removerBarras(3);
                }
            },

            {
                texto: "B) +2 barras, -100 soldados",
                efeito: () => {
                    adicionarBarras(2);
                    adicionarSoldados(-100);
                }
            }

        ]
    },


    {
        titulo: "Gastos da corte",

        opcoes: [

            {
                texto: "A) +2 resistência, -4 barras",
                efeito: () => {
                    aumentarResistencia(2);
                    removerBarras(4);
                }
            },

            {
                texto: "B) +3 barras, -200 soldados",
                efeito: () => {
                    adicionarBarras(3);
                    adicionarSoldados(-200);
                }
            }

        ]
    },


    {
        titulo: "Exército rival",

        opcoes: [

            {
                texto: "A) +300 soldados, -3 barras",
                efeito: () => {
                    adicionarSoldados(300);
                    removerBarras(3);
                }
            },

            {
                texto: "B) +2 barras, -1 resistência",
                efeito: () => {
                    adicionarBarras(2);
                    perderResistencia(1);
                }
            }

        ]
    },


    {
        titulo: "Produção de mercadorias",

        opcoes: [

            {
                texto: "A) +5 barras, -3 barras",
                efeito: () => {
                    adicionarBarras(5);
                    removerBarras(3);
                }
            },

            {
                texto: "B) +2 barras, -100 soldados",
                efeito: () => {
                    adicionarBarras(2);
                    adicionarSoldados(-100);
                }
            }

        ]
    },


    {
        titulo: "Decisão sobre o tesouro",

        opcoes: [

            {
                texto: "A) +400 soldados, -4 barras",
                efeito: () => {
                    adicionarSoldados(400);
                    removerBarras(4);
                }
            },

            {
                texto: "B) +3 barras, -2 resistência",
                efeito: () => {
                    adicionarBarras(3);
                    perderResistencia(2);
                }
            }

        ]
    }

];


/* =========================================================
   ABRIR CARTA
========================================================= */

function abrirCarta(tipo) {

    tipoCartaAtual = tipo;

    decisaoEscolhida = null;


    if (tipo === "sorte") {

        const indice =
            Math.floor(
                Math.random() *
                cartasSorte.length
            );


        cartaAtual =
            cartasSorte[indice];


        elemento("cartaTipo").textContent =
            "🍀 SORTE OU AZAR";


        elemento("cartaTitulo").textContent =
            cartaAtual.titulo;


        elemento("cartaTexto").textContent =
            cartaAtual.texto;


        elemento("opcoesDecisao").innerHTML =
            "";


        elemento("botaoOK").style.display =
            "block";
    }


    if (tipo === "decisao") {

        const indice =
            Math.floor(
                Math.random() *
                cartasDecisao.length
            );


        cartaAtual =
            cartasDecisao[indice];


        elemento("cartaTipo").textContent =
            "👑 DECISÃO";


        elemento("cartaTitulo").textContent =
            cartaAtual.titulo;


        elemento("cartaTexto").textContent =
            "Escolha uma das duas opções:";


        criarOpcoesDecisao();


        elemento("botaoOK").style.display =
            "block";
    }


    mostrarTela("telaCarta");
}


/* =========================================================
   OPÇÕES DE DECISÃO
========================================================= */

function criarOpcoesDecisao() {

    const area =
        elemento("opcoesDecisao");


    area.innerHTML = "";


    cartaAtual.opcoes.forEach(
        (opcao, indice) => {

            const botao =
                document.createElement("button");


            botao.className =
                "opcao-decisao";


            botao.textContent =
                opcao.texto;


            botao.onclick = () => {

                decisaoEscolhida =
                    indice;


                document
                    .querySelectorAll(
                        ".opcao-decisao"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "selecionada"
                        );
                    });


                botao.classList.add(
                    "selecionada"
                );
            };


            area.appendChild(botao);
        }
    );
}


/* =========================================================
   CONFIRMAR CARTA
========================================================= */

function confirmarCarta() {

    if (!cartaAtual) {
        return;
    }


    if (
        tipoCartaAtual === "decisao"
    ) {

        if (
            decisaoEscolhida === null
        ) {

            alert(
                "Escolha uma das opções antes de clicar em OK."
            );

            return;
        }


        cartaAtual
            .opcoes[decisaoEscolhida]
            .efeito();

    } else {

        cartaAtual.efeito();
    }


    cartaAtual = null;

    decisaoEscolhida = null;


    elemento("botaoOK").style.display =
        "none";


    elemento("opcoesDecisao").innerHTML =
        "";


    mostrarTela("telaJogo");

    atualizarStatus();

    atualizarPeao();


    mostrarMensagem(
        "Efeito da carta aplicado! Continue sua jornada."
    );
}


/* =========================================================
   GUERRA
========================================================= */

function abrirGuerra() {

    rodadaGuerra = 1;

    dadoMeu = null;
    dadoInimigo = null;

    vitoriasMeu = 0;
    vitoriasInimigo = 0;

    guerraFinalizada = false;

    vencedorGuerra = null;


    elemento("nomeGuerraMeuReino").textContent =

        reinoAtual === "ingles"
            ? "Reino da Inglaterra"
            : "Reino da França";


    elemento("nomeGuerraInimigo").textContent =

        reinoInimigo === "ingles"
            ? "Reino da Inglaterra"
            : "Reino da França";


    elemento("soldadosGuerraMeu").textContent =
        soldados;


    elemento("soldadosGuerraInimigo").textContent =
        300;


    elemento("dadoMeu").textContent =
        "—";

    elemento("dadoInimigo").textContent =
        "—";


    elemento("placarGuerra").textContent =
        "Rodada 1 de 3";


    elemento("mensagemGuerra").textContent =
        "Role os dois dados para começar.";


    elemento("resultadoDano").textContent =
        "";


    elemento("botaoMeuDado").disabled =
        false;

    elemento("botaoInimigoDado").disabled =
        false;


    elemento("botaoProximaRodada").disabled =
        true;

    elemento("botaoDanoGuerra").disabled =
        true;


    mostrarTela("telaGuerra");
}


/* =========================================================
   DADOS DA GUERRA
========================================================= */

function rolarMeuDado() {

    if (dadoMeu !== null) {
        return;
    }


    dadoMeu =
        Math.floor(
            Math.random() * 6
        ) + 1;


    elemento("dadoMeu").textContent =
        dadoMeu;


    elemento("botaoMeuDado").disabled =
        true;


    verificarDadosGuerra();
}


function rolarDadoInimigo() {

    if (dadoInimigo !== null) {
        return;
    }


    dadoInimigo =
        Math.floor(
            Math.random() * 6
        ) + 1;


    elemento("dadoInimigo").textContent =
        dadoInimigo;


    elemento("botaoInimigoDado").disabled =
        true;


    verificarDadosGuerra();
}


/* =========================================================
   VERIFICAR GUERRA
========================================================= */

function verificarDadosGuerra() {

    if (
        dadoMeu === null ||
        dadoInimigo === null
    ) {
        return;
    }


    if (dadoMeu > dadoInimigo) {

        vitoriasMeu++;

        elemento("mensagemGuerra").textContent =
            "⚔️ Você venceu esta rodada!";

    }

    else if (
        dadoInimigo > dadoMeu
    ) {

        vitoriasInimigo++;

        elemento("mensagemGuerra").textContent =
            "⚔️ O reino inimigo venceu esta rodada!";

    }

    else {

        elemento("mensagemGuerra").textContent =
            "🤝 Empate! A rodada não vale ponto.";
    }


    if (
        vitoriasMeu >= 2 ||
        vitoriasInimigo >= 2 ||
        rodadaGuerra >= 3
    ) {

        finalizarRodadaGuerra();

        return;
    }


    elemento("botaoProximaRodada").disabled =
        false;
}


/* =========================================================
   PRÓXIMA RODADA
========================================================= */

function proximaRodada() {

    if (
        dadoMeu === null ||
        dadoInimigo === null
    ) {
        return;
    }


    rodadaGuerra++;

    dadoMeu = null;
    dadoInimigo = null;


    elemento("dadoMeu").textContent =
        "—";

    elemento("dadoInimigo").textContent =
        "—";


    elemento("placarGuerra").textContent =
        "Rodada " +
        rodadaGuerra +
        " de 3";


    elemento("mensagemGuerra").textContent =
        "Role os dados novamente.";


    elemento("botaoMeuDado").disabled =
        false;

    elemento("botaoInimigoDado").disabled =
        false;


    elemento("botaoProximaRodada").disabled =
        true;
}


/* =========================================================
   FINAL DA GUERRA
========================================================= */

function finalizarRodadaGuerra() {

    guerraFinalizada = true;


    if (
        vitoriasMeu >
        vitoriasInimigo
    ) {

        vencedorGuerra =
            "meu";

        elemento("mensagemGuerra").textContent =
            "🏆 Você venceu a guerra! Role o dado para determinar o dano.";

    }

    else if (
        vitoriasInimigo >
        vitoriasMeu
    ) {

        vencedorGuerra =
            "inimigo";

        elemento("mensagemGuerra").textContent =
            "💀 O reino inimigo venceu a guerra! Role o dado para determinar o dano.";

    }

    else {

        vencedorGuerra =
            dadoMeu > dadoInimigo
                ? "meu"
                : "inimigo";


        elemento("mensagemGuerra").textContent =
            "⚔️ A guerra terminou! Role o dado de dano.";
    }


    elemento("botaoDanoGuerra").disabled =
        false;
}


/* =========================================================
   DANO
========================================================= */

function rolarDano() {

    const danoBase =
        Math.floor(
            Math.random() * 6
        ) + 1;


    if (
        vencedorGuerra === "meu"
    ) {

        const danoFinal =
            calcularDanoGuerra(
                danoBase,
                300
            );


        elemento("mensagemGuerra").textContent =
            "🎲 Dano causado: " +
            danoFinal +
            ".";


        elemento("resultadoDano").textContent =
            "⚔️ O inimigo deve diminuir " +
            danoFinal +
            " ponto(s) de resistência no dispositivo dele.";

    }


    else {

        const danoFinal =
            calcularDanoGuerra(
                danoBase,
                soldados
            );


        elemento("mensagemGuerra").textContent =
            "🎲 Dano recebido: " +
            danoFinal +
            ".";


        elemento("resultadoDano").textContent =
            "⚔️ Você recebeu " +
            danoFinal +
            " ponto(s) de dano.";


        perderResistencia(
            danoFinal
        );
    }


    elemento("botaoDanoGuerra").disabled =
        true;


    setTimeout(() => {

        if (resistencia > 0) {

            guerraFinalizada =
                false;

            mostrarTela("telaJogo");

            atualizarStatus();

            atualizarPeao();

            mostrarMensagem(
                "A guerra terminou. Continue pelo tabuleiro."
            );
        }

    }, 2200);
}


/* =========================================================
   CÁLCULO DO DANO
========================================================= */

function calcularDanoGuerra(
    danoBase,
    soldadosAlvo
) {

    soldadosAlvo =
        Number(soldadosAlvo);


    if (
        soldadosAlvo >= 900
    ) {

        return 1;
    }


    if (
        soldadosAlvo >= 600
    ) {

        return Math.max(
            1,
            Math.ceil(
                danoBase / 2
            )
        );
    }


    if (
        soldadosAlvo >= 300
    ) {

        return Math.max(
            1,
            danoBase - 1
        );
    }


    return danoBase;
}


/* =========================================================
   DERROTA
========================================================= */

function derrotarReino() {

    resistencia = 0;

    atualizarStatus();


    mostrarTela(
        "telaDerrota"
    );


    elemento("textoVencedor").textContent =

        reinoInimigo === "ingles"

            ? "O Reino da Inglaterra venceu."

            : "O Reino da França venceu.";
}


/* =========================================================
   REDIMENSIONAMENTO
========================================================= */

window.addEventListener(
    "resize",
    () => {

        requestAnimationFrame(
            atualizarPeao
        );
    }
);