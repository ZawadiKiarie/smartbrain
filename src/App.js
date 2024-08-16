import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import './App.css';

// const getRequestOptionsJSON = (imgUrl) => {
//   const PAT = '4b651165ec6447e2999e40b6d3024571';
//   const USER_ID = 'clarifai';
//   const APP_ID = 'main';
//   const MODEL_ID = 'face-detection';
//   const IMAGE_URL = imgUrl;

//   const raw = JSON.stringify({
//       "user_app_id": {
//           "user_id": USER_ID,
//           "app_id": APP_ID
//       },
//       "inputs": [
//           {
//               "data": {
//                   "image": {
//                       "url": IMAGE_URL
//                       // "base64": IMAGE_BYTES_STRING
//                   }
//               }
//           }
//       ]
//   });

//   const requestOptions = {
//       method: 'POST',
//       headers: {
//           'Accept': 'application/json',
//           'Authorization': 'Key ' + PAT
//       },
//       body: raw
//   };

//   return requestOptions;
// }

const initialState = {
      input: '',
      imgUrl: '',
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
}


class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    const { id, name, email, entries, joined } = data;
    this.setState({user: {
      id: id,
      name: name,
      email: email,
      entries: entries,
      joined: joined
    }})
  }


  calculateFaceLocation = (data) => {
    // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    const arrayOfFaces =  clarifaiFaces.map(face => {
      const boundingBox = face.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - (boundingBox.right_col * width),
        bottomRow: height - (boundingBox.bottom_row * height)
      }
    })
    return arrayOfFaces;
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onPictureSubmit = () => {
    this.setState({imgUrl: this.state.input})
    fetch('https://smartbrain-api-9nid.onrender.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(result => {
        // console.log(result);
        // this.calculateFaceLocation(result);
        if (result) {
          fetch('https://smartbrain-api-9nid.onrender.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(resp => resp.json())
            .then(entries => {
              this.setState(Object.assign(this.state.user, { entries: entries }))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(result));
        // console.log(result.outputs[0].data.regions[0].region_info.bounding_box)
      })
      .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signin'){
      this.setState(initialState)
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render(){
    const { isSignedIn, imgUrl, route, boxes} = this.state;
    return (
      <div className="App">         
        <ParticlesBg color="#B692C2" type= "cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries = {this.state.user.entries} />
            <ImageLinkForm
            onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition boxes={boxes} imgUrl={imgUrl}/>
          </div>
          :(route === 'signin'
            ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
