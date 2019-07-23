const Util = require('./util');
class Track {
	constructor() {
		this.color = '#04F2D4';
		this.track = this.initTrack();
	}

	initTrack() {
		let track = {};
		for (let i = 75; i < 925; i++) {
			track[[ i, 75 ]] = true;
			track[[ i, 525 ]] = true;
			if (i < 550) {
				track[[ 75, i ]] = true;
				track[[ 925, i ]] = true;
			}
		}
		return track;
	}

	move(timeDelta) {}

	updateTrack(newPoints) {
		// console.log(newPoints);
		// https://stackoverflow.com/questions/17692922/check-is-a-point-x-y-is-between-two-points-drawn-on-a-straight-line
		const _deleteOldTrack = (startPoint, endPoint) => {
			let currentTrack = Object.keys(this.track);
			for (let i = 0; i < currentTrack.length; i++) {
				let currPoint = Util.formatPoint(currentTrack[i]);
				// console.log(
				// 	Util.isPointOnLine(startPoint, endPoint, currPoint)
				// );
				if (
					Util.isPointOnLine(startPoint, endPoint, currPoint) ===
						true &&
					!Util.areSamePos(startPoint, currPoint) &&
					!Util.areSamePos(endPoint, currPoint)
				) {
					// console.log(currPoint);
					this.track[currPoint] = false;
				}
			}
		};
		// console.log(typeof newPoints[0]);
		const _addCapturePointsToTrack = (newPoints) => {
			newPoints.forEach((point) => {
				this.track[point] = true;
			});
		};

		let startPoint = newPoints[0];
		let endPoint = newPoints.slice(-1)[0];
		_deleteOldTrack(startPoint, endPoint);
		_addCapturePointsToTrack(newPoints);
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 2.5;
		ctx.moveTo(75, 75);
		ctx.lineTo(925, 75);
		ctx.stroke();
		ctx.lineTo(925, 525);
		ctx.stroke();
		ctx.lineTo(75, 525);
		ctx.stroke();
		ctx.lineTo(75, 75);
		ctx.stroke();
		ctx.closePath();
		// ctx.fill();
	}
}

module.exports = Track;
