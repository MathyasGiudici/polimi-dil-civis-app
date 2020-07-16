// Default state object
export function getDefaultState() {
  var isTest = true;
  var ip = isTest ? 'http://localhost:8080/' : 'https://polimi-dil-civis.herokuapp.com/';
  return {
    baseUrl: ip,
    endpoint: ip + 'api/',
    session: {
      token: '',
      user: {
        email : '',
        name : '',
        surname : '',
        password : '',
        gender : '',
        birthday : '',
        country: '',
        phone: '',
        profilePic: '',
        level: '',
        premium: false
      }
    },
    login: {
      email: 'cesare@email.it',
      password: 'passwordSegret@123',
    },
    // Anything in the 'blob' will be stored in the state
    // but not saved in the AsyncStorage
    blob : {
      home: [],
    }
  };
};
