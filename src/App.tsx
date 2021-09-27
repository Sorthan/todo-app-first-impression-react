import './App.css';
import TodoList from './components/TodoList';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Nav from './Nav';
import logo from './todologo.png'

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <div className="Todo">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/todoapplication" component={TodoList} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className="home">
    <h1 className="home-h1">Welcome to </h1>
    <h1 className="home-h1">Work to be done Application</h1>
    <section>
      <h3 className="home-h3">Home Page</h3>
      <img src={logo} style={{paddingBottom: '30px'}} />
    </section>
  </div>
)
  

export default App;
