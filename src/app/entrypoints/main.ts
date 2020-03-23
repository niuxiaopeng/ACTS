import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app.module';
import { AppProperties } from 'app.properties';

if (AppProperties.ENABLE_PROD_MODE === 'true') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
