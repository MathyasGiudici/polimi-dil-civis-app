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
  var endpoint = store.state.endpoint + 'article/home';
  var params = { method: "get", headers: { 'Authorization': 'Bearer ' + store.state.session.token }};

  var promise = Promise.race([timerPromise(),
    fetch(endpoint,params).then( response => response.json() ).catch((error) => {
        return 'Connection problems';
      })
  ]);

  var home = await promise;

  if(!isResponseReadable(home))
    return;

  store.commit('blobMutation', {key:'home', value: home });
}

export {timerPromise, isResponseReadable, getHome};
