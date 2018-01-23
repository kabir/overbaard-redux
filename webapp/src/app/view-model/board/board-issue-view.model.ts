import {List, Map} from 'immutable';
import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {BoardIssue} from '../../model/board/data/issue/board-issue';
import {BoardIssueView} from './board-issue-view';
import {NO_ASSIGNEE} from '../../model/board/data/assignee/assignee.model';
import {CustomField} from '../../model/board/data/custom-field/custom-field.model';
import {LinkedIssue} from '../../model/board/data/issue/linked-issue';

const DEFAULT_STATE: BoardIssueView = {
  // Fields from core issue
  key: null,
  projectCode: null,
  summary: null,
  assignee: NO_ASSIGNEE,
  priority: null,
  type: null,
  components: null,
  labels: null,
  fixVersions: null,
  customFields: Map<string, CustomField>(),
  parallelTasks: null,
  selectedParallelTasks: null,
  linkedIssues: List<LinkedIssue>(),
  ownState: -1,
  visible: true,
  projectColour: 'red',
  issueUrl: null,
  ownStateName: null,
  calculatedTotalHeight: 0,
  summaryLines: null
};

interface BoardIssueViewRecord extends TypedRecord<BoardIssueViewRecord>, BoardIssueView {
}

const ISSUE_FACTORY = makeTypedFactory<BoardIssueView, BoardIssueViewRecord>(DEFAULT_STATE);

export class BoardIssueViewUtil {

  static createBoardIssue(
    issue: BoardIssue, jiraUrl: string, projectColour: string, ownStateName: string,
    visible: boolean, summaryLines: List<string>, totalHeight: number): BoardIssueViewRecord {
    const issueUrl = `${jiraUrl}browse/${issue.key}`;
    return ISSUE_FACTORY({
      key: issue.key,
      projectCode: issue.projectCode,
      summary: issue.summary,
      assignee: issue.assignee,
      priority: issue.priority,
      type: issue.type,
      components: issue.components,
      labels: issue.labels,
      fixVersions: issue.fixVersions,
      customFields: issue.customFields,
      parallelTasks: issue.parallelTasks,
      selectedParallelTasks: issue.selectedParallelTasks,
      linkedIssues: issue.linkedIssues,
      ownState: issue.ownState,
      visible: visible,
      projectColour: projectColour,
      issueUrl: issueUrl,
      ownStateName: ownStateName,
      calculatedTotalHeight: totalHeight,
      summaryLines: summaryLines
    });
  }

  static equals(one: BoardIssueView, two: BoardIssueView) {
    return (<BoardIssueViewRecord>one).equals(<BoardIssueViewRecord>two);
  }

  static updateVisibility(issue: BoardIssueView, visible: boolean): BoardIssueView {
    return (<BoardIssueViewRecord>issue).withMutations(mutable => {
      mutable.visible = visible;
    })
  }
}
