
const URL = "https://www.googleapis.com/youtube/v3/search";
let nextPage = '';
let prevPage = '';
let totalResults = '';
let searchTerm = '';

function renderResult(item){
  if(item.id.videoId){
    let videoId = item.id.videoId ;
    let videoTitle = item.snippet.title;
    let thumbImg = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    let videoURL = `https://www.youtube.com/watch?v=${videoId}`;
    let channelId = item.snippet.channelId;
    let channelTitle = item.snippet.channelTitle;
    let channelURL = `https://www.youtube.com/channel/${channelId}`;
    return `<li class="videoItem">
                <div class="title">
                  <h4>${videoTitle}</h4>
                  <p><em> See more videos from <a href="${channelURL}" target="_blank">${channelTitle}</a></em> </p>
                </div>
                <a href="${videoURL}" data-id=${videoId} target="_blank" class="js-lightbox_show"><img src="${thumbImg}"
                alt="${videoTitle}"/></a>
            </li>`;
  } else
  if (item.id.channelId){
    let channelId = item.id.channelId;
    let channelTitle = item.snippet.channelTitle;
    let channelURL = `https://www.youtube.com/channel/${channelId}`;
    let channelThumb = item.snippet.thumbnails.medium.url;
    return `<li class="videoItem">
            <div class="title">
              <h4>${channelTitle} : CHANNEL</h4>
              <p><em> See more videos from <a href="${channelURL}" target="_blank">${channelTitle}</a></em> </p>
            </div>
            <a href="${channelURL}" target="_blank"><img src="${channelThumb}"
                 alt="${channelTitle}"/></a>
            </li>`;
  }    
}

function renderPageNav(linkClass){
  $('.js-resultSection').append(`<div class="pageNav">
                                    <a href="#" id="prev" ${linkClass}>Prev 5</a>
                                    <a href="#" id="next">Next 5</a>
                                  </div>`);
}

function processDataCB(data){
  nextPage = data.nextPageToken ? data.nextPageToken : '';
  prevPage = data.nextPageToken ? data.prevPageToken : '';
  totalResults = data.pageInfo.totalResults;
  $('.js-resultSection').empty();
  $('.js-resultSection').append(`
                      <h2 class="totalResults">Your search returned ${totalResults} videos</h2>`);
  if(totalResults){
    let linkClass = '';
    //prevPage link will be disabled on first page alone using class=disableLink
    if(!prevPage){
        linkClass = ` class="disableLink"`;
    }
    let results = data.items.map((item,index)=>renderResult(item));
    let html = `
                <ul class="js-results">
                ${results.join('')}
                </ul>
                `;
    renderPageNav(linkClass);
    $('.js-resultSection').append(html);
  }
}

function getDataFromApi(token){
  const query = {'maxResults': '5',
                  'part': 'snippet',
                  'q': searchTerm,
                  'key': 'AIzaSyAyfhhAuLc_PehUl8OF580fVV0JhyIygn0',
                  'type': '',
                  'pageToken' : token};
  $.getJSON(URL,query, processDataCB);
  return true;
}

function handlePageNav(){
  //handle prev page link click by getting prev 5 results
  $('.js-resultSection').on('click', '#prev', function(e){
      e.preventDefault();
      $('.js-results').remove();
      getDataFromApi(prevPage);   
  });
  //handle next page link click by getting next 5 results
  $('.js-resultSection').on('click', '#next', function(e){
      e.preventDefault();
      $('.js-results').remove();
      console.log(`calling next page with ${nextPage}`);
      getDataFromApi(nextPage);
  });
}

function renderLightBox(videoID){
  let lightboxHTML = `
                      <div id="lightbox_container" aria-live="polite">
                      <div class="frame" tabindex="0">
                          <button aria-label ="video_close_button" type="button" 
                          class="lightbox_close">X</button>
                          <iframe title="video player"
                          src="https://www.youtube.com/embed/${videoID}?autoplay=1"
                          width="100%" height="100%" 
                          frameborder="0" autoplay></iframe>
                      </div>       
                      </div>`;
  $('body').append(lightboxHTML);
}

/* Close the lighbox by clicking X or ESC key */
function handleCloseLightbox(){
  // ESCAPE key pressed
   $(document).keydown(function(e){
    if (e.keyCode === 27) {
      $("#lightbox_container").remove();
    }
  }); 
  // Close button clicked
  $('.lightbox_close').click(function(e){
      e.preventDefault();
      $("#lightbox_container").remove();    
  });

  //Enable background content again
  $('main').attr("aria-hidden", false);
}

/* Handle the lightbox functionality */
function handleLightBoxShow(){
  $('.js-resultSection').on('click','.js-lightbox_show', function(e){
      e.preventDefault();
      let videoID = $(this).data('id');
      renderLightBox(videoID);
      handleCloseLightbox();
      //keep the background content hidden to screen readers
      $('main').attr("aria-hidden", true);  
  });
}

function handleSearchBoxFocus(){
  $('.js-search-field').on('click focusin', function(){
    $('.js-search-field').val(''); 
  })
}

function youTubeSearch(){
  handleSearchBoxFocus();
  $('#searchForm').submit(function(e){
   e.preventDefault();
   //assign the search term to global value
   searchTerm = $('.js-search-field').val();
   getDataFromApi();
   handlePageNav();
   handleLightBoxShow(); 
  });
}

$(youTubeSearch);