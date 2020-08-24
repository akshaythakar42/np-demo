import React, { Component, Fragment } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Row, Col, Progress, Container } from 'reactstrap';
import network from './network.json'

const scores = `[
{"country":"Pakistan", "score":23},
{"country":"Pakistan", "score":127},
{"country":"India", "score":3},
{"country":"India", "score":71},
{"country":"Australia", "score":31},
{"country":"India", "score":22},
{"country":"Pakistan", "score":81}
]`;

const processedTeams = [];

export default class MainComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            country1: '',
            country2: '',
            average1: '',
            average2: '',
        }
    }

 getHighestScoreOppTeam(name, value) {
     if(name == "country1"){
       let filterArray = this.state.data && this.state.data.filter(obj => obj.country == value)
       let sum = 0;
       filterArray && filterArray.map(obj => sum = sum + obj.score);
       let average = filterArray && sum/filterArray.length;
       let avg = isNaN(average) ? 0 : average;
       this.setState({
           average1:avg
       })
     }else{
       let filterArray = this.state.data && this.state.data.filter(obj => obj.country == value)
       let sum = 0;
       filterArray && filterArray.map(obj => sum = sum + obj.score);
       let average = filterArray && sum/filterArray.length;
       let avg = isNaN(average) ? 0 : average;
       this.setState({
           average2:avg
       })
     }
}

coutryNameChanged = (event) => {
    if(event.target.name == 'country1'){
      this.setState({country1: event.target.value}, () => {
          this.getHighestScoreOppTeam("country1", this.state.country1)
      });
    }else{
        this.setState({country2: event.target.value}, () => {
         this.getHighestScoreOppTeam("country2", this.state.country2)
      });
    }  
}

setData = () => {
    if(this.state.source1){
     var scoresJson = JSON.parse(scores);
      this.setState({
          data:scoresJson
      })
    }else{
      this.getDataFromNetwork();
    }
};

getDataFromNetwork = async() => {

   fetch("http://localhost:3000/public/network.json")
   .then(response => {
       if (!response.ok) {
           throw new Error("HTTP error " + response.status);
       }
       return response.body;
   })
   .then(json => {
      this.setState({
          data:network.body
      })
   })
   .catch(function () {
       this.dataError = true;
   })
}

sourceChange = (event) => {
    if(event.target.name == 'source1'){
        this.setState({source1: true, source2: false}, () => {
          this.setData();
        });
    }else{
        this.setState({source1: false, source2: true}, () => {
          this.setData();
        });
    }
}

    render(){
        return(
            <Container className='justify-content-center row-margin'>
             <Label>Source of data: </Label>
            <FormGroup check inline>
                <Label check>
                  <Input type="radio" name="source1" checked={this.state.source1} onChange={(e) => this.sourceChange(e)}/> Test Data
                </Label>
            </FormGroup>
            <FormGroup check inline>
                <Label check>
                  <Input type="radio" name="source2" checked={this.state.source2} onChange={(e) => this.sourceChange(e)} /> Server Data
                </Label>
            </FormGroup>
            <Row>
                <Col xs='4'>
                    <FormGroup row>
                        <Label for="country1" sm={4}>The Country: </Label>
                        <Col sm={8}>
                            <Input name="country1" id="country1" placeholder="Country Name" value={this.state.country1} 
                                   onChange={(e) => this.coutryNameChanged(e)} />
                        </Col>
                    </FormGroup>
                </Col>
                <Col xs='4'>
                   <FormGroup row>
                        <Label sm={6}>The Average: </Label>
                        <Label sm={6}>{this.state.average1 ? this.state.average1 : ""}</Label>                       
                    </FormGroup>
                </Col>
                <Col xs='4'><Progress value={this.state.average1 && this.state.average1} /></Col>
            </Row>
            <Row>
                <Col xs='4'>
                    <FormGroup row>
                        <Label for="country2" sm={4}>The Country: </Label>
                        <Col sm={8}>
                            <Input name="country2" id="country2" value={this.state.country2} placeholder="Country Name" onChange={this.coutryNameChanged} />
                        </Col>
                    </FormGroup>
                </Col>
                <Col xs='4'>
                   <FormGroup row>
                        <Label sm={6}>The Average: </Label>
                        <Label sm={6}>{this.state.average2 ? this.state.average2 : ""}</Label>                        
                    </FormGroup>
                </Col>
                <Col xs='4'><Progress value={this.state.average2 && this.state.average2} /></Col>
            </Row>
            </Container>
           
     );
    }
}