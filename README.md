# A odisseia do puto

Blog Jekyll para GitHub Pages.

## Rodar localmente

1. Instale o [Ruby](https://www.ruby-lang.org/) (no macOS costuma vir instalado).

2. Na pasta do projeto, instale as dependências com o Bundler:

   ```bash
   gem install bundler
   bundle install
   ```

3. Suba o servidor do Jekyll:

   ```bash
   bundle exec jekyll serve
   ```

4. Abra no navegador: **http://localhost:4000**

   O Jekyll recarrega sozinho quando você altera arquivos.

Para parar o servidor: `Ctrl+C` no terminal.

## Publicar no GitHub Pages

### Opção A: branch `gh-pages`

1. Crie um repositório no GitHub (ex: `odisseia-do-puto`).
2. No projeto, faça o build:

   ```bash
   bundle exec jekyll build
   ```

3. A pasta gerada é `_site`. Publique só ela na branch `gh-pages`:

   ```bash
   git subtree push --prefix _site origin gh-pages
   ```

   Ou use um script/action que faça o build e faça push de `_site` para `gh-pages`.

O site ficará em: `https://<seu-usuario>.github.io/<nome-do-repo>/`

### Opção B: GitHub Pages com Jekyll (branch principal)

1. Suba o projeto todo para a branch `main` (ou `master`) do repositório.
2. No GitHub: **Settings → Pages**.
3. Em "Source" escolha essa branch (e pasta `/ (root)`).
4. O GitHub faz o build do Jekyll sozinho.

Se usar essa opção, confira a [documentação do Jekyll no GitHub](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll) para limites e gems permitidas.

### Domínio próprio

Se quiser usar um domínio (ex: `odisseiadoputo.com.br`), coloque o domínio no arquivo `CNAME` na raiz (uma linha só com o domínio). No DNS do domínio, aponte para o GitHub Pages conforme a [documentação](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
