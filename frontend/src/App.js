import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
const data = [
  {filename: "/cuhk-2013.jpg", year:    2013, remarks: "Restaurant Info1"},
  {filename: "/cuhk-2017.jpg", year:    2017, remarks: "Restaurant Info2"},
  {filename: "/sci-2013.jpg", year:    2013, remarks: "Restaurant Info3"},
  {filename: "/shb-2013.jpg", year:    2013, remarks: "Restaurant Info4"},
  {filename: "/stream-2009.jpg", year:    2009, remarks: "Restaurant Info5"},
];

class Title extends React.Component {
  render() {
      return (
          <header className="bg-warning">
              <h1 className="display-4 text-center">{this.props.name}</h1>
          </header>
      );
  }
}


class Gallery extends React.Component {
  render() {
      return (
          <main className="container">
              {data.map((file,index) => <FileCard i={index} key={index}/>)}
          </main>
      );
  }
}

class FileCard extends React.Component{
  handleClick(index, e) {
      console.log(index);
      this.setState( ()=>
          {   
              if (this.state.selected !== index)
                  return { selected: index }
              else
                  return { selected: -1 }
          }
      );
  }
  constructor(props) {
      super(props);
      this.state = { selected: -1 };
  }
  render() {
      let index = this.props.i;
      return (
          <div className="card d-inline-block m-2" style={{width: this.state.selected===index ? '100%' : 200}} 
              onClick={(e) => this.handleClick(index,e)} >
              <img src={process.env.PUBLIC_URL+data[index].filename} className="w-100" />
              <div className="card-body">
                   <h6 className="card-title"> {data[index].filename}</h6>
                  <p className="card-text"> {data[index].year}</p>
                  { this.state.selected===index && <p className="card-text">{data[index].remarks}</p> }
              </div>
          </div>
      );
  }

}

class App extends React.Component{
  render() {
      return (
          <>
              <Title name={this.props.name}/>
              <Gallery />
          </>
      );
  }
}

// function App() {
//   return (
//     // <>
//     //   <Title name={this.props.name}/>
//     //   <Gallery />
//     // </>
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
