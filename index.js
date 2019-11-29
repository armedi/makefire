import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import "firebase/firestore";

export default function makeFire(config) {
  firebase.initializeApp(config)
  const db = firebase.firestore()

  function useDocument(path) {
    const [dbState, setDbState] = useState({ data: null, loading: true, error: null })

    useEffect(() => {
      try {
        db.doc(path).onSnapshot(doc => {
          setDbState({
            data: doc.data(),
            loading: false,
            error: null
          })
        })
      } catch (error) {
        setDbState({
          ...dbState,
          loading: false,
          error
        })
      }
    }, [])
    return dbState
  }

  function useCollection(path, queries) {
    const [dbState, setDbState] = useState({ data: [], loading: true, error: null })

    useEffect(() => {
      try {
        let ref = db.collection(path)
        for (let query of queries) {
          ref = ref.where(...query)
        }
        ref.onSnapshot(querySnapshot => {
          let data = []
          querySnapshot.forEach(doc => data.push(doc.data()))
          setDbState({
            data,
            loading: false,
            error: null
          })
        })
      } catch (error) {
        setDbState({
          ...dbState,
          loading: false,
          error
        })
      }
    }, [])
    return dbState
  }

  return { useDocument, useCollection }
}