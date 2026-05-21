# Controle de Estoque Central — Simples e Natural

Sistema web de controle de estoque da câmara fria, com dados compartilhados entre múltiplos usuários.

## Deploy no Railway

### 1. Suba o código no GitHub

```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/estoque-pa.git
git push -u origin main
```

### 2. Crie o projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **New Project → Deploy from GitHub repo**
3. Selecione o repositório `estoque-pa`
4. Railway detecta o `package.json` automaticamente e faz o deploy

### 3. Volume persistente (IMPORTANTE)

O banco de dados SQLite precisa de um volume para não perder dados ao reiniciar:

1. No painel do Railway, clique no serviço
2. Vá em **Settings → Volumes**
3. Clique em **Add Volume**
4. Mount path: `/app/data`
5. Salve — o Railway reiniciará o serviço

### 4. Variáveis de ambiente (opcional)

| Variável | Valor padrão | Descrição |
|----------|-------------|-----------|
| `PORT` | 3000 | Porta do servidor (Railway define automaticamente) |
| `DB_PATH` | `./data/estoque.db` | Caminho do banco de dados |

### Acesso

Após o deploy, o Railway fornece uma URL pública no formato:
`https://estoque-pa-production.up.railway.app`

## Desenvolvimento local

```bash
npm install
npm start
```

Acesse: http://localhost:3000

## Login padrão

- **Usuário:** admin  
- **Senha:** admin

⚠️ Mude a senha após o primeiro acesso em Configurações → Usuários.
