import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

test('SEO e ativos PWA obrigatórios existem e estão padronizados', () => {
  const requiredPublicFiles = [
    'public/icon.svg',
    'public/pwa-192x192.png',
    'public/pwa-512x512.png',
    'public/pwa-maskable-512x512.png',
    'public/apple-touch-icon.png',
    'public/og-image.jpg',
    'public/robots.txt',
    'public/sitemap.xml',
  ];

  for (const rel of requiredPublicFiles) {
    const fullPath = path.join(rootDir, rel);
    assert.equal(fs.existsSync(fullPath), true, `Arquivo ausente: ${rel}`);
    assert.ok(fs.statSync(fullPath).size > 0, `Arquivo vazio: ${rel}`);
  }

  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
  assert.match(indexHtml, /Associação Julieta Barros/);
  assert.match(indexHtml, /property="og:image"\s+content="\/og-image\.jpg"/);
  assert.match(indexHtml, /rel="apple-touch-icon"\s+href="\/apple-touch-icon\.png"/);
  assert.match(indexHtml, /application\/ld\+json/);
});

test('Build de produção gera manifesto PWA e Service Worker válidos', () => {
  const manifestPath = path.join(rootDir, 'dist', 'manifest.webmanifest');
  const swPath = path.join(rootDir, 'dist', 'sw.js');

  assert.equal(fs.existsSync(manifestPath), true, 'dist/manifest.webmanifest ausente (rode npm run build antes)');
  assert.equal(fs.existsSync(swPath), true, 'dist/sw.js ausente (rode npm run build antes)');

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  assert.equal(manifest.id, '/');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.short_name.length <= 12, `short_name deve ter <= 12 caracteres (${manifest.short_name})`);

  const purposes = (manifest.icons || []).map((i) => i.purpose);
  assert.ok(purposes.includes('any'), 'Manifesto deve conter ícones purpose=any');
  assert.ok(purposes.includes('maskable'), 'Manifesto deve conter ícone purpose=maskable separado');
  assert.equal(purposes.includes('any maskable'), false, 'Não misturar any e maskable no mesmo ícone');
});

test('Frontend desacoplado de Express e servidor Vite responde HTML/Manifest na porta 3000', async () => {
  assert.equal(fs.existsSync(path.join(rootDir, 'server.ts')), false, 'server.ts deve permanecer removido no projeto apenas Frontend');
  assert.equal(fs.existsSync(path.join(rootDir, 'backend_django')), false, 'backend_django deve permanecer removido no projeto apenas Frontend');

  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  assert.equal(pkg.scripts.dev, 'vite', 'Script dev deve usar Vite diretamente');
  assert.equal(pkg.dependencies?.express, undefined, 'express não deve constar nas dependências do Frontend');

  const htmlRes = await fetch(`${baseUrl}/`);
  assert.equal(htmlRes.status, 200);
  const htmlText = await htmlRes.text();
  assert.match(htmlText, /Associação Julieta Barros/);

  const manifestRes = await fetch(`${baseUrl}/manifest.webmanifest`);
  assert.equal(manifestRes.status, 200);
});
