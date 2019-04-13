$(document).ready(function () {
    $("#indexCarousel").carousel({ interval: 2000 });
    $("#carouselButton").click(function () {
        if ($("#carouselButton").children("span").hasClass("fa-pause")) {
            $("#indexCarousel").carousel("pause");
            $("#carouselButton").children("span").removeClass("fa-pause");
            $("#carouselButton").children("span").addClass("fa-play");
        }
        else if ($("#carouselButton").children("span").hasClass("fa-play")) {
            $("#indexCarousel").carousel("cycle");
            $("#carouselButton").children("span").removeClass("fa-play");
            $("#carouselButton").children("span").addClass("fa-pause");
        }
    });
});

$(document).ready(function(){
    $("#reserveButton").click(function (){
        $("#reserveModal").modal("show");
    });
});