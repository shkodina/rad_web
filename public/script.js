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

    var params = null;


	$.getJSON("compass.json", function (json) {
		compass = json;
	});

    socket.on('setParamsForUser', function(mes){
        console.log('setParamsForUser', mes);
        params = mes;
    });

    socket.emit('getParamsForUser', 0);

	return {
        getSocket : function () {
			return socket;
		}
		, getCompass : function () {
			return compass;
		}
		, getParams : function () {

            return params;

		}
	}
})
.controller('MainCtrl', function ($scope, $rootScope, valueService) {
    var main = this;
    main.title = 'RADICO@Web';

    main.meas = {};
    main.cur_mea = {};

    main.setCurrentItem = function (item) {
        main.cur_mea = item;
	};


    //********************************************************************
    //********************************************************************
    //
    //  P A R A M S
    //
    //********************************************************************
    //********************************************************************


    main.isshowparams = null;
    main.askParamsForSADAR = function(){
        main.params = valueService.getParams();
        main.isshowparams = (main.isshowparams == null) ? {} : null;
    }

    main.useNewParams = function(){
        main.params.toemitarray = [];
        main.params.toemit.split(",").forEach(function(item){
            var ditem = ((+item) > 0) ? (+item) : -(+item);
            if (ditem) {
                main.params.toemitarray.push(+ditem);
            }
        })

        main.params.toemit = "";
        main.params.toemitarray.forEach(function(item){
            main.params.toemit = main.params.toemit + item + ",";
        })

        valueService.getSocket().emit('newParamsFromUser', main.params);
    }

    //********************************************************************
    //********************************************************************
    //
    //  M E A S U R E M E N T S
    //
    //********************************************************************
    //********************************************************************


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

            //delete if need emit
            if (main.params != null){
                if (main.params.toemitarray.indexOf((+(mes[index].high))) > -1){
                    delete mes[index];
                    continue;
                }
            }


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

			mes[index].test2 = 90 +  +(Math.floor(+(mes[index].angle)));
			if((+(mes[index].test2)) > 360){
				mes[index].test2 = (+(mes[index].test2)) - 360;
			}

			//console.log('mes[index].test = ', mes[index].test)
		}

		$scope.main.meas = mes;
		$scope.$apply();

		//console.log("printMeas", "All Ok");
	});
})
.directive('myitem', function () {
	return {
		templateUrl : 'myitem.tmpl.html'
	}
})
.directive('paramsmodel', function () {
	return {
		templateUrl : 'paramsmodel.tmpl.html'
	}
})
;
