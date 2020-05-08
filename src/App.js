import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  // useLocation
} from "react-router-dom";
import Practice from './Practice';
import * as api from './api';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/">
            <span role="img" aria-label="parrot emoji">🦜</span>
          </Link>
        </header>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/practice/:id">
            <Practice />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}


const AddSample = ({ handleCreated }) => {
  const history = useHistory();

  const goToCreated = (id) => {
    history.push('/practice/' + id);
  };

  const onInputChange = (event) => {
    const file = event.target.files[0]; 
    const toCommit = {
      title: file.name || 'untitled',
      description: 'TODO',
      blob: file,
    }
    api.saveMedia(toCommit).then(id => {
      handleCreated({
        ...toCommit,
        id        
      })
      goToCreated(id)
    })
  }
  return (
    <div>
      <h2>Upload some stuff to mimic</h2>
      <input
        accept="audio/*,video/*"
        id="sample"
        name="sample"
        type="file"
        onChange={onInputChange}
        style={{ width: '180px' }}
      />
    </div>
  );
}

function Home() {
  const [things, setThings] = React.useState([]);
  React.useEffect(() => {
    // TODO - fetch things
    api.loadAllMedia().then(result => {
      return setThings(result);
    });
  }, [])
  const addThing = (newlyCreated) => {
    setThings(ts => [newlyCreated, ...ts])
  }
  const removeSample = id => {
    setThings(ts => ts.filter(t => t.id !== id))
    api.removeMedia(id)
  }
  if (!things.length) {
    return <AddSample handleCreated={addThing} />;
  }
  return (
    <nav>
      <h1>Practice Some Squakin'</h1>
      <ul>
      {things.map((thing, i) => {
        return (
          <li key={i}>          
            <Link  className="App-link" to={"/practice/" + thing.id}>{thing.title}</Link>
            {' '}
            <button onClick={() => removeSample(thing.id)}>x</button>
          </li>
        );
      })}
      </ul>
      <AddSample handleCreated={addThing} />
    </nav>
  );
}

function NoMatch() {
  return <h1>Not Found! (You lost? Click the parrot)</h1>;
}

export default App;
