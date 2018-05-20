// var element = $('.notification__list__item');
//
// document.addEventListener('touchstart', handleTouchStart(element));
// document.addEventListener('touchmove', handleTouchMove(element));
//
// var xDown = null;
// var yDown = null;
//
// function handleTouchStart(evt) {
//   xDown = evt.originalEvent.touches[0].clientX;
//   yDown = evt.originalEvent.touches[0].clientY;
// }
//
// function handleTouchMove(evt) {
//   if ( ! xDown || ! yDown ) {
//     return;
//   }
//
//   var xUp = evt.originalEvent.touches[0].clientX;
//   var yUp = evt.originalEvent.touches[0].clientY;
//
//   var xDiff = xDown - xUp;
//   var yDiff = yDown - yUp;
//
//   if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
//     if ( xDiff > 0 ) {
//       /* left swipe */
//       //$(this).addClass('swipe');
//       console.log('swipe left');
//     } else {
//       /* right swipe */
//       //$('').removeClass('swipe');
//       console.log('swipe right');
//     }
//   } else {
//     if ( yDiff > 0 ) {
//       /* up swipe */
//     } else {
//       /* down swipe */
//     }
//   }
//   /* reset values */
//   xDown = null;
//   yDown = null;
// }