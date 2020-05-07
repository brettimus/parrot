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
  // const location = useLocation();

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
      <p>Upload another file You Can Mimic</p>
      <input id="sample" name="sample" type="file" onChange={onInputChange} style={{ width: '180px' }} />
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
  return (
    <nav>
      {things.map((thing, i) => {
        return (
          <React.Fragment key={i}>          
            <Link  className="App-link" to={"/practice/" + thing.id}>{thing.title}</Link>
            { i < things.length - 1 ? ' | ' : ''}
          </React.Fragment>
        );
      })}
      <AddSample handleCreated={addThing} />
    </nav>
  );
}

function NoMatch() {
  return <h1>Not Found! (You lost? Click the parrot)</h1>;
}

export default App;
