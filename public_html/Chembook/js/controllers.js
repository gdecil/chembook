
/* Controllers */

var xControllers = angular.module('xControllers', ['ui.layout', 'ngSanitize', 'angularTreeview', 'angAccordion', 'highcharts-ng'])
.controller('loginCtrl',['$scope','$routeParams','$http','$location', '$cookies', function($scope, $param ,$http, $location, $cookies) {
        $scope = navBarLogin($scope,$param, $location)   
        $scope.login = function () {
            var ok = checkUserPwd($scope.username, $scope.password);
            if(ok=="\"User or password error\""){
                $cookies.userChembook = 'Please Login'
                alert(ok)
            }
            else {
                $cookies.userChembook = $scope.username;
                alert($scope.username + " is logged in")
                $location.path('/search');                
            }
        };
      }
    ])
.controller('graphCtrl', ['$routeParams','$scope', '$http', '$window', '$location', function($param, $scope,$http, $window, $location) {        
  $scope = treeview($scope,$http,null,$location)  
//        $scope = formView($scope,$http)  
  $scope = tabsSearch($scope, $window)
  $scope = navBarSearch($scope, $location)        
  $scope.$on("editReactionEvent", function (event, args) {
//          $('#containerReaction').hide()
//          $('#ketcherFrame').show();
    var ketcher = getKetcher();
    ketcher.setMolecule(exp.Rxn);
    if($scope.form.ctrl != undefined){
      $scope.form.ctrl.$dirty= true;
    }
  });
  $scope = graphChart($scope, $param)
 }])
.controller('searchCtrl', ['$scope', '$http', '$window', '$location', '$cookies', function($scope,$http, $window, $location, $cookies) {  
        var user = $cookies.userChembook
        $scope = treeview($scope,$http,null,$location)  
//        $scope = formView($scope,$http)  
        $scope = tabsSearch($scope, $window)
        $scope = navBarSearch($scope, $location, user)        
        $scope.$on("editReactionEvent", function (event, args) {
//          $('#containerReaction').hide()
//          $('#ketcherFrame').show();
            if($('.ui-jqgrid-title')[0].textContent=="STRID"){
                getMolecule(currentStrid).done(function(molfile) {
                    var ketcher = getKetcher();
                    ketcher.setMolecule(molfile);
                })
            }
            else
            {
                var ketcher = getKetcher();
                ketcher.setMolecule(exp.Rxn);
                if($scope.form.ctrl != undefined){
                    $scope.form.ctrl.$dirty= true;
                }
            }
        });

     }])
.controller('viewCtrl',['$scope','$routeParams','$http','$location', '$cookies', function($scope, $param ,$http, $location, $cookies) {
        var user = $cookies.userChembook
        var form ={input: {}}

        $scope = treeview($scope,$http,$param,$location)  
        $scope = navBarView($scope,$param, $location, user)     
        $scope.$on("openExperiment", function (event, args) {
          var tmp = args.value.split("-");
          $scope.form = getExperiment(tmp[0],tmp[1], form);
          $('#containerProcedure').show();
          $( "div[ng-controller='ckeCtrl']" ).hide()
        });        
        
        $scope.save = function () {
          // Set the form to pristine state so we're not prompting the user to save
          // the changes when changing the location.

          $scope.form.ctrl.$setPristine(true);
          inform.add('Form data saved');
      //    $location.path('/');
        };
    
        if($param.experiment.length >1){
            var tmp = $param.experiment.split("-");
            $scope.$root.$broadcast("openExperiment", {                                      
                value: tmp[0] + "-" + tmp[1]
            });
        }            
      }
    ])
.controller('registerCtrl', ['$scope', '$routeParams', '$http', '$location','inform', '$cookies', 'ngDialog', function($scope, $param ,$http, $location, inform, $cookies, ngDialog) {  
        var user = $cookies.userChembook
        $scope = treeview($scope,$http, $param,$location)  
        $scope = navBarRegister($scope, $location, user)             
        var form ={input: {}}
        $scope.form =form
        var jqxhr = $.get( "example.php", function() {
          alert( "success" );
        })
          .always(function() {
              $scope.isReady = true;
        });            
        
        $scope.$on("openExperiment", function (event, args) {
          var tmp = args.value.split("-");
          $scope.form = getExperiment(tmp[0],tmp[1], form);
          $('#containerProcedure').show();
          $( "div[ng-controller='ckeCtrl']" ).hide()
        });        

        $scope.$watch('form.input', 
        function() { 
          if(exp != undefined){
            exp.GeneralDataReaction[0].subject = form.input.title
            exp.GeneralDataReaction[0].yield= (form.input.yield==null) ? "0" :form.input.yield 
            //exp.PROJECT_CODE= form.input.
            exp.GeneralDataReaction[0].batch_creator= form.input.batch_creator
            exp.GeneralDataReaction[0].notebook= form.input.notebook
            exp.GeneralDataReaction[0].experiment= form.input.experiment
            exp.GeneralDataReaction[0].creation_date= form.input.creation_date
            exp.GeneralDataReaction[0].continued_from_rxn= (form.input.continued_from_rxn==null) ? "" :form.input.continued_from_rxn  
            exp.GeneralDataReaction[0].continued_to_rxn= (form.input.continued_to_rxn==null) ? "" :form.input.continued_to_rxn  
            exp.GeneralDataReaction[0].project_code = ""
            exp.GeneralDataReaction[0].project_alias = ""
            exp.GeneralDataReaction[0].synth_route_ref=""
            exp.GeneralDataReaction[0].literature_ref = ""
            exp.GeneralDataReaction[0].issuccessful = ""
  //          exp.PROJECT_ALIAS= form.input.
  //          exp.BATCH_OWNER= form.input.
  //          exp.LITERATURE_REF= form.input.
  //          exp.OWNER_USERNAME= form.input.
          }
        }, true);
                                             
        $scope.$on("editReactionEvent", function (event, args) {
          $('#containerReaction').hide()
          $('#ketcherFrame').show();
          var ketcher = getKetcher();
          ketcher.setMolecule(exp.Rxn);
          if($scope.form.ctrl != undefined){
            $scope.form.ctrl.$dirty= true;
          }
        });

        $scope.$on("regDetailEvent", function (event, args) {
          
          exp.updateDetail();
          if($scope.form.ctrl != undefined){$scope.form.ctrl.$setPristine(true);}
//          inform.add('Form data saved');
        });
        $scope.$on("regSchemalEvent", function (event, args) {
          var ketcher = getKetcher();
          exp.Rxn = ketcher.getMolfile();

          exp.updateSchema();
          if($scope.form.ctrl != undefined){$scope.form.ctrl.$setPristine(true);}
//          inform.add('Form data saved');
        });
        $scope.$on("setMoleculesEvent", function (event, args) {
          var ketcher = getKetcher();
          exp.Rxn = ketcher.getMolfile();
          loadStoic(exp.Rxn, "", "mole")
          if($scope.form.ctrl != undefined){$scope.form.ctrl.$setPristine(false);}
        });
        $scope.$on("findAllEvent", function (event, args) {
            ngDialog.open({
                template: 'firstDialog',
                controller: 'FirstDialogCtrl',
                className: 'ngdialog-theme-default ngdialog-theme-custom'
            });
        });
  
        if($param.experiment.length >1){
            var tmp = $param.experiment.split("-");
            $scope.$root.$broadcast("openExperiment", {                                      
                value: tmp[0] + "-" + tmp[1]
            });
        }            
    
}])
.controller('FirstDialogCtrl', function ($scope, ngDialog) {
				$scope.next = function () {
					ngDialog.close('ngdialog1');
					ngDialog.open({
						template: 'secondDialog',
						className: 'ngdialog-theme-flat ngdialog-theme-custom'
					});
				};
			})
.controller('ckeCtrl', ['$scope', function($scope) {        
  $scope.htmlEditor = ""
    $scope.$on("openProcedure", function (event, args) {
      $('#containerProcedure').hide();
      $( "div[ng-controller='ckeCtrl']" ).show()

      $scope.htmlEditor = exp.WorkUp
/*
      if(args.value==null){
          $scope.htmlEditor = "";
      }
      else {
        if(exp.page!="0014"){
          $scope.htmlEditor = args.value;                  
        }
        else {
          $scope.htmlEditor = args.value; 
          $scope.htmlEditor = "test";
          $scope.htmlEditor = args.value; 
        }
      }
*/
        //"ciao ugo " + exp.GeneralDataReaction[0].procedure;
      //$scope.$apply()
    });
}]);  

var treeview = function($scope,$http,$param,$location) {
        /* treeview section*/
  var swt
  if($param == null){
    swt = 0
  }
  else if($param.experiment == "1"){
    swt = 0
  }
  else {
    swt = 1
  }
  if(swt==0){
    $http.post(server + '/Reaction.asmx/GetUsersFullnameAng','{}').
      success(function(data, status, headers, config) {
        $scope.treedata = data;
      }).
      error(function(data, status, headers, config) {
        $scope.treedata = 
                [
                    { "label" : "De Cillis, Gianpiero", "id" : "role1", "children" : [
                        { "label" : "00000001", "id" : "role11", "children" : [
                            { "label" : "0001", "id" : "role111", "children" : []},
                            { "label" : "0002", "id" : "role112", "children" : []}
                        ],collapsed:true},
                        { "label" : "00000002", "id" : "role12", "children" : [
                            { "label" : "0001", "id" : "role121", "children" : []},
                            { "label" : "0002", "id" : "role122", "children" : []}
                        ],collapsed:true}
                    ],collapsed:true}
                ];   
    });
  }
  else {
    var tmp = $param.experiment.split("-");
    var tv =server + '/Reaction.asmx/GetExperimentTreeView'
    var data = '{"notebook":"' + tmp[0] + '", "page":"' + tmp[1] + '","enumVal":"undefined"}'
    $http.post(tv, data).
      success(function(data, status, headers, config) {
        $scope.treedata = data;
      }).
      error(function(data, status, headers, config) {
        $scope.treedata = 
                [
                    { "label" : "De Cillis, Gianpiero", "id" : "role1", "children" : [
                        { "label" : "00000001", "id" : "role11", "children" : [
                            { "label" : "0001", "id" : "role111", "children" : []},
                            { "label" : "0002", "id" : "role112", "children" : []}
                        ],collapsed:true},
                        { "label" : "00000002", "id" : "role12", "children" : [
                            { "label" : "0001", "id" : "role121", "children" : []},
                            { "label" : "0002", "id" : "role122", "children" : []}
                        ],collapsed:true}
                    ],collapsed:true}
                ];   
    });
  }
  
  $scope.$watch( 'abc.currentNode', function( newObj, oldObj ) {
          if( $scope.abc && angular.isObject($scope.abc.currentNode) ) {
            //alert($scope.abc.currentNode.label);
            $scope.addChild();
/*
              var labParent =   $scope.abc.currentNode.id.substr(0 , $scope.abc.currentNode.id.length - 1);
              var a = getObjects($scope.treedata,'id',labParent)
//                    var nodeParent = $.grep($scope.treedata, function(e){ return e.id == labParent; })
              alert(a[0].label + "-" + $scope.abc.currentNode.label);
              console.log( 'Node Selected!!' );
              console.log( $scope.abc.currentNode );
*/
          }
      }, false);
  $scope.selectedItem = {};
  $scope.options = {

  };
  $scope.remove = function(scope) {
    scope.remove();
  };
  $scope.toggle = function(scope) {novembre
    scope.toggle();
  };
  $scope.newSubItem = function(scope) {
    var nodeData = scope.$modelValue;
    nodeData.items.push({
      id: nodeData.id * 10 + nodeData.items.length,
      title: nodeData.title + '.' + (nodeData.items.length + 1),
      items: []
    });
  };
  
  $scope.temporaryNode = {
        children: []
    };
  $scope.addChild = function () {
          /* add child */
    
    if ("userid" in $scope.abc.currentNode){
      var userid = $scope.abc.currentNode.userid;
      var notebooks;
      $scope.abc.currentNode.children.length = 0;

      $http.post(server + '/Reaction.asmx/GetUserNotebooks','{"id":"' + userid + '"}').
      success(function(data, status, headers, config) {
        notebooks = data;
        $.each( notebooks, function( key, value ) {
          $scope.temporaryNode = {
              children: []
          };
          $scope.temporaryNode.id = value.title;
          $scope.temporaryNode.label= value.title;
          $scope.temporaryNode.notebook = value.title;
          if( $scope.temporaryNode.id && $scope.temporaryNode.label ) {
            $scope.abc.currentNode.children.push(angular.copy($scope.temporaryNode)) ;
          }
        });
      }).
      error(function(data, status, headers, config) {
      });        
    }
    else {
      if ("notebook" in $scope.abc.currentNode){
        if ("page" in $scope.abc.currentNode){
          var page = $scope.abc.currentNode.page;
          var notebook= $scope.abc.currentNode.notebook;
                   
          if (window.location.hash.indexOf("search") >= 0){
            currentNB =""
            currentPage="" 
            var rxnIDs = getReactions(notebook + "-" + page ,"text", $('#containerReaction'),"#myGridSearch") 
          }
          else{
//            $location.path('/view/' + notebook + '-' + page);
            $scope.$root.$broadcast("openExperiment", {                                      
                value: notebook + "-" + page
            });
          }
        }
        else{
          var notebook = $scope.abc.currentNode.label;
          var pages;
          $scope.abc.currentNode.children.length = 0;

          $http.post(server + '/Reaction.asmx/GetPagesNotebook','{"notebook":"' + notebook + '"}').
          success(function(data, status, headers, config) {
            pages = data;
            $.each( pages, function( key, value ) {
              $scope.temporaryNode = {
                  children: []
              };
              $scope.temporaryNode.id = value.title;
              $scope.temporaryNode.label= value.title;
              $scope.temporaryNode.page= value.title;
              $scope.temporaryNode.notebook= notebook;
              if( $scope.temporaryNode.id && $scope.temporaryNode.label ) {
                  $scope.abc.currentNode.children.push(angular.copy($scope.temporaryNode)) ;
              }
            });
          }).
          error(function(data, status, headers, config) {
          });        
        }
      }
      else{
     
      }
            
    }

  }
  return $scope
}

var navBarLogin = function($scope, $location){
      /* navBar section*/
          $scope.affixed = 'top';
          $scope.brand = "<span class='glyphicon glyphicon-user'></span> Please Login";
          $scope.inverse = true;
          $scope.menus = [
            {
              title : "Move to",
              menu : [
                {
                  title : "Register",
                  action : "item.one"
                },
                {
                  title : "View",
                  action : "item.two"
                }
              ]
            }
          ]; // end menus

          $scope.item = '';
          $scope.styling = 'Inverse';
          $scope.searchDisplay = 'Visible';true

          var tmp = window.location.pathname.split("/");
          $scope.navfn = function(action){
            switch(action){
              case 'item.one':
                window.open(serverWeb + "/" + tmp[1] + "/index.html#/register/1", "_blank");
                break;
              case 'item.two':
                window.open(serverWeb + "/" + tmp[1] + "/index.html#/view/1", "_blank");
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn
  return $scope
}

var navBarSearch = function($scope, $location, user){
      /* navBar section*/
          $scope.affixed = 'top';
          $scope.search = {
            show : true,
            terms : ''
          };
          $scope.brand = "<span class='glyphicon glyphicon-user'></span> " + user;
          $scope.inverse = true;
          $scope.menus = [
            {
              title : "Move to",
              menu : [
                {
                  title : "Register",
                  action : "item.one"
                },
                {
                  title : "View",
                  action : "item.two"
                }
              ]
            },
            {
              title : "Search Rea",
              menu : [
                {
                  title : "Search SSS",
                  action : "item.sss"
                },
                {
                  title : "Search Exact",
                  action : "item.exact"
                }
              ]
            },
            {
              title : "Search Mol",
              menu : [
                {
                  title : "Online",
                  action : "searchOnline"
                },
                {
                  title : "MAR SSS",
                  action : "searchMARSSS"
                },
                {
                  title : "MAR Exact",
                  action : "searchMARExact"
                }
              ]
            },
/*
            {
              title : "Search Text",
              menu : [
                {
                  title : "AND",
                  action : "item.and"
                },
                {
                  title : "OR",
                  action : "item.or"
                }
              ]
            },
*/
            {
              title : "Clear",
              action : "clear"
            },
            {
              title : "Selected",
              menu : [
                {
                  title : "Edit",
                  action : "editReaction"
                },
                {
                  title : "View",
                  action : "viewsel"
                },
                {
                  title : "Update",
                  action : "updatesel"
                }
              ]
            }
          ]; // end menus

          $scope.item = '';
          $scope.styling = 'Inverse';
          $scope.searchDisplay = 'Visible';true

          $scope.searchfn = function(){
            if($scope.search.terms.toUpperCase().indexOf("R ") >= 0){
                var ft = $scope.search.terms.substring(2, $scope.search.terms.length)
                getReactions( ft, "fulltext", $('#containerReaction'),"#myGridSearch") 
            }
            else {
              getMAR($scope.search.terms) 
            }

          }; // searchfn

          var tmp = window.location.pathname.split("/");
          $scope.navfn = function(action){
            switch(action){
              case 'item.one':
//                $location.path('/register/1');
                window.open(serverWeb + "/" + tmp[1] + "/index.html#/register/1", "_blank");
                break;
              case 'item.two':
//                $location.path('/view/1');                
                window.open(serverWeb + "/" + tmp[1] + "/index.html#/view/1", "_blank");
                break;
              case 'item.three':
                $scope.item = 'Item three selected.';
                break;
              case 'item.sss':
                  var ketcher = getKetcher();
                  searchSSS(ketcher);
                break;
              case 'item.exact':
                    alert('work in progress')
                break;
              case 'item.and':
                    alert('work in progress')
                break;
              case 'item.or':
                    alert('work in progress')
                break;
              case 'clear':
                    alert('work in progress')
                break;
              case 'searchOnline':
                  var ketcher = getKetcher();
                  searchOnline(ketcher);
                break;
              case 'searchMARSSS':
                  var ketcher = getKetcher();
                  searchMARSSS(ketcher);
                break;
              case 'searchMARExact':
                    alert('work in progress')
                    return
                  var ketcher = getKetcher();
                  searchMARSSS(ketcher);
                break;
              case 'viewsel':
                var expV = currentNB + "-" + currentPage
                if (expV=="-"){
                  alert("Please select a grid row")
                  return
                }
                //$location.path('/view/' + expV);
                window.open(serverWeb + "/" + tmp[1] + "/index.html#/view/" + expV)
                break;
              case 'updatesel':
                var expV = currentNB + "-" + currentPage
                if (expV=="-"){
                  alert("Please select a grid row")
                  return
                }
//                $location.path('/register/' + expV);
                window.open(serverWeb + "/" + tmp[1] + "/index.html#/register/" + expV)
                break;
              case 'editReaction':
                var expV = currentNB + "-" + currentPage
                if (expV=="-"){
                  alert("Please select a grid row")
                  return
                }
                $scope.$root.$broadcast("editReactionEvent", {                                      
                    value: ""
                });
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn

          $scope.toggleStyling = function(){
            $scope.inverse = !$scope.inverse;
            if(angular.equals($scope.inverse,true))
              $scope.styling = 'Inverse';
            else
              $scope.styling = 'Default';
          }; // end toggleStyling

          $scope.toggleSearchForm = function(){
            $scope.search.show = !$scope.search.show;
            if(angular.equals($scope.search.show,true))
              $scope.searchDisplay = 'Visible';
            else
              $scope.searchDisplay = 'Hidden';
          }; // end toggleSearchForm

          $scope.addMenu = function(){
            $scope.menus.push({
                title : "Added On The Fly!",
                action : "default"
            });
          }; // end test

          $scope.toggleAffixed = function(){
            switch($scope.affixed){
              case 'top':
                $scope.affixed = 'bottom';
                break;
              case 'bottom':
                $scope.affixed = 'none';
                break;
              case 'none':
                $scope.affixed = 'top';
                break;
            };
          }; // end toggleAffixed
  
  return $scope
}

var navBarRegister = function($scope, $location, user){
      /* navBar section*/
          $scope.affixed = 'top';
          $scope.search = {
            show : true,
            terms : ''
          };
          $scope.brand = "<span class='glyphicon glyphicon-user'></span> " + user;
          $scope.inverse = true;
          $scope.menus = [
            {
              title : "Move to",
              menu : [
                {
                  title : "Search",
                  action : "item.one"
                },
                {
                  title : "View",
                  action : "item.two"
                },
                {
                  divider: true
                },
                {
                  title : "Register Three",
                  action : "item.three"
                }
              ]
            },
            {
              title : "Register",
              menu : [
                {
                  title : "Detail",
                  action : "regdetail"
                },
                {
                  title : "Reaction Scheme",
                  action : "regSchema"
                },
                {
                  title : "Stoichiometry",
                  action : "regStoic"
                },
                {
                  title : "Procedure & workup",
                  action : "regProc"
                }
              ]
            },
            {
              title : "Reaction",
              menu : [
                {
                  title : "Create New Page",
                  action : "newPage"
                },
                {
                  title : "Clear Page",
                  action : "clearPage"
                },
                {
                  title : "Copy Page",
                  action : "copyPage"
                },
                {
                  title : "Edit Scheme",
                  action : "editReaction"
                },
                {
                  title : "Edit Procedure",
                  action : "editProcedure"
                },
                {
                  title : "Set Molecules",
                  action : "setMolecules"
                },
                {
                  title : "Find All",
                  action : "findAll"
                }
              ]
            },            
            {
              title : "Add to Reaction",
              menu : [
                {
                  title : "Reagent from Chemtools",
                  action : "addReaCT"
                },
                {
                  title : "Product from Chemtools",
                  action : "addProCT"
                },
                {
                  title : "Reagent from Bottle",
                  action : "addReaBott"
                },
                {
                  title : "Product from Bottle",
                  action : "addProBottle"
                },
                {
                  title : "Solvent",
                  action : "addSolvent"
                }
              ]
            },            
          ]; // end menus

          $scope.item = '';
          $scope.styling = 'Inverse';
          $scope.searchDisplay = 'Visible';true

          $scope.searchfn = function(){
            alert('Attempting search on: "' + $scope.search.terms + '"');
          }; // searchfn

          $scope.navfn = function(action){
            switch(action){
              case 'item.one':
                $location.path('/search');
                break;                
              case 'item.two':
                $location.path('/view/1');
                break;
              case 'item.three':
                break;
              case 'editReaction':
                $scope.$root.$broadcast("editReactionEvent", {                                      
                    value: ""
                });
                break;
              case 'regdetail':
                $scope.$root.$broadcast("regDetailEvent", {                                      
                    value: ""
                });
                break;
              case 'regSchema':
                $scope.$root.$broadcast("regSchemalEvent", {                                      
                    value: ""
                });
                break;
              case 'setMolecules':
                $scope.$root.$broadcast("setMoleculesEvent", {                                      
                    value: ""
                });
                break;
              case 'findAll':
                $scope.$root.$broadcast("findAllEvent", {                                      
                    value: ""
                });
                break;
              case 'editProcedure':
                $scope.$root.$broadcast("openProcedure", {                                      
                    value: "ciao ugo"
                });
                break;
              default:
                $scope.item = 'Default selection.';
                    alert("Working in progress")
                break;
            }; // end switch
          }; // end navfn
    return $scope
}

var navBarView = function($scope, $param, $location, user){
      /* navBar section*/
          $scope.affixed = 'top';
          $scope.search = {
            show : false,
            terms : ''
          };
          $scope.brand = "<span class='glyphicon glyphicon-user'></span>  " + user;
          $scope.inverse = true;
          $scope.menus = [
            {
              title : "Move to",
              menu : [
                {
                  title : "Search",
                  action : "item.one"
                },
                {
                  title : "Register",
                  action : "item.two"
                },
                {
                  divider: true
                },
                {
                  title : "Empty",
                  action : ""
                }
              ]
            },
            {
              title : "Update Reaction",
              action : "UpdateReaction"
            }
          ]; // end menus

          $scope.item = '';
          $scope.styling = 'Inverse';
          $scope.searchDisplay = 'Visible';

          $scope.searchfn = function(){
            alert('Attempting search on: "' + $scope.search.terms + '"');
          }; // searchfn

          var tmp = window.location.pathname.split("/");
          $scope.navfn = function(action){
            switch(action){
              case 'item.one':
                $location.path('/search/');
                
        //        window.open(window.location.origin +"/chembookAng/app/index.html#/search", "_self");
                break;
              case 'item.two':
                $location.path('/register/1');
  //              window.open(window.location.origin +"/chembookAng/app/index.html#/register/1", "_self");
                break;
              case 'item.three':
                break;
              case 'UpdateReaction':
                var expV = $scope.form.input.notebook + "-" + $scope.form.input.experiment
//                $location.path('/register/' + expV);
                window.open(serverWeb + "/" + tmp[1] + "/index.html#/register/" + expV)
                break;
              default:
                $scope.item = 'Default selection.';
                break;
            }; // end switch
          }; // end navfn
return $scope
}
                                                          
var tabsSearch = function($scope, $window){
  $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
  ];

  $scope.alertMe = function() {
    setTimeout(function() {
      $window.alert('You\'ve selected the alert tab!');
    });
  };
  return $scope
}

var graphChart = function ($scope,$param) {
  alert($param.id)

  $scope.chartTypes = [
    {"id": "line", "title": "Line"},
    {"id": "spline", "title": "Smooth line"},
    {"id": "area", "title": "Area"},
    {"id": "areaspline", "title": "Smooth area"},
    {"id": "column", "title": "Column"},
    {"id": "bar", "title": "Bar"},
    {"id": "pie", "title": "Pie"},
    {"id": "scatter", "title": "Scatter"}
  ];

  $scope.dashStyles = [
    {"id": "Solid", "title": "Solid"},
    {"id": "ShortDash", "title": "ShortDash"},
    {"id": "ShortDot", "title": "ShortDot"},
    {"id": "ShortDashDot", "title": "ShortDashDot"},
    {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
    {"id": "Dot", "title": "Dot"},
    {"id": "Dash", "title": "Dash"},
    {"id": "LongDash", "title": "LongDash"},
    {"id": "DashDot", "title": "DashDot"},
    {"id": "LongDashDot", "title": "LongDashDot"},
    {"id": "LongDashDotDot", "title": "LongDashDotDot"}
  ];

  $scope.chartSeries = [
    {"name": "Some data", "data": [1, 2, 4, 7, 3]},
    {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
    {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
    {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
  ];

  $scope.chartStack = [
    {"id": '', "title": "No"},
    {"id": "normal", "title": "Normal"},
    {"id": "percent", "title": "Percent"}
  ];

  $scope.addPoints = function () {
    var seriesArray = $scope.chartConfig.series;
    var rndIdx = Math.floor(Math.random() * seriesArray.length);
    seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
  };

  $scope.addSeries = function () {
    var rnd = []
    for (var i = 0; i < 10; i++) {
      rnd.push(Math.floor(Math.random() * 20) + 1)
    }
    $scope.chartConfig.series.push({
      data: rnd
    })
  }

  $scope.removeRandomSeries = function () {
    var seriesArray = $scope.chartConfig.series;
    var rndIdx = Math.floor(Math.random() * seriesArray.length);
    seriesArray.splice(rndIdx, 1)
  }

  $scope.removeSeries = function (id) {
    var seriesArray = $scope.chartConfig.series;
    seriesArray.splice(id, 1)
  }

  $scope.toggleHighCharts = function () {
    this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
  }

  $scope.replaceAllSeries = function () {
    var data = [
      { name: "first", data: [10] },
      { name: "second", data: [3] },
      { name: "third", data: [13] }
    ];
    $scope.chartConfig.series = data;
  };

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
    series: $scope.chartSeries,
    title: {
      text: 'Hello'
    },
    credits: {
      enabled: true
    },
    loading: false,
    size: {}
  }

  $scope.reflow = function () {
    $scope.$broadcast('highchartsng.reflow');
  };


};
















var formView = function($scope,$http,$param){

  $scope.tests = [
    { name: "Simple", data: 'detail.json' }
  ];

  $scope.selectedTest = $scope.tests[0];

  $scope.$watch('selectedTest',function(val){
    if (val) {      
      $http.get(val.data).then(function(res){
        $scope.schema = res.data.schema;
        $scope.form   = res.data.form;
        $scope.formR   = res.data.formR;
        $scope.schemaJson = JSON.stringify($scope.schema,undefined,2);
        $scope.formJson   = JSON.stringify($scope.form,undefined,2);
        $scope.modelData = res.data.model || {};
        if($param.experiment.length >1){
          var tmp = $param.experiment.split("-");
          $scope.modelData = getExperiment(tmp[0],tmp[1], $scope.modelData);
        }            
/*
        $scope.modelData.batch_creator = "Leeroy Jenkinsdddd";
        $scope.modelData.yield = "10";
*/
      });
    }
  });

  $scope.decorator = 'bootstrap-decorator';

  $scope.itParses     = true;
  $scope.itParsesForm = true;

  $scope.$on("myEvent", function (event, args) {
      if($scope.ngform!= undefined){
        $scope.submitForm($scope.ngform);
      }
  });
  
  $scope.$on("openExperiment", function (event, args) {
          var tmp = args.value.split("-");
          $scope.modelData = getExperiment(tmp[0],tmp[1], $scope.modelData);
  });
  
  $scope.$watch('schemaJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.schema = JSON.parse($scope.schemaJson);
        $scope.itParses = true;
      } catch (e){
        $scope.itParses = false;
      }
    }
  });

  $scope.$watch('formJson',function(val,old){
    if (val && val !== old) {
      try {
        $scope.form = JSON.parse($scope.formJson);
        $scope.itParsesForm = true;
      } catch (e){
        $scope.itParsesForm = false;
      }
    }
  });

  $scope.pretty = function(){
    return JSON.stringify($scope.modelData,undefined,2,2);
  };

  $scope.log = function(msg){
    console.log("Simon says",msg);
  };

  $scope.sayNo = function() {
    alert('Noooooooo');
  };

  $scope.say = function(msg) {
    alert(msg);
  };

  $scope.submitForm = function(form, model) {
    // First we broadcast an event so all fields validate themselves
    $scope.$broadcast('schemaFormValidate');
    // Then we check if the form is valid
    if (form.$valid) {
      updateExperimentDetail($scope.modelData);
      alert('You did it!');
    }
  }
  
  return $scope
}     

