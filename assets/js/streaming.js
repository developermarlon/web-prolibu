//	var constraints = navigator.mediaDevices.getSupportedConstraints();
//	console.log("constraints", constraints);
//	console.log("constraints", constraints.frameRate.value);

var output_console = null,
  output_message = null,
  output_video = null,
  option_url = null,
  socketio_address = null,
  option_width = null,
  option_height = null,
  option_framerate = null,
  option_bitrate = null,
  button_start = null,
  mediaRecorder = null;

var firstCheck = false;
var player = null;

async function checkHLSActive(url) {
  try {
    let res = await axios.head(url);
    return /2\d\d/.test("" + res.status);
  } catch (err) {
    // console.log('err', url, err);
    return false;
  }
}

function fail(str) {
  alert(
    str +
      "\nUnable to access the camera Please ensure you are on HTTPS and using Firefox or Chrome."
  );
  location.replace("http://mozilla.org/firefox");
}

function docReadyStreaming(fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

function getRoomFromUrl() {
  const search = window.location.search;
  const re = new RegExp("room=([^&=]+)");
  const results = re.exec(search);
  let room = "";
  if (results) {
    room = results[1];
  }
  return room;
}

(() => {
  setInterval(async () => {
    // fetch(`https://livestream.b2bpalmera.com/${getRoomFromUrl()}.m3u8`, {mode: 'no-cors'})
    let checkVideo = await fetch(
      `https://livestream.b2bpalmera.com/${getRoomFromUrl()}.m3u8`,
      { mode: "cors" }
    );
    checkVideo = checkVideo.status == 200 ? true : false;

    if (
      document &&
      document.getElementById("example-video") &&
      checkVideo &&
      videojs
    ) {
      if (!player)
        player = await videojs("example-video", {
          controlBar: {
            playToggle: false
          },
          hls: {
            smoothQualityChange: true
          }
        });

      if (player.paused()) {
        player.src({
          src: `https://livestream.b2bpalmera.com/${getRoomFromUrl()}.m3u8`,
          type: "application/x-mpegURL"
        });

        player.play();

        player.on("loadedmetadata", data => {
          // var player = player.textTracks()[0];
          // player.on('cuechange', (e) => console.log(player.activeCues));
          // player.mode = 'disabled';

          if (document
            .getElementById("configurationStreaming") &&
            document
              .getElementById("configurationStreaming")
              .classList.contains("show")
          ) {
            document
              .getElementById("configurationStreaming")
              .classList.remove("show");

            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth"
            });
          }
        });

        player.on("ended", function() {
          console.log("finaliza");
          this.dispose();
        });
      }
    }
  }, 3000);
})();

docReadyStreaming(async () => {
  const validateForm = setInterval(async () => {
    output_console = document.getElementById("output_console");
    output_message = document.getElementById("output_message");
    output_video = document.getElementById("output_video");
    option_url = document.getElementById("option_url");
    socketio_address = document.getElementById("socket.io_address");
    option_width = document.getElementById("option_width");
    option_height = document.getElementById("option_height");
    option_framerate = document.getElementById("option_framerate");
    option_bitrate = document.getElementById("option_bitrate");
    button_start = document.getElementById("button_start");

    //url=option_url.value='rtmp://'+location.host.split(':')[0]+':1935/live/test0';

    // console.log(output_console)
    // console.log(output_message)
    // console.log(output_video)
    // console.log(option_url)
    // console.log(socketio_address)
    // console.log(option_width)
    // console.log(option_height)
    // console.log(option_framerate)
    // console.log(option_bitrate)
    // console.log(button_start)

    if (
      !output_console ||
      // !output_message ||
      !output_video ||
      !option_url ||
      !socketio_address ||
      !option_width ||
      !option_height ||
      !option_framerate ||
      !option_bitrate ||
      !button_start ||
      !document.getElementById("buttonConfiguration") ||
      !document.getElementById("configurationStreaming") ||
      !document.getElementById("example-video") ||
      !videojs
    )
      return;

    var height = parseInt(option_height.value),
      width = parseInt(option_width.value),
      framerate = parseInt(option_framerate.value),
      audiobitrate = parseInt(option_bitrate.value),
      url = document.getElementById("option_url").value;

    document
      .getElementById("buttonConfiguration")
      .addEventListener("click", () => {
        document
          .getElementById("configurationStreaming")
          .classList.toggle("show");
      });

    console.log("framerate", framerate);
    // document.getElementById("buttonConfiguration").style.display = "block";
    option_height.onchange = option_height.onkeyup = function() {
      height = 1 * this.value;
    };
    option_width.onchange = option_width.onkeyup = function() {
      width = 1 * this.value;
      console.log("width" + width);
    };
    option_framerate.onchange = option_framerate.onkeyup = function() {
      framerate = 1 * this.value;
      console.log("framerate" + framerate);
    };
    option_bitrate.onchange = option_bitrate.onkeyup = function() {
      audiobitrate = 1 * this.value;
      console.log("bitrate" + audiobitrate);
    };
    document.getElementById(
      "option_url"
    ).onchange = option_url.onkeyup = function() {
      url = this.value;
    };
    button_start.onclick = requestMedia;

    document.getElementById("button_stop").addEventListener("click", () => {
      document.getElementById("output_console").value = "";
      stopStream();
    });

    document.getElementById("button_server").addEventListener("click", () => {
      connect_server();
    });

    var oo = document.getElementById("checkbox_Reconection");
    //just start the server
    //connect_server;
    var mediaRecorder;
    var socketBroadcast;
    var state = "stop";
    console.log("state initiated = " + state);
    var t;
    button_start.disabled = true;
    button_stop.disabled = true;

    clearInterval(validateForm);
  }, 500);
});

function video_show(stream) {
  if ("srcObject" in output_video) {
    output_video.muted = true;
    output_video.srcObject = stream;
  } else {
    output_video.src = window.URL.createObjectURL(stream);
  }
  output_video.addEventListener(
    "loadedmetadata",
    function(e) {
      //console.log(output_video);
      output_message.innerHTML =
        "Local video source size:" +
        output_video.videoWidth +
        "x" +
        output_video.videoHeight;
    },
    false
  );
}

function show_output(str) {
  output_console.value += "\n" + str;
  output_console.scrollTop = output_console.scrollHeight;
}

function timedCount() {
  var oo = document.getElementById("checkbox_Reconection");
  if (document.getElementById("checkbox_Reconection").checked) {
    console.log("timed count state = " + state);
    if (state == "ready") {
      console.log("reconnecting and restarting the media stream");
      //do I need to rerun the request media?

      connect_server();
      button_start.disabled = false;
      button_server.disabled = true;
    } else {
      console.log("not ready yet - wating 1000ms");
      t = setTimeout("timedCount()", 1000);
      connect_server();
      output_message.innerHTML = "try connect server ...";
      button_start.disabled = true;
      button_server.disabled = false;
    }
  } else {
    //reconnection is off
    console.log("reconnection is off, buttons hcnage and we are done.");
    button_start.disabled = true;
    button_server.disabled = false;
  }
}

function connect_server() {
  navigator.getUserMedia =
    navigator.mediaDevices.getUserMedia ||
    navigator.mediaDevices.mozGetUserMedia ||
    navigator.mediaDevices.msGetUserMedia ||
    navigator.mediaDevices.webkitGetUserMedia;
  if (!navigator.getUserMedia) {
    fail("No getUserMedia() available.");
  }
  if (!MediaRecorder) {
    fail("No MediaRecorder available.");
  }

  var socketOptions = {
    secure: true,
    reconnection: true,
    reconnectionDelay: 1000,
    timeout: 15000,
    pingTimeout: 15000,
    pingInterval: 45000,
    query: {
      framespersecond: parseInt(
        document.getElementById("option_framerate").value
      ),
      audioBitrate: parseInt(document.getElementById("option_bitrate").value)
    }
  };

  //start socket connection
  socketBroadcast = io.connect(socketio_address.value, socketOptions);
  // console.log("ping interval =", socket.pingInterval, " ping TimeOut" = socket.pingTimeout);
  //output_message.innerHTML=socket;

  socketBroadcast.on("connect_timeout", timeout => {
    console.log("state on connection timeout= " + timeout);
    output_message.innerHTML = "Connection timed out";
    recordingCircle.style.fill = "gray";
  });
  socketBroadcast.on("error", error => {
    console.log("state on connection error= " + error);
    output_message.innerHTML = "Connection error";
    recordingCircle.style.fill = "gray";
  });

  socketBroadcast.on("connect_error", function() {
    console.log("state on connection error= " + state);
    output_message.innerHTML = "Connection Failed";
    recordingCircle.style.fill = "gray";
  });

  socketBroadcast.on("message", function(m) {
    console.log("state on message= " + state);
    console.log("recv server message", m);
    show_output("SERVER:" + m);
  });

  socketBroadcast.on("fatal", function(m) {
    show_output("Fatal ERROR: unexpected:" + m);
    //alert('Error:'+m);
    console.log("fatal socket error!!", m);
    console.log("state on fatal error= " + state);
    //already stopped and inactive
    console.log("media recorder restarted");
    recordingCircle.style.fill = "gray";

    //mediaRecorder.start();
    //state="stop";
    //button_start.disabled=true;
    //button_server.disabled=false;
    //document.getElementById('button_start').disabled=true;
    //restart the server

    if (document.getElementById("checkbox_Reconection").checked) {
      //timedCount();
      output_message.innerHTML = "server is reload!";
      console.log("server is reloading!");
      recordingCircle.style.fill = "gray";
    }
    //should reload?
  });

  socketBroadcast.on("ffmpeg_stderr", function(m) {
    //this is the ffmpeg output for each frame
    show_output("FFMPEG:" + m);
  });

  socketBroadcast.on("disconnect", function(reason) {
    console.log("state disconec= " + state);
    show_output("ERROR: server disconnected!");
    console.log("ERROR: server disconnected!" + reason);
    recordingCircle.style.fill = "gray";
    //reconnect the server
    connect_server();

    socketBroadcast.open();
    //mediaRecorder.stop();
    //state="stop";
    //button_start.disabled=true;
    //button_server.disabled=false;
    //	document.getElementById('button_start').disabled=true;
    //var oo=document.getElementById("checkbox_Reconection");
    if (document.getElementById("checkbox_Reconection").checked) {
      //timedCount();
      output_message.innerHTML = "server is reloading!";
      console.log("server is reloading!");
    }
  });

  state = "ready";
  console.log("state = " + state);
  button_start.disabled = false;
  button_stop.disabled = false;
  button_server.disabled = true;
  output_message.innerHTML = "connect server successful";
}

function requestMedia() {
  var constraints = {
    audio: {
      sampleRate: parseInt(document.getElementById("option_bitrate").value),
      echoCancellation: true
    },
    video: {
      width: {
        min: 100,
        ideal: document.getElementById("option_width").value,
        max: 1920
      },
      height: {
        min: 100,
        ideal: document.getElementById("option_height").value,
        max: 1080
      },
      frameRate: {
        ideal: parseInt(document.getElementById("option_framerate").value)
      }
    }
  };
  // navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
  navigator.mediaDevices
    .getDisplayMedia({
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    })
    .then(function(stream) {
      //let supported = navigator.mediaDevices.getSupportedConstraints();
      //console.log(supported);
      video_show(stream); //only show locally, not remotely
      recordingCircle.style.fill = "green";
      socketBroadcast.emit(
        "config_rtmpDestination",
        document.getElementById("option_url").value
      );
      socketBroadcast.emit("start", "start");
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start(250);
      button_stop.disabled = false;
      button_start.disabled = true;
      button_server.disabled = true;

      //show remote stream
      var livestream = document.getElementsByClassName("Livestream");
      console.log("adding live stream");
      livestream.innerHtml = "test";

      mediaRecorder.onstop = function(e) {
        console.log("stopped!");
        console.log(e);
        //stream.stop();
      };

      mediaRecorder.onpause = function(e) {
        console.log("media recorder paused!!");
        console.log(e);
        //stream.stop();
      };

      mediaRecorder.onerror = function(event) {
        let error = event.error;
        // console.log("error", error.name);
      };
      //document.getElementById('button_start').disabled=false;

      mediaRecorder.ondataavailable = function(e) {
        // console.log(e.data);
        socketBroadcast.emit("binarystream", e.data);
        state = "start";
        //chunks.push(e.data);
      };
    })
    .catch(function(err) {
      console.log("The following error occured: " + err);
      show_output("Local getUserMedia ERROR:" + err);
      output_message.innerHTML =
        "Local video source size is not support or No camera ?" +
        output_video.videoWidth +
        "x" +
        output_video.videoHeight;
      state = "stop";
      button_start.disabled = true;
      button_server.disabled = false;
    });
}

function stopStream() {
  console.log("stop pressed:");
  // stream.getTracks().forEach(track => track.stop())
  if (mediaRecorder) mediaRecorder.stop();
  recordingCircle.style.fill = "gray";
  output_message.innerHTML = "stop successful";
  button_stop.disabled = true;
  button_start.disabled = true;
  button_server.disabled = false;
}
