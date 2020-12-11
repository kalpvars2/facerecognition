 import React from 'react';
 import Tilt from 'react-tilt';
 import logo from './Logo.png';
 import './Logo.css';

 const Logo = () =>{
 	return (
 		<div>
 			<Tilt className="Tilt ml2 br2 shadow-2" options={{ max : 45 }} >
				<div className="Tilt-inner" ><img src={logo} alt="Logo"/></div>
			</Tilt>
 		</div>
	);
 }

 export default Logo;