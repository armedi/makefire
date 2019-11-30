import { useState, useEffect } from 'react'
import * as firebase from 'firebase/app'
import "firebase/firestore";

function normalizePath(path) {
  if (path.startsWith('/')) path = path.substring(1)
  if (path.endsWith('/')) path = path.substring(0, -1)
  return path
}

export default function makeFire(config) {
  firebase.initializeApp(config)
  const db = firebase.firestore()

  function useDocument(path) {
    const [dbState, setDbState] = useState({ data: null, loading: true, error: null })

    useEffect(() => {
      try {
        return db.doc(normalizePath(path)).onSnapshot(doc => {
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
        let ref = db.collection(normalizePath(path))
        for (let query of queries) {
          ref = ref.where(...query)
        }
        return ref.onSnapshot(querySnapshot => {
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