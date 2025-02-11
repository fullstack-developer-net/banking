// Angular import
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

// project import
import { NavigationItem } from '../../navigation';

import { NavCollapseComponent } from '../nav-collapse/nav-collapse.component';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { AppStateManager } from 'src/app/shared/app.state-manager';

@Component({
  selector: 'app-nav-group',
  standalone: true,
  imports: [CommonModule, NavCollapseComponent, NavItemComponent],
  templateUrl: './nav-group.component.html',
  styleUrl: './nav-group.component.scss'
})
export class NavGroupComponent implements OnInit {
  private location = inject(Location);

  // public props
  @Input() item!: NavigationItem;

  current_url!: string;
  constructor(private appState: AppStateManager) {}
  // Life cycle events
  ngOnInit() {
    this.item.children = this.item.children?.filter((x) => x.role?.includes(this.appState.currentRole));

    this.appState.user$.subscribe((auth) => {
      if (auth) {
        this.item.children = this.item.children?.filter((x) => x.role?.includes(this.appState.currentRole));
      }
    });

    this.current_url = this.location.path();
    //eslint-disable-next-line
    //@ts-ignore
    const baseHref = this.location['_baseHref'] || '';
    this.current_url = baseHref + this.current_url;

    // Use a more reliable way to find and update the active group
    setTimeout(() => {
      const links = document.querySelectorAll('a.nav-link') as NodeListOf<HTMLAnchorElement>;
      links.forEach((link: HTMLAnchorElement) => {
        if (link.getAttribute('href') === this.current_url) {
          let parent = link.parentElement;
          while (parent && parent.classList) {
            if (parent.classList.contains('coded-hasmenu')) {
              parent.classList.add('coded-trigger');
              parent.classList.add('active');
            }
            parent = parent.parentElement;
          }
        }
      });
    }, 0);
  }
}
