import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
constructor(){
	super()
	this.state ={stadiums:[],details:"",inputText:"",error:""};
}

getStadiums(event){
	let name =this.state.inputText;
	event.preventDefault();
	console.log(name.toString());
	fetch('http://localhost:8080/search?search_text='+name).then(res=>res.json()).then(data=>{
	if(data.length!==0){
		console.log(data.length+" no error");
		this.setState({stadiums:data,inputText:"",details:"",error:""})
	}else{
	console.log(data.length+ " Error");
		this.setState({stadiums:"",inputText:"",details:"",error:"No stadium"})
	}  
	console.log("done"+new Date());
}).catch(e=>{console.log(e);
	this.setState({stadiums:[],inputText:"",details:"",error:" Error in getting stadium list"}); 
	});
}

handleTextChange(e){
	this.setState({inputText:e.target.value});
	}
	
populateStadiumList(stadiumList){
	if(stadiumList.length!==0){
	<h3> Stadium list </h3>
 return (<ul>
 {stadiumList.map(e=>{
			console.log(e.name);
			return <li key={e.name}><a href="#" onClick={this.getStadiumDetails.bind(this)}data-value={e.href}>{e.name}</a></li>
		})
	}
</ul>);	
}
}	
populateStadiumDetails(){
	if(this.state.details!==""){
		let detls = this.state.details;
		let firstKeys = ["Nimi","Osoite","desc"];
		return (<ul>
			<li key="Nimi"><strong>Nimi </strong>:{detls["Nimi"]}</li>
			<li key="Osoite"><strong>Osoite </strong>:{detls["Osoite"]}</li>
			<li key="desc"><strong>desc </strong>:{detls["desc"]}</li>
			{firstKeys.forEach(k=>delete detls[k])}
			{Object.keys(detls).map(k=>{
					console.log(k,detls[k]);
					return <li key={k}><strong> {k} </strong>:{detls[k]}</li>
					})
				}
				</ul>);
		}
}
getStadiumDetails(event){
	event.preventDefault();
	let path = event.target.dataset.value;
	fetch("http://localhost:8080/detail?url="+path).then(res=>res.json()).then(data=>{
		console.log(data);
		this.setState({details:data,stadiums:[],inputText:"",error:""})
		}).catch(e=>this.setState({details:"",stadiums:[],inputText:"","error":"Error in getting stadium detail"})); 
}
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
		  <input type="text" onChange={e=>this.handleTextChange(e)} value={this.state.inputText} placeholder="Enter stadium name" />
		  <button onClick={this.getStadiums.bind(this)}> Get Stadium List </button>
        </header>
        <div className="App-content">
		
			{this.populateStadiumList(this.state.stadiums)}
			{this.populateStadiumDetails()}
			{this.state.error}
		</div>
      </div>
    );
  }
}

export default App;
