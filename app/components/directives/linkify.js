angular.module('grabtangle').directive('linkify', ['$compile', function($compile)
{
    return {
        restrict: 'A',
        scope: false,
        link: function(scope, element, attrs)
        {
            let observer_ref = attrs.$observe('linkify', function(value)
            {
                var txt = value;
                txt = txt.replace(attrs.keyword, '<a style="cursor:pointer;" ng-click="' + attrs.handler + '">' + attrs.keyword + '</a>');
                element.html(txt);
                $compile(element.contents())(scope);
            });

            element.on('$destroy', function() {
                observer_ref();
            });
        }
    };
}]);