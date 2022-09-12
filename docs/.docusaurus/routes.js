import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', 'e93'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '872'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'bdd'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', '7aa'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '8b1'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '896'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '415'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '613'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '966'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', '510'),
        exact: true,
        sidebar: "someSidebar"
      },
      {
        path: '/docs/configuration',
        component: ComponentCreator('/docs/configuration', '757'),
        exact: true,
        sidebar: "someSidebar"
      },
      {
        path: '/docs/installation',
        component: ComponentCreator('/docs/installation', 'e7f'),
        exact: true,
        sidebar: "someSidebar"
      },
      {
        path: '/docs/overview',
        component: ComponentCreator('/docs/overview', '55b'),
        exact: true,
        sidebar: "someSidebar"
      },
      {
        path: '/docs/support',
        component: ComponentCreator('/docs/support', 'a84'),
        exact: true,
        sidebar: "someSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '787'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
