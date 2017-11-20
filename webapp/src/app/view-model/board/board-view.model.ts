import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {List, Map, OrderedMap} from 'immutable';
import {BoardIssueView} from './board-issue-view';
import {BoardViewModel} from './board-view';
import {SwimlaneData} from './swimlane-data';
import {BoardHeader} from './board-header';
import {IssueTable} from './issue-table';
import {BoardHeaders} from './board-headers';
import {SwimlaneInfo} from './swimlane-info';


const DEFAULT_BOARD_HEADERS: BoardHeaders = {
  headersList: List<BoardHeader>()
}

const DEFAULT_BOARD_VIEW: BoardViewModel = {
  headers: null,    // The initial state will have this set to initialBoardHeaders, declared below
  issueTable: null  // The initial state will have this set to initialIssueTable, declared below
};


const DEFAULT_BOARD_HEADER: BoardHeader = {
  name: null,
  abbreviation: null,
  backlog: false,
  category: true,
  stateIndices: List<number>(),
  states: null,
  wip: 0,
  visible: false,
  totalIssues: 0,
  visibleIssues: 0
}

const DEFAULT_ISSUE_TABLE: IssueTable = {
  issues: Map<string, BoardIssueView>(),
  table: List<List<string>>(),
  swimlaneInfo: null
};

const DEFAULT_SWIMLANE_INFO: SwimlaneInfo = {
  swimlanes: OrderedMap<string, SwimlaneData>()
};

const DEFAULT_SWIMLANE_DATA: SwimlaneData = {
  key: null,
  display: null,
  table: List<List<string>>(),
  visibleIssues: 0,
  filterVisible: true
};

interface BoardViewModelRecord extends TypedRecord<BoardViewModelRecord>, BoardViewModel {
}

interface BoardHeaderRecord extends TypedRecord<BoardHeaderRecord>, BoardHeader {
}

interface BoardHeadersRecord extends TypedRecord<BoardHeadersRecord>, BoardHeaders {
}

interface IssueTableRecord extends TypedRecord<IssueTableRecord>, IssueTable {
}

interface SwimlaneInfoRecord extends TypedRecord<SwimlaneInfoRecord>, SwimlaneInfo {
}

interface SwimlaneDataRecord extends TypedRecord<SwimlaneDataRecord>, SwimlaneData {
}

const BOARD_VIEW_MODEL_FACTORY = makeTypedFactory<BoardViewModel, BoardViewModelRecord>(DEFAULT_BOARD_VIEW);
const BOARD_HEADER_FACTORY = makeTypedFactory<BoardHeader, BoardHeaderRecord>(DEFAULT_BOARD_HEADER);
const BOARD_HEADERS_FACTORY = makeTypedFactory<BoardHeaders, BoardHeadersRecord>(DEFAULT_BOARD_HEADERS);
const ISSUE_TABLE_STATE_FACTORY = makeTypedFactory<IssueTable, IssueTableRecord>(DEFAULT_ISSUE_TABLE);
const SWIMLANE_INFO_STATE_FACTORY = makeTypedFactory<SwimlaneInfo, SwimlaneInfoRecord>(DEFAULT_SWIMLANE_INFO);
const SWIMLANE_DATA_STATE_FACTORY = makeTypedFactory<SwimlaneData, SwimlaneDataRecord>(DEFAULT_SWIMLANE_DATA);
const initialBoardHeaders: BoardHeaders = BOARD_HEADERS_FACTORY(DEFAULT_BOARD_HEADERS);
const initialIssueTable: IssueTable = ISSUE_TABLE_STATE_FACTORY(DEFAULT_ISSUE_TABLE);
export const initialBoardViewModel: BoardViewModel = BOARD_VIEW_MODEL_FACTORY({
  headers: initialBoardHeaders,
  issueTable: initialIssueTable});

export class BoardViewModelUtil {
  static updateBoardViewModel(boardViewModel: BoardViewModel, mutate: (boardViewModel: BoardViewModel) => any): BoardViewModel {
    return (<BoardViewModelRecord>boardViewModel).withMutations(mutable => {
      return mutate(mutable);
    });
  }

  static updateBoardHeaders(headersModel: BoardHeaders, mutate: (headers: BoardHeaders) => any): BoardHeaders {
    return (<BoardHeadersRecord>headersModel).withMutations(mutable => {
      return mutate(mutable);
    });
  }

  static updateBoardHeader(headerModel: BoardHeader, mutate: (header: BoardHeader) => any): BoardHeader {
    return (<BoardHeaderRecord>headerModel).withMutations(mutable => {
      return mutate(mutable);
    });
  }

  static createBoardHeaders(headers: List<BoardHeader>) {
    return BOARD_HEADERS_FACTORY({
      headersList: headers
    });
  }

  static createBoardHeaderRecord(header: BoardHeader): BoardHeaderRecord {
    return BOARD_HEADER_FACTORY(header);
  }


  static createIssueTable(
    issues: Map<string, BoardIssueView>,
    tableList: List<List<string>>,
    swimlaneInfo: SwimlaneInfo): IssueTable {

    const state: IssueTable = {
      issues: issues,
      table: tableList,
      swimlaneInfo: swimlaneInfo
    };
    return ISSUE_TABLE_STATE_FACTORY(state);
  }

  static createSwimlaneDataView(
    key: string,
    display: string,
    table: List<List<string>>,
    visibleIssues: number,
    filterVisible: boolean): SwimlaneData {
    const state: SwimlaneData = {
      key: key,
      display: display,
      table: table,
      visibleIssues: visibleIssues,
      filterVisible: filterVisible
    }
    return SWIMLANE_DATA_STATE_FACTORY(state);
  }

  static createSwimlaneInfoView(swimlanes: OrderedMap<string, SwimlaneData>) {
    const state: SwimlaneInfo = {
      swimlanes: swimlanes
    }
    return SWIMLANE_INFO_STATE_FACTORY(state);
  }
}
