import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyATcw_Hc6MgMfsv3dkdifwUFZOC3Isf5fo",
  authDomain: "scrumflow-af1fd.firebaseapp.com",
  projectId: "scrumflow-af1fd",
  storageBucket: "scrumflow-af1fd.firebasestorage.app",
  messagingSenderId: "683931020360",
  appId: "1:683931020360:web:b577323f7ce80263f7fc7d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Request additional scopes for profile info
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app;
