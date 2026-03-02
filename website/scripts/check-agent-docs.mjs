import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteDir = path.resolve(__dirname, '..');
const llmsPath = path.join(websiteDir, 'static', 'llms.txt');
const companionPath = path.join(
  websiteDir,
  'docs',
  'ai-agents.mdx'
);

const llms = await fs.readFile(llmsPath, 'utf8');
await fs.access(companionPath);

const requiredPatterns = [
  '# react-native-global-exception-handler',
  'Read first',
  'Public API',
  'Platform notes',
  'Testing and release validation',
  'https://geh.darshan09200.dev/docs/overview/installation/',
  'https://geh.darshan09200.dev/docs/usage/basic-usage/',
  'https://geh.darshan09200.dev/docs/usage/native-crash-handling/',
  'https://geh.darshan09200.dev/docs/api/',
  'https://geh.darshan09200.dev/docs/troubleshooting/',
  'https://geh.darshan09200.dev/docs/migration/migrating-from-react-native-exception-handler/'
];

for (const pattern of requiredPatterns) {
  if (!llms.includes(pattern)) {
    throw new Error(`llms.txt is missing required content: ${pattern}`);
  }
}

console.log('AI agent docs checks passed.');
