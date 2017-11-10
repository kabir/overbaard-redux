import {List, Map, OrderedMap} from 'immutable';
import {BoardIssue} from '../../../model/board/data/issue/board-issue';
import {BoardIssueView} from './board-issue-view';

export interface IssueTable {
  showBacklog: boolean;
  backlogStates: List<number>;
  normalStates: List<number>;
  issues: Map<string, BoardIssueView>;
  table: List<List<string>>;
  swimlaneInfo: SwimlaneInfo;
  visibleIssueCounts: List<number>;
  visibleColumns: List<boolean>;
}

export interface SwimlaneInfo {
  swimlanes: OrderedMap<string, SwimlaneData>;
}

export interface SwimlaneData {
  key: string;
  display: string;
  table: List<List<string>>;
  visibleIssues: number;
  filterVisible: boolean;
}


