
function getNavigator(parameters) { 
    //navbar-static-top
    
var navigator1 = "<div class='container'>" +
"       <div class='navbar navbar-inverse navbar-fixed-bottom' role='navigation'> "+
"          <div class='container'>" +
"            <div class='navbar-header'>" +
"              <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>" +
"               <span class='sr-only'>Toggle navigation</span>" +
"               <span class='icon-bar'></span>" +
"              <span class='icon-bar'></span>" +
"              <span class='icon-bar'></span>" +
"            </button>" +
"            <a class='navbar-brand' href='#'>QualcheIdea</a>" +
"            </div>" +
"            <div class='navbar-collapse collapse'>" +
"              <ul class='nav navbar-nav'>" +
"                <li class='active'><a href='/'>Home</a></li>" +
"                <li><a href='#about'>About</a></li>" +
"                <li><a href='/contact.html'>Contact</a></li>" +
"                <li class='dropdown'>" +
"                  <a href='#' class='dropdown-toggle' data-toggle='dropdown'>Controlli <b class='caret'></b></a>" +
"                  <ul class='dropdown-menu'>" +
"                    <li><a href='/controlli/Tabs.html'>Tabs</a></li>" +
"                    <li><a href='/controlli/SmartWizard.html'>Smart Wizard</a></li>" +
"                    <li><a href='#'>Grid</a></li>" +
"                  </ul>" +
"                </li>" +
"              </ul>" +
"            </div>" +
"          </div>" +
"        </div>" +
"      </div>";    

    $('.navbar-wrapper').append(navigator1)
}

function getBreadCrumb(parameters) {
    
}
//"                    <li class='divider'></li>" +
//"                    <li class='dropdown-header'>Nav header</li>" +
//"                    <li><a href='#'>Separated link</a></li>" +
//"                    <li><a href='#'>One more separated link</a></li>" +

