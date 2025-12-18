# ❄️ FrostyStore

FrostyStore é uma plataforma **minimalista e focada em backend** para criação de vitrines online de eletrodomésticos (principalmente geladeiras), permitindo que vendedores exibam seus produtos de forma organizada, moderna e profissional, **sem funcionalidade de compra**, apenas visualização e contato.

O projeto foi pensado como um **MVP escalável**, com foco em **API REST**, utilizando **Django + Django Rest Framework**, e um **frontend simples em React**, apenas para consumo da API.

---

## 🎯 Objetivo do Projeto

A ideia do FrostyStore surgiu da necessidade real de ter um local onde vendedores possam:

* Organizar seus produtos
* Exibir imagens, preços e informações
* Compartilhar um link único da sua vitrine
* Ter um catálogo visualmente limpo e profissional

Sem complexidade desnecessária como:

* Carrinho de compras
* Pagamentos
* Logística

---

## 🧱 Arquitetura do Projeto

O projeto segue uma arquitetura **Backend-driven**:

```
Backend (Django + DRF)
└── API REST (JSON)

Frontend (React)
└── Consome a API
```

* O **backend é o coração do sistema**
* O **frontend é apenas um consumidor da API**
* Pensado para evoluir facilmente para:

  * App mobile
  * Frontend em Next.js
  * Integrações externas

---

## 🚀 Tecnologias Utilizadas

### Backend

* Python 3
* Django
* Django Rest Framework (DRF)
* JWT Authentication
* PostgreSQL / SQLite (dev)

### Frontend

* React
* React Router
* Fetch / Axios

### Outros

* Git & GitHub
* Docker (futuro)
* Postman / Insomnia

---

## 👥 Tipos de Usuários

### Cliente (não autenticado)

* Visualizar vitrines públicas
* Visualizar produtos
* Entrar em contato com o vendedor (futuro)

### Usuário (autenticado / vendedor)

* Login / Logout
* Criar, editar e deletar produtos
* Ativar ou desativar produtos
* Editar perfil
* Gerenciar sua vitrine

---

## 🧩 Funcionalidades Principais

* Vitrine pública por usuário
* Catálogo de produtos
* Múltiplas imagens por produto
* Produtos com status ativo/inativo
* URLs amigáveis com slug
* API REST completa
* Controle de permissões (owner-only)

---

## 🔗 Estrutura de URLs

### Públicas

```text
/                         → Landing page
/<username>/              → Vitrine pública do vendedor
/<username>/products/<slug>/ → Visualização do produto
```

### API (DRF)

```text
/api/auth/
/api/users/
/api/categories/
/api/products/
```

---

## 🗄 Modelagem de Dados (Resumo)

### User (Django Default)

* username
* first_name
* last_name
* email
* password

### Profile

* user (OneToOne)
* foto_perfil
* telefone
* data_nascimento
* slug
* created_at
* updated_at

### Categoria

* nome
* slug
* created_at
* updated_at

### Item

* vendedor (User)
* nome
* slug
* preco
* descricao
* categoria
* marca
* voltagem
* condicao
* ativo
* created_at
* updated_at

### ItemFoto

* item
* imagem
* created_at

---

## 🔐 Autenticação e Segurança

* Autenticação via **JWT**
* Endpoints protegidos por permissões
* Apenas o dono do item pode:

  * Editar
  * Deletar
  * Ativar / Desativar

---

## 🧪 Testes da API

A API pode ser testada utilizando:

* Postman
* Insomnia

Todos os endpoints retornam **JSON**.

---

## 📈 Escalabilidade

O projeto foi estruturado para facilitar:

* Crescimento de usuários
* Criação de planos pagos
* Aplicativo mobile
* Frontend alternativo
* Integração com terceiros

---

## 🛠 Como rodar o projeto (Backend)

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Rodar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Rodar servidor
python manage.py runserver
```

---

## 📌 Status do Projeto

🚧 Em desenvolvimento (MVP)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido por **SBrayan Alves**

> Projeto com foco em **Backend, APIs REST e boas práticas de arquitetura**.
