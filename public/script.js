/*

 */
angular.module('exercises', [
		'ui.router',
		'ngAnimate',
		'ngMessages'
	])
.factory('valueService', function ($rootScope, $location) {

	var socket = io.connect();

	var compass = {};
	$.getJSON("compass.json", function (json) {
		compass = json;
	});

	return {
		b : function () {},
		getSocket : function () {
			return socket;
		},
		getCompass : function () {
			return compass;
		}
	}
})
.controller('MainCtrl', function ($scope, $rootScope, valueService) {
	this.title = 'RADICO@Web';

	this.meas = {};
	this.cur_mea = {};

	this.setCurrentItem = function (item) {
		this.cur_mea = item;
	};

	valueService.getSocket().on('printMeas', function (mes) {

		function getCompasByAngle(angle) {
			var compass = valueService.getCompass();
			//console.log('getCompasByAngle = ', angle);
			var delta = 22.5;
			for (var i in compass) {
				var right =  + (compass[i].angle) + delta;
				var left =  + (compass[i].angle) - delta;
				left = (left > 0) ? left : (360.0 + left);

				//console.log('getCompasByAngle left = ', left);
				//console.log('getCompasByAngle right = ', right);

				
				if (left > right) { // fucking north
					if ((angle >= 0 && angle < right) || (angle >= left && angle < 360)){
						return i;
					}
				} else {
					if (angle >= left && angle < right) {
						//console.log('getCompasByAngle return = ', i);

						return i;
					}
				}
			}
		}

		function  getStringDateFromTimestamp (timestamp) {
			var date = new Date(timestamp);
			var resultstring = ""
					+ date.getFullYear() + "/"
					+ date.getMonth() + "/"
					+ date.getUTCDate() + " "
					+ date.getHours() + ":"
					+ date.getMinutes()
			;
			return resultstring;
		}

		for (var index in mes) {
			mes[index].compass = valueService.getCompass()[getCompasByAngle(mes[index].angle)];
			//console.log("mes index compass",mes[index].compass);

			mes[index].quality_text = (mes[index].quality == "0") ? "Измерение недостоверно" : " ";

			//console.log("threshold = ", mes[index].threshold)
			
			if (mes[index].threshold == "1") {
				mes[index].warning = true;
			}

			if (mes[index].threshold == "2") {
				mes[index].alert = true;
			}

			mes[index].date = getStringDateFromTimestamp(mes[index].timestamp);
			mes[index].compassangle = Math.floor(+(mes[index].angle));

			if ((+(mes[index].angle)) >= 180){
				mes[index].test = "arrow" +  Math.floor((+(mes[index].angle) - 180) / 10) ;
			}else{
				mes[index].test = "arrow" +  Math.floor(+(mes[index].angle) / 10) ;
			}


			//console.log('mes[index].test = ', mes[index].test)
		}

		$scope.main.meas = mes;
		$scope.$apply();

		//console.log("printMeas", "All Ok");
	});
})
.directive('item', function () {
	return {
		templateUrl : 'item.tmpl.html'
	}
})
.directive('myitem', function () {
	return {
		templateUrl : 'myitem.tmpl.html'
	}
})
;
