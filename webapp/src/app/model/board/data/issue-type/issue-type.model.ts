import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {OrderedMap} from 'immutable';
import {freezeObject} from '../../../../common/object-util';

export interface IssueTypeState {
  types: OrderedMap<string, IssueType>;
}

export interface IssueType {
  name: string;
  colour: string;
}

const DEFAULT_STATE: IssueTypeState = {
  types: OrderedMap<string, IssueType>()
};

interface IssueTypeStateRecord extends TypedRecord<IssueTypeStateRecord>, IssueTypeState {
}

const STATE_FACTORY = makeTypedFactory<IssueTypeState, IssueTypeStateRecord>(DEFAULT_STATE);
export const initialIssueTypeState: IssueTypeState = STATE_FACTORY(DEFAULT_STATE);

export class IssueTypeUtil {
  static fromJS(input: any): IssueType {
    return freezeObject(<IssueType>input);
  }

  static withMutations(s: IssueTypeState, mutate: (mutable: IssueTypeState) => any): IssueTypeState {
    return (<IssueTypeStateRecord>s).withMutations(mutable => {
      mutate(mutable);
    });
  }
};


