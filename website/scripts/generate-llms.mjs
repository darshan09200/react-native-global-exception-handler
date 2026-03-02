import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const websiteDir = path.resolve(__dirname, '..');
const guidePath = path.join(websiteDir, 'src', 'data', 'agentGuide.json');
const outputPath = path.join(websiteDir, 'static', 'llms.txt');

const guide = JSON.parse(await fs.readFile(guidePath, 'utf8'));

const abs = (docPath) => `${guide.docsUrl}${docPath}`;

const lines = [
  `# ${guide.packageName}`,
  '',
  'Summary',
  guide.summary,
  '',
  'Use this package for',
  ...guide.useCases.map((item) => `- ${item}`),
  '',
  'Do not assume',
  ...guide.nonGoals.map((item) => `- ${item}`),
  '',
  'Read first',
  ...guide.readFirst.map(
    (item) => `- ${item.title}: ${abs(item.path)} (${item.why})`
  ),
  '',
  'Task map',
  ...guide.taskMap.map(
    (item) =>
      `- ${item.task}: ${item.docs.map((docPath) => abs(docPath)).join(', ')}`
  ),
  '',
  'Public API',
  ...guide.apiMap.flatMap((item) => [
    `- ${item.name}: ${item.purpose}`,
    ...item.notes.map((note) => `  - ${note}`),
  ]),
  '',
  'Core options',
  ...guide.coreOptions.flatMap((item) => [
    `- ${item.name} (default: ${item.default})`,
    ...item.notes.map((note) => `  - ${note}`),
  ]),
  '',
  'Platform notes',
  ...guide.platformNotes.common.map((item) => `- ${item}`),
  '- iOS',
  ...guide.platformNotes.ios.map((item) => `  - ${item}`),
  '- Android',
  ...guide.platformNotes.android.map((item) => `  - ${item}`),
  '',
  'Testing and release validation',
  ...guide.testingNotes.map((item) => `- ${item}`),
  '',
  'Migration',
  ...guide.migrationLinks.map((item) => `- ${item.title}: ${abs(item.path)}`),
  '',
  'Examples',
  ...guide.exampleLinks.map((item) => `- ${item.title}: ${abs(item.path)}`),
  '',
  'Canonical links',
  `- Docs: ${guide.siteUrl}/`,
  `- AI agents guide: ${abs('/ai-agents/')}`,
  `- GitHub: ${guide.githubUrl}`,
  `- npm: ${guide.npmUrl}`,
  `- Issues: ${guide.issuesUrl}`,
  `- Discussions: ${guide.discussionsUrl}`,
  '',
];

await fs.writeFile(outputPath, `${lines.join('\n')}`, 'utf8');
console.log(`Generated ${path.relative(websiteDir, outputPath)}`);
