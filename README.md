# ECLIPSE — O Último Refúgio

Projeto inicial de jogo 3D de sobrevivência para PC e dispositivos móveis.

## Requisitos
- Node.js 20.19+ ou 22.12+
- npm

## Instalação
```bash
npm install
npm run dev
```

## Compilar
```bash
npm run build
```

## Estrutura
- `src/core`: ciclo principal e renderização
- `src/world`: cenário, iluminação e ambiente
- `src/player`: personagem e câmera
- `src/controls`: teclado, mouse e controles touch
- `src/systems`: sistemas de jogo que serão adicionados nas próximas etapas
- `public/assets`: modelos, texturas e áudio

## Estado atual
Fundação técnica jogável: cena 3D procedural inicial, personagem provisório, câmera em terceira pessoa, controles de teclado/mouse, joystick touch, menu e pausa.

Os elementos geométricos atuais são placeholders de desenvolvimento. O visual final dependerá da integração de modelos, texturas, animações e áudio próprios/licenciados.
