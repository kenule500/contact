import { NgModule } from '@angular/core';

// xplat
import { UIModule } from '@contact/ionic';

@NgModule({
  imports: [UIModule],
  exports: [UIModule],
})
export class SharedModule {}
