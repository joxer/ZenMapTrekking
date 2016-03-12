'use strict';

angular.module('myApp.view1', ['ngRoute', 'leaflet-directive', 'ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ["$scope", "leafletData", "Upload", "mapHttp", "$compile",function($scope,leafletData,Upload, mapHttp, $compile) {

  function init(){
    angular.extend($scope, {
      center: {
        lat: 41.9,
        lng: 12.5,
        zoom: 4
      },
      paths: {
        multiPolyline: {
                    type: "polyline",
                    latlngs: [],
                    smoothFactor: 0.8,
                    color:"red",
                    weight: 2
                  }
        }
    });




  }
  $scope.addCoordinates = function(coords){

      for(var idxCoord in coords){
        var coord = coords[idxCoord];
        $scope.paths.multiPolyline.latlngs.push(coord);
      }


  }

  $scope.clearCoordinates = function(coords){
    while( $scope.paths.multiPolyline.latlngs.length > 0)
      $scope.paths.multiPolyline.latlngs.pop();
  }


  $scope.loadCoordinates = function(str){
    $scope.clearCoordinates();
    gpxParse.parseGpx(str, function(error, data) {

      console.log(data.tracks)
      var ccs = data.tracks[0].segments[0];
      var objs = []

      if(ccs.length > 0){

        $scope.center.lat = ccs[0].lat
        $scope.center.lng = ccs[0].lon

        $scope.center.zoom = 12

      }

      for(var idx in ccs){
        var lat = ccs[idx].lat
        var lon = ccs[idx].lon
        var elevation = ccs[idx].elevation
        var time = ccs[idx].time
        objs.push({lat: lat,lng: lon, message: time});
      }
      $scope.addCoordinates(objs);

    });
  }

  $scope.submit = function() {
    if ($scope.form.file.$valid && $scope.file) {
      $scope.upload($scope.file);
    }
  };


  $scope.upload = function (file) {
    if(file != null){
      Upload.upload({
        url: '/gpx_data/new',
        data: {file: file, 'username': $scope.username}
      }).then(function (resp) {
        $scope.loadCoordinates(resp.data.file)
        $scope.addNewLiForMap(resp.data);
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });
    }
  }

 $scope.addNewLiForMap = function(data){

   var ul = angular.element(document.createElement("oldmaps-li"));
   var li = angular.element(document.querySelector("#oldmaps-ul"));
   li.attr("mdata", data.date)
   li.attr("mid", i.id)
   li.attr("get-map", "getMapFromServer(id)");
   var el = $compile(li)(scope);
   ul.append(el);


 }


 $scope.getMapFromServer = function(id){

   mapHttp.getMap(id).then(function(resp){
     $scope.loadCoordinates(resp.file)
   })
 }
  init();
}

])

.service('mapHttp',function($http, $q){

  this.getMaps = function(){

    var request = $http({
      method: "get",
      url: "/gpx_data/all"
    })
    return request.then(function(data){
      return data.data;
    }, function(error){
      console.log(error);
    })
  },
  this.getMap = function(id){

    var request = $http({
      method: "get",
      url: "/gpx_data/"+id
    })
    return request.then(function(data){
      return data.data;
    }, function(error){
      console.log(error);
    })
  }
})
.directive("oldmapsUl", function(mapHttp, $compile){

  return {
    restrict: "AE",
    replace:true,
    template: "<ul></ul>",

    scope: false,

    link: function(scope, elem, attrs){
        var oldMaps = mapHttp.getMaps().then(function(data){
        scope.oldmaps = data
        for(var i in data){
                var li = angular.element(document.createElement("oldmaps-li"));
                li.attr("mdate", data[i].date);
                li.attr("mid", data[i].id)
                li.attr("get-map", "getMapFromServer(id)");
                var el = $compile(li)(scope);
                elem.append(el);
        }
      })
    }
  }
})
.directive("oldmapsLi", function(){

  return {
    restrict: "AE",
    replace: true,
    scope: {
        mdate: "=",
        mid: "=",
        getMap: "&"
    },
    template: "<li class='liListMap' ng-click='getMap({id: mid})'>Get Map from  {{ mdate }} </li>",
  }
})
