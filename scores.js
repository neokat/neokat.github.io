$().ready(function(){
    $.getJSON( "/scores.json", function( data ) {
    console.log(data);
    $("#last_updated").html(data["last_updated"]);

    scores_html = build_table(data["scores"]);

    $("#score_contents").html(scores_html);

  });
});

function build_table(score_data) {
    for (score in score_data) {
        return string.concat(
            "<tr><td style=\"text-align: center !important;\"><img src=\"",
            score["team_logo"],
            "\" width=\"50px\"></td><td>",
            score["username"],
            "</td><td>",
            score["yyb_wins"],
            "</td><td>1</td><td>100</td><td>370</td><td>3,500</td><td>10,714</td><td>All-Star</td></tr>\n"
        )
    }
}