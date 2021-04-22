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
        text: "No, thank you",
        response: `"Sigh, it's your loss."`
      }
    },
    captain: {
      prompt: `"You look tired traveler, may I offer you a drink to unwind?"`,
      accept: {
        text: "Please bring me some wine",
        response: `"That's what I like to hear! We haven't had that spirit here since 1969."`
      },
      refuse: {
        text: "I'll just have some water",
        response: `"Shame, water doesn't make the voices call from far away..."`
      }
    },
    feast: {

    }
  }

  // counter to track positive or negative responses???
  let dialogueCounter = 0;

  // register the user's name, default is Baby Yoda
  const userName = prompt("Greetings stranger! What is your name?", "Baby Yoda");


  // simple helper method to make links between pages easy to set up
  document.addEventListener("click", (event) => {
    // look for elements with the data-link attribute
    const templateId = event.target.getAttribute("data-link");
    const talkId = event.target.getAttribute("data-talk");
    const answerId = event.target.getAttribute("data-answer");

    if (templateId) {
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

    const templateContent = $(`template#${templateId}`).content.cloneNode(true);
    console.log("templateID: " + templateId);

    if(templateContent.querySelector('[data-talk]') != null){
      templateContent.querySelector('[data-talk]').setAttribute("class", templateId);
      console.log("This is the class: " + templateContent.querySelector('[data-talk]').getAttribute("class"));
    }

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
      console.log("You decided to engage somebody!")
    }, 500);

  }

  function respondToDialogue(answerId) {
    const [talkId, answer] = answerId.split(':');
    const dialogOpts = dialog[talkId];

    if (answer === 'yes') {
      dialogueCounter++;
      $('.storytext').textContent = dialogOpts.accept.response;
    } else if (answer === 'no') {
      dialogueCounter--;
      $('.storytext').textContent = dialogOpts.refuse.response;
    }


    console.log("Dialogue Counter: ", dialogueCounter);

    $all('[data-answer]').forEach(i => i.remove());
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
