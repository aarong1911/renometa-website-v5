export type NavLink = {
  name: string;
  path: string;
  external?: boolean;
  action?: (e: React.MouseEvent) => void;
};

export const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Solutions', path: '/solutions' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'About', path: '/about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/#contact' },
  

];
