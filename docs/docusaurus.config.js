
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

module.exports = {
  title: 'Subgraph Uncrashable',
  tagline: 'a safe subgraph code generation framework',
  url: 'https://float-capital.github.io',
  baseUrl: '/float-subgraph-uncrashable/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: "float-capital",
  projectName: "float-subgraph-uncrashable",
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: 
            require.resolve('./sidebars.js'),
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Float-Capital/float-subgraph-uncrashable/tree/dev/docs/',
        },
        blog: 
          false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
      title: "",
      logo: {
        alt: "Float Logo",
        src: "https://media-float-capital.fra1.cdn.digitaloceanspaces.com/public/img/float-logo-sq-center.svg"
      },
      items: [
         {
           to: "/",
           activeBasePath: "/",
           label: "Home",
           position: "left",
         },
         {
           to: "docs/",
           activeBasePath: "docs",
           label: "Docs",
           position: "left",
         },
        {
          href: "https://github.com/Float-Capital/float-subgraph-uncrashable",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "docs/",
            },
            {
              label: "Getting Started",
              to: "docs/installation",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Discord",
              href: "https://discord.gg/float-capital",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/float_shipping",
            },
            {
            label: "Lens",
            href: "https://lenster.xyz/u/float.lens"
            }
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/Float-Capital/float-subgraph-uncrashable",
            },
          ],
        },
      ],
        copyright: `Copyright © ${new Date().getFullYear()} Subgraph Uncrashable by <a href='https://float.capital'>Float</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};



