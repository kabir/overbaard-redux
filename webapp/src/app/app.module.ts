import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {reducer} from './app-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {BoardsComponent} from './components/boards/boards.component';
import {RestUrlService} from './services/rest-url.service';
import {BoardComponent} from './components/board/board.component';
import {HttpClientModule} from '@angular/common/http';
import {AppHeaderService} from './services/app-header.service';
import { KanbanViewComponent } from './components/board/view/kanban-view/kanban-view.component';
import { RankViewComponent } from './components/board/view/rank-view/rank-view.component';


@NgModule({
  declarations: [
    AppComponent,
    BoardsComponent,
    BoardComponent,
    KanbanViewComponent,
    RankViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StoreModule.provideStore(reducer),
    !environment.production ? StoreDevtoolsModule.instrumentOnlyWithExtension() : []
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AppHeaderService,
    RestUrlService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
