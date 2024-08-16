import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imgUrl, boxes }) => {
  return (
    <div className='center ma'>
      <div id='ctn' className='absolute mt2'>
        <img id="inputimage" src={imgUrl} alt='' width='500px' height='auto'/>
        {boxes.map((box, index) => {
          return(
            <div
            key={index} 
            className='bounding-box' 
            style={{
              top: box.topRow, 
              right: box.rightCol, 
              bottom: box.bottomRow, 
              left: box.leftCol}}
            ></div>
          );
        })}
      </div>
    </div>
  )
}

export default FaceRecognition;
