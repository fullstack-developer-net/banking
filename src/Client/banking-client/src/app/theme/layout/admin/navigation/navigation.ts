export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  role?: string[];
  isMainParent?: boolean;
}
export const LOGOUT_ITEM: NavigationItem = {
  id: 'logout',
  title: 'Logout',
  type: 'item',
  role: ['*'],
  icon: 'feather icon-log-out',
  url: '/auth/logout'
};

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    classes: 'nav-item',
    title: 'Dashboard',
    type: 'group',
    icon: 'ti ti-dashboard',
    role: ['User', 'Admin'],
    children: [
      {
        id: 'user',
        title: 'User dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/user',
        icon: 'ti ti-dashboard',
        breadcrumbs: false,
        role: ['User']
      },
      {
        id: 'admin-dashboard',
        title: 'Admin dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/admin',
        icon: 'ti ti-dashboard',
        breadcrumbs: false,
        role: ['Admin']
      }
    ]
  },
  {
    id: 'page',
    title: 'Pages',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'login',
        title: 'Login',
        type: 'item',
        url: '/login',
        target: true,
        breadcrumbs: false
      }
    ]
  }
];
