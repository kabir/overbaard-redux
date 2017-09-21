import {IssueActions, issueReducer} from './issue.reducer';
import {BoardIssue, DeserializeIssueLookupParams, initialIssueState, IssueState} from './issue.model';
import {async} from '@angular/core/testing';
import {getTestAssigneeState} from '../assignee/assignee.reducer.spec';
import {getTestIssueTypeState} from '../issue-type/issue-type.reducer.spec';
import {getTestPriorityState} from '../priority/priority.reducer.spec';
import {IssueChecker} from './issue.model.spec';
import {NO_ASSIGNEE} from '../assignee/assignee.model';
import {Map} from 'immutable';
import {getTestComponentState} from '../component/component.reducer.spec';
import {getTestLabelState} from '../label/label.reducer.spec';
import {getTestFixVersionState} from '../fix-version/fix-version.reducer.spec';
import {cloneObject} from '../../utils/test-util.spec';

function getTestIssuesInput() {
  return cloneObject({
    'ISSUE-1': {
      key: 'ISSUE-1',
      type: 0,
      priority: 0,
      summary: 'One',
      assignee: 0,
      state: 0,
      'linked-issues' : [
        {
          key : 'LNK-1',
          summary : 'Linked 1',
        }]
    },
    'ISSUE-2': {
      key: 'ISSUE-2',
      type: 1,
      priority: 1,
      summary: 'Two',
      assignee: 1,
      state: 5
    },
    'ISSUE-3': {
      key: 'ISSUE-3',
      type: 0,
      priority: 0,
      summary: 'Three',
      assignee: 0,
      state: 3
    },
    'ISSUE-4': {
      key: 'ISSUE-4',
      type: 0,
      priority: 1,
      summary: 'Four',
      state: 2
    }
  });
}
describe('Issue reducer tests', () => {

  let issueState: IssueState;
  let issues: Map<string, BoardIssue>;
  let lookupParams: DeserializeIssueLookupParams;
  beforeEach(async(() => {

    lookupParams = new DeserializeIssueLookupParams()
      .setAssignees(getTestAssigneeState().assignees)
      .setPriorities(getTestPriorityState().priorities)
      .setIssueTypes(getTestIssueTypeState().types)
      .setComponents(getTestComponentState().components)
      .setLabels(getTestLabelState().labels)
      .setFixVersions(getTestFixVersionState().versions);

    issueState = issueReducer(
      initialIssueState,
      IssueActions.createDeserializeIssuesAction(getTestIssuesInput(), lookupParams));
    issues = issueState.issues;
  }));

  describe('Deserialize', () => {
    it('Deserialize issues', () => {
      expect(issues.size).toEqual(4);
      const issueArray: BoardIssue[] = issues.toArray();
      new IssueChecker(issueArray[0],
        lookupParams.issueTypes.get('task'), lookupParams.priorities.get('Blocker'), lookupParams.assignees.get('bob'), 'One', 0)
        .key('ISSUE-1')
        .addLinkedIssue('LNK-1', 'Linked 1')
        .check();
      new IssueChecker(issueArray[1],
        lookupParams.issueTypes.get('bug'), lookupParams.priorities.get('Major'), lookupParams.assignees.get('kabir'), 'Two', 5)
        .key('ISSUE-2')
        .check();
      new IssueChecker(issueArray[2],
        lookupParams.issueTypes.get('task'), lookupParams.priorities.get('Blocker'), lookupParams.assignees.get('bob'), 'Three', 3)
        .key('ISSUE-3')
        .check();
      new IssueChecker(issueArray[3],
        lookupParams.issueTypes.get('task'), lookupParams.priorities.get('Major'), NO_ASSIGNEE, 'Four', 2)
        .key('ISSUE-4')
        .check();
    });

    it('Deserialize same state', () => {
      const state = issueReducer(
        issueState,
        IssueActions.createDeserializeIssuesAction(getTestIssuesInput(), lookupParams));
      expect(state).toBe(issueState);
    });
  });

  describe('Update', () => {
    it('Process updates', () => {
      fail('NYI');
    });
  });
});
