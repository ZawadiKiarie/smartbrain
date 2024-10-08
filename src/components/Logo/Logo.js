import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
  return (
    <div className='ma4 mt0'>
      <Tilt>
        <div className='Tilt br2 shadow2' style={{ height: '150px', width: '150px', backgroundColor: 'darkgreen' }}>
          <div className='Tilt-inner pa3'>
            <img style={{paddingTop: '5px'}} src={brain} alt='logo' />
          </div>
        </div>
      </Tilt>
    </div>
  )
}

export default Logo;