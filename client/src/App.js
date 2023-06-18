import { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    data: null
  };
  
  componentDidMount() {
    this.callBackendApi()
      .then(res => this.setState({ data: res.mdjs }))
      .catch(err => console.log(err));
  }
  
  callBackendApi = async () => {
    const response = await fetch('/api');
    const body = await response.json();
    
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to NERO stack</h1>
        </header>
        <p className="App-intro">{this.state.data}</p>
      </div>
    );
  }
}

export default App;
