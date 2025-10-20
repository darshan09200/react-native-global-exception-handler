import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'react-native-global-exception-handler',
  tagline: 'Catch and report fatal/native errors in React Native',
  favicon: 'img/favicon/favicon.ico',

  staticDirectories: ['static'],
  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Production URL of your site (GitHub Pages)
  url: 'https://darshan09200.github.io',
  // For GitHub pages deployment, you often set the baseUrl to your project name.
  // If you serve from a custom domain, keep it as '/'
  baseUrl: '/react-native-global-exception-handler/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'darshan09200',
  projectName: 'react-native-global-exception-handler',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/darshan09200/react-native-global-exception-handler/tree/main/website/',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Global Exception Handler',
      logo: {
        alt: 'Global Exception Handler Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docSidebar',
          label: 'Docs',
          position: 'left',
        },
        {
          to: '/docs/api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/darshan09200/react-native-global-exception-handler',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting started',
              to: '/docs/overview/getting-started',
            },
            {
              label: 'Installation',
              to: '/docs/overview/installation',
            },
            {
              label: 'API reference',
              to: '/docs/api',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/darshan09200/react-native-global-exception-handler',
            },
            {
              label: 'Issues',
              href: 'https://github.com/darshan09200/react-native-global-exception-handler/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/darshan09200/react-native-global-exception-handler/discussions',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/global-exception-handler',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            // {
            //   label: 'Changelog',
            //   to: '/changelog',
            // },
            {
              label: 'Examples',
              to: '/docs/examples',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting',
            },
          ],
        },
      ],
      // project logo centered by the theme (use full logo variants for light/dark)
      logo: {
        alt: 'Global Exception Handler',
        src: 'img/logo-full-light.svg',
        srcDark: 'img/logo-full-dark.svg',
        href: '/',
      },
      // small badge-like HTML will still be rendered; keep it in metadata area via headTags or as a raw html link in the footer if desired
      // keep copyright and make it specific to the project
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/darshan09200" target="_blank" rel="noopener noreferrer">Darshan Jain</a>. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    metadata: [
      { name: 'algolia-site-verification', content: 'E6AE78369C7E69D4' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
    ],
  } satisfies Preset.ThemeConfig,

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        href: 'img/favicon/icon-96x96.webp',
        sizes: '96x96',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: 'img/favicon/favicon.svg',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: 'img/favicon/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: 'img/favicon/site.webmanifest',
      },
    },
  ],
};

export default config;
