import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() showBackButton: boolean = false;
  @Input() showMenuButton: boolean = false;
  @Input() backHref: string = '/';
  @Input() customBackFn: (() => void) | null = null;

  constructor(private router: Router) {}



  goBack() {
    if (this.customBackFn) {
      this.customBackFn();
    } else {
      this.router.navigate([this.backHref]);
    }
  }
}
