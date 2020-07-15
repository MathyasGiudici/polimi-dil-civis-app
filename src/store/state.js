// Default state object
export function getDefaultState() {
  var isTest = true;
  var ip = isTest ? 'http://localhost:8080/api/' : 'https://polimi-dil-civis.herokuapp.com/api/';
  return {
    endpoint: ip,
    session: {
      token: '',
      user: ''
    },
    // Anything in the 'blob' will be stored in the state
    // but not saved in the AsyncStorage
    blob : {
      home: [],
      recommended: [],
    }
  };
};
