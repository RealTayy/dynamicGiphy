function display(search, addtionalParameters = '') {
    // Clears current images
    $('#giphy-view').empty();
    $('#giphy-view').append($('<div>').attr({ class: "grid-sizer" }));

    // Intializes Masonry grid layout
    $('.grid').masonry({
        itemSelector: '.grid-item',        
        columnWidth: '.grid-sizer',
        percentPosition: true
    });

    var queryURL = 'http://api.giphy.com/v1/gifs/search?q=';
    var apiKey = 'rxJdnZS8wGz7tycEkjccy4PuOCwdp4Us';
    var search = search;
    var addtionalParameters = addtionalParameters;

    // Sends AJAX request to Giphy's API and recieves JSON object
    $.get(queryURL + search + '&api_key=' + apiKey + addtionalParameters).then(function (response) {
        console.log(response.data[0]); // Delete this line later please                
        response.data.forEach(function (i) {
            var newImg = ($('<img>').attr({
                class: "grid-item",
                src: i.images['480w_still'].url,
            }).data({
                still: i.images['480w_still'].url,
                moving: i.images.original.url,
                triggered: false
            }));
            $grid = $('.grid');
            $grid.append(newImg).masonry('appended', newImg);
        })
        $('#giphy-view').imagesLoaded().done(function (instance) {
            $('.grid').masonry({
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer'
            });
        })
    });
}

$(document).on('click', 'img', function (e) {
    if ($(this).data('triggered')) {
        $(this).data('triggered', false);
        $(this).attr('src', $(this).data('still'));
    } else {
        $(this).data('triggered', true);
        $(this).attr('src', $(this).data('moving'));
    }
})

display('ducks');