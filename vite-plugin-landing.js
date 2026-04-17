import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export default function landingPagePlugin() {
  return {
    name: 'zehnx-landing-swap',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      const landing = resolve(dist, 'landing.html');
      const spa = resolve(dist, 'index.html');
      const appDir = resolve(dist, 'app');
      const appIndex = resolve(appDir, 'index.html');

      if (!existsSync(landing) || !existsSync(spa)) {
        console.log('⚠️  landing.html or index.html missing in dist — skipping');
        return;
      }

      if (!existsSync(appDir)) mkdirSync(appDir, { recursive: true });

      writeFileSync(appIndex, readFileSync(spa, 'utf-8'));
      console.log('✅ React SPA → /app/index.html');

      writeFileSync(spa, readFileSync(landing, 'utf-8'));
      console.log('✅ Landing Page → index.html');
    }
  };
}
