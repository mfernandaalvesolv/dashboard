# SaúdeTech Dashboards

Sistema de apoio à fiscalização sanitária, desenvolvido para organizar informações, registros e processos de acompanhamento de estabelecimentos de saúde.

O **SaúdeTech Dashboards** é um protótipo de aplicação web desenvolvido como parte de um projeto acadêmico de Engenharia de Software, com foco na organização e visualização de informações relacionadas à Vigilância Sanitária de Londrina.

## Objetivo

Facilitar o gerenciamento das atividades de fiscalização sanitária por meio de uma interface intuitiva, permitindo o registro de fiscalizações, o acompanhamento de formulários e a administração dos acessos ao sistema.

## Funcionalidades

- **Login:** autenticação de usuários.
- **Solicitação de acesso:** cadastro de novos usuários mediante aprovação da administração.
- **Controle de permissões:** diferenciação entre os perfis de administrador e fiscal.
- **Formulário de fiscalização:** registro de informações sobre estabelecimentos fiscalizados.
- **Anexos:** seleção, visualização e remoção de fotografias.
- **Confirmação de envio:** retorno visual após o envio de um formulário.
- **Administração:** gerenciamento de usuários, solicitações de acesso e formulários.
- **Estabelecimentos:** cadastro e acompanhamento dos estabelecimentos registrados.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Git e GitHub
- LocalStorage

## Estrutura do projeto

```text
dashboard/
├── index.html
├── index.css
├── login.html
├── login.css
└── script.js
```

## Como executar

1. Clone o repositório:

```bash
git clone https://github.com/mfernandaalvesolv/dashboard.git
```

2. Acesse a pasta:

```bash
cd dashboard
```

3. Abra o arquivo `login.html` no navegador ou utilize a extensão Live Server do Visual Studio Code.

## Acessos para demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Administração | admin@saudetech.com | 123456 |
| Fiscal | fiscal@saudetech.com | 123456 |

## Observações

Este projeto encontra-se em fase de prototipação.

Atualmente, os dados são armazenados localmente no navegador por meio do LocalStorage. As fotografias selecionadas são utilizadas para visualização durante a sessão e ainda não possuem armazenamento permanente ou envio para servidor.

O sistema ainda não conta com uma estrutura de backend ou banco de dados integrado.

## Repositório

[GitHub – SaúdeTech Dashboards](https://github.com/mfernandaalvesolv/dashboard)

---

**SaúdeTech Dashboards**  
Projeto acadêmico de Engenharia de Software.