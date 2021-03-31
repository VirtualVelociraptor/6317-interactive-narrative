(function () {
  // just a shorthand for queries
  const $ = document.querySelector.bind(document);

  // main div where all content will get rendered
  const contentWrapper = $("#content");

  // simple helper method to make links between pages easy to set up
  document.addEventListener("click", (event) => {
    // look for elements with the data-link attribute
    const templateId = event.target.getAttribute("data-link");

    if (templateId) {
      loadTemplate(templateId);
    }
  });

  loadTemplate("intro");

  function loadTemplate(templateId) {
    // clear out current page
    contentWrapper.innerHTML = "";

    // add content from new page template
    contentWrapper.append($(`template#${templateId}`).content.cloneNode(true));
  }
})();
