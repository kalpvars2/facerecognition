import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({boxes, imageURL}) => {
	const boxArray = boxes.map(box =>   <div className="bounding-boxes" style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>);
	return (
		<div className="center ma">
			<div className="absolute mt2">
	            <img id="inputimage" alt="" src={imageURL} height="300px" />
				<div>
					{boxArray}
				</div>
			</div>
		</div>
	);
}

export default FaceRecognition;