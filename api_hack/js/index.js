// Globals
const URL_CITIES = "https://developers.zomato.com/api/v2.1/cities";
const URL_RESTAURANTS = "https://developers.zomato.com/api/v2.1/search"; 
const restaurant_thumb = "images/restaurant_thumb.png";  
let queryString = '';
let cityQuery = '';
let start = 0;
let end = 10;
let total = 0;

function renderRestaurant(item){
    let restaurantName = item.restaurant.name;
    let restaurantImage = (item.restaurant.thumb) ? item.restaurant.thumb : restaurant_thumb;
    let restaurantLocation = item.restaurant.location.address;
    let restaurantURL = item.restaurant.url;
    let rating = item.restaurant.user_rating.aggregate_rating;
    console.log(restaurantName);
    console.log(restaurantLocation);
    console.log(restaurantImage);
    return `
        <li class="restaurantItem">
            <a href="${restaurantURL}">
                <img src="${restaurantImage}" alt="${restaurantName}" />
            </a>
            <h3>${restaurantName}</h3>
            <h4>${restaurantLocation}</h4>
            <h4>Rating : ${rating}</h4>
        </li>`;
}

function processcityCB(cityInfo){
    console.log(cityInfo);
    let cityID = cityInfo.location_suggestions[0].id;
    let restaurantQuery = {
        'entity_type': "city",
        'entity_id': cityID,
        'cuisines': '308',
        'start': start,
        'count': 10,
        "apikey": "5e07d543a08ec1f65b9ef497e9c9e1b4",
        };
    console.log(restaurantQuery);
    $.getJSON(URL_RESTAURANTS, restaurantQuery, function(data){
        console.log(data);
        let total =  data.results_found;
        let result_start = data.results_start;
        let linkPrev =  ((start) === 0) ? 'hideLink' : '';
        let linkNext = ((result_start+10)>=total) ? 'hideLink' : '';
        let restaurants = data.restaurants.map(item => renderRestaurant(item));
        //Empty and append to the results ul
        $(".results").empty();
        restaurants = restaurants.join('');
        restaurants += `
            <button class="btn_prev ${linkPrev}">prev</button>
            <button class="btn_load ${linkNext}">next</button>`;
        $(".results").append(restaurants);    
    });
}

function searchRestaurants(){
    let query = { 
        'q': cityQuery,
        "apikey": "5e07d543a08ec1f65b9ef497e9c9e1b4",
    };
    $.getJSON(URL_CITIES, query, processcityCB);
    }

function renderRecipes(item){
    let recipeURL = item.recipe.url;
    let recipeName = item.recipe.label;
    let recipeImage = item.recipe.image;
    let template = `
        <li class="recipeItem">
            <a href="${recipeURL}">
                <img src="${recipeImage}" alt="${recipeName}" />
            </a>
            <h3>${recipeName}</h3>
        </li>`;
    return template;

}

function processRecipeCB(data){
    console.log(data);
    total =  data.count;
    //Return if no results found
    if(total === 0){
        $(".results").append(`
        <p>No results found for ${queryString}</p>`);
        return;
    }
    let linkPrev =  (start === 0) ? 'hideLink' : '';
    let linkNext = (end>=total) ? 'hideLink' : '';
    console.log("end : "+ end + "total : " + total);
    let recipes = data.hits.map(item => renderRecipes(item));
    //Empty and append to the results ul
    $(".results").empty();
    recipes = recipes.join('');
    recipes += `
    <button class="btn_prev ${linkPrev}">prev</button>
    <button class="btn_load ${linkNext}">Next</button>`;
    console.log(recipes);
    $(".results").append(recipes);
}

function searchRecipes(){
    const URL_RECIPE = "https://api.edamam.com/search";
    let query = { 
        'q': queryString,
        'app_id': '69992146',
        'app_key': 'c6f65fe807883f1ff2522326f432f2b4',
        'health':'vegetarian',
        'from':start,
        'to':end
    };
    $.getJSON(URL_RECIPE, query, processRecipeCB);
}

function handlePrevBtn(){
    $(".results").on('click', '.btn_prev', function(e){
        e.preventDefault();
        start -=10;
        end -=10;
        if ($("#cook").is(':checked')){
            //Call the Edamam API again to add 5 more results to the list
            searchRecipes();
        } else 
        if ($("#eat-out").is(':checked')){
            searchRestaurants();
        }    
    })
}

function handleNextBtn(){
    $(".results").on('click', '.btn_load', function(e){
        e.preventDefault();
        start +=10;
        end +=10;
        if ($("#cook").is(':checked')){
            //Call the Edamam API again to add 5 more results to the list
            searchRecipes();
        } else 
        if ($("#eat-out").is(':checked')){
            searchRestaurants();
        }
        
    })
}

function handleSearchQuery(){
    $("#form_search").submit(function(e){
        e.preventDefault();
        //reset the fetch count for items
        start = 0;
        end = 10;
        let text = $('.search_query').val().trim();
        if ($("#cook").is(':checked')){
            //queryString  = text.replace(/\s/g,'').split(',').join(' ');
            queryString = text.split(',').join(' ');
            searchRecipes();
        } else 
        if ($("#eat-out").is(':checked')){ 
            cityQuery = text;
            searchRestaurants();
        }
    });
}


function handleRadioSelection(){
    $(".selection input[type='radio']").on('change', function(e){
        let val = $(this).val();
        console.log(val);
        let searchboxHTML = '';
        if(val === 'cook'){
            searchboxHTML = `
            <input type="textarea" placeholder="enter comma seperated keywords" class="search_query"/>
            <button type="submit"> Search </button>`;
        } else
        if(val === 'eat-out'){
            searchboxHTML = `
            <input type="textarea" placeholder="Type a city name" class="search_query" autocomplete="off"/>
            <button type="submit"> Search </button>`;
        }
        //empty and append the search box to the DOM
        $('.searchBox').empty();
        $('.searchBox').append(searchboxHTML);
    })
}

function renderSlider(){
    $("#slider > .slide:gt(0)").hide();
    setInterval(function() { 
    $('#slider > .slide:first')
        .fadeOut(1000)
        .next()
        .fadeIn(1000)
        .end()
        .appendTo('#slider');
    },  3000);
}

function launchApp(){
    renderSlider();
    handleRadioSelection();
    handleSearchQuery();
    handleNextBtn();
    handlePrevBtn();   
};

$(launchApp);