import type { MenuItem } from '../components/layout/Navbar';

export const designMenu: MenuItem[] = [
  { title: 'Framework', url: '/framework' },
  { title: 'Apex', url: '/apex' },
  { title: 'Features', url: '/features' },
  { title: 'Packages', url: '/packages' },
  {
    title: 'Compare',
    url: '#',
    children: [
      { title: 'vs Laravel', url: '/compare-laravel' },
      { title: 'vs Symfony', url: '/compare-symfony' },
    ],
  },
];
