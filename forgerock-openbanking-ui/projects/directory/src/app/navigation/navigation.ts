import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'NAV.DASHBOARD',
    type: 'item',
    icon: 'dashboard',
    url: '/dashboard'
  },
  {
    id: 'organisation',
    title: 'Organisation',
    translate: 'NAV.ORGANISATION',
    type: 'item',
    icon: 'assignment_ind',
    url: '/organisation'
  },
  {
    id: 'software-statements',
    title: 'Software Statements',
    translate: 'NAV.SOFTWARE_STATEMENTS',
    type: 'item',
    icon: 'gavel',
    url: '/software-statements'
  },
  {
    id: 'bank',
    title: 'Bank (ASPSPs)',
    translate: 'NAV.BANK',
    type: 'item',
    icon: 'card_travel',
    url: '/aspsps'
  },
  {
    id: 'directory',
    title: 'Directory',
    translate: 'NAV.DIRECTORY',
    type: 'item',
    icon: 'folder',
    url: '/forgerock-directory'
  }
];

export const admin: FuseNavigation[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'NAV.HOME',
    type: 'item',
    icon: 'arrow_back',
    url: '/dashboard'
  },
  {
    id: 'admin',
    title: 'Admin',
    translate: 'NAV.ADMIN',
    type: 'group',
    children: [
      {
        id: 'organisation',
        title: 'Organisation',
        translate: 'NAV.ORGANISATIONS',
        type: 'item',
        icon: 'assignment_ind',
        url: '/admin/organisations'
      },
      {
        id: 'aspsps',
        title: 'ASPSPs',
        translate: 'NAV.ASPSPS',
        type: 'item',
        icon: 'card_travel',
        url: '/admin/aspsps'
      },
      {
        id: 'messages',
        title: 'Messages',
        translate: 'NAV.MESSAGES',
        type: 'item',
        icon: 'message',
        url: '/admin/messages'
      }
    ]
  }
];
