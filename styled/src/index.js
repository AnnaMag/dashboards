function parseanddraw() {
 loadJSON(function(response) {
    drawdashboard(JSON.parse(response));
 });
}

parseanddraw();
