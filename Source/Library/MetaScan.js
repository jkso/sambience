const Transform = require('stream').Transform;
const meta = require('music-metadata');

class MetaScan extends Transform {
	constructor() {
		super({
			objectMode: true
		});
		this.allowedEndings = [
			'.mp3','.flac','.wav','.ogg'
		];
	}

	_transform(obj,enc,cb) {
		var fullpath;
		var remove = false;
		if (obj.file && obj._id) {	//SOURCE DB
			fullpath = obj.file;
			remove = true;
		} else {					//SOURCE WALKER
			let name = obj.basename;
			fullpath = obj.filepath;
			if (obj.type !== 'file') return cb();
			let ending = this.allowedEndings.find((e) => {
				return name.substr(name.length-e.length,e.length) === e;
			});
			if (!ending) return cb();
		}
		meta.parseFile(fullpath)
		.then((metadata) => {
			//console.log("metadata for "+fullpath,metadata);
			let data = {
				file: fullpath,
				artist: metadata.common.artist,
				album: metadata.common.album,
				title: metadata.common.title,
				year: metadata.common.year,
				tracknum: metadata.common.track.no,
				disknum: metadata.common.disk.no
			};
			cb(null,data);
		}).catch((err) => {
			console.log("error reading metadata for "+fullpath,err);
			if (remove) {	//@TODO stops here for some reason. deletes entry but stream ends too
				cb(null,{
					file: fullpath,
					remove: true
				});
			} else {
				cb(err);
			}
		});
	}
}

module.exports = MetaScan;