<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# LookSwap: Gerador de Looks com IA

LookSwap é uma aplicação web inovadora que utiliza inteligência artificial para transformar fotos de roupas em imagens de moda realistas e personalizadas. Faça o upload de uma foto, escolha uma modelo, um cenário, e gere looks profissionais em segundos, ideal para criadores de conteúdo, lojas de e-commerce e influenciadores.

## ✨ Funcionalidades

*   **Upload de Imagem:** Envie uma foto de uma peça de roupa (em um cabide, manequim ou pessoa).
*   **Análise com IA:** A IA analisa e descreve a peça de roupa automaticamente.
*   **Personalização Completa:** Escolha entre dezenas de opções para:
    *   **Persona:** Diferentes etnias e aparências.
    *   **Cabelo:** Vários estilos e cores.
    *   **Ambiente:** De quartos luxuosos a cenários urbanos.
    *   **Iluminação:** Da luz natural à iluminação de estúdio.
    *   **Composição:** Poses, ângulos, acessórios e mais.
*   **Geração de Imagem:** Crie uma imagem fotorrealista com a modelo e o cenário escolhidos, vestindo a roupa original.
*   **Download:** Baixe a imagem gerada em alta qualidade.

## 🚀 Tecnologias Utilizadas

*   **Frontend:** React, TypeScript, Vite, TailwindCSS
*   **Backend:** Netlify Functions
*   **API de IA:** Google Gemini API (modelos `gemini-2.5-flash` e `gemini-2.5-flash-image`)

## 🔧 Configuração e Instalação

Siga os passos abaixo para rodar o projeto localmente.

### 1. Clone o Repositório

```bash
git clone https://github.com/lookswapp-netizen/Look_Swapapp.git
cd Look_Swapapp
```

### 2. Instale as Dependências

O projeto utiliza `npm`. Execute o seguinte comando para instalar todos os pacotes necessários:

```bash
npm install
```

### 3. Configure a Chave de API para Desenvolvimento Local

Para que as funções da Netlify funcionem localmente, você precisa da [Netlify CLI](https://docs.netlify.com/cli/get-started/) e de uma chave de API.

*   Instale a CLI da Netlify:
    ```bash
    npm install netlify-cli -g
    ```
*   Crie um arquivo chamado `.env` na raiz do projeto.
*   Dentro deste arquivo, adicione sua chave de API da seguinte forma:
    ```
    API_KEY=SUA_CHAVE_DE_API_AQUI
    ```
**Importante:** Este arquivo `.env` é apenas para desenvolvimento local e não deve ser enviado para o GitHub. A chave de API para o site em produção será configurada diretamente na Netlify.

### 4. Rode o Servidor de Desenvolvimento

Use a CLI da Netlify para rodar o projeto, pois ela executará o site Vite e as funções serverless juntas:

```bash
netlify dev
```

Abra o endereço local que a Netlify indicar no seu navegador para ver a aplicação funcionando.

## 🚀 Deploy para a Netlify

1.  **Faça o Push para o GitHub:** Envie seu projeto para um repositório no GitHub.
2.  **Crie um Novo Site na Netlify:**
    *   Faça login no seu painel da Netlify.
    *   Clique em "Add new site" -> "Import an existing project".
    *   Conecte-se ao GitHub e selecione seu repositório.
3.  **Configure o Build:** A Netlify deve detectar automaticamente as configurações do `netlify.toml`. As configurações padrão devem ser:
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
4.  **Configure a Chave de API (Passo Crucial):**
    *   Vá para "Site settings" -> "Build & deploy" -> "Environment".
    *   Clique em "Edit variables" e adicione uma nova variável:
        *   **Key:** `API_KEY`
        *   **Value:** `SUA_CHAVE_DE_API_AQUI`
    *   Clique em "Save".
5.  **Faça o Deploy:** Volte para a aba "Deploys" e acione um novo deploy para que a variável de ambiente seja aplicada.

Seu site estará no ar! A partir de agora, cada `git push` para a sua branch principal acionará um novo deploy automaticamente.