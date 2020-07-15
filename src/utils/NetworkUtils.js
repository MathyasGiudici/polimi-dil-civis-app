// Import store manager
import store from '../store';

// Function to create a timer to not create possible infinite request
function timerPromise() {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};

function isResponseReadable(response) {
  if(response == 'End Race' || response == 'Connection problems')
    return false;
  else
    return true;
}

async function getHome() {
  // Creating variables
  var endpoint = store.state.endpoint + 'article/home';
  var params = { method: "get", headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

  // Promise to handle the request
  var promise = Promise.race([timerPromise(),
    fetch(endpoint,params).then( response => response.json() ).catch((error) => {
        return 'Connection problems';
      })
  ]);

  var home = await promise;

  if(!isResponseReadable(home))
    return;

  // Storing the result
  store.commit('blobMutation', {key:'home', value: home });
}

async function postLogin(loginObj){
  if(loginObj == null || loginObj.email == '' || loginObj.password == '')
    return {status:false, session: {}};

  // Creating variables
  var endpoint = store.state.endpoint + 'user/login';
  var params = { method: "post", headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginObj)};

  // Promise to handle the request
  var promise = Promise.race([timerPromise(),
    fetch(endpoint,params).then( response => response.json() ).catch((error) => {
        return 'Connection problems';
      })
  ]);

  var session = await promise;

  if(!isResponseReadable(session))
    return {status:false, session: {}};

  return {status:true, session: session};
}

export {timerPromise, isResponseReadable, getHome, postLogin};
