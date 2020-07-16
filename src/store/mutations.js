// Import for manage the local storage
import * as storageHandler from './storageHandler';
import {getDefaultState} from './state';

// Local state functions
export function RESTORE (state){
  storageHandler.retrieveData();
}

export function SAVE (state){
  storageHandler.storeData(state);
}

export function DELETE(state){
  storageHandler.deleteDate();
}

export function REPLACE(state, obj){
  Object.keys(obj).forEach((item, i) => {
    state[item] = obj[item];
  });
}

export function sessionMutation(state, session){
  state.session = session;
}

export function sessionClean(state){
  state.session = getDefaultState().session;
}

export function loginMutation(state, login){
  state.login = login;
}

export function blobMutation(state, {key, value}){
  state.blob[key] = value;
}
