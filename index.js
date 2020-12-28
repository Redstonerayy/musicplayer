/* requirements  */
const fs = require('fs');
var { Howl, Howler } = require('howler'); //using const causes an error

/* config */
musicfolderpath = "";
exportpath = "";


/* ==============================================================
                      FUNCTIONS
============================================================== */


button = document.getElementsByTagName('button')[0];

button.addEventListener('click', () => {
  var sound = new Howl({
    src: ['hateme.mp4']
  });
  sound.play();
  Howler.volume(0.1);
});
