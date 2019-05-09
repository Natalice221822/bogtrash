<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&amp;libraries=visualization&amp;key=AIzaSyDVXzYzDGWFWNNklAKiYImMIkIpwfhEyVE&amp;unused-google-fusiontables"></script>

<script type="text/javascript">
  if (window.location.protocol == "file:") {
    alert('This script only works when loaded from a web server,' +
        ' not from a file on your computer.');
  }

function showPosition(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;

  var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=
  "+latlon+"&zoom=14&size=400x300&sensor=false&key=YOUR_:KEY";

  document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
}
  function ftOnLoadClientApi() {
  }
</script>
<script type="text/javascript" src="https://apis.google.com/js/client.js?onload=ftOnLoadClientApi">
</script>

<script type="text/javascript">
  var map;

  function loadApi() {
    gapi.client.load('fusiontables', 'v1', initialize);
  }

  function initialize() {
    var isMobile = (navigator.userAgent.toLowerCase().indexOf('android') > -1) ||
      (navigator.userAgent.match(/(iPod|iPhone|iPad|BlackBerry|Windows Phone|iemobile)/));
    if (isMobile) {
      var viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute('content', 'initial-scale=1.0, user-scalable=no');
    }
    var mapDiv = document.getElementById('googft-mapCanvas');
    mapDiv.style.width = isMobile ? '100%' : '500px';
    mapDiv.style.height = isMobile ? '100%' : '300px';
    map = new google.maps.Map(mapDiv, {
      center: new google.maps.LatLng(4.761292195080712, -74.0415649444356),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId['ROADMAP']
    });
    var query = 'select col10 from 11P8FRbqul5DP4jdmn-kWUXWA4fD1FS9NmT1FcTQL limit 1000';
    var request = gapi.client.fusiontables.query.sqlGet({ sql: query });
    request.execute(function(response) {
      onDataFetched(response);
    });
  }

  function onDataFetched(response) {
    if (response.error) {
      alert('Unable to fetch data. ' + response.error.message +
          ' (' + response.error.code + ')');
    } else {
      drawHeatmap(extractLocations(response.rows));
    }
  }

  function extractLocations(rows) {
    var locations = [];
    for (var i = 0; i < rows.length; ++i) {
      var row = rows[i];
      if (row[0]) {
        var geometry = row[0].geometry;
        var weight = row[1];
        if (geometry.type === 'Point') {
          var lat = geometry.coordinates[1];
          var lng = geometry.coordinates[0];
          var latLng = new google.maps.LatLng(lat, lng);
          locations.push({ location: latLng, weight: parseFloat(weight) });
        }
      }
    }
    return locations;
  }

  function drawHeatmap(locations) {
    var heatmap = new google.maps.visualization.HeatmapLayer({
       dissipating: true,
       gradient: [
         'rgba(102,255,0,0.0)', 
         'rgba(147,255,0,1.0)', 
         'rgba(193,255,0,1.0)', 
         'rgba(238,255,0,1.0)', 
         'rgba(244,227,0,1.0)', 
         'rgba(244,227,0,1.0)', 
         'rgba(249,198,0,1.0)', 
         'rgba(255,170,0,1.0)', 
         'rgba(255,113,0,1.0)', 
         'rgba(255,57,0,1.0)', 
         'rgba(255,0,0,1.0)'
       ],
       opacity:  0.55 ,
       radius:  50.0 ,
       data: locations
    });
    heatmap.setMap(map);
  }

  google.maps.event.addDomListener(window, 'load', loadApi);
</script>