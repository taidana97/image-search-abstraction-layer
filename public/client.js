$(document).ready(function () {
  var i6 = $("#i6");

  $("#incrementOffset").click(() => {
    let valI6 = i6.val();
    if (valI6 === "") {
      i6.val(1);
    } else {
      valI6++;
      i6.val(valI6);
    }
  });

  $("#decrementOffset").click(() => {
    let valI6 = i6.val();
    if (valI6 === "" || valI6 <= 1) {
      i6.val(1);
    } else {
      valI6--;
      i6.val(valI6);
    }
  });

  $("#btnSearch").on("click", () => {
    $("#refresh-response").toggleClass("hidden");
    $("#jsonResponse").find("p").remove();

    var i5 = $("#i5").val();
    var i6 = $("#i6").val();

    i6 = i6 == "" ? 1 : i6;

    if (i5 != "") {
      $.ajax({
        url: "/api/search/" + i5 + "?offset=" + i6,
        type: "get",
        success: function (data) {
          console.log(data);
          $("#refresh-response").toggleClass("hidden");
          data.forEach((ele) => {
            $("<p/>", {
              style: "word-wrap: break-word;",
              html: JSON.stringify(ele),
            }).appendTo("#jsonResponse");
          });
        },
      });
    }
  });

  GetBrowse();

  $("#clear-response").on("click", function () {
    $("#jsonResponse").find("p").remove();
  });

  $("#clearBrowse").on("click", function () {
    $("#browseSearch").find("p").remove();
    $("#refreshBrowse").toggleClass("hidden");
    GetBrowse();
  });
});

function GetBrowse() {
  $.getJSON("/api/latest/imagesearch/", (data) => {
    $("#refreshBrowse").toggleClass("hidden");

    data.forEach((ele) => {
      $("<p/>", {
        style: "word-wrap: break-word;",
        html: `Date: ${ele.when} - Search: ${ele.term}`,
      }).appendTo("#browseSearch");
    });
  });
}
