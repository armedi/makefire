# makefire

This is a simple React hooks for google cloud firestore database.


### Requirements

1. Create a firebase project in [firebase console](https://console.firebase.google.com/)
2. Obtain firebase configuration for the project. You can find how to get the configuration on [this link](https://support.google.com/firebase/answer/7015592)


## Installation

```bash
npm install makefire
```

## Usage

Create `useDocument` and `useCollection` hooks with `makefire`

```javascript
import makefire from 'makefire'

const firebaseConfiguration = {
  apiKey: '### FIREBASE API KEY ###',
  authDomain: '### FIREBASE AUTH DOMAIN ###',
  projectId: '### CLOUD FIRESTORE PROJECT ID ###'
});

const { useDocument, useCollection } = makefire(firebaseConfiguration)
```

Now you can use them on your components. Insert the path for the collection or document in database as the first argument for the hooks.

```javascript
function CoolComponent(props) {
  // subscribing to document 'bob' in 'users' collection
  const { data, loading, error } = useDocument('users/bob')

  // subscribing to 'users' collection
  const { data, loading, error } = useCollection('users')

  // subscribing to 'users' collection with additional queries
  const { data, loading, error } = useCollection('users', [['age', '>=', 21], ['location', '==', 'Jakarta']])
  
  ...
  );
}

```