import { NgClass } from '@angular/common';
import { AfterContentInit, Component, contentChildren } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss'
})
export class TabsContainerComponent implements AfterContentInit {
  public tabs = contentChildren(TabComponent)

  ngAfterContentInit() {
    const activeTab = this.tabs().find(i => i.active())
    if(!activeTab) {
      this.selectTab(this.tabs()[0])
    }
  }
  public selectTab(tab: TabComponent) {
    this.tabs().forEach(i => i.active.set(false))
    tab.active.set(true)
    return false
  }
}
