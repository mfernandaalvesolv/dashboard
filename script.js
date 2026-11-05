const USUARIOS_PADRAO = [
    {
        nome: "Administrador",
        email: "admin@saudetech.com",
        senha: "123456",
        perfil: "admin",
        status: "aprovado"
    },
    {
        nome: "Fiscal de Demonstração",
        email: "fiscal@saudetech.com",
        senha: "123456",
        perfil: "fiscal",
        status: "aprovado"
    }
];

function obterUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem("usuariosSaudeTech"));

    if (!usuarios) {
        usuarios = USUARIOS_PADRAO;
        localStorage.setItem("usuariosSaudeTech", JSON.stringify(usuarios));
    }

    return usuarios;
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuariosSaudeTech", JSON.stringify(usuarios));
}

function obterFormularios() {
    return JSON.parse(localStorage.getItem("formulariosSaudeTech")) || [];
}

function salvarFormularios(formularios) {
    localStorage.setItem("formulariosSaudeTech", JSON.stringify(formularios));
}

function obterEstabelecimentos() {
    return JSON.parse(localStorage.getItem("estabelecimentosSaudeTech")) || [
        {
            nome: "Mercado Central",
            categoria: "Comércio de alimentos",
            bairro: "Centro",
            status: "Verificado"
        },
        {
            nome: "Restaurante Sabor",
            categoria: "Restaurante",
            bairro: "Centro",
            status: "Pendente"
        },
        {
            nome: "Padaria Primavera",
            categoria: "Panificadora",
            bairro: "Zona Norte",
            status: "Verificado"
        }
    ];
}

function salvarEstabelecimentos(estabelecimentos) {
    localStorage.setItem(
        "estabelecimentosSaudeTech",
        JSON.stringify(estabelecimentos)
    );
}

function alternarAcesso(tipo) {
    const login = document.getElementById("formLogin");
    const cadastro = document.getElementById("formCadastro");

    if (!login || !cadastro) return;

    login.classList.toggle("hidden", tipo !== "login");
    cadastro.classList.toggle("hidden", tipo !== "cadastro");

    document.getElementById("tabLogin").classList.toggle("active", tipo === "login");
    document.getElementById("tabCadastro").classList.toggle("active", tipo === "cadastro");
}

const formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("emailLogin").value.trim().toLowerCase();
        const senha = document.getElementById("senhaLogin").value;

        const usuarios = obterUsuarios();

        const usuario = usuarios.find(user =>
            user.email.toLowerCase() === email && user.senha === senha
        );

        const mensagem = document.getElementById("mensagemLogin");

        if (!usuario) {
            mensagem.style.color = "#e69a9a";
            mensagem.textContent = "E-mail ou senha incorretos.";
            return;
        }

        if (usuario.status !== "aprovado") {
            mensagem.style.color = "#e8c77d";
            mensagem.textContent = "Sua solicitação ainda não foi aprovada pela administração.";
            return;
        }

        localStorage.setItem("usuarioLogado", JSON.stringify({
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil
        }));

        window.location.href = "index.html";
    });
}

const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
    formCadastro.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nomeCadastro").value.trim();
        const email = document.getElementById("emailCadastro").value.trim().toLowerCase();
        const senha = document.getElementById("senhaCadastro").value;

        const usuarios = obterUsuarios();
        const mensagem = document.getElementById("mensagemCadastro");

        const emailExiste = usuarios.some(user =>
            user.email.toLowerCase() === email
        );

        if (emailExiste) {
            mensagem.style.color = "#e69a9a";
            mensagem.textContent = "Já existe uma conta cadastrada com esse e-mail.";
            return;
        }

        usuarios.push({
            nome,
            email,
            senha,
            perfil: "fiscal",
            status: "pendente"
        });

        salvarUsuarios(usuarios);

        mensagem.style.color = "#80d5b7";
        mensagem.textContent =
            "Solicitação enviada! Aguarde a aprovação da administração.";

        formCadastro.reset();
    });
}

function usuarioAtual() {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

function sair() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

function configurarPerfil() {
    const usuario = usuarioAtual();

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("nomeUsuario").textContent = usuario.nome;

    document.getElementById("perfilUsuario").textContent =
        usuario.perfil === "admin" ? "Administração" : "Fiscal";

    const elementosAdmin = document.querySelectorAll(".admin-only");

    elementosAdmin.forEach(elemento => {
        elemento.classList.toggle("hidden", usuario.perfil !== "admin");
    });

    if (usuario.perfil !== "admin") {
        const telaAdmin = document.getElementById("administracao");
        if (telaAdmin) telaAdmin.classList.add("hidden");
    }
}

function mostrarTela(id) {
    const usuario = usuarioAtual();

    if (!usuario) {
        window.location.href = "login.html";
        return;
    }

    if (id === "administracao" && usuario.perfil !== "admin") {
        alert("Você não tem permissão para acessar essa área.");
        return;
    }

    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.add("hidden");
    });

    const telaSelecionada = document.getElementById(id);

    if (telaSelecionada) {
        telaSelecionada.classList.remove("hidden");
    }

    if (id === "administracao") {
        atualizarSolicitacoes();
        atualizarAdministracao();
        atualizarVerificacao();
    }

    if (id === "estabelecimentos") {
        atualizarTabelaEstabelecimentos();
    }
}

const formFiscalizacao = document.getElementById("formFiscalizacao");

if (formFiscalizacao) {
    formFiscalizacao.addEventListener("submit", function(event) {
        event.preventDefault();

        const usuario = usuarioAtual();

        if (!usuario || !["fiscal", "admin"].includes(usuario.perfil)) {
            alert("Você não tem permissão para enviar fiscalizações.");
            return;
        }

        const formularios = obterFormularios();

        formularios.push({
            id: Date.now(),
            estabelecimento: document.getElementById("estabelecimentoFiscal").value,
            data: document.getElementById("dataFiscalizacao").value,
            observacoes: document.getElementById("observacoes").value,
            resultado: document.getElementById("resultadoFiscalizacao").value,
            fiscal: usuario.nome,
            status: "Em análise"
        });

        salvarFormularios(formularios);

        formFiscalizacao.reset();
        document.getElementById("listaFotos").innerHTML = "";

        mostrarTela("confirmacao");
    });
}

let fotosSelecionadas = [];

function abrirModalFotos() {
    const modal = document.getElementById("modalFotos");

    if (modal) modal.classList.remove("hidden");
}

function fecharModalFotos() {
    const modal = document.getElementById("modalFotos");

    if (modal) modal.classList.add("hidden");
}

function renderizarFotos() {
    const lista = document.getElementById("listaFotos");

    if (!lista) return;

    lista.innerHTML = "";

    fotosSelecionadas.forEach((foto, indice) => {
        const item = document.createElement("div");
        item.className = "photo-item";

        const imagem = document.createElement("img");
        imagem.src = foto.url;
        imagem.className = "photo-preview";
        imagem.alt = foto.arquivo.name;

        const nome = document.createElement("span");
        nome.className = "photo-name";
        nome.textContent = foto.arquivo.name;

        const remover = document.createElement("button");
        remover.type = "button";
        remover.className = "remove-photo";
        remover.textContent = "Remover";

        remover.setAttribute("aria-label", `Remover ${foto.arquivo.name}`);

        remover.addEventListener("click", () => removerFoto(indice));

        item.append(imagem, nome, remover);
        lista.appendChild(item);
    });
}

function adicionarFotos() {
    const input = document.getElementById("inputFotos");

    if (!input || !input.files || input.files.length === 0) {
        alert("Selecione pelo menos uma imagem.");
        return;
    }

    const arquivos = Array.from(input.files);

    const imagensValidas = arquivos.filter(arquivo =>
        arquivo.type.startsWith("image/")
    );

    if (imagensValidas.length === 0) {
        alert("Selecione arquivos de imagem válidos.");
        input.value = "";
        return;
    }

    imagensValidas.forEach(arquivo => {
        const jaExiste = fotosSelecionadas.some(foto =>
            foto.arquivo.name === arquivo.name &&
            foto.arquivo.size === arquivo.size &&
            foto.arquivo.lastModified === arquivo.lastModified
        );

        if (!jaExiste) {
            fotosSelecionadas.push({
                arquivo,
                url: URL.createObjectURL(arquivo)
            });
        }
    });

    renderizarFotos();

    input.value = "";
    fecharModalFotos();
}

function removerFoto(indice) {
    const foto = fotosSelecionadas[indice];

    if (!foto) return;

    URL.revokeObjectURL(foto.url);

    fotosSelecionadas.splice(indice, 1);

    renderizarFotos();
}

function limparFotos() {
    fotosSelecionadas.forEach(foto => URL.revokeObjectURL(foto.url));

    fotosSelecionadas = [];

    const input = document.getElementById("inputFotos");

    if (input) input.value = "";

    renderizarFotos();
}

function atualizarSolicitacoes() {
    const tabela = document.getElementById("tabelaSolicitacoes");

    if (!tabela) return;

    const usuarios = obterUsuarios();

    const pendentes = usuarios.filter(usuario =>
        usuario.status === "pendente"
    );

    tabela.innerHTML = "";

    if (pendentes.length === 0) {
        tabela.innerHTML = `<tr><td colspan="4">Nenhuma solicitação pendente.</td></tr>`;
        return;
    }

    pendentes.forEach(usuario => {
        const linha = document.createElement("tr");

        const nome = document.createElement("td");
        nome.textContent = usuario.nome;

        const email = document.createElement("td");
        email.textContent = usuario.email;

        const status = document.createElement("td");
        status.innerHTML = `<span class="status status-pending">Aguardando aprovação</span>`;

        const acoes = document.createElement("td");

        const aprovar = document.createElement("button");
        aprovar.className = "small-button";
        aprovar.textContent = "Aprovar";
        aprovar.onclick = () => alterarAcesso(usuario.email, "aprovado");

        const recusar = document.createElement("button");
        recusar.className = "small-button";
        recusar.textContent = "Recusar";
        recusar.style.marginLeft = "7px";
        recusar.onclick = () => alterarAcesso(usuario.email, "recusado");

        acoes.append(aprovar, recusar);
        linha.append(nome, email, status, acoes);

        tabela.appendChild(linha);
    });
}

function alterarAcesso(email, novoStatus) {
    const usuario = usuarioAtual();

    if (!usuario || usuario.perfil !== "admin") {
        alert("Apenas a administração pode alterar acessos.");
        return;
    }

    const usuarios = obterUsuarios();

    const atualizado = usuarios.map(item => {
        if (item.email === email) {
            return { ...item, status: novoStatus };
        }

        return item;
    });

    salvarUsuarios(atualizado);
    atualizarSolicitacoes();

    alert(novoStatus === "aprovado"
        ? "Cadastro aprovado com sucesso."
        : "Solicitação recusada.");
}

function atualizarAdministracao() {
    const tabela = document.getElementById("tabelaAdministracao");

    if (!tabela) return;

    const formularios = obterFormularios();

    tabela.innerHTML = "";

    if (formularios.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6">Nenhum formulário enviado.</td></tr>`;
        return;
    }

    formularios.forEach(formulario => {
        const linha = document.createElement("tr");

        const dados = [
            formulario.estabelecimento,
            formulario.data,
            formulario.fiscal,
            formulario.resultado
        ];

        dados.forEach(valor => {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        });

        const status = document.createElement("td");
        status.textContent = formulario.status;
        linha.appendChild(status);

        const acao = document.createElement("td");

        const seletor = document.createElement("select");
        seletor.className = "select-status";

        ["Em análise", "Pendente", "Concluído"].forEach(opcao => {
            const option = document.createElement("option");
            option.value = opcao;
            option.textContent = opcao;
            seletor.appendChild(option);
        });

        seletor.value = formulario.status;

        seletor.onchange = () => alterarStatusFormulario(
            formulario.id,
            seletor.value
        );

        acao.appendChild(seletor);
        linha.appendChild(acao);

        tabela.appendChild(linha);
    });
}

function alterarStatusFormulario(id, novoStatus) {
    const usuario = usuarioAtual();

    if (!usuario || usuario.perfil !== "admin") {
        alert("Apenas a administração pode alterar o status.");
        return;
    }

    const formularios = obterFormularios();

    const atualizados = formularios.map(formulario => {
        if (formulario.id === id) {
            return { ...formulario, status: novoStatus };
        }

        return formulario;
    });

    salvarFormularios(atualizados);
    atualizarAdministracao();
}

function abrirModalEstabelecimento() {
    const usuario = usuarioAtual();

    if (!usuario || usuario.perfil !== "admin") {
        alert("Apenas a administração pode cadastrar estabelecimentos.");
        return;
    }

    document.getElementById("modalEstabelecimento").classList.remove("hidden");
}

function fecharModalEstabelecimento() {
    document.getElementById("modalEstabelecimento").classList.add("hidden");
}

const formEstabelecimento = document.getElementById("formEstabelecimento");

if (formEstabelecimento) {
    formEstabelecimento.addEventListener("submit", function(event) {
        event.preventDefault();

        const usuario = usuarioAtual();

        if (!usuario || usuario.perfil !== "admin") {
            alert("Apenas a administração pode cadastrar estabelecimentos.");
            return;
        }

        const estabelecimentos = obterEstabelecimentos();

        estabelecimentos.push({
            nome: document.getElementById("nomeEstabelecimento").value,
            categoria: document.getElementById("categoriaEstabelecimento").value,
            bairro: document.getElementById("bairroEstabelecimento").value,
            status: "Pendente"
        });

        salvarEstabelecimentos(estabelecimentos);

        formEstabelecimento.reset();

        fecharModalEstabelecimento();
        atualizarTabelaEstabelecimentos();
        atualizarVerificacao();

        alert("Estabelecimento cadastrado com sucesso.");
    });
}

function atualizarTabelaEstabelecimentos() {
    const tabela = document.getElementById("tabelaEstabelecimentos");

    if (!tabela) return;

    const estabelecimentos = obterEstabelecimentos();

    tabela.innerHTML = "";

    estabelecimentos.forEach(estabelecimento => {
        const linha = document.createElement("tr");

        const situacao = estabelecimento.status === "Verificado"
            ? `<span class="status status-ok">Verificado</span>`
            : `<span class="status status-pending">Pendente</span>`;

        linha.innerHTML = `
            <td>${escaparHTML(estabelecimento.nome)}</td>
            <td>${escaparHTML(estabelecimento.categoria)}</td>
            <td>${escaparHTML(estabelecimento.bairro)}</td>
            <td>${situacao}</td>
        `;

        tabela.appendChild(linha);
    });
}

function atualizarVerificacao() {
    const tabela = document.getElementById("tabelaVerificacao");

    if (!tabela) return;

    const estabelecimentos = obterEstabelecimentos();

    tabela.innerHTML = "";

    estabelecimentos.forEach((estabelecimento, indice) => {
        const linha = document.createElement("tr");

        const situacao = document.createElement("td");
        situacao.textContent = estabelecimento.status;

        const nome = document.createElement("td");
        nome.textContent = estabelecimento.nome;

        const categoria = document.createElement("td");
        categoria.textContent = estabelecimento.categoria;

        const bairro = document.createElement("td");
        bairro.textContent = estabelecimento.bairro;

        const acao = document.createElement("td");

        if (estabelecimento.status === "Pendente") {
            const botao = document.createElement("button");
            botao.className = "small-button";
            botao.textContent = "Verificar";
            botao.onclick = () => verificarEstabelecimento(indice);

            acao.appendChild(botao);
        } else {
            acao.textContent = "Cadastro confirmado";
        }

        linha.append(nome, categoria, bairro, situacao, acao);

        tabela.appendChild(linha);
    });
}

function verificarEstabelecimento(indice) {
    const usuario = usuarioAtual();

    if (!usuario || usuario.perfil !== "admin") {
        alert("Apenas a administração pode verificar estabelecimentos.");
        return;
    }

    const estabelecimentos = obterEstabelecimentos();

    estabelecimentos[indice].status = "Verificado";

    salvarEstabelecimentos(estabelecimentos);

    atualizarVerificacao();
    atualizarTabelaEstabelecimentos();
}

function escaparHTML(valor) {
    return String(valor).replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

document.addEventListener("DOMContentLoaded", function() {

    if (document.getElementById("formLogin")) {
        obterUsuarios();
        return;
    }

    if (document.getElementById("dashboard")) {
        configurarPerfil();

        if (usuarioAtual()) {
            atualizarTabelaEstabelecimentos();
            mostrarTela("dashboard");
        }
    }
});