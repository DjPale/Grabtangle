angular.module('grabtangle').directive('linkify', ['$compile', function($compile)
{
    function processValue(value, scope, element, attrs)
    {
        var txt = value;

        if (attrs.keyword == '#')
        {
            element.html(txt);
            // TODO: loop for each # found to create multiple links
            var pos = txt.indexOf('#');

            if (pos == -1 || pos >= txt.length - 1) return;

            var spacePos = txt.indexOf(' ', pos + 1);
            if (spacePos == -1) spacePos = txt.length;

            if (spacePos - pos <= 1) return;

            var keyword = txt.substring(pos, spacePos);

            txt = txt.replace(keyword, '<a style="cursor:pointer;" ng-click="' + attrs.handler.replace('#', keyword) + '">' + keyword + '</a>');
        }
        else
        {
            txt = txt.replace(attrs.keyword, '<a style="cursor:pointer;" ng-click="' + attrs.handler + '">' + attrs.keyword + '</a>');
        }

        element.html(txt);
        $compile(element.contents())(scope);
    }

    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs)
        {
            let observer_ref = attrs.$observe('linkify', function(value)
            {
                processValue(value, scope, element, attrs);
            });

            element.on('$destroy', function() {
                if (observer_ref) observer_ref();
            });
        }
    };
}]);