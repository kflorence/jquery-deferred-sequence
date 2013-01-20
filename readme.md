# jQuery Deferred Sequence

Allows a value to be sequentially processed through a list of objects, usually
[Deferred](http://api.jquery.com/category/deferred-object/) objects that represent asynchronous events.

```javascript
var value = 0,
    items = [
        function( value ) {
            return value + 1;
        },
        function( value ) {
            var dfd = $.Deferred();

            setTimeout(function() {
                dfd.resolve( value * 2 );
            }, 1000 );

            return dfd;
        },
        function( value ) {
            return value * value;
        }
    ],
    sequence = $.Deferred.Sequence( items );

sequence.reduce( value, function( func, value ) {
    return $.when( func( value ) );

}).done(function( value ) {
    console.log( value ); // => 4
});
```

## Methods

*   **reduce( [ intialValue, ] callbackFunction [, context ] )** _Promise_  
    Apply a function against each item in the sequence, optionally calling
    the function with the specified context.

## Properties

*   **head** _Deferred_  
    A deferred object representing the beginning of the sequence.

*   **items** _Array_, _Object_  
    The items given to the sequence on initialization.

*   **master** _Deferred_  
    A deferred object which tracks the aggregate state of all the deferreds
    in the sequence.

*   **tail** _Deferred_  
    A deferred object representing the end of the sequence.

## License

Copyright (c) 2013 Kyle Florence  
Dual licensed under the MIT and GPLv2 licenses.