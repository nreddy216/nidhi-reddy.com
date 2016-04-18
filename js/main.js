$(document).ready(function(){

  // split your email into two parts and remove the @ symbol
  var first = "nidhi.sama.reddy";
  var last = "gmail.com";


  // NAVIGATION ANIMATION
   $(".button-collapse").sideNav();



  //HOVER OVER thumbnail
  $(".image-overlay").hover(function() {
       $(this).animate({opacity: '0.9'}, 200)},
       function() {
       $(this).animate({opacity: '0'}, 200);
  });



  // tipewriter by roXon // modified by me

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


  // slider
  $('.slider').slider({full_width: true});

});
