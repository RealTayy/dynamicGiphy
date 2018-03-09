function display(search, isNewSearch) {
    $('#giphy-view').attr('search-term', search);
    // Clears current images and resets offSet if starting a new search
    if (isNewSearch) {
        $('#giphy-view').empty();
        $('#giphy-view').append($('<div>').attr({ class: "grid-sizer" }));
        $('#giphy-view').attr('data-off-set', 0);
    }
    // Else adds to the current offSet to load new images   
    else {
        $('#giphy-view').attr('data-off-set', (parseInt(($('#giphy-view').attr('data-off-set'))) + 25));
    }

    // Intializes Masonry grid layout
    $('.grid').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
    });

    var queryURL = 'http://api.giphy.com/v1/gifs/search?q=';
    var apiKey = 'rxJdnZS8wGz7tycEkjccy4PuOCwdp4Us';
    var search = search;
    var offSet = '&offset=' + $('#giphy-view').attr('data-off-set');

    // Sends AJAX request to Giphy's API and recieves JSON object
    $.get(queryURL + search + '&api_key=' + apiKey + offSet).then(function (response) {
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

function addCategory(searchTerm) {
    var newButton = $('<div>').attr({
        class: 'category-button'
    }).data({
        text: searchTerm
    }).text(searchTerm);
    $('#category-view').append(newButton);
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

$(document).on('click', '.category-button', function (e) {
    display($(this).data('text'), true);
})

$('#search-button').on('click', function (e) {
    if ($('#search-input').val() !== '') {
        addCategory($('#search-input').val());
        display($('#search-input').val(), true);
        $('#search-input').val('');
    }
})

$('input').keyup(function (e) {
    if (e.keyCode === 13 && $('#search-input').val() !== '') {
        addCategory($('#search-input').val());
        display($('#search-input').val(), true);
        $('#search-input').val('');
    }
});

display('Ducks', true);

var initialCategory = ['Ducks', 'Dogs', 'Cats', 'Swag'];
initialCategory.forEach(function (i) { addCategory(i) });

$(window).on("scroll", function () {
    var scrollHeight = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if ((scrollHeight - scrollPosition) < 1) {
        display($('#giphy-view').attr('search-term'), false);
        $('#giphy-view').attr('search-term');
    }
});