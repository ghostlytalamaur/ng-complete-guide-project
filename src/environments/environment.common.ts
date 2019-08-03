const API_KEY = 'AIzaSyBrVa7gZgOU1okS3wVLUiC38_LWrrog1IE';
export const environment = {
  firebase: {
    endpoint: 'https://ng-complete-guide-projec-84903.firebaseio.com',
    apiKey: API_KEY,
    signUpEndpoint: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    signInEndpoint: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
  }
};
