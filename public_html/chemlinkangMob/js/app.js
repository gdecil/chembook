(function(){
  'use strict';
  
  var server = window.location.protocol + "//" + window.location.host;
  if (server.indexOf("http://127.0.0.1") >= 0 ){		//sviluppo da nms con brackets
        server = "http://localhost:8080"
  }
  var service = new ChemlinkService(server);
  var data;
  var batchData;
  var getCorpid = function(batch){
  }
  
  var module = angular.module('app', [
    'ngRoute',
    'ngTouch',
    'ngQuantum', 
    'ui.grid', 
    'ui.grid.edit', 
    'ui.grid.resizeColumns', 
    'onsen', 
    'highcharts-ng', 
    'ngSanitize',
    'ngAnimate'
  ]);

  module.run(['$templateCache', '$cacheFactory', '$rootScope',
    function ($templateCache, $cacheFactory, $rootScope) {
        $templateCache = false;
    }]);

  module.config(['$httpProvider','$routeProvider',
    function($httpProvider, $routeProvider) {
      $httpProvider.defaults.cache = false;
      $routeProvider.
        when('/a', {
          templateUrl: 'index.html',
          controller: 'MasterController'
        }).
        when('/batch', {
          templateUrl: 'kss.html',
          controller: 'MasterController'
        }).
        otherwise({
          redirectTo: '/'
        });
    }                 
/*
    function ($httpProvider) {
        $httpProvider.defaults.cache = false;
    }
*/
  ]);
  
  module.controller('AppController', function($scope, $data) {
    $scope.doSomething = function() {
      ons.notification.alert({message: 'Hello, World!'});
    };
  });

  module.controller('ChartController', ['$scope', function($scope) {
    //esempi ms21144/54a ms21144/09b
    // pro al15366/58
    var getColor = function (actval) {
      var x;
      if (actval<0.1)
        {
        x="#FF0000";    //red
        }
      else if (actval<1)
        {
        x="#FF00FF";    //magenta
        }
      else if (actval<10)
        {
        x="00FF00"; //green
        }
      else
        {
        x="000000"; //black
        }
      return x;
    };
    
    service.getBatchCorpid(batchData.batch).done(function(corpid) {
      corpid = jQuery.parseJSON(corpid)[0].corpid
      var url = server + '/Chemlink?quest=getKSS&corpid=' + corpid
      $.get(url, function (data) {
        if(jQuery.parseJSON(data).length==0){
          return
        }
        var seriesOptions = {
                "name": corpid,
                "data": [], 
                type: "column"        
        };
        var xAxisOptions = {
          categories: []
        }
        $.each(jQuery.parseJSON(data), function (i, Table) {
                xAxisOptions.categories.push(Table.TARGET);
                seriesOptions.data.push({ y: parseFloat(Table.CHART_VAL), color: getColor(parseFloat(Table.ACTIVITY_VAL)) });
        });
        $scope.chartSeries = []
        $scope.chartSeries.push(seriesOptions)

        $scope.chartConfig = {
          options: {
            chart: {
              type: 'areaspline'
            },
            plotOptions: {
              series: {
                stacking: ''
              }
            }
          },
          series: $scope.chartSeries ,
          xAxis: xAxisOptions,
          title: {
            text: corpid
          },
          credits: {
            enabled: true
          },
          loading: false,
          size: {}
        }
        $scope.$apply();
      })        
    });
        
  }]);

  module.controller('ProliferationController', ['$scope', function($scope) {
    //esempi ms21144/54a ms21144/09b
    // proliferation al15366/58
    var getColor = function (actval) {
      var x;
      if (actval<0.1)
        {
        x="#FF0000";    //red
        }
      else if (actval<1)
        {
        x="#FF00FF";    //magenta
        }
      else if (actval<10)
        {
        x="00FF00"; //green
        }
      else
        {
        x="000000"; //black
        }
      return x;
    };
    
    service.getBatchCorpid(batchData.batch).done(function(corpid) {
      corpid = jQuery.parseJSON(corpid)[0].corpid
      var url = server + '/Chemlink?quest=getProliferation&corpid=' + corpid
      $.get(url, function (data) {
        if(jQuery.parseJSON(data).length==0){
          return
        }
        var seriesOptions = {
                "name": corpid,
                "data": [], 
                type: "column"        
        };
        var xAxisOptions = {
          categories: []
        }
        $.each(jQuery.parseJSON(data), function (i, Table) {
                xAxisOptions.categories.push(Table.TARGET);
                seriesOptions.data.push({ y: parseFloat(Table.CHART_VAL), color: getColor(parseFloat(Table.ACTIVITY_VAL)) });
        });
        $scope.chartSeries = []
        $scope.chartSeries.push(seriesOptions)

        $scope.chartConfig = {
          options: {
            chart: {
              type: 'areaspline'
            },
            plotOptions: {
              series: {
                stacking: ''
              }
            }
          },
          series: $scope.chartSeries ,
          xAxis: xAxisOptions,
          title: {
            text: corpid
          },
          credits: {
            enabled: true
          },
          loading: false,
          size: {}
        }
        $scope.$apply();
      })        
    });
        
  }]);

  module.controller('DetailController', function($scope, $data) {
    var table = {};
    table.title = batchData.selectedItem.description.toUpperCase()
    table.label= batchData.selectedItem.data.length + " rows ";
    table.desc=""

    $scope.table = table ;
    
    data = {};
    data.items = [];
    $scope.items = data.items; 
    
    var columnsDefs = []
    $.each(batchData.selectedItem.data[0], function( index1, value1 ) {
      var col = {}
      col.name = index1
      col.fields = index1
      columnsDefs.push(col)
    });
    var modifyDate = function (obj) {
      if (obj === null || typeof obj !== 'object') {
          return obj;
      }

      var temp = obj.constructor(); // give temp the original obj's constructor
      $.each(obj, function( index, value ) {
        if($.type(value) == "object" ){
            if (value.$date!=undefined){
              function pad(s) { return (s < 10) ? '0' + s : s; }
              var d = new Date(value.$date);
              date = [ d.getFullYear(), pad(d.getMonth()+1),pad(d.getDate())].join('/');
//              var date = new Date(value.$date);
              temp[index] =date;
            }
          else {
            temp[index] = modifyDate(obj[index]);
          }
        }
        else {
          temp[index] = modifyDate(obj[index]);
        }
          
      });
      
      return temp;
    }
    
    var modData = modifyDate(batchData.selectedItem.data);
    
    var date = ""
    
    $scope.gridOptions = {
        columnDefs: columnsDefs,
        data : modData,
        enableColumnResize: true,
        filterOptions: {filterText: '', useExternalFilter: false},
        showColumnMenu: true,
        showFilter: true,
        enableSorting: true,
        enablePaging: true
      };    
  });

  module.controller('MasterController', ['$scope', '$data','$http','$rootScope','$routeParams','$location',function($scope, $data, $http, $rootScope, $param, $location ) {

    var $that = this;
    var getData = function(batchData){
          data = {};
          data.items = [];
        $.each(batchData, function( index, value ) {
          var table = {};
          table.title = value.description.toUpperCase()
          table.label= value.data.length + " rows ";
          table.desc=""
          data.items.push(table)
        });
        return data
      }
    $scope.slide = function(){
      var perc = $scope.rangeSliderVer/50
      var wid = 400 * perc
      var hei =300*perc
      
      $( "#noresizable" ).css( "width", wid);
      $( "#noresizable" ).css( "height", hei);
//      alert($scope.rangeSliderVer)
    }
    $scope.search = function(b){
      
      var batch
        $('#stolav').css( { "visibility": "visible"} )
        
        if(b !=""){
          batch=b
        }
      else{
        batch = $('input').val();
      }
        
      
        $scope.items = []; 
      
        service.getBatchData(batch).done(function(bdata) {
          batchData =$.parseJSON(bdata);
          batchData.batch = batch
                    
          $data = batchData;

          service.getBatchCorpid(batchData.batch).done(function(corpid) {
            corpid = jQuery.parseJSON(corpid)[0].corpid
            service.getKss(corpid).done(function(dataKss) {
              if(dataKss==""){
                var d=getData(batchData)
                $scope.items = d.items;  
                $scope.$apply();
                service.getPro(corpid).done(function(dataPro) {
                  if(dataPro==""){
                    var d=getData(batchData)
                    $scope.items = d.items;  
                    $scope.$apply();
                  }
                  else {
                    var table = {};
                    table.description = "Proliferation Activity Profile"
                    table.tablename= "Proliferation Activity Profile";
                    table.data= []
                    var pro  = {};
                    kss.name = "pro"
                    table.data.push(pro)
                    batchData.unshift(table)                
                    var d=getData(batchData)
                    $scope.items = d.items;  
                    $scope.$apply();
                  }  
                })
                
              }
              else {
                var table = {};
                table.description = "KSS Activity Profile"
                table.tablename= "KSS Activity Profile";
                table.data= []
                var kss  = {};
                kss.name = "kss"
                table.data.push(kss)
                batchData.unshift(table)                
                $scope.promise4=service.getPro(corpid).done(function(dataPro) {
                  if(dataPro==""){
                    var d=getData(batchData)
                    $scope.items = d.items;  
                    $scope.$apply();
                  }
                  else {
                    var table = {};
                    table.description = "Proliferation Activity Profile"
                    table.tablename= "Proliferation Activity Profile";
                    table.data= []
                    var pro  = {};
                    kss.name = "pro"
                    table.data.push(pro)
                    batchData.unshift(table)                
                    var d=getData(batchData)
                    $scope.items = d.items;  
                    $scope.$apply();
                  }  
                })
/*

                var d=getData(batchData)
                $scope.items = d.items;  
                $scope.$apply();
*/
              }  
            })
          });
         $('#stolav').css( { "visibility": "hidden"} )
        });
        service.getBatchStrid(batch).done(function(strid) {
          $( "#contImage" ).remove();
            var batch =eval('(' + strid + ')');
            if (batch.length==0){
              alert("Batch not found")
              $('#stolav').css( { "visibility": "hidden"} )
              return
            }
            var sql = "<div id='contImage' class='vicini'><img id='noresizable' width='400px' height= '300px' src='" + server  + "/render?strid=" + batch[0].strid + "'></div>"
            $('#imgcont').prepend(sql)
        });
    }
    
    $scope.showDetail = function(index) {
      var selectedItem = batchData[index];
      batchData.selectedItem = selectedItem;
      if(batchData.selectedItem.description=="KSS Activity Profile"){
        $scope.navi.pushPage('graph.html', {title : "pippo"});
      }
      else if(batchData.selectedItem.description=="Proliferation Activity Profile"){
        $scope.navi.pushPage('proliferation.html', {title : "pippo"});
      }
      else {
        $scope.navi.pushPage('detail.html', {title : selectedItem.description});
      }

    };
    
    if ($location.$$absUrl.split("?").length>1){
      var a0 =$location.$$absUrl.split("?")[1].split("=")[0]
      var a1 =$location.$$absUrl.split("?")[1].split("=")[1]
      if (a0=='batch'){
        $scope.search(a1)
      }
    }
    
  }]);

  module.factory('$data', function() {
      var data = {};
      
      data.items = [
          { 
              title: 'Item 1 Pippo',
              label: '4h',
              desc: 'Pippo Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
          },
          { 
              title: 'Another Item Title',
              label: '6h',
              desc: 'Ut enim ad minim veniam.'
          },
          { 
              title: 'Yet Another Item Title',
              label: '1day ago',
              desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          { 
              title: 'Yet Another Item Title',
              label: '1day ago',
              desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          }
      ]; 
      
      return data;
  });
  
})();


