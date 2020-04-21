import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [

    // { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    // { path: '/transaction-list', title: 'Transaction List',  icon: 'list', class: '' },
    // { path: '/manage-categories', title: 'Manage Categories',  icon:'content_paste', class: '' },
    // { path: '/monthly-income-list', title: 'Monthly Income List',  icon:'content_paste', class: '' },
    // { path: '/database-testing', title: 'Database Testing',  icon:'content_paste', class: '' },

    { path: '/user-profile', title: 'User Profile',  icon:'person', class: '' },
    { path: '/categories', title: 'Categories',  icon:'content_paste', class: '' },
    { path: '/default-options', title: 'Default Options',  icon:'content_paste', class: '' },
    { path: '/repeat-options', title: 'Repeat Options',  icon:'content_paste', class: '' },
    { path: '/settled-transactions', title: 'Settled Transactions',  icon:'content_paste', class: '' },
    { path: '/tax-exemptions', title: 'Tax Exemptions',  icon:'content_paste', class: '' },
    { path: '/transactions', title: 'Transactions',  icon:'content_paste', class: '' },
    { path: '/types', title: 'Types',  icon:'content_paste', class: '' },

    /*{ path: '/typography', title: 'Typography',  icon:'library_books', class: '' },*/
    /*{ path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },*/
    /*{ path: '/maps', title: 'Maps',  icon:'location_on', class: '' },*/
    { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    /*{ path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },*/
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
