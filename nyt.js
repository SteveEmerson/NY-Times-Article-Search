// API information
const baseurl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const key = 'Pym18SuPKG9X0EyCTidwOJgP5Fl28q5B';
let url;

// SEARCH FORM 
const searchTerm = document.querySelector('.search');
const startDate = document.querySelector('.start-date');
const endDate = document.querySelector('.end-date');
const searchForm = document.querySelector('form');
const submitBtn = document.querySelector('.search');

// RESULTS NAVIGATION
const nextBtn = document.querySelector('.next');
const previousBtn = document.querySelector('.prev');
const nav = document.querySelector('nav');

// RESULTS SECTION
const section = document.querySelector('section');

// Initialize results components
nextBtn.style.display = 'none';   //hide nav on page load ... no results yet
previousBtn.style.display = 'none';   //hide nav on page load ... no results yet
let pageNumber = 0;
//let displayNav = false;

// Add event listeners
searchForm.addEventListener('submit', fetchResults);
nextBtn.addEventListener('click', nextPage);
previousBtn.addEventListener('click', previousPage);

function fetchResults(e){

  e.preventDefault();  //default nature of a form is to POST and refresh the page ... prevents the refresh in this case
  console.log(e);

  url = baseurl + '?api-key=' + key + '&page=' + pageNumber + '&q=' + searchTerm.value;

  if(startDate.value !== '') {
    console.log(startDate.value);
    url += '&begin_date=' + startDate.value;
  }

  if(endDate.value !== '') {
    console.log(endDate.value);
    url += '&end_date=' + endDate.value;
  }

  console.log(url);

  fetch(url)
    .then(function(result){
      return result.json();
    })
    .then(function(json){
      displayResults(json);
    })
    .catch(function(err){
      console.log('nope');
      console.log(err);
    });

}

function displayResults(json){

  while(section.firstChild){
    section.removeChild(section.firstChild);
  }

  let articles = json.response.docs;

  if(pageNumber === 0){
    previousBtn.style.display = 'none';
    if(articles.length === 10){
      nextBtn.style.display = 'block';
    }
  }else{
    previousBtn.style.display = 'block';
    if(articles.length < 10){
      nextBtn.style.display = 'none';
    }
  }

  if(articles.length === 0) {
    console.log('No results');
  }else{
    for (current of articles){
      console.log(current);
      let article = document.createElement('article');
      let heading = document.createElement('h2');
      let link = document.createElement('a');
      let para = document.createElement('p');
      let clearfix = document.createElement('div');
      let image = document.createElement('img');

      link.href = current.web_url;
      link.textContent = current.headline.main;
      para.textContent = 'Keywords: ';

      for(keyword of current.keywords){
        let span = document.createElement("span");
        span.textContent = keyword.value;
        para.appendChild(span);
      }

      if(current.multimedia.length > 0){
        image.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        image.alt = current.headline.main;
      }

      clearfix.setAttribute('class', 'clearfix');

      heading.appendChild(link);
      article.appendChild(heading);
      article.appendChild(image);
      article.appendChild(para);
      article.appendChild(clearfix);
      section.appendChild(article);
    }

  }
  
}

function nextPage(e){
  pageNumber++;
  fetchResults(e);

}

function previousPage(e){
  if(pageNumber > 0){
    pageNumber--;
  }else{
    return;
  }
  
  fetchResults(e);
}






