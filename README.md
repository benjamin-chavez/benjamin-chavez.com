# benjamin-chavez.com

<p align="center">
  <img src=".github/benjamin-chavez.com-preview.png" alt="benjamin-chavez.com application screenshot">
</p>


## Running Locally

First, clone the repo:
```bash
git clone git@github.com:benjamin-chavez/benjamin-chavez.com.git
cd benjamin-chavez.com
```
Next, install the npm dependencies:
```bash
pnpm install
```

Then, create a new `.env` file by copying [`.env.example`](.env.example):
```bash
cp .env.example .env.local
```

Next, run the development server:

```bash
pnpm dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.


## Scripts:
- `pnpm dev`
  - Runs the development server

- `pnpm run dev:clear-cache`
  - Rebuilds the `.next` and `.contentlayer` folders before running the development server. This is required in order to see styling changes when editing the blog markdown file: `ctrl-markdown-theme.json`.

- `pnpm run build`
  - Creates a production build

- `pnpm run start`
  - Runs a local copy of the production build on [http://localhost:3000](http://localhost:3000)
- `pnpm run lint`
  - Checks styling throughout codebase
