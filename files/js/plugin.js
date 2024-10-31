var $placesurf = jQuery.noConflict();

tinyMCEPopup.requireLangPack();

var ed, url, anchortext;

var geocoder;
var placesurf_map=null;
var markersArray=[];

function init() {

	anchortext = jQuery.trim(tinyMCE.activeEditor.selection.getContent());

	document.getElementById("searchtext").value = anchortext;
	document.getElementById("placename").value = anchortext;

	ed = tinyMCEPopup.editor;
	tinyMCEPopup.resizeToInnerSize();
	//TinyMCE_EditableSelects.init();
}


function body_onload(){
	placesurf_loadmap();
}


function insertPlacemark(url) {

	  tinyMCEPopup.restoreSelection();
		//var anchortext = tinyMCE.activeEditor.selection.getContent();
		var stitle = '\n     PlaceSurf.com link - jumping to this link requires Google Earth to be installed.\n\nSee PlaceSurf.com for more details.';
		var html = '';
		html += " <a href=\'" + url + "\'  title=\'" + stitle + "\' style='padding:0px;margin:0px;' ><img border=0 height=12 width=12 src=\'" + tinyMCEPopup.getWindowArg("plugin_url") + "/img/gearth.jpg' style='text-decoration:none;border-style:none;border-width:0px;vertical-align:baseline;padding:0px;margin:0px 1px 0px 0px;float:none;display:inline;position:static;height:12px;width:12px;' />";
		html += anchortext;
		html += "</a> ";

		ed.execCommand('mceInsertContent',false,html);
		tinyMCEPopup.close();
}

tinyMCEPopup.onInit.add(init);

function placesurf_loadmap(){
		try{
				var c=new google.maps.LatLng(-32.044464858785716,33.573687500000005);
				var d={
							 zoom:1
							,center:c
							,mapTypeId:google.maps.MapTypeId.HYBRID
							,draggableCursor:"pointer"
							,draggingCursor:"default"
					};
				placesurf_map=new google.maps.Map(document.getElementById("placesurf_map"),d);
				google.maps.event.addListener(placesurf_map,"click",function(a){setMarker(a.latLng)});
		}catch(err){

			  var html = "";
			  html += "<div style='text-align:center;vertical-align:center;font-size:14px;padding:20px;'>\n";
			  html += "<p>&nbsp;</p>To view Google Maps in this plugin, you need a <p><b>Google Maps Api key</b><p> for this domain. Its fast and easy and just requires a Google account!	<p>\n";
			  html += "<a href='http://code.google.com/apis/maps/signup.html' target=_blank>Click here to get your key</a>\n";

				document.getElementById("placesurf_map").innerHTML = html;


   }
}

function setMarker(e){

			setlatlonghighlight(true);
			setTimeout("setlatlonghighlight(false)",250);
			setTimeout("setlatlonghighlight(true)",500);
			setTimeout("setlatlonghighlight(false)",750);

			deleteOverlays();
			marker=new google.maps.Marker({position:e,map:placesurf_map,title:"Placesurf location",clickable:false});
			placesurf_map.setCenter(e);

			var dms = '';
			dms = decimal2dms(e);

			var lat=e.lat();
			var lng=e.lng();

			lat=lat.toFixed(6);
			lng=lng.toFixed(6);


			document.getElementById("declatlng").innerHTML='Lat: ' + lat + ' &nbsp; Lng: ' + lng;
			document.getElementById("dmslatlng").innerHTML='DMS: &nbsp;' + dms[0]+ ' &nbsp; ' + dms[1];

			document.getElementById("latitude").value=lat;
			document.getElementById("longitude").value=lng;
			document.getElementById("latitude").style.backgroundColor="#FFFFFF";
			document.getElementById("longitude").style.backgroundColor="#FFFFFF";
			markersArray.push(marker);

			$placesurf("#placename").focus();
}


function setlatlonghighlight(b){
	if(b==true){
				document.getElementById("latitude").style.color="red";
				document.getElementById("longitude").style.color="red";
	}
	else{
				document.getElementById("latitude").style.color="black";
				document.getElementById("longitude").style.color="black";
	}
}


function deleteOverlays(){

	if(markersArray){
		for(i in markersArray){
				markersArray[i].setMap(null)
		}
		markersArray.length=0
	}
}


function placesurf_searchmap(){
		var b=jQuery.trim(document.getElementById("searchtext").value);
		if(b==""){return;}
		if(!geocoder){
				geocoder=new google.maps.Geocoder();
		}

		geocoder.geocode({address:b},function(d,a){
									if(a==google.maps.GeocoderStatus.OK){
										placesurf_map.setCenter(d[0].geometry.location);
										placesurf_map.setZoom(13)
									}
									else{
											alert("Location was not successful for the following reason: " + a)
									}
		})
}

function placesurf_searchmapclear(){
		document.getElementById("searchtext").value = "";
		$placesurf("#searchtext").focus();
}


function key_down(c){

		var d=c.which;
		if(d==undefined){
				d=c.keyCode
		}

		switch(d){
		case 13:
				placesurf_searchmap();
		break;

		case 27:
				document.getElementById("searchtext").value="";
		break;
		default:
		}
}


function textCounter(){

		var maxchar=250;
		var desc=document.getElementById("description");
		var lendesc=document.getElementById("len_description");

		if(desc.value.length>maxchar){
					desc.value = desc.value.substring(0,maxchar);
		}else{
					lendesc.value = maxchar - desc.value.length;
		}

		if(lendesc.value==0){
			lendesc.style.backgroundColor = "#FF9999";
		}else{
			lendesc.style.backgroundColor = "#FFFFFF";
		}
}


function placesurf_clearfields(){

			document.getElementById("declatlng").innerHTML="";
			document.getElementById("dmslatlng").innerHTML="";
			document.getElementById("latitude").value="";
			document.getElementById("longitude").value="";
			document.getElementById("placename").value="";
			document.getElementById("description").value="";
			document.getElementById("len_description").value="250";
			document.getElementById("latitude").style.backgroundColor="#FFFFFF";
			document.getElementById("longitude").style.backgroundColor="#FFFFFF";
			document.getElementById("placename").style.backgroundColor="#FFFFFF";
			document.getElementById("description").style.backgroundColor="#FFFFFF";
			document.getElementById("len_description").style.backgroundColor="#FFFFFF";

			$placesurf("#latitude").focus()
}


function placesurf_constructurl()
{
				document.getElementById("latitude").value    = jQuery.trim(document.getElementById("latitude").value);
				document.getElementById("longitude").value   = jQuery.trim(document.getElementById("longitude").value);
				document.getElementById("placename").value   = jQuery.trim(document.getElementById("placename").value);
				document.getElementById("description").value = jQuery.trim(document.getElementById("description").value);

				var lat=document.getElementById("latitude").value;
				var lng=document.getElementById("longitude").value;
				var place=document.getElementById("placename").value;
				var desc=document.getElementById("description").value;

				var msg='';
				var error_colour="#FF9999";

				document.getElementById("latitude").style.backgroundColor  = "#FFFFFF";
				document.getElementById("longitude").style.backgroundColor = "#FFFFFF";
				document.getElementById("placename").style.backgroundColor = "#FFFFFF";

				if(place==""){
						msg=msg+"Placename\n\n";
						document.getElementById("placename").style.backgroundColor = error_colour;
						$placesurf("#placename").focus()
				}
				if(validlatlong(lng)==0){
						msg=msg+"Longitude\n\n";
						document.getElementById("longitude").style.backgroundColor = error_colour;
						$placesurf("#longitude").focus()
				}
				if(validlatlong(lat)==0){
						msg=msg+"Latitude\n\n";
						document.getElementById("latitude").style.backgroundColor = error_colour;
						$placesurf("#latitude").focus()
				}


				if(msg!=""){
							msg="\nPlease specify a valid value for the following field(s):-\n\n" + msg;
							alert(msg);
							return "";
				}else{

						 return makeurl(lat, lng, place, desc);
				}
}




	function placesurf_testlink()
	{
		var url = placesurf_constructurl();
		if(url!="")
		{
				location.href = url;
		}
	}

	function placesurf_insertlink()
	{
		var url = placesurf_constructurl();
		if(url!="")
		{
			insertPlacemark(url);
		}
	}


function input_onkeydown(b){
			b.style.backgroundColor="#FFFFFF"
}

