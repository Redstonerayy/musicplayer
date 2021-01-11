/* requirements  */
const fs = require('fs');
const os = require('os');
var { Howl, Howler } = require('howler'); //using const causes an error


/* config */
console.log(__dirname);
musicfolderpath = __dirname + "/video/"; // ""
exportpath = os.homedir();
fileextregex = RegExp(".mp3|.mpeg|.opus|.ogg|.oga|.wav|.aac|.caf|.m4a|.mp4|.weba|.webm|.dolby|.flac");


/* ==============================================================
                      FUNCTIONS
============================================================== */

/* Intervals  */

function updatefilenames(path) {
  new Promise((resolve, reject) => {
    let temp = [];
    fs.readdir(path, {withFileTypes: true}, (err, filenames) => {
      if(err){
        reject("Error reading directory");
      }
      filenames.forEach((item) => {
        fs.stat(path + item["name"], (err, stats) => {
          if(stats.isFile()){
            if(fileextregex.test(item["name"])){
              temp.push(item["name"]);
            }
          }
        });
      });
      resolve(temp);
    });
  }).then((filenames) => {
    if(files == filenames){
    } else {//update all songs GUI
      let newfiles = filenames.filter(file => !files.includes(file));
      let removedfiles = files.filter(file => !filenames.includes(file));
      for (var i = 0; i < removedfiles.length; i++) {
        allsongs.removesongwidget(allsongs, removedfiles[i]);
      }
      for (var i = 0; i < newfiles.length; i++) {
        songwidget(newfiles[i]);
      }
    }
    files = filenames;
  })
  .catch(error => console.log(error));
}


function updateslider(){
  if(current_song != null){
    slidervalue = progressslider[0].value;
    if(slidervalue != previoustime){
      current_song.settime(slidervalue)
      previoustime = slidervalue;
    } else {
      songtime = Math.round(current_song.gettime());
      progressslider[0].value = songtime;
      previoustime = songtime;
    }
    timeleft.innerHTML = converttimeformat(previoustime);
  }
}


/* Utility  */

function converttimeformat(timesec) {
  if(timesec != 0){
    min = Math.ceil(timesec/60) - 1;
    sec = timesec - (min * 60);
    sep = ":"
    if(sec < 10){
      sep += "0";
    }
    return min.toString() + sep + sec.toString();
  } else {
    return "0:00";
  }
}

function exportaszip() {
}

function readplaylistdata(filename){
  fs.readFile(filename, "utf8", (err, data) => {
    //get lines
    var lines = data.split(/\r?\n/);
    lines = lines.filter(line => line != "");
    //write in object
    key = null;
    playlists = {};
    lines.forEach((item) => {
      if(item.slice(0,1) == "#"){//sign for a playlist
        if(!playlists.hasOwnProperty(item.slice(1))){
          playlists[item.slice(1)] = [];
        }
        key = item.slice(1);//the following belong to this playlist(key) until the next #
      } else if(key != null) {
        if(!(playlists[key].includes(item))){
          playlists[key].push(item);
        }
      } else{
        //some idiot put lines at the start
      }
    });
    //console.log(playlists); //debug xD
  });
}

/* GUI  */

function songwidget(parent, songname){
  let songdiv = document.createElement("div");
  songdiv.id = songname;
  songdiv.className = "song-widget";
  //append events
  songdiv.draggable = true;
  songdiv.ondragstart = dragstart;
  songdiv.ondragover = dragover;
  songdiv.ondrop = droponsong;
  //title
  let songtitle = document.createElement("span");
  songtitle.innerHTML = songname.split(".")[0];
  songtitle.style.color = "white";
  //image
  let kebabmenu = document.createElement("img");
  kebabmenu.src = "images/kebabmenu.png";
  //append elements
  songdiv.appendChild(songtitle);
  songdiv.appendChild(kebabmenu);
  parent.appendChild(songdiv);
}

function removesongwidget(songname){
  document.getElementById(songname).remove();
  for(let i = 1; i < songwidgetcount + 1; i++){
    document.getElementById(songname + "." + (i).toString()).remove();
  }
}

/* events for drag and drop  */

function dragover(ev) {
  ev.preventDefault(); //normally you can`t drop an element into another
}

function dragstart(ev) {
  ev.dataTransfer.setData("id", ev.target.id);
}

function droponplay(ev, target) {
  ev.preventDefault(); //default ondrop is open as link
  if(ev.target == target){//only when directly dropped on this
    let insertelement = document.getElementById(ev.dataTransfer.getData("id")).cloneNode(true);//clones
    // all elements need a unique id. to be able to retrieve the song name, the
    // syntax is songname.clonenumber
    songwidgetcount[insertelement.id] += 1;
    insertelement.id += "." + (songwidgetcount[insertelement.id]).toString();
    if(insertelement.id = "drag"){
      insertelement.id = "";
      document.getElementById("drag").id = "";
    } else {
      insertelement.id = "";
    }
    //add to queqe
    queqe.addsong(insertelement.id);
    target.appendChild(insertelement); //append as last to target element
  }
}

function droponsong(ev){
  console.log(document.getElementById(ev.dataTransfer.getData("id")).parentNode.className);
  if(ev.target.tagName != "DIV"){
    var target = ev.target.parentNode;
  } else {
    var target = ev.target;
  }
  if(document.getElementById(ev.dataTransfer.getData("id")).parentNode.className == "playlist"){
    var insertelement = document.getElementById(ev.dataTransfer.getData("id")).cloneNode(true);//does clone
    songwidgetcount[insertelement.id] += 1;
    insertelement.id += "." + (songwidget[insertelement.id]).toString();
    var remove = false;//if the song is moved and needs to be removed from play queqe
  } else {
    var insertelement = document.getElementById(ev.dataTransfer.getData("id"));//does not clone
    var remove = true;
  }
  //add to queqe
  if(remove){
    let songdivs = target.parentNode.children;
    droppedon = songdivs.indexOf(target);
    indexel = songdivs.indexOf(insertelement);
    queqe.removesong(indexel);
    queqe.addsong(insertelement.id.split(".")[0], droppedon + 1);
  }

  target.parentNode.insertBefore(insertelement, target.nextSibling); //append after target element
}


/* ==============================================================
                      CLASSES
============================================================== */


// plays the current song and makes pause usw. possible
// there will only one song, the current song that is played
// wrapped Howl methods in my own class

function song(filename, slider){
  //init
  previoustime = 0;
  this.song = new Howl({
    src: [filename]
  }).on('load', () => {
    //get duration and set range slider
    this.duration = this.song._duration;
    timeright.innerHTML = converttimeformat(Math.ceil(this.duration));
    if(slider){
      progressslider[0].max = Math.ceil(this.duration);
    }
  });

  //methods
  this.playpauseresume = () => {
    if(!current_song.song.playing()){
      this.song.play();
    } else {
      this.pause(false);
    }
  }

  this.pause = (reset) => {
    if(reset){
      this.song.stop();
    } else {
      this.song.pause();
    }
  }

  this.mute = (mute) => { // true -> mute; false -> unmute
    this.song.mute(mute);
  }

  this.loop = (loop) => { // true -> loop; false -> unloop
    this.song.loop(loop);
  }

  this.setvolume = (volume) => { //0.0 - 1.0
    this.song.volume(volume);
  }

  this.setrate = (rate) => { //0.5 - 4.0
    this.song.rate(rate);
  }

  this.settime = (seconds) => {
    this.song.seek(seconds);
  }

  this.gettime = () => {
    return this.song.seek();
  }
}


// queqe class to bundle all queqe functions
function queqe(){
  //init
  this.playqueqe = [];
  this.currentindex = 0;
  this.loopatend = false;
  this.randomplayatend = false;

  //basic methods
  //manipulation
  this.addsong = (song, index) => {
    if(index){
      this.playqueqe.splice(song, 0, index);
      if(index <= this.currentindex){
        this.currentindex += 1;
      }
    } else {
      this.playqueqe.push(song);
    }
  }

  this.appendlist = (list) => {
    for (let i = 0; i < list.length; i++) {
      this.playqueqe.push(list[i]);
    }
  }

  this.removesong = (songname, index, all) => {
    if(all){
      var removedbeforecurrentindex = 0;
      let newqueqe = this.playqueqe.filter((song, i) => {
        if(song != songname){
          return true;
        } else {
          if(i < this.currentindex){
            removedbeforecurrentindex += 1;
          } else if(i == this.currentindex){
            //play next song
          }
          return false;
        }
      });
      this.currentindex -= removedbeforecurrentindex;
      this.playqueqe = newqueqe;

    } else {
      if(index < this.currentindex){
        this.currentindex -= 1;
      } else if(index == this.currentindex){
        //play next song
      }
      this.playqueqe.splice(index, 1);
    }
  }

  this.clearqueqe = (removecurrentsong) => {
    if(removecurrentsong){
      current_song.unload();
      current_song = null;
    }
    this.playqueqe = [];
  }

  //info
  this.currentsongname = () => {
    return this.playqueqe[this.currentindex];
  }

  this.remainingsongs = () => {
    //excludes current song
    return [this.playqueqe.length - this.currentindex - 1, this.playqueqe.slice(this.currentindex + 1)];
  }

  this.previoussongs = () => {
    return [this.currentindex, this.playqueqe.slice(0, this.currentindex)];
  }
}


/* ==============================================================
                      APP
============================================================== */


/* dump  */
exportbutton = document.getElementById('export');
loopbutton = document.getElementById('loop');
previousbutton = document.getElementById('previous');
playbutton = document.getElementById('pause-resume-play');
nextbutton = document.getElementById('next');
randombutton = document.getElementById('random');

progressslider = document.getElementsByClassName('slider-play-control');
timeleft = document.getElementById('time-left');
timeright = document.getElementById('time-right');

allsongs = document.getElementById("all-songs");
playqueqediv = document.getElementById("play-song-control");

/* variables  */
current_song = null;
songwidgetcount = {}
queqe = queqe();

//get plalists
//playlists = readplaylistdata("playlists.txt");
allsongs = document.getElementById("allsongs");

//get files
files = [];
updatefilenames(musicfolderpath);






/* ==============================================================
                      INTERVALS
============================================================== */


//update slider
previoustime = 0;
sliderupdate = setInterval(updateslider, 500);

//update files in directory
setInterval(updatefilenames, 5000, musicfolderpath);

//update playlists


/* ==============================================================
                      CLICK EVENT LISTENERS
============================================================== */


/* export as zip  */

exportbutton.addEventListener('click', () => {
  exportaszip();
});

/* control bar  */

loopbutton.addEventListener('click', () => {
  current_song.loop(true);
});

previousbutton.addEventListener('click', () => {

});

playbutton.addEventListener('click', () => {
  //Howler.volume(0.1);
  current_song.playpauseresume();
});

nextbutton.addEventListener('click', () => {

});

randombutton.addEventListener('click', () => {

});
