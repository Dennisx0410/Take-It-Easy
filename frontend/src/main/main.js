import './main.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// let navigate = useNavigate();

const suggest_type = [{remarks: "Just TAKE it"}, {remarks: "I'm loving IT"}, {remarks: "EASYer's Choice"}];
const suggested = [
    {filename: "/cuhk-2013.jpg", name: "Restaurant 1", location:    "Location 1", remarks: "Restaurant Info1"},
    {filename: "/cuhk-2017.jpg", name: "Restaurant 2", location:    "Location 2", remarks: "Restaurant Info2"},
    {filename: "/sci-2013.jpg", name: "Restaurant 3", location:    "Location 3", remarks: "Restaurant Info3"},
];

const data = [
  {filename: "/cuhk-2013.jpg", name: "Restaurant 1", location:    "Location 1", remarks: "Restaurant Info1"},
  {filename: "/cuhk-2017.jpg", name: "Restaurant 2", location:    "Location 2", remarks: "Restaurant Info2"},
  {filename: "/sci-2013.jpg", name: "Restaurant 3", location:    "Location 3", remarks: "Restaurant Info3"},
  {filename: "/shb-2013.jpg", name: "Restaurant 4", location:    "Location 4", remarks: "Restaurant Info4"},
  {filename: "/stream-2009.jpg", name: "Restaurant 5", location:    "Location 5", remarks: "Restaurant Info5"},
];

class Suggestion extends React.Component {
  render() {
      return (
            <main>
                <div className="row">
                    <div className="col-1"></div>
                    <div className="col-10 align-self-start">
                        <h4 style={{padding: "5px 0 0 0"}}>Recommended For You</h4>
                        {suggested.map((file,index) => <SuggestionCard i={index} key={index}/>)}
                    </div>
                    <div className="col-1"></div>
                </div>
            </main>
      );
  }
}


class SuggestionCard extends React.Component{
    handleCLick(index, e) {
        console.log(index);
    }
    constructor(props) {
        super(props);
    }
    render() {
        let index = this.props.i;
        return (
            <Link to={"/restaurant/"+index}>
                    {/* {index} */}
                    <div className="" style={{ margin: '5px 3vw', display: 'inline-block', 
                        justifyContent: 'center', textAlign: 'center', backgroundColor: "white"}}>
                        <div className="e-card e-card-horizontal" style={{ width: '100%' }}>
                            <img src={process.env.PUBLIC_URL+suggested[index].filename} className="w-100" style={{ height: '150px' }}/>
                            <div className="e-card-stacked">
                                <div className="e-card-header">
                                    <div className="e-card-header-caption">
                                        <div className="e-card-header-title">{suggested[index].name}</div>
                                    </div>
                                </div>
                                <div className="e-card-content">
                                    {suggest_type[index].remarks}
                                </div>
                            </div>
                        </div>
                    </div>   
            </Link>
                
        );
    }

}

class Gallery extends React.Component {
  render() {
      return (

          <main className="container-fluid custom-container-width">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10 align-self-start">
                    <h4 style={{padding: "5px 0 0 0"}}>Restaurants:</h4>
                    {data.map((file,index) => <FileCard i={index} key={index}/>)}
                </div>
                <div className="col-1"></div>
            </div>
          </main>
      );
  }
}

class FileCard extends React.Component{
    handleMOver(index, e) {
        console.log(index);
        this.setState( ()=>
            {   
                if (this.state.selected != index)
                    return { selected: index }
                else
                    return { selected: -1 }
            }
        );
    }
    handleMOut(index, e) {
        console.log(index);
        this.setState( ()=>
            {   
                // if (this.state.selected = index)
                    return { selected: -1 }
                // else
                //     return { selected: index }
            }
        );
    }
    handleCLick(index, e) {
        console.log(index);
        
        // navigate('/restaurant/' + index);
    }
    constructor(props) {
        super(props);
        this.state = { selected: -1 };
    }
    render() {
        let index = this.props.i;
        return (
            <Link to={"/restaurant/"+index}>
                <div className="card d-inline-block m-1 custom-card " style={{width: this.state.selected==index ? '33%' : '31%'}}  
                    onMouseOver={(e) => this.handleMOver(index,e)} onMouseOut={(e) => this.handleMOut(index,e)} 
                    onClick={(e) => this.handleCLick(index,e)}>
                    <img src={process.env.PUBLIC_URL+data[index].filename} className="w-100" />
                    <div className="card-body">
                        <h6 className="card-title"> {data[index].name}</h6>
                        <p className="card-text"> {data[index].location}</p>
                        { this.state.selected===index && <p className="card-text">{data[index].remarks}</p> }
                    </div>
                </div>
            </Link>
                
        );
    }

}

class Main extends React.Component{
  render() {
      return (
          <>
            <div className='Main'>
                <Suggestion />
                <Gallery />
            </div>
              
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

export default Main;
