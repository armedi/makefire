function normalizePath(path) {
  if (path.startsWith('/')) path = path.substring(1)
  if (path.endsWith('/')) path = path.substring(0, path.length - 1)
  return path
}

export default class Firestore {
  constructor(db) {
    this.db = db
    this.subscriptions = {}
  }

  subscribeDoc(path, subscriber) {
    path = normalizePath(path)
    let subscription = this.subscriptions[path]
    if (subscription) {
      subscription.subscribers.push(subscriber)
      subscriber(subscription.state)
    } else {
      this.subscriptions[path] = {
        state: {
          data: null,
          loading: true,
          error: null
        },
        unsubscribe: this.db.doc(path).onSnapshot(doc => {
          const state = {
            data: Object.assign({ id: doc.id }, doc.data()),
            loading: false,
            error: null
          }
          this.subscriptions[path].state = state
          this.subscriptions[path].subscribers.forEach(subscriber => {
            subscriber(state)
          })
        }),
        subscribers: [subscriber],
      }
    }
  }

  subscribeCollection(...args) {
    const path = normalizePath(args[0])
    const queries = (args.length > 2 && Array.isArray(args[1])) ? args[1] : []
    const subscriber = args[args.length - 1]

    let subscription = this.subscriptions[path]
    if (subscription) {
      subscription.subscribers.push(subscriber)
      subscriber(subscription.state)
    } else {
      let ref = this.db.collection(path)
      for (let query of queries) {
        ref = ref.where(...query)
      }
      this.subscriptions[path] = {
        state: {
          data: [],
          loading: true,
          error: null
        },
        unsubscribe: ref.onSnapshot(querySnapshot => {
          let data = []
          querySnapshot.forEach(doc => {
            data.push(Object.assign({ id: doc.id }, doc.data()))
          })
          const state = {
            data,
            loading: false,
            error: null
          }
          this.subscriptions[path].state = state
          this.subscriptions[path].subscribers.forEach(subscriber => {
            subscriber(state)
          })
        }),
        subscribers: [subscriber],
      }
    }
  }

  unsubscribe(path, subscriber) {
    path = normalizePath(path)
    const subcsription = this.subscriptions[path]
    if (!subcsription) return

    const index = subcsription.subscribers.findIndex(e => e === subscriber)
    subcsription.subscribers.splice(index, 1)
    if (subcsription.subscribers.length === 0) {
      subcsription.unsubscribe()
      delete this.subscriptions[path]
    }
  }

  unsubscribeDoc(path, subscriber) {
    this.unsubscribe(path, subscriber)
  }

  unsubscribeCollection(path, subscriber) {
    this.unsubscribe(path, subscriber)
  }
}
