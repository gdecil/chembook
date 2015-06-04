function getMoleculePicture64(corpid) {
//   debugger;
   var webServiceURL = 'http://chemserver:8084/testjscript/Service1.asmx/getPicture64FromCorpId?corpid=' + corpid +'&width=256&height=256&format=png';
   if (navigator.appVersion.indexOf("MSIE") != -1){
	   $.ajax({
			url: webServiceURL,
			success: function(xml) {
//                debugger;
				var im = '<img src="data:image/png;base64,'+ xml.firstChild.nextSibling.text +'" width="256" height="256" alt="' + corpid + '">';
				$('<h3></h3>')
				.html(im)
				.appendTo('#image');
			},
			error: function() { alert("error"); }
					});
   }
   else {
		   $.ajax({
			url: webServiceURL,
			success: function(xml) {
			   // debugger;

				var im = '<img alt="'+ corpid +'" src="data:image/png;base64,'  +  xml.firstChild.firstChild.data + '" width="256" height="256" >';
				$('<h3></h3>')
				.html(im)
				.appendTo('#image');   
			},
			error: function() { alert("error"); }
					});
	}
};

function getStructure(corpid) {
//   debugger;
   var webServiceURL = 'http://chemserver:8084/testjscript/Service1.asmx/getPicture64FromCorpId?corpid=' + corpid +'&width=256&height=256&format=png';
   var im ;
   var test = 'pippo';
   if (navigator.appVersion.indexOf("MSIE") != -1){
	   $.ajax({
			url: webServiceURL,
			success: function(xml) {
//                debugger;
				im = '<img src="data:image/png;base64,'+ xml.firstChild.nextSibling.text +'" width="256" height="256" alt="' + corpid + '">';
			},
			error: function() { alert("error"); }
					});
   }
   else {
		   $.ajax({
			url: webServiceURL,
			success: function(xml,test) {
//                debugger;
				 test='ugo';
//                  im = im + ' src="data:image/png;base64,'  +  xml.firstChild.firstChild.data + '" width="256" height="256" >';
				$html('<img alt="'+ corpid +'" src="data:image/png;base64,'  +  xml.firstChild.firstChild.data + '" width="256" height="256" >')
				;
//                alert(im);
			},
			error: function() { alert("error"); }
					});
	}
//    alert('pippo ' + im);
	return test;
};

function getStructureEmbedded(corpid) {
//   debugger;
   var webServiceURL = 'http://chemserver:8084/testjscript/Service1.asmx/getPicture64FromCorpId?corpid=' + corpid +'&width=256&height=256&format=png';
   var im ;
   if (navigator.appVersion.indexOf("MSIE") != -1){
	   $.ajax({
			url: webServiceURL,
			async: false,
			success: function(xml) {
				im = '<img src="data:image/gif;base64,' + xml.firstChild.nextSibling.text +  '" alt="British Blog Directory" width="128" height="128" />';
//                im = 'data:image/gif;base64,' + xml.firstChild.nextSibling.text ;
			},
			error: function() { alert("error"); }
					});
   }
   else {
		   $.ajax({
			url: webServiceURL,
			async: false,
			success: function(xml,test) {
			  im = '<img src="data:image/gif;base64,' + xml.firstChild.firstChild.data +  '" alt="British Blog Directory" width="128" height="128" />';
//              im = 'data:image/gif;base64,' + xml.firstChild.firstChild.data ;
			},
			error: function() { alert("error"); }
					});
	}
	return im;
//    return 'data:image/gif;base64,' + im;
};

function start_ajax()
{
	$ajax( "http://localhost/ajax.example.php", {
		success: function (data)
		{
			$html( $("box"), "[Tom]<br />age: " + data["Tom"]["age"] + "<br />phone: " + data["Tom"]["phone"] + "<br />email: " + data["Tom"]["email"] );
		},
		error: function ()
		{
			'pippo';
		}
	});
}
function getDataCorpid(corpid, testType) {
//   debugger;                   http://chemserver:8084/NmsCoreUtility
   var webServiceURL = 'http://chemserver:8084/NmsCoreUtility/BioDataServices.asmx/getDataCorpId?corpid=' + corpid +
	'&testType='+ testType ;
   $.ajax({
		url: webServiceURL,
		success: function(xml) {
			$(xml).find('Table').each(function(){
					var id_text     = $(this).find('CMP_ID').text();
					var corpid     = $(this).find('CORP_ID').text();
					//debugger;
					var PROMISCUITY     = $(this).find('PROMISCUITY').text();
					var RUNSET_COUNT   = $(this).find('RUNSET_COUNT').text();
					var TARGET_COUNT   = $(this).find('TARGET_COUNT').text();
					var OTHER_PLATFORM   = $(this).find('OTHER_PLATFORM').text();

					if(testType == 'spa') 
                    {
						$().html('Activity profile of ' + id_text + ' - KSS');
					}
					else if(testType == 'proliferation') 
                    {
						$().html('Activity profile of ' + id_text + ' - Proliferation');
					}
					else 
                    {
						$().html('Activity profile of ' + id_text + ' - ???????');
					}

					if(testType == 'spa') {
						$('<h1></h1>')
						 .html('KSS activity profile')
						 .appendTo('#image');
					}
		            else if (testType == 'proliferation') 
                    {
						$('<h1></h1>')
						 .html('Proliferation activity profile')
						 .appendTo('#image');
					}
		            else 
                    {
						$('<h1></h1>')
						 .html('????? activity profile')
						 .appendTo('#image');
					}

					$('<h2></h2>')
					 .html( corpid )
					 .appendTo('#corpid');
					 
					$('<h3></h3>')
					 .html(PROMISCUITY )
					 .appendTo('#promiscuity');
					$('<h3></h3>')
					 .html(RUNSET_COUNT )
					 .appendTo('#runset');
					$('<h3></h3>')
					 .html(TARGET_COUNT )
					 .appendTo('#target');
					$('<h3></h3>')
					 .html(OTHER_PLATFORM )
					 .appendTo('#other');
					});
				},
		error: function() { alert("error"); }
				});
};
function testAjax(corpid) {
   var webServiceURL = 'http://chemserver:8084/testjscript/Service1.asmx/getPicture64FromCorpId?corpid=' + corpid;
   $.ajax({
		url: webServiceURL,
		success: function(xml) {
//            debugger;

			var im = '<img alt="'+ corpid +'" src="data:image/gif;base64,'  +  xml.firstChild.firstChild.data + '" width="128" height="128" >';
			$('<li></li>')
			.html(im)
			.appendTo('#image');   
		},
		error: function() { alert("error"); }
				});
};

function ShowXMLData(xml, corpid)
{
	debugger;
	try
	{
		var im = '<img src="data:image/gif;base64,'  +  xml.firstChild.firstChild.data + '" width="256" height="256" alt="'+ corpid +'">';
		$('<li></li>')
		 .html(im)
		 .appendTo('#image');       
	}
	catch(err)
	{
		var txt="There was an error on this page.\n\n";
		txt+="Error description: " + err.description + "\n\n";
		txt+="Click OK to continue.\n\n";
		alert(txt);
	}
}

function test(corpid) {
		 return corpid + 'ugo';
};
