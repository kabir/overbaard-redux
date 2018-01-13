import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {OrderedMap} from 'immutable';
import {freezeObject} from '../../../../common/object-util';


export interface PriorityState {
  priorities: OrderedMap<string, Priority>;
}

export interface Priority {
  name: string;
  colour: string;
}

const DEFAULT_STATE: PriorityState = {
  priorities: OrderedMap<string, Priority>()
};

interface PriorityStateRecord extends TypedRecord<PriorityStateRecord>, PriorityState {
}

const STATE_FACTORY = makeTypedFactory<PriorityState, PriorityStateRecord>(DEFAULT_STATE);
export const initialPriorityState: PriorityState = STATE_FACTORY(DEFAULT_STATE);

export class PriorityUtil {
  static fromJS(input: any): Priority {
    return freezeObject(<Priority>input);
  }

  static withMutations(s: PriorityState, mutate: (mutable: PriorityState) => any): PriorityState {
    return (<PriorityStateRecord>s).withMutations(mutable => {
      mutate(mutable);
    });
  }
};

