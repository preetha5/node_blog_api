
const URL = "https://www.googleapis.com/youtube/v3/search";
let nextPage = '';
let prevPage = '';

function getDataFromApi(searchTerm,token){
    const query = {'maxResults': '5',
            'part': 'snippet',
            'q': searchTerm,
            'key': 'AIzaSyAyfhhAuLc_PehUl8OF580fVV0JhyIygn0',
            'type': '',
            'pageToken' : token};
    $.getJSON(URL,query, processDataCB);

}

function processDataCB(data){
        console.log(data);
        nextPage = data.nextPageToken ? data.nextPageToken : '';
        prevPage = data.nextPageToken ? data.prevPageToken : '';
        let results = data.items.map((item,index)=>renderResult(item));
        let html = `
                    <ul class="js-results">
                    ${results.join('')}
                    </ul>
                    `;
        
        $('.js-resultSection').append(html);
}

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
                <a href="${videoURL}" target="_blank"><img src="${thumbImg}" alt="${videoTitle}"/></a>
                </li>`;
    } else
    if (item.id.channelId){
        let channelId = item.id.channelId;
        let channelTitle = item.snippet.channelTitle;
        let channelURL = `https://www.youtube.com/channel/${channelId}`;
        let channelThumb = item.snippet.thumbnails.medium.url;
        return `<li class="videoItem">
                <div class="title">
                    <h4>${channelTitle}</h4>
                    <p><em> See more videos from <a href="${channelURL}" target="_blank">${channelTitle}</a></em> </p>
                </div>
                <a href="${channelURL}" target="_blank"><img src="${channelThumb}" alt="${channelTitle}"/></a>
                </li>`;
    }
    
}

function handlePageNav(searchTerm){
    //handle prev page link click by getting prev 5 results
    $('#prev').click(function(e){
        e.preventDefault();
        $('.js-results').remove();
        getDataFromApi(searchTerm,prevPage);
        console.log(prevPage);
        if (!(prevPage)){
            $('#prev').addClass('disableLink');
        }

    });
    //handle next page link click by getting next 5 results
    $('#next').click(function(e){
        $('#prev').removeClass('disableLink');
        e.preventDefault();
        $('.js-results').remove();
        getDataFromApi(searchTerm,nextPage);

    });
    
}
function youTubeSearch(){
    $('#searchForm').submit(function(e){
        e.preventDefault();
        const searchTerm = $('.js-search-field').val();
        $('.js-resultSection').empty();
        $('.js-resultSection').append(`
                        <h2>Showing results for search : "${searchTerm}"</h2>
                        <div class="pageNav">
                        <a href="#" id="prev" class="disableLink">Prev</a>
                        <a href="#" id="next">Next</a>
                        </div>
                        `)
       getDataFromApi(searchTerm);
       handlePageNav(searchTerm);
       
    });
}






$(youTubeSearch);