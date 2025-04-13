
export interface NavLink {
  name: string;
  path: string;
  action?: (e: React.MouseEvent) => void;
  submenu?: {
    name: string;
    path: string;
  }[];
}
