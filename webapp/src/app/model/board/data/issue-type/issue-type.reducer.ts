import {AppState} from '../../../../app-store';
import {Action, createSelector} from '@ngrx/store';
import {initialIssueTypeState, IssueType, IssueTypeState, IssueTypeUtil} from './issue-type.model';
import {equalObjects} from '../../../../common/object-util';


const DESERIALIZE_ALL_ISSUE_TYPES = 'DESERIALIZE_ALL_ISSUE_TYPES';

class DeserializeIssueTypesAction implements Action {
  readonly type = DESERIALIZE_ALL_ISSUE_TYPES;

  constructor(readonly payload: IssueType[]) {
  }
}

export class IssueTypeActions {
  static createDeserializeIssueTypes(input: any): Action {
    const inputArray: any[] = input ? input : [];
    const issueTypes = new Array<IssueType>(inputArray.length);
    inputArray.forEach((type, i) => {
      issueTypes[i] = IssueTypeUtil.fromJS(type);
    });

    return new DeserializeIssueTypesAction(issueTypes);
  }
}


// 'meta-reducer here means it is not called directly by the store, rather from the boardReducer
export function issueTypeMetaReducer(state: IssueTypeState = initialIssueTypeState, action: Action): IssueTypeState {

  switch (action.type) {
    case DESERIALIZE_ALL_ISSUE_TYPES: {
      const payload: IssueType[] = (<DeserializeIssueTypesAction>action).payload;
      let types = state.types;
      types = types.withMutations(mutable => {
        for (const type of payload) {
          if (!equalObjects(mutable.get(type.name), type))
          mutable.set(type.name, type);
        }
      });
      return IssueTypeUtil.withMutations(state, mutable => {
        if (!mutable.types.equals(types)) {
          mutable.types = types;
        }
      });
    }
    default:
      return state;
  }
};

const getIssueTypesState = (state: AppState) => state.board.issueTypes;
const getTypes = (state: IssueTypeState) => state.types;
export const issuesTypesSelector = createSelector(getIssueTypesState, getTypes);

