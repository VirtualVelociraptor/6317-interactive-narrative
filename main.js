(function () {
  // just a shorthand for queries
  const $ = document.querySelector.bind(document);
  const $all = document.querySelectorAll.bind(document);

  // main div where all content will get rendered
  const contentWrapper = $("#content");

  // object to hold dialog text and options
  const dialog = {
    swimsuit: {
      prompt: `"Hey are you new here? Wanna take a hit?"`,
      accept: {
        text: "Sure, why not?",
        response: `"Here, don't inhale too much!"`
      },
      refuse: {
        text: "No thanks.",
        response: `"Maybe next time."`
      }
    },
    champagne: {
      prompt: `"Hi, and welcome! Would you like to have some champagne? It's on the house."`,
      accept: {
        text: "Sure, I'll have a glass.",
        response: `"Enjoy your drink. Feel free to explore the hotel!"`
      },
      refuse: {
        text: "No, I'll pass. Thanks.",
        response: `"Well, see you around."`
      }
    },
    friends: {
      prompt: `"These are my friends! Do you want to go on a drive with us in my Mercedes Benz?"`,
      accept: {
        text: "Yeah, sounds fun!",
        response: `"Great! We'll all meet in the lobby after dinner. It's going to be unforgettable!"`
      },
      refuse: {
        text: "No, thank you.",
        response: `"Sigh, it's your loss."`
      }
    },
    captain: {
      prompt: `"You look tired traveler, may I offer you a drink to unwind?"`,
      accept: {
        text: "Please bring me some wine.",
        response: `"That's what I like to hear! We haven't had that spirit here since 1969."`
      },
      refuse: {
        text: "I'll just have some water.",
        response: `"Shame, water doesn't make the voices call from far away..."`
      }
    },
    feast: {

    }
  }

  // keep track of the directions the player clicks to run
  const runDirections = [];

  // sequence of directions to run to always escape
  const escapeRunSequence = ["forward", "right", "back", "left"];

  // counter to track positive or negative responses???
  let responseScore = 0;
  let dialogueCounter = 0;

  // register the user's name, default is Don Henley
  const userName = prompt("Greetings stranger! What is your name?", "Don Henley");


  // simple helper method to make links between pages easy to set up
  document.addEventListener("click", (event) => {
    // look for elements with the data-link attribute
    let templateId = event.target.getAttribute("data-link");
    const talkId = event.target.getAttribute("data-talk");
    const answerId = event.target.getAttribute("data-answer");

    $("#playAudio").play();

    if (templateId) {
      // check for running buttons
      var dir;
      if (dir = event.target.getAttribute("data-run")) {
        runDirections.push(dir);
      }

      //check if escape button
      if (templateId === "ending") {
        templateId = getEndingTemplate();
      }

      loadTemplate(templateId);
    } else if (talkId) {
      // dialog logic
      loadDialogue(talkId, event.target);
      // replace the template if player previousy spoke to the hotel person
      document.getElementById(document.querySelector('[data-talk]').getAttribute("class")).setAttribute("id", "null");
    } else if (answerId) {
      // response to dialogue
      respondToDialogue(answerId);
    }
  });

  loadTemplate("intro");

  function loadTemplate(templateId) {
    // clear out current page
    contentWrapper.innerHTML = "";

    // add content from new page template
    // contentWrapper.append($(`template#${templateId}`).content.cloneNode(true));

    let templateContent = $(`template#${templateId}`).content.cloneNode(true);

    // hide the go to room button until they have talked to at least two people
    if (templateContent.querySelector("[data-link='gotoroom']") && dialogueCounter < 3) {
      templateContent.querySelector("[data-link='gotoroom']").style.display = "none";
    }

    if (templateContent.querySelector('[data-talk]') != null) {
      templateContent.querySelector('[data-talk]').setAttribute("class", templateId);
    }

    // check for and hide run direction buttons that have been used
    templateContent.querySelectorAll("[data-run]").forEach(btn => {
      if (runDirections.includes(btn.getAttribute("data-run"))) {
        btn.remove();

        // check how many buttons are left, if none, load the "escape" template instead
        if (templateContent.querySelectorAll("[data-run]").length == 0) {
          templateContent = $(`template#escape`).content.cloneNode(true);
        }
      }
    });

    contentWrapper.append(templateContent);

    if (userName != null) {
      $(".name").innerHTML = userName;
    } else {
      $(".name").innerHTML = "Baby Yoda";
    }
  }

  function loadDialogue(talkId, btnElement) {
    let dialogOpts = dialog[talkId];

    $('.storytext').textContent = dialogOpts.prompt;

    btnElement.style.display = "none";

    setTimeout(() => {
      const noBtn = document.createElement('button'),
        yesBtn = document.createElement('button');

      noBtn.setAttribute('data-answer', `${talkId}:no`);
      yesBtn.setAttribute('data-answer', `${talkId}:yes`);

      noBtn.textContent = dialogOpts.refuse.text;
      yesBtn.textContent = dialogOpts.accept.text;

      btnElement.after(yesBtn, noBtn);
      btnElement.remove();

      $all("[data-link]").forEach(b => b.style.display = "none");

    }, 200);

  }

  function respondToDialogue(answerId) {
    const [talkId, answer] = answerId.split(':');
    const dialogOpts = dialog[talkId];

    if (answer === 'yes') {
      responseScore++;
      $('.storytext').textContent = dialogOpts.accept.response;
    } else if (answer === 'no') {
      responseScore--;
      $('.storytext').textContent = dialogOpts.refuse.response;
    }

    dialogueCounter++;

    console.log("Dialogue counter ", dialogueCounter);
    console.log("Response Score: ", responseScore);

    $all('[data-answer]').forEach(i => i.remove());
    $all("[data-link]").forEach(b => b.style.display = "inline-block");

    // hide the go to room button until they have talked to at least two people
    if ($("[data-link='gotoroom']") && dialogueCounter < 3) {
      $("[data-link='gotoroom']").style.display = "none";
    }
  }

  function getEndingTemplate() {
    // check if they got the correct escape sequence of directions
    if (JSON.stringify(runDirections) == JSON.stringify(escapeRunSequence)) {
      return "good_end";
    } else {

      if (responseScore < 0)
        return "good_end"

      return "bad_end";
    }
  }

  // debugging helpers
  if (window.location.search.includes('debug=true')) {
    createPageLinks();
  }

  // shows links to each individual page, for easy access for debugging
  function createPageLinks() {
    const body = $('body');
    $all("template").forEach(template => {
      let btn = document.createElement('button');
      btn.setAttribute('data-link', template.id);
      btn.textContent = template.id;
      body.append(btn);
    });
  }

})();
