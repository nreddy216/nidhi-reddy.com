$(document).ready(function(){



  // NAVIGATION ANIMATION
  $('.nav-hide').toggleClass('hide');

  $('.nav-show').on('click', function(){
    $('.nav-hide').toggleClass('hide');
    $('.nav-show').toggleClass('nav-float-right');
  });


  //HOVER OVER LOGO
  $(".logo img").hover(function() {
		$(this).attr("src","./images/logo/fullname_pronunciation.svg");
			}, function() {
		$(this).attr("src","./images/logo/fullname_lowercase_logo_black.svg");
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

});
