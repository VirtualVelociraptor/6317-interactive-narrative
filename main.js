(function () {
  // just a shorthand for queries
  const $ = document.querySelector.bind(document);

  // main div where all content will get rendered
  const contentWrapper = $("#content");

  // object to hold dialog text and options
  const dialog = {
    swimsuit: {
      prompt: `"Hey are you new here? Wanna have some drugs?"`,
      accept: {
        text: "Sure, why not?"
      },
      refuse: { text: "No thanks." }
    }
  }

  // register the user's name, default is Baby Yoda
  const userName = prompt("Greetings stranger! What is your name?", "Baby Yoda");


  // simple helper method to make links between pages easy to set up
  document.addEventListener("click", (event) => {
    // look for elements with the data-link attribute
    const templateId = event.target.getAttribute("data-link");
    const talkId = event.target.getAttribute("data-talk");

    if (templateId) {
      loadTemplate(templateId);
    } else if (talkId) {
      // dialog logic
      loadDialogue(talkId, event.target);
    }
  });

  loadTemplate("intro");

  function loadTemplate(templateId) {
    // clear out current page
    contentWrapper.innerHTML = "";

    // add content from new page template
    contentWrapper.append($(`template#${templateId}`).content.cloneNode(true));

    if (userName != null) {
      document.querySelector(".name").innerHTML = userName;
    }
    else {
      document.querySelector(".name").innerHTML = "Baby Yoda";
    }

  }

  function loadDialogue(talkId, btnElement) {
    let dialogOpts = dialog[talkId];

    $('.storytext').textContent = dialogOpts.prompt;

    btnElement.style.display = "none";

    setTimeout(() => {
      const noBtn = document.createElement('button'),
        yesBtn = document.createElement('button');

      noBtn.setAttribute('data-answer', 'no');
      yesBtn.setAttribute('data-answer', 'yes');

      noBtn.textContent = dialogOpts.refuse.text;
      yesBtn.textContent = dialogOpts.accept.text;

      btnElement.after(yesBtn, noBtn);
      btnElement.remove();
    }, 500);

  }


  // debugging helpers
  if (window.location.search.includes('debug=true')) {
    createPageLinks();
  }

  // shows links to each individual page, for easy access for debugging
  function createPageLinks() {
    const body = $('body');
    document.querySelectorAll("template").forEach(template => {
      let btn = document.createElement('button');
      btn.setAttribute('data-link', template.id);
      btn.textContent = template.id;
      body.append(btn);
    });
  }


})();
