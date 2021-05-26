$().ready(function(){
    $.getJSON( "/scores.json", function( data ) {
    console.log(data);
    $("#text").html(data["last_updated"]);
  });
});