import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardsComponent} from './components/boards/boards.component';
import {BoardComponent} from './components/board/board.component';
import {ConfigurationComponent} from './components/config/configuration.component';
import {LoginComponent} from './components/login/login.component';
import {DbExplorerComponent} from './components/db-explorer/db-explorer.component';
import {AccessLogViewComponent} from './components/access-log/access-log.component';
import {FontMeasureComponent} from './components/font-measure/font-measure.component';
import {FontMeasureTableComponent} from './components/font-measure/font-measure-table.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/boards', pathMatch: 'full'
  },
  {
    path: 'boards', component: BoardsComponent,
  },
  {
    path: 'board', component: BoardComponent
  },
  {
    path: 'config', component: ConfigurationComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'db-explorer', component: DbExplorerComponent
  },
  {
    path: 'access-log', component: AccessLogViewComponent
  },
  {
    path: 'font-measure', component: FontMeasureComponent
  },
  {
    path: 'font-measure-table', component: FontMeasureTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
