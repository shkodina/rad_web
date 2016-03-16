function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

var rnd_data_generator = {
	generateNew : function(count){
		var meas = {};
		var name = "mea";
		var kks = "kks";
		var hight = 10;
		var hightstep = 14;
		for (var i = 0; i < count; i++){
			var mea = {};
  
			mea["kks"] = kks + "_" + name + "_" + i;
			mea["mea_t"] = getRandomArbitrary(-100, 100).toFixed(2);
			mea["mea_speed"] = getRandomArbitrary(0, 30).toFixed(2);
			mea["quality"] = (Math.random() > 0.5) ? "1" : "0";
			mea["threshold"] = Math.floor((Math.random() * 100000) % 3);
			mea["high"] = hight;
			
			hight += hightstep;
			
			mea["angle"] = getRandomArbitrary(0, 360).toFixed(2);
			mea["timestamp"] = (new Date().getTime());
			
			meas[(name + i)] = mea;
		}
		return meas;
	}
	
	, generateByOld : function(olddata){
		for (var i in olddata){
			olddata[i].mea_speed = (+(olddata[i].mea_speed) + +(getRandomArbitrary(-5, 5))).toFixed(2);
			olddata[i].mea_t = (+(olddata[i].mea_t) + +(getRandomArbitrary(-8, 8))).toFixed(2);
			olddata[i].angle = (+(olddata[i].angle) + +(getRandomArbitrary(-20, 20))).toFixed(2);

			if (+(olddata[i].angle) > 360){
				olddata[i].angle = (+(olddata[i].angle) - 360).toFixed(2);
			}
			if (+(olddata[i].angle) < 0){
				olddata[i].angle = (+(olddata[i].angle) + 360).toFixed(2);
			}

			olddata[i].quality = (Math.random() > 0.5) ? "1" : "0";
			olddata[i].threshold = Math.floor((Math.random() * 100000) % 3);
		}
		return olddata;
	}
}

module.exports = rnd_data_generator;