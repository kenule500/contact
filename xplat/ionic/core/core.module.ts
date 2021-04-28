import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { throwIfAlreadyLoaded } from '@contact/utils';
import { ContactCoreModule } from '@contact/web';

@NgModule({
  imports: [ContactCoreModule, IonicModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
})
export class ContactIonicCoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ContactIonicCoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'ContactIonicCoreModule');
  }
}
