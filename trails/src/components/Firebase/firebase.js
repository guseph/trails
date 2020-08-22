import app, { firestore } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/functions'
import 'firebase/storage'
import 'firebase/analytics'
import 'firebase/firestore' // added to KC's version bc there was an error

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
  }

  // AUTH
  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

  // DATABASE
  docRef = path => {
    if (!path) return undefined
    return this.db.doc(path)
  }
  setDoc = async (path, additions) => {
    const ref = this.docRef(path)
    if (!ref) return {}
    await ref.set(additions, {merge: true})
    return ref
  }
  updateDoc = async (path, additions) => {
    const ref = this.docRef(path)
    if (!ref) return {}
    await ref.update(additions)
    return ref
  }
  deleteDoc = async (path) => {
    const ref = this.docRef(path)
    if (!ref) return {}
    await ref.delete()
    return ref
  }
  getDoc = (path) => {
    const ref = this.docRef(path)
    if (!ref) return {}
    return ref.get()
  }
  addDoc = (path, additions) => {
    return this.db.collection(path).add(additions)
  }
  getCol = (path, queryAdditions = (q => q)) => {
    return queryAdditions(this.db.collection(path)).get()
  }
  watchDoc = (path, callback, options = {includeMetadataChanges: false}) => {
    const ref = this.docRef(path)
    if (!ref) return undefined

    return ref.onSnapshot(options, callback)
  }
  watchCol = (path, queryAdditions = (q => q), callback, options = {includeMetadataChanges: false}) => {
    const ref = this.docRef(path)
    if (!ref) return undefined

    return queryAdditions(this.db.collection(path)).onSnapshot(options, callback)
  }
  runTransaction = (...args) => this.db.runTransaction(...args)
}

export default Firebase
