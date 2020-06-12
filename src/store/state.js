// Default state object
export function getDefaultState() {
  return {
    user: {
      token: '',
      email: ''
    },
    // Anything in the 'blob' will be stored in the state 
    // but not saved in the AsyncStorage
    // blob : {
    //
    // }
  };
};
