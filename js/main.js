$(document).ready(function(){

  // NAVIGATION ANIMATION-----------------------------------------------------
   $(".button-collapse").sideNav();

  // tipewriter by roXon // modified by me------------------------------------
  var $el = $('.subtitle'),
      txt = $el.text(),
      txtLen = txt.length,
      timeOut,
      char = 0;

  (function typeIt() {
      var humanize = Math.round(Math.random() * (200 - 30)) + 30;
      timeOut = setTimeout(function() {
          char++;
          var type = txt.substring(0, char);
          $el.text(type);
          typeIt();

          if (char == txtLen) {
              clearTimeout(timeOut);
          }

      }, humanize);
  }());


  //HOVER OVER thumbnail-------------------------------------------------------
  $(".image-overlay").hover(function() {
       $(this).animate({opacity: '0.9'}, 200)},
       function() {
       $(this).animate({opacity: '0'}, 200);
  });

});
