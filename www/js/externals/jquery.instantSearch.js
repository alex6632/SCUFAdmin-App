(function($) {
    $.fn.instantSearch = function(config) {
        return this.each(function() {
            initInstantSearch(this, $.extend(true, defaultConfig, config || {}));
        });
    };

    var defaultConfig = {
        minQueryLength: 2,
        maxPreviewItems: 10,
        previewDelay: 500,
        noItemsFoundMessage: 'No items found'
    };

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        };
    }

    var initInstantSearch = function(el, config) {
        var $input = $(el);
        //console.log($input);
        var $form = $input.closest('form');
        var $preview = $('<ul class="search__list">').appendTo($form);

        var setPreviewItems = function(items) {
            $preview.empty();

            $.each(items, function(index, item) {
                if (index > config.maxPreviewItems) {
                    return;
                }
                addItemToPreview(item);
            });
        };

        var addItemToPreview = function(item) {
            var $li;
            console.log('stop loader');

            if (item.id) {
                var $text = $('<strong>').text(item.result);
                $li = $('<li class="search__list__item small-padding">').attr('data-id', item.id).append($text);
            } else {
                $li = $('<li class="search__list__item search-response">').append(item.total + " " + item.result);
            }

            $preview.append($li);
        };

        var noItemsFound = function() {
            var $li = $('<li class="search__list__item small-padding">').text(config.noItemsFoundMessage);

            $preview.empty();
            $preview.append($li);
        };

        var updatePreview = function() {
            $('.loader').fadeOut();
            var query = $.trim($input.val()).replace(/\s{2,}/g, ' ');

            if (query.length < config.minQueryLength) {
                $preview.empty();
                $preview.css('border:0');
                return;
            }

            $.getJSON($form.attr('action') + '?' + $form.serialize(), function(items) {
                if (items.length === 0) {
                    noItemsFound();
                    return;
                }

                setPreviewItems(items);
            });
        };

        $input.focusout(function() {
            $preview.fadeOut();
        });

        $input.focusin(function() {
            $preview.fadeIn();
            updatePreview();
        });

        $input.keyup(debounce(updatePreview, config.previewDelay));
    }
})(window.jQuery);