/// <reference path="../../../../common/immutable-matcher.spec.d.ts"/>
import {immutableMatcher} from '../../../../common/immutable-matcher.spec';
import {cloneObject} from '../../../../common/object-util';
import {BlacklistState, initialBlacklistState} from './blacklist.model';
import {BlacklistActions, blacklistMetaReducer} from './blacklist.reducer';

export function getTestBlacklistInput() {
  return cloneObject({
    states: [
      'State1', 'State2'
    ],
    priorities: [
      'Priority1', 'Priority2'
    ],
    'issue-types': [
      'Type1', 'Type2'
    ],
    issues: [
      'BAD-1',
      'BAD-2'
    ]
  });
}
describe('Blacklist reducer tests', () => {
  beforeEach(() => {
    jasmine.addMatchers(immutableMatcher);
  });
  describe('Deserialize', () => {
    it('Deserialize initial state', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      expect(state.states.toArray()).toEqual(['State1', 'State2']);
      expect(state.priorities.toArray()).toEqual(['Priority1', 'Priority2']);
      expect(state.issueTypes.toArray()).toEqual(['Type1', 'Type2']);
      expect(state.issues.toArray()).toEqual(['BAD-1', 'BAD-2']);
      expect(state).toBeImmutable();
    });

    it('Deserialize empty blacklist', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(null));
      expect(state.states.toArray()).toEqual([]);
      expect(state.priorities.toArray()).toEqual([]);
      expect(state.issueTypes.toArray()).toEqual([]);
      expect(state.issues.toArray()).toEqual([]);
      expect(state).toBeImmutable();
    });

    it ('Deserialize same state', () => {
      const stateA: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const stateB: BlacklistState =
        blacklistMetaReducer(stateA, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      expect(stateA).toBe(stateB);
    });
  });

  describe('Changes', () => {

    it ('Add states', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const newState: BlacklistState =
        blacklistMetaReducer(state, BlacklistActions.createChangeBlacklist({
          states: ['aState', 'zState']}));
      expect(newState.states.toArray()).toEqual(['aState', 'State1', 'State2', 'zState']);
      expect(newState.priorities.toArray()).toEqual(['Priority1', 'Priority2']);
      expect(newState.issueTypes.toArray()).toEqual(['Type1', 'Type2']);
      expect(newState.issues.toArray()).toEqual(['BAD-1', 'BAD-2']);
      expect(newState).toBeImmutable();
    });

    it ('Add priorities', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const newState: BlacklistState =
        blacklistMetaReducer(state, BlacklistActions.createChangeBlacklist({
          priorities: ['aPriority', 'zPriority']}));
      expect(newState.states.toArray()).toEqual(['State1', 'State2']);
      expect(newState.priorities.toArray()).toEqual(['aPriority', 'Priority1', 'Priority2', 'zPriority']);
      expect(newState.issueTypes.toArray()).toEqual(['Type1', 'Type2']);
      expect(newState.issues.toArray()).toEqual(['BAD-1', 'BAD-2']);
      expect(newState).toBeImmutable();
    });

    it ('Add issueTypes', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const newState: BlacklistState =
        blacklistMetaReducer(state, BlacklistActions.createChangeBlacklist({
          'issue-types': ['aType', 'zType']}));
      expect(newState.states.toArray()).toEqual(['State1', 'State2']);
      expect(newState.priorities.toArray()).toEqual(['Priority1', 'Priority2']);
      expect(newState.issueTypes.toArray()).toEqual(['aType', 'Type1', 'Type2', 'zType']);
      expect(newState.issues.toArray()).toEqual(['BAD-1', 'BAD-2']);
      expect(newState).toBeImmutable();
    });

    it ('Add issues', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const newState: BlacklistState =
        blacklistMetaReducer(state, BlacklistActions.createChangeBlacklist({
          issues: ['aIssue', 'zIssue']}));
      expect(newState.states.toArray()).toEqual(['State1', 'State2']);
      expect(newState.priorities.toArray()).toEqual(['Priority1', 'Priority2']);
      expect(newState.issueTypes.toArray()).toEqual(['Type1', 'Type2']);
      expect(newState.issues.toArray()).toEqual(['aIssue', 'BAD-1', 'BAD-2', 'zIssue']);
      expect(newState).toBeImmutable();
    });


    it ('Remove issues', () => {
      // Issues removed from the blacklist should be removed from the issue table if they exist (although this happens in another reducer)
      // This can happen if the change set includes adding the issue to the black list, and then the issue is deleted

      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const newState: BlacklistState =
        blacklistMetaReducer(state, BlacklistActions.createChangeBlacklist({
          'removed-issues': ['BAD-1']}));
      expect(newState.states.toArray()).toEqual(['State1', 'State2']);
      expect(newState.priorities.toArray()).toEqual(['Priority1', 'Priority2']);
      expect(newState.issueTypes.toArray()).toEqual(['Type1', 'Type2']);
      expect(newState.issues.toArray()).toEqual(['BAD-2']);
      expect(newState).toBeImmutable();
    });

    it ('Combine changes', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const newState: BlacklistState =
        blacklistMetaReducer(state, BlacklistActions.createChangeBlacklist({
          states: ['aState', 'zState'],
          priorities: ['aPriority', 'zPriority'],
          'issue-types': ['aType', 'zType'],
          issues: ['aIssue', 'zIssue'],
          'removed-issues': ['BAD-1', 'BAD-2']
        }));
      expect(newState.states.toArray()).toEqual(['aState', 'State1', 'State2', 'zState']);
      expect(newState.priorities.toArray()).toEqual(['aPriority', 'Priority1', 'Priority2', 'zPriority']);
      expect(newState.issueTypes.toArray()).toEqual(['aType', 'Type1', 'Type2', 'zType']);
      expect(newState.issues.toArray()).toEqual(['aIssue', 'zIssue']);
      expect(newState).toBeImmutable();
    });

    it ('No change', () => {
      const state: BlacklistState =
        blacklistMetaReducer(initialBlacklistState, BlacklistActions.createDeserializeBlacklist(getTestBlacklistInput()));
      const newState: BlacklistState = blacklistMetaReducer(state, BlacklistActions.createChangeBlacklist(null));
      expect(newState).toBe(state);
    });

  });
});


