import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {OrderedMap} from 'immutable';
import {freezeObject} from '../../../../common/object-util';


export interface CustomFieldState {
  fields: OrderedMap<string, OrderedMap<string, CustomField>>;
}

export interface CustomField {
  key: string;
  value: string;
}

const DEFAULT_STATE: CustomFieldState = {
  fields: OrderedMap<string, OrderedMap<string, CustomField>>()
};

interface CustomFieldStateRecord extends TypedRecord<CustomFieldStateRecord>, CustomFieldState {
}

interface CustomFieldRecord extends TypedRecord<CustomFieldRecord>, CustomField {
}

const STATE_FACTORY = makeTypedFactory<CustomFieldState, CustomFieldStateRecord>(DEFAULT_STATE);
export const initialCustomFieldState: CustomFieldState = STATE_FACTORY(DEFAULT_STATE);

export class CustomFieldUtil {
  static fromJs(input: any): CustomField {
      return freezeObject(<CustomField>input);
  }

  static withMutations(s: CustomFieldState, mutate: (mutable: CustomFieldState) => any): CustomFieldState {
    return (<CustomFieldStateRecord>s).withMutations(mutable => {
      mutate(mutable);
    });
  }
}

