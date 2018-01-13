import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {OrderedMap} from 'immutable';
import {freezeObject} from '../../../../common/object-util';

export interface AssigneeState {
  assignees: OrderedMap<string, Assignee>;
}

export interface Assignee {
  key: string;
  email: string;
  avatar: string;
  name: string;
  initials: string;
}

const DEFAULT_STATE: AssigneeState = {
  assignees: OrderedMap<string, Assignee>()
};

export interface AssigneeStateRecord extends TypedRecord<AssigneeStateRecord>, AssigneeState {
}

const STATE_FACTORY = makeTypedFactory<AssigneeState, AssigneeStateRecord>(DEFAULT_STATE);
const assigneeStateCaster: AssigneeStateRecord = STATE_FACTORY(DEFAULT_STATE);
export const initialAssigneeState: AssigneeState = assigneeStateCaster;

export const NO_ASSIGNEE: Assignee = freezeObject({
  key: '_____N$O$N$E____',
  email: '-',
  avatar: null,
  name: 'None',
  initials: '-'
});

export class AssigneeUtil {

  static fromJS(input: any): Assignee {
    const assignee: Assignee = {...<Assignee>input, initials: AssigneeUtil.calculateInitials(input['name'])};
    return freezeObject(assignee);
  }

  static withMutations(s: AssigneeState, mutate: (mutable: AssigneeState) => any): AssigneeState {
    return (<AssigneeStateRecord>s).withMutations(mutable => {
      mutate(mutable);
    });
  }

  private static calculateInitials(name: string): string {

    const arr: string[] = name.split(' ');
    let ret = '';
    if (arr.length === 1) {
      for (let i = 0; i < 3 && i < arr[0].length; i++) {
        let char: string = arr[0][i];
        if (i === 0) {
          char = char.toUpperCase();
        } else {
          char = char.toLowerCase();
        }
        ret = ret + char;
      }
      return ret;
    }
    ret = '';
    for (let i = 0; i < 3 && i < arr.length; i++) {
      ret = ret + arr[i][0];
    }
    return ret.toUpperCase();
  }
};


