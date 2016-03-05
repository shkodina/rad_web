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
	$.getJSON("compass.json", function(json) {
		compass = json;
    });

    return {
        b: function () {
        },
		getSocket : function(){
			return socket;
		},
		getCompass : function(){
			return compass;
		}
    }
})
.controller('MainCtrl', function ($scope, $rootScope, valueService) {
    this.title = 'RADICO@Web';

    this.meas = {};
    this.cur_mea = {};

    this.setCurrentItem = function(item){
        this.cur_mea = item;
    };
	
	    valueService.getSocket().on('printMeas', function (mes) {
        //console.log('printMeas', mes);

        //console.log("compass", compass); // this will show the info it in firebug console

        for(var index in mes) {
            //console.log("mes index",compass[mes[index].way]);
            mes[index].compass = valueService.getCompass()[mes[index].way];
            //console.log("mes index compass",mes[index].compass);

            mes[index].quality_text = (mes[index].quality == "0") ? "Измерение недостоверно" : " ";

            if (mes[index].threshold == "1"){
                mes[index].warning = true;
            }

            if (mes[index].threshold == "2"){
                mes[index].alert = true;
            }
        }

        $scope.main.meas = mes;
        $scope.$apply();
		
		console.log("printMeas","All Ok");
    });
})
;