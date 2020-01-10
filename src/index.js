import { useState, useEffect } from 'react'

import Firestore from './Firestore'


export default function makefire(firestoreDb) {
  const db = new Firestore(firestoreDb)

  function useDocument(path) {
    const [dbState, setDbState] = useState({ data: null, loading: true, error: null })
    useEffect(() => {
      try {
        db.subscribeDoc(path, setDbState)
      } catch (error) {
        setDbState({ data: null, loading: false, error })
      }
      return () => db.unsubscribeDoc(path, setDbState)
    }, [])

    return dbState
  }

  function useCollection(path, queries) {
    const [dbState, setDbState] = useState({ data: [], loading: true, error: null })
    useEffect(() => {
      try {
        db.subscribeCollection(path, queries, setDbState)
      } catch (error) {
        setDbState({ data: [], loading: false, error })
      }
      return () => db.unsubscribeCollection(path, setDbState)
    }, [])

    return dbState
  }

  return { useDocument, useCollection }
}