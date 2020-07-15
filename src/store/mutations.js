// Import for manage the local storage
import * as storageHandler from './storageHandler'

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
  session.user.profilePic = { uri: session.user.profilePic };
  state.session = session;
}

export function loginMutation(state, login){
  state.login = login;
}

export function blobMutation(state, {key, value}){
  state.blob[key] = value;
}
