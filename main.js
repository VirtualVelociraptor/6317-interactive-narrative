(function () {
  // just a shorthand for queries
  const $ = document.querySelector.bind(document);

  // main div where all content will get rendered
  const contentWrapper = $('#content');

  // simple helper method to make links between pages easy to set up
  document.addEventListener('click', (event) => {
    // look for elements with the data-link attribute
    if (!event.target.getAttribute('data-link')) {
      return;
    }

    const pageId = event.target.getAttribute('data-link');

    // clear out current page
    contentWrapper.innerHTML = '';

    // add content from new page template
    contentWrapper.append(
      $(`template#${pageId}`).content.cloneNode(true)
    );
  });
})();

