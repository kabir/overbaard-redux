import {List, OrderedSet, Set} from 'immutable';
import {IssueTable, SwimlaneData, SwimlaneInfo} from './issue-table';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {IssuesFactory, IssueTableObservableUtil} from './issue-table.common.spec';
import {Dictionary} from '../../../common/dictionary';
import {DeserializeIssueLookupParams} from '../../../model/board/data/issue/issue.model';
import {NONE_FILTER} from '../../../model/board/user/board-filter/board-filter.constants';


describe('Swimlane observer tests', () => {

  describe('No Filters', () => {
    describe('Create swimlane', () => {
      it('Project', () => {
        // Project is a bit different from the others in this test
        createUtil(
          {swimlane: 'project'},
          {'ONE' : [4, 3, 2, 1], 'TWO': [3, 2, 1]},
          new SwimlaneIssueFactory()
            .addIssue('ONE-1', 0)
            .addIssue('ONE-2', 0)
            .addIssue('ONE-3', 1)
            .addIssue('ONE-4', 2)
            .addIssue('TWO-1', 0)
            .addIssue('TWO-2', 1)
            .addIssue('TWO-3', 1))
        .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-2', 'ONE-1'], ['ONE-3', 'TWO-1'], ['ONE-4', 'TWO-3', 'TWO-2']], [])
              .setSwimlanes([
                {key: 'ONE', name: 'ONE', issues: ['ONE-1', 'ONE-2', 'ONE-3', 'ONE-4']},
                {key: 'TWO', name: 'TWO', issues: ['TWO-1', 'TWO-2', 'TWO-3']}])
              .checkTable(issueTable);
        });
      });

      it('Issue Type', () => {
        createUtilWithStandardIssues({swimlane: 'issue-type'})
          .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'task', name: 'task', issues: ['ONE-2', 'ONE-4']},
                  {key: 'bug', name: 'bug', issues: ['ONE-1', 'ONE-3', 'ONE-5']}])
                .checkTable(issueTable);
            });
      });

      it('Priority', () => {
        createUtilWithStandardIssues({swimlane: 'priority'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'Blocker', name: 'Blocker', issues: ['ONE-1', 'ONE-3', 'ONE-5']},
                {key: 'Major', name: 'Major', issues: ['ONE-2', 'ONE-4']}])
              .checkTable(issueTable);
          });
      });

      it('Assignee', () => {
        createUtilWithStandardIssues({swimlane: 'assignee'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'bob', name: 'Bob Brent Barlow', issues: ['ONE-3']},
                {key: 'kabir', name: 'Kabir Khan', issues: ['ONE-1', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-2', 'ONE-5']}])
              .checkTable(issueTable);
          });
      });

      it ('Components', () => {
        createUtilWithStandardIssues({swimlane: 'component'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-4']},
                {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-4']},
                {key: 'C-30', name: 'C-30', issues: ['ONE-3', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);
          });
      });

      it ('Fix Versions', () => {
        createUtilWithStandardIssues({swimlane: 'fix-version'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'F-10', name: 'F-10', issues: ['ONE-1', 'ONE-2']},
                {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-3']},
                {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-4']}])
              .checkTable(issueTable);
          });
      });

      it ('Labels', () => {
        createUtilWithStandardIssues({swimlane: 'label'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3']},
                {key: 'L-20', name: 'L-20', issues: ['ONE-2', 'ONE-4']},
                {key: 'L-30', name: 'L-30', issues: ['ONE-2', 'ONE-5']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-1']}])
              .checkTable(issueTable);
          });
      });

      it ('Custom Field', () => {
        createUtilWithStandardIssues({swimlane: 'Custom-2'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'c2-A', name: 'First C2', issues: ['ONE-1', 'ONE-2', 'ONE-3']},
                {key: 'c2-B', name: 'Second C2', issues: ['ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);

          });
      });
    });

    describe('Switch to swimlane', () => {
      it ('Project', () => {
        // Project is a bit different from the others in this test
        const util: IssueTableObservableUtil = createUtil(
          {},
          {'ONE' : [4, 3, 2, 1], 'TWO': [3, 2, 1]},
          new SwimlaneIssueFactory()
            .addIssue('ONE-1', 0)
            .addIssue('ONE-2', 0)
            .addIssue('ONE-3', 1)
            .addIssue('ONE-4', 2)
            .addIssue('TWO-1', 0)
            .addIssue('TWO-2', 1)
            .addIssue('TWO-3', 1));
          util.tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-2', 'ONE-1'], ['ONE-3', 'TWO-1'], ['ONE-4', 'TWO-3', 'TWO-2']], [])
              .checkTable(issueTable);
          });
          util.updateUserSettings({swimlane: 'project'})
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-2', 'ONE-1'], ['ONE-3', 'TWO-1'], ['ONE-4', 'TWO-3', 'TWO-2']], [])
                .setSwimlanes([
                  {key: 'ONE', name: 'ONE', issues: ['ONE-1', 'ONE-2', 'ONE-3', 'ONE-4']},
                  {key: 'TWO', name: 'TWO', issues: ['TWO-1', 'TWO-2', 'TWO-3']}])
                .checkTable(issueTable);
            });
          // Check resetting the swimlanes, it does not need testing elsewhere
          util.updateUserSettings({})
            .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-2', 'ONE-1'], ['ONE-3', 'TWO-1'], ['ONE-4', 'TWO-3', 'TWO-2']], [])
                  .checkTable(issueTable);
              });
      });

      it('Other', () => {
        // Test switching between all these in one go, just to see there isn't anything hanging around
        const util: IssueTableObservableUtil = createUtilWithStandardIssues({});
        util.tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .checkTable(issueTable);
          });

        util.updateUserSettings({swimlane: 'issue-type'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'task', name: 'task', issues: ['ONE-2', 'ONE-4']},
                {key: 'bug', name: 'bug', issues: ['ONE-1', 'ONE-3', 'ONE-5']}])
              .checkTable(issueTable);
          });

        util.updateUserSettings({swimlane: 'priority'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'Blocker', name: 'Blocker', issues: ['ONE-1', 'ONE-3', 'ONE-5']},
                {key: 'Major', name: 'Major', issues: ['ONE-2', 'ONE-4']}])
              .checkTable(issueTable);
          });

        util.updateUserSettings({swimlane: 'assignee'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'bob', name: 'Bob Brent Barlow', issues: ['ONE-3']},
                {key: 'kabir', name: 'Kabir Khan', issues: ['ONE-1', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-2', 'ONE-5']}])
              .checkTable(issueTable);
          });

        util.updateUserSettings({swimlane: 'component'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-4']},
                {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-4']},
                {key: 'C-30', name: 'C-30', issues: ['ONE-3', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);
          });

        util.updateUserSettings({swimlane: 'fix-version'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'F-10', name: 'F-10', issues: ['ONE-1', 'ONE-2']},
                {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-3']},
                {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-4']}])
              .checkTable(issueTable);
          });

        util.updateUserSettings({swimlane: 'label'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3']},
                {key: 'L-20', name: 'L-20', issues: ['ONE-2', 'ONE-4']},
                {key: 'L-30', name: 'L-30', issues: ['ONE-2', 'ONE-5']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-1']}])
              .checkTable(issueTable);
          });

        util.updateUserSettings({swimlane: 'Custom-2'})
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'c2-A', name: 'First C2', issues: ['ONE-1', 'ONE-2', 'ONE-3']},
                {key: 'c2-B', name: 'Second C2', issues: ['ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);
          });
      });
    });

    describe('Add issues', () => {
      it ('Project', () => {
        // Project is a bit different from the others in this test.
        let originalState: IssueTable;
        const util: IssueTableObservableUtil = createUtil(
          {swimlane: 'project'},
          {'ONE': [4, 3, 2, 1], 'TWO': [3, 2, 1]},
          new SwimlaneIssueFactory()
            .addIssue('ONE-1', 0)
            .addIssue('ONE-2', 0)
            .addIssue('ONE-3', 1)
            .addIssue('ONE-4', 2)
            .addIssue('TWO-1', 0)
            .addIssue('TWO-2', 1)
            .addIssue('TWO-3', 1));
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

        util
          .issueChanges({new: [
            {key: 'ONE-5', state: '1-1', summary: 'Test', priority: 'Blocker', type: 'bug'},
            {key: 'TWO-4', state: '2-1', summary: 'Test', priority: 'Major', type: 'task'}]})
          .rankChanges({ONE: [{index: 4, key: 'ONE-5'}], TWO: [{index: 3, key: 'TWO-4'}]})
          .emitBoardChange()
          .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-2', 'ONE-1', 'ONE-5'], ['ONE-3', 'TWO-1', 'TWO-4'], ['ONE-4', 'TWO-3', 'TWO-2']], [])
                .setSwimlanes([
                  {key: 'ONE', name: 'ONE', issues: ['ONE-1', 'ONE-2', 'ONE-3', 'ONE-4', 'ONE-5']},
                  {key: 'TWO', name: 'TWO', issues: ['TWO-1', 'TWO-2', 'TWO-3', 'TWO-4']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
      });

      it ('Issue Type', () => {
        let originalState: IssueTable;
        const util: IssueTableObservableUtil = createUtilWithStandardIssues({swimlane: 'issue-type'});
        util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);
        util
          .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task'}]})
          .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
          .emitBoardChange()
          .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'task', name: 'task', issues: ['ONE-2', 'ONE-4', 'ONE-6']},
                  {key: 'bug', name: 'bug', issues: ['ONE-1', 'ONE-3', 'ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
      });

      it ('Priority', () => {
        let originalState: IssueTable;
        const util: IssueTableObservableUtil = createUtilWithStandardIssues({swimlane: 'priority'});
        util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);
        util
          .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task'}]})
          .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
          .emitBoardChange()
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'Blocker', name: 'Blocker', issues: ['ONE-1', 'ONE-3', 'ONE-5']},
                {key: 'Major', name: 'Major', issues: ['ONE-2', 'ONE-4', 'ONE-6']}])
              .checkTable(issueTable);
            // TODO check equality of not changed swimlanes and columns
          });
      });

      describe('Assignee', () => {
        let originalState: IssueTable;
        let util: IssueTableObservableUtil;
        beforeEach(() => {
          util = createUtilWithStandardIssues({swimlane: 'assignee'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

        });
        it ('None', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task'}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'bob', name: 'Bob Brent Barlow', issues: ['ONE-3']},
                  {key: 'kabir', name: 'Kabir Khan', issues: ['ONE-1', 'ONE-4']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-2', 'ONE-5', 'ONE-6']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('Set', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', assignee: 'bob'}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'bob', name: 'Bob Brent Barlow', issues: ['ONE-3', 'ONE-6']},
                  {key: 'kabir', name: 'Kabir Khan', issues: ['ONE-1', 'ONE-4']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-2', 'ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
      });

      describe('Components', () => {
        let originalState: IssueTable;
        let util: IssueTableObservableUtil;
        beforeEach(() => {
          util = createUtilWithStandardIssues({swimlane: 'component'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

        });
        it ('None', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task'}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-4']},
                  {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-4']},
                  {key: 'C-30', name: 'C-30', issues: ['ONE-3', 'ONE-4']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-5', 'ONE-6']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('One', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', components: ['C-10']}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-4', 'ONE-6']},
                  {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-4']},
                  {key: 'C-30', name: 'C-30', issues: ['ONE-3', 'ONE-4']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('Several', () => {
          util
            .issueChanges({new:
              [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', components: ['C-10', 'C-20']}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-4', 'ONE-6']},
                  {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-4', 'ONE-6']},
                  {key: 'C-30', name: 'C-30', issues: ['ONE-3', 'ONE-4']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
      });

      describe('Fix Versions', () => {
        let originalState: IssueTable;
        let util: IssueTableObservableUtil;
        beforeEach(() => {
          util = createUtilWithStandardIssues({swimlane: 'fix-version'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

        });
        it ('None', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task'}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'F-10', name: 'F-10', issues: ['ONE-1', 'ONE-2']},
                  {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-3']},
                  {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-4', 'ONE-6']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('One', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', 'fix-versions': ['F-10']}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'F-10', name: 'F-10', issues: ['ONE-1', 'ONE-2', 'ONE-6']},
                  {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-3']},
                  {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-4']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('Several', () => {
          util
            .issueChanges({new:
              [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', 'fix-versions': ['F-10', 'F-20']}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'F-10', name: 'F-10', issues: ['ONE-1', 'ONE-2', 'ONE-6']},
                  {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-3', 'ONE-6']},
                  {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-4']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
      });

      describe('Labels', () => {
        let originalState: IssueTable;
        let util: IssueTableObservableUtil;
        beforeEach(() => {
          util = createUtilWithStandardIssues({swimlane: 'label'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

        });
        it ('None', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task'}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3']},
                  {key: 'L-20', name: 'L-20', issues: ['ONE-2', 'ONE-4']},
                  {key: 'L-30', name: 'L-30', issues: ['ONE-2', 'ONE-5']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-1', 'ONE-6']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('One', () => {
          util
            .issueChanges({new: [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', labels: ['L-10']}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3', 'ONE-6']},
                  {key: 'L-20', name: 'L-20', issues: ['ONE-2', 'ONE-4']},
                  {key: 'L-30', name: 'L-30', issues: ['ONE-2', 'ONE-5']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-1']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('Several', () => {
          util
            .issueChanges({new:
              [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', labels: ['L-10', 'L-20']}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3', 'ONE-6']},
                  {key: 'L-20', name: 'L-20', issues: ['ONE-2', 'ONE-4', 'ONE-6']},
                  {key: 'L-30', name: 'L-30', issues: ['ONE-2', 'ONE-5']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-1']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
      });
      describe('CustomField', () => {
        let originalState: IssueTable;
        let util: IssueTableObservableUtil;
        beforeEach(() => {
          util = createUtilWithStandardIssues({swimlane: 'Custom-2'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

        });
        it ('None', () => {
          util
            .issueChanges({new:
              [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task'}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'c2-A', name: 'First C2', issues: ['ONE-1', 'ONE-2', 'ONE-3']},
                  {key: 'c2-B', name: 'Second C2', issues: ['ONE-4']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-5', 'ONE-6']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('Set', () => {
          util
            .issueChanges({new:
              [{key: 'ONE-6', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', custom: {'Custom-2': 'c2-B'}}]})
            .rankChanges({ONE: [{index: 5, key: 'ONE-6'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3', 'ONE-6'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'c2-A', name: 'First C2', issues: ['ONE-1', 'ONE-2', 'ONE-3']},
                  {key: 'c2-B', name: 'Second C2', issues: ['ONE-4', 'ONE-6']},
                  {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
      });

    });

    describe('Update Issue', () => {
      describe('Remain in same swimlane', () => {
        it ('Change state', () => {
          let originalState: IssueTable;
          const util: IssueTableObservableUtil = createUtilWithStandardIssues({swimlane: 'issue-type'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);
          util
            .issueChanges({update: [{key: 'ONE-1',  state: '1-3'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], ['ONE-1']], [])
                .setSwimlanes([
                  {key: 'task', name: 'task', issues: ['ONE-2', 'ONE-4']},
                  {key: 'bug', name: 'bug', issues: ['ONE-1', 'ONE-3', 'ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('Change rank - not affecting states or swimlanes', () => {
          let originalState: IssueTable;
          const util: IssueTableObservableUtil = createUtilWithStandardIssues({swimlane: 'issue-type'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);
          util
            .rankChanges({ONE: [{index: 4, key: 'ONE-3'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'task', name: 'task', issues: ['ONE-2', 'ONE-4']},
                  {key: 'bug', name: 'bug', issues: ['ONE-1', 'ONE-3', 'ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        it ('Delete issue', () => {
          let originalState: IssueTable;
          const util: IssueTableObservableUtil = createUtilWithStandardIssues({swimlane: 'issue-type'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);
          util
            .issueChanges({delete: ['ONE-5']})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4'], []], [])
                .setSwimlanes([
                  {key: 'task', name: 'task', issues: ['ONE-2', 'ONE-4']},
                  {key: 'bug', name: 'bug', issues: ['ONE-1', 'ONE-3']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
      });

      describe('Change swimlane', () => {
        // Don't do project since a move there is basically a delete and an add which we test elsew

        it ('Issue Type', () => {
          let originalState: IssueTable;
          const util: IssueTableObservableUtil = createUtilWithStandardIssues({swimlane: 'issue-type'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);
          util
            .issueChanges({update: [{key: 'ONE-1', type: 'task'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'task', name: 'task', issues: ['ONE-1', 'ONE-2', 'ONE-4']},
                  {key: 'bug', name: 'bug', issues: ['ONE-3', 'ONE-5']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });

        it ('Priority', () => {
          let originalState: IssueTable;
          const util: IssueTableObservableUtil = createUtilWithStandardIssues({swimlane: 'priority'});
          util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);
          util
            .issueChanges({update: [{key: 'ONE-2', priority: 'Blocker'}]})
            .emitBoardChange()
            .tableObserver().take(1).subscribe(
            issueTable => {
              new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                .setSwimlanes([
                  {key: 'Blocker', name: 'Blocker', issues: ['ONE-1', 'ONE-2', 'ONE-3', 'ONE-5']},
                  {key: 'Major', name: 'Major', issues: ['ONE-4']}])
                .checkTable(issueTable);
              // TODO check equality of not changed swimlanes and columns
            });
        });
        describe('Assignee', () => {
          let originalState: IssueTable;
          let util: IssueTableObservableUtil;
          beforeEach(() => {
            util = createUtilWithStandardIssues({swimlane: 'assignee'});
            util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

          });
          it ('None', () => {
            util
              .issueChanges({update: [{key: 'ONE-1', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', unassigned: true}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'bob', name: 'Bob Brent Barlow', issues: ['ONE-3']},
                    {key: 'kabir', name: 'Kabir Khan', issues: ['ONE-4']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-1', 'ONE-2', 'ONE-5']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('Set', () => {
            util
              .issueChanges({update: [{key: 'ONE-2', assignee: 'bob'}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'bob', name: 'Bob Brent Barlow', issues: ['ONE-2', 'ONE-3']},
                    {key: 'kabir', name: 'Kabir Khan', issues: ['ONE-1', 'ONE-4']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
        });
        describe('Components', () => {
          let originalState: IssueTable;
          let util: IssueTableObservableUtil;
          beforeEach(() => {
            util = createUtilWithStandardIssues({swimlane: 'component'});
            util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

          });
          it ('None', () => {
            util
              .issueChanges({update: [{key: 'ONE-4', 'clear-components': true}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'C-10', name: 'C-10', issues: ['ONE-1']},
                    {key: 'C-20', name: 'C-20', issues: ['ONE-2']},
                    {key: 'C-30', name: 'C-30', issues: ['ONE-3']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-4', 'ONE-5']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('One', () => {
            util
              .issueChanges({update: [{key: 'ONE-3', components: ['C-10']}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-3', 'ONE-4']},
                    {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-4']},
                    {key: 'C-30', name: 'C-30', issues: ['ONE-4']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('Several', () => {
            util
              .issueChanges({update:
                [{key: 'ONE-3', components: ['C-10', 'C-20']}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-3', 'ONE-4']},
                    {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-3', 'ONE-4']},
                    {key: 'C-30', name: 'C-30', issues: ['ONE-4']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
        });
        describe('Fix Versions', () => {
          let originalState: IssueTable;
          let util: IssueTableObservableUtil;
          beforeEach(() => {
            util = createUtilWithStandardIssues({swimlane: 'fix-version'});
            util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

          });
          it ('None', () => {
            util
              .issueChanges({update: [{key: 'ONE-2', 'clear-fix-versions': true}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'F-10', name: 'F-10', issues: ['ONE-1']},
                    {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-3']},
                    {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-2', 'ONE-4']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('One', () => {
            util
              .issueChanges({update:
                [{key: 'ONE-2', state: '1-1', summary: 'Test', priority: 'Major', type: 'task', 'fix-versions': ['F-20']}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'F-10', name: 'F-10', issues: ['ONE-1']},
                    {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-2', 'ONE-3']},
                    {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-4']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('Several', () => {
            util
              .issueChanges({update:
                [{key: 'ONE-2', 'fix-versions': ['F-10', 'F-20']}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'F-10', name: 'F-10', issues: ['ONE-1', 'ONE-2']},
                    {key: 'F-20', name: 'F-20', issues: ['ONE-1', 'ONE-2', 'ONE-3']},
                    {key: 'F-30', name: 'F-30', issues: ['ONE-1', 'ONE-5']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-4']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
        });
        describe('Labels', () => {
          let originalState: IssueTable;
          let util: IssueTableObservableUtil;
          beforeEach(() => {
            util = createUtilWithStandardIssues({swimlane: 'label'});
            util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

          });
          it ('None', () => {
            util
              .issueChanges({update: [{key: 'ONE-4', 'clear-labels': true}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3']},
                    {key: 'L-20', name: 'L-20', issues: ['ONE-2']},
                    {key: 'L-30', name: 'L-30', issues: ['ONE-2', 'ONE-5']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-1', 'ONE-4']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('One', () => {
            util
              .issueChanges({update: [{key: 'ONE-4', labels: ['L-10']}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3', 'ONE-4']},
                    {key: 'L-20', name: 'L-20', issues: ['ONE-2']},
                    {key: 'L-30', name: 'L-30', issues: ['ONE-2', 'ONE-5']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-1']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('Several', () => {
            util
              .issueChanges({update:
                [{key: 'ONE-5', labels: ['L-10', 'L-20']}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'L-10', name: 'L-10', issues: ['ONE-2', 'ONE-3', 'ONE-5']},
                    {key: 'L-20', name: 'L-20', issues: ['ONE-2', 'ONE-4', 'ONE-5']},
                    {key: 'L-30', name: 'L-30', issues: ['ONE-2']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-1']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
        });
        describe('CustomField', () => {
          let originalState: IssueTable;
          let util: IssueTableObservableUtil;
          beforeEach(() => {
            util = createUtilWithStandardIssues({swimlane: 'Custom-2'});
            util.tableObserver().take(1).subscribe(issueTable => originalState = issueTable);

          });
          it ('None', () => {
            util
              .issueChanges({update: [{key: 'ONE-2', custom: {'Custom-2': null}}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'c2-A', name: 'First C2', issues: ['ONE-1', 'ONE-3']},
                    {key: 'c2-B', name: 'Second C2', issues: ['ONE-4']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-2', 'ONE-5']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
          it ('Set', () => {
            util
              .issueChanges({update:
                [{key: 'ONE-3', custom: {'Custom-2': 'c2-B'}}]})
              .emitBoardChange()
              .tableObserver().take(1).subscribe(
              issueTable => {
                new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
                  .setSwimlanes([
                    {key: 'c2-A', name: 'First C2', issues: ['ONE-1', 'ONE-2']},
                    {key: 'c2-B', name: 'Second C2', issues: ['ONE-4', 'ONE-3']},
                    {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
                  .checkTable(issueTable);
                // TODO check equality of not changed swimlanes and columns
              });
          });
        });
      });
    });

    // TODO Filter swimlanes
    // TODO Some tests of changing when swimlane is theres


    function createUtilWithStandardIssues(params: Dictionary<string>): IssueTableObservableUtil {
      return createUtil(params, {'ONE': [1, 2, 3, 4, 5]},
        new SwimlaneIssueFactory()
          .addIssue('ONE-1', 0,
            {components: [0], 'fix-versions': [0, 1, 2], custom: {'Custom-2': 0}})
          .addIssue('ONE-2', 0,
            {components: [1], 'fix-versions': [0], labels: [0, 1, 2], custom: {'Custom-2': 0}})
          .addIssue('ONE-3', 0,
            {components: [2], 'fix-versions': [1], labels: [0], custom: {'Custom-2': 0}})
          .addIssue('ONE-4', 1, {components: [0, 1, 2], labels: [1], custom: {'Custom-2': 1}})
          .addIssue('ONE-5', 1, {'fix-versions': [2], labels: [2]})
      );
    }

    function createUtil(params: Dictionary<string>, ranks: Dictionary<number[]>,
                        issueFactory: SwimlaneIssueFactory): IssueTableObservableUtil {
      const util: IssueTableObservableUtil = new IssueTableObservableUtil('ONE', issueFactory, 3, params);
      for (const key of Object.keys(ranks)) {
        util.setRank(key, ...ranks[key]);
      }
      util
        .mapState('ONE', 'S-1', '1-1')
        .mapState('ONE', 'S-2', '1-2')
        .mapState('ONE', 'S-3', '1-3')
        .mapState('TWO', 'S-2', '2-1')
        .mapState('TWO', 'S-3', '2-2')
      util.emitBoardChange();
      return util;
    }
  });
});

class IssueTableChecker {
  private _expectedSwimlanes: SwimlaneCheck[];
  constructor(private _expectedTable: string[][], private _expectedInvisible: string[]) {
  }

  setTable(table: string[][]): IssueTableChecker {
    this._expectedTable = table;
    return this;
  }

  setInvisible(invisible: string[]): IssueTableChecker {
    this._expectedInvisible = invisible;
    return this;
  }

  setSwimlanes(swimlanes: SwimlaneCheck[]): IssueTableChecker {
    this._expectedSwimlanes = swimlanes;
    return this;
  }

  checkTable(issueTable: IssueTable) {
    const actualTable: string[][] = [];
    issueTable.table.forEach((v, i) => {
      actualTable.push(issueTable.table.get(i).toArray());
    });
    expect(actualTable).toEqual(this._expectedTable);

    // Check the size of the issues map
    expect(issueTable.issues.size).toBe(this._expectedTable.map(issues => issues.length).reduce((s, c) => s + c));

    // Check issue visibilities
    const invisibleKeys: string[] =
      issueTable.issues.filter(issue => !issue.visible).keySeq().toArray().sort((a, b) => a.localeCompare(b));
    expect(invisibleKeys).toEqual(this._expectedInvisible.sort((a, b) => a.localeCompare(b)));

    // Check issue counts
    const invisibleSet: Set<string> = Set<string>(this._expectedInvisible);
    const visibleIssueCounts: number[] = new Array<number>(this._expectedTable.length);
    for (let i = 0 ; i < this._expectedTable.length ; i++) {
      visibleIssueCounts[i] = this._expectedTable[i].reduce((s, v, ind, arr) => {
        return invisibleSet.contains(arr[ind]) ? s : s + 1;
      }, 0);
    }
    expect(issueTable.visibleIssueCounts.toArray()).toEqual(visibleIssueCounts);

    if (!this._expectedSwimlanes) {
      expect(issueTable.swimlaneInfo).toBeFalsy();
    } else {
      expect(issueTable.swimlaneInfo).toBeTruthy();
      this.checkSwimlanes(issueTable);
    }
  }

  private checkSwimlanes(issueTable: IssueTable) {
    const slInfo: SwimlaneInfo = issueTable.swimlaneInfo;
    // Check the names and keys are as expected
    expect(slInfo.swimlanes.size).toBe(this._expectedSwimlanes.length);
    expect(slInfo.swimlanes.keySeq().toArray()).toEqual(this._expectedSwimlanes.map(sl => sl.key));
    expect(slInfo.swimlanes.map(sd => sd.display).toArray()).toEqual(this._expectedSwimlanes.map(sl => sl.name));

    for (const check of this._expectedSwimlanes) {
      const checkIssueSet: Set<string> = Set<string>(check.issues);
      const sl: SwimlaneData = slInfo.swimlanes.get(check.key);

      const expectedTable: string[][] = [];
      issueTable.table.forEach((v, i) => {
        expectedTable.push(issueTable.table.get(i).toArray().filter(key =>  checkIssueSet.contains(key)));
      });
      const actualTable: string[][] = [];
      sl.table.forEach((v, i) => {
        actualTable.push(sl.table.get(i).toArray());
      });
      expect(actualTable).toEqual(expectedTable);
      expect(sl.visibleIssues).toBe(check.issues.reduce((s, key) => issueTable.issues.get(key).visible ? s + 1 : s, 0));
    }
  }
}

interface SwimlaneCheck {
  key: string,
  name: string,
  issues: string[]
}

function checkSameColumns(oldState: IssueTable, newState: IssueTable, ...cols: number[]) {
  const expectedEqual: OrderedSet<number> = OrderedSet<number>(cols);
  expect(oldState.table.size).toBe(newState.table.size);
  for (let i = 0 ; i < oldState.table.size ; i++) {
    const oldCol: List<string> = oldState.table.get(i);
    const newCol: List<string> = newState.table.get(i);
    if (expectedEqual.contains(i)) {
      expect(oldCol).toBe(newCol, 'Column ' + i);
    } else {
      expect(oldCol).not.toBe(newCol, 'Column ' + i);
    }
  }
}

class SwimlaneIssueFactory implements IssuesFactory {
  _issues: Dictionary<any>;

  clear() {
    this._issues = null;
  }

  addIssue(key: string, state: number, data?: any): SwimlaneIssueFactory {
    if (!this._issues) {
      this._issues = {};
    }
    this._issues[key] = !data ? {} : data;
    this._issues[key]['state'] = state;
    return this;
  }

  createIssueStateInput(params: DeserializeIssueLookupParams): any {
    const input: any = {};
    for (const key of Object.keys(this._issues)) {
      const id = Number(key.substr(key.indexOf('-') + 1));
      const assignee: number = id % 3 === 2 ? null : id % 3;
      const isssue = {
        key: key,
        type: id % 2,
        priority: (id + 1) % 2,
        assignee: assignee
      };

      const data: any = this._issues[key];
      for (const override of Object.keys(data)) {
        isssue[override] = data[override]
      }

      input[key] = isssue;
    }

    return input;
  }
}


