import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  docSidebar: [
    {
      type: 'category',
      label: 'Overview',
      collapsed: false,
      items: ['getting-started', 'installation'],
    },
    {
      type: 'category',
      label: 'Usage',
      items: ['usage', 'native-crash-handling'],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: ['customization', 'analytics-integration', 'testing'],
    },
    {
      type: 'doc',
      id: 'api',
    },
    {
      type: 'doc',
      id: 'troubleshooting',
    },
  ],
};

export default sidebars;
