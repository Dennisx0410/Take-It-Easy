const data = [
    {filename: "cuhk-2013.jpg", year:    2013, remarks: "Sunset over CUHK"},
    {filename: "cuhk-2017.jpg", year:    2017, remarks: "Bird's-eye view of CUHK"},
    {filename: "sci-2013.jpg", year:    2013, remarks: "The CUHK Emblem"},
    {filename: "shb-2013.jpg", year:    2013, remarks: "The Engineering Buildings"},
    {filename: "stream-2009.jpg", year:    2009, remarks: "Nature hidden in the campus"},
];

class App extends React.Component{
    render() {
        {/* <> fragment for >1 components */}
        return (
            <>
                <Title name={this.props.name}/>
                <Gallery />
            </>
        );
    }
}

class Title extends React.Component {
    render() {
        return (
            <header className="bg-warning">
                <h1 className="display-4 text-center">{this.props.name}</h1>
            </header>
        );
    }
}

// class Gallery extends React.Component {
//     render() {
//         return (
//             <main className="container">
//                 <FileCard />
//             </main>
//         );
//     }
// }

// class FileCard extends React.Component{
//     render(){
//         return(
//             <div className="card d-inline-block m-2" style={{width:200}}>
//                 <img src={"images/"+data[0].filename} className="w-100" />
//                 <div className="card-body">
//                     <h6 className="card-title"> {data[0].filename}</h6>
//                     <p className="card-text"> {data[0].year}</p>
//                 </div>
//             </div>
//         )
//     }
// }

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
                if (this.state.selected != index)
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
            <div className="card d-inline-block m-2" style={{width: this.state.selected==index ? '100%' : 200}} onClick={(e) => this.handleClick(index,e)}>
                <img src={"images/"+data[index].filename} className="w-100" />
                <div className="card-body">
                     <h6 className="card-title"> {data[index].filename}</h6>
                    <p className="card-text"> {data[index].year}</p>
                    { this.state.selected==index && <p className="card-text">{data[index].remarks}</p> }
                </div>
            </div>
        );
    }

}

ReactDOM.render(
    <App name="CUHK Pictures"/>,
    document.querySelector("#app"));