import React from 'react';
import CenterBox from '../center-box';


function LoadingScreen() {
  return (
    <CenterBox height='100vh'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        height='40%'
        viewBox='0 0 135.46666 135.46667'
      >
        <linearGradient id='lg' gradientTransform='rotate(90,0,0)'>
          <stop offset='0%' stopColor='#ffcc00' />
          <stop offset='0%' stopColor='#ffff50'>
            <animate id='op' attributeName='offset' from='0%' to='100%' dur='1s' repeatCount='1' begin='0s;op.end+0.4s' restart='always' />
          </stop>
          <stop offset='100%' stopColor='#ffcc00' />
        </linearGradient>

        <path
          fill='url(#lg)'
          d='m 23.735858,0 33.48985,58.00589 -6.28476,19.45488 60.789852,58.00589 -29.115677,-58.00589 6.28477,-19.45488 z'
          id='lightning'
        >
        </path>
      </svg>
    </CenterBox>
  );
}

export default LoadingScreen;