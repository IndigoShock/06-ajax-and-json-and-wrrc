'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
// Because of the contextual this.

Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // It is running a short 'if' statement. It is concatenating the number of days published and showing it. The colon separates the condition it is looking for. The first part is true while the second is false (else). And the question mark represents the start of an if statement.

  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// It is called in the function down below. rawData represents a string, based on it being used by JSON. This is different because the data is not being derived from the .js file but is instead, being derived from local storage or remote source.
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.getItem('rawData')));
    articleView.initIndexPage();
    console.log('hi localStorage')
  } else {
    let hackerInfo = 'data/hackerIpsum.json';
    console.log('hey to you too')

    $.getJSON(hackerInfo)
      .then (data => {
        Article.loadAll(data);
        //save to local storage
        localStorage.setItem('rawData', JSON.stringify(data));
        articleView.initIndexPage();
      })
      .catch( err => console.error('Watch out', err) );

    // (Do below within callback function) -- watch for syntax
    // set to localStorage (setItem (what called in localstorage(rawData), value), stringify)
    // initiate page
  }
}
// how we determined sequence