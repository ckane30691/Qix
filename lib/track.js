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

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 5;
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
