import React, {Component} from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

const particleOptions = {
      "particles": {
          "number": {
              "value": 125,
              "density":{
                enable: true,
                value_area: 700
              }
          }
      }
}

const initialState = {
      input: '',
      imageURL: '',
      boxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user:{
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  calculateFaceLocations = (data) => {
    const faceArray = data.outputs[0].data.regions.map(region => {
        const clarifaiFaceArray = region.region_info.bounding_box;
        const image = document.getElementById("inputimage");
        const height = Number(image.height);
        const width = Number(image.width);
        return {
          leftCol: clarifaiFaceArray.left_col * width,
          topRow: clarifaiFaceArray.top_row * height,
          rightCol: width - clarifaiFaceArray.right_col * width,
          bottomRow: height - clarifaiFaceArray.bottom_row * height
        }
    });
    return faceArray;
  }

  displayFaceboxes = (boxes) => {
    this.setState({boxes: boxes});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('https://immense-tor-55056.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response=>response.json())
    .then(response => {
      if(response){
        fetch('https://immense-tor-55056.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceboxes(this.calculateFaceLocations(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState);
    } else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const {boxes, isSignedIn, route, imageURL} = this.state;
    return(
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        {
          route === 'home'
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <div className="f3 mt2">{`The picture has ${this.state.boxes.length} face(s).`}</div>
              <FaceRecognition boxes={boxes} imageURL={imageURL}/>
            </div>
          : (
            route === 'register'
            ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
      );
    }
  };

export default App;
