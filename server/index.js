import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import jsdom from "jsdom";

const { JSDOM } = jsdom;
const __dirname = path.dirname(fileURLToPath(new URL(import.meta.url)));

const PORT = 3001;

async function main() {
  const app = express();

  app.use(express.static(path.resolve(__dirname, '../client/')));

  process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
  });

  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const htmlPath = path.resolve(__dirname, '../client/index.html');
  const html = await fs.readFile(htmlPath, 'utf-8');

  app.get('/ssr', (req, res) => {
    const dom = new JSDOM(html);
    const { document } = dom.window;

    globalThis.document = document;

    const scriptElement = document.createElement('script');

    scriptElement.type = 'module';
    scriptElement.innerHTML = `
      import App from './index.js';

      const component = new App();
      const root = document.querySelector('#root');

      root.append(component.element);
    `;

    document.body.append(scriptElement);

    return res.send(dom.serialize());
  });

  app.use((req, res) => {
    res.status(400).send('404');
  })

  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  })
}

main()
  .catch(error => {
    console.error(`Error: ${error}`);
  })
