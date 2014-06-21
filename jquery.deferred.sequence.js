(function( factory ) {
    // AMD
    if ( typeof define === "function" && define.amd ) {
        define( [ "jquery" ], factory);

    // Node/CommonJS
    } else if ( typeof exports === "object" ) {
        factory( require( "jquery" ) );

    // Browser
    } else {
        factory( jQuery );
    }
}(function( $ ) {
    var slice = Array.prototype.slice;

    function scopedFunc( func ) {
        var args = slice.call( arguments, 1 );

        return function() {
            return func.apply( this, args.concat( slice.call( arguments ) ) );
        };
    }

    function Sequence( items ) {
        var head = $.Deferred(),
            master = $.Deferred(),
            tail = head;

        items = $.makeArray( items );

        return {
            head: head,
            items: items,
            master: master,
            reduce: function( value, func, context ) {
                // Args: func, context
                if ( typeof value === "function" ) {
                    context = func;
                    func = value;
                    value = undefined;
                }

                head.resolveWith( context, $.makeArray( value ) );

                $.each( items, function( i, item ) {
                    tail = tail.pipe( scopedFunc( func, item ) );
                });

                tail.done( scopedFunc( master.resolve ) );

                return master;
            },
            tail: tail
        };
    }

    // Exports
    $.Deferred.Sequence = Sequence;
}));