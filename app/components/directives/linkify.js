angular.module('grabtangle').directive('linkify', ['$compile', function($compile)
{
    function processValue(value, scope, element, attrs)
    {
        let txt = value;

        if (attrs.keyword == '#')
        {
            // create a separate target txt to avoid messing with our source string
            let dstTxt = '';
            let pos = txt.indexOf('#');
            let startIdx = 0;

            while (pos != -1 && pos < txt.length - 1)
            {
                let spacePos = txt.indexOf(' ', pos + 1);
                // if no space, it means that the tag spans the rest of the string
                if (spacePos == -1) spacePos = txt.length;

                // must have at least one character in hash tag
                if (spacePos - pos > 1)
                {
                    let keyword = txt.substring(pos, spacePos);

                    dstTxt += txt.substring(startIdx, pos);
                    dstTxt += '<a style="cursor:pointer;" ng-click="' + attrs.handler.replace('#', keyword) + '">' + keyword + '</a>';
                }

                startIdx = spacePos;

                pos = txt.indexOf('#', startIdx);
            }

            // if we have filled in our dst text variable we must have made at least one substitution
            if (dstTxt.length > 0) 
            {
                // we could have a leftover string after the last substitution
                if (startIdx < txt.length) dstTxt += txt.substring(startIdx);
                element.html(dstTxt);
            }
            else
            {
                element.html(txt);
                return;
            }
        }
        else
        {
            txt = txt.replace(attrs.keyword, '<a style="cursor:pointer;" ng-click="' + attrs.handler + '">' + attrs.keyword + '</a>');
            element.html(txt);
        }

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