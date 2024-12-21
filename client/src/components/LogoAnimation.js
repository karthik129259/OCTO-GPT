// src/components/LogoAnimation.js
import React from 'react';
import Lottie from 'lottie-react';
import logoAnimation from '../../public/logo animation.lottie';

const LogoAnimation = () => {
  return <Lottie animationData={logoAnimation} loop={true} />;
};

export default LogoAnimation;