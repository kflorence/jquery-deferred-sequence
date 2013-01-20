(function( $ ) {

var slice = [].slice;

function arr( obj ) {
    return $.isArray( obj ) ? obj : [ obj ];
}

function scopedFunc( func /* arg, ... , argsN */ ) {
    var args = slice.call( arguments, 1 );

    return function() {
        return func.apply( this, args.concat( slice.call( arguments ) ) );
    };
}

function Sequence( items ) {
    var head = $.Deferred(),
        master = $.Deferred(),
        tail = head;

    return {
        head: head,
        items: items,
        master: master,
        reduce: function( value, func, context ) {

            // Args: func, context
            if ( typeof value === 'function' ) {
                context = func;
                func = value;
                value = undefined;
            }

            head.resolveWith( context, arr( value ) );

            $.each( items, function( i, item ) {
                tail = tail.pipe( scopedFunc( func, item ) );
            });

            tail.done( scopedFunc( master.resolve ) );

            return master;
        },
        tail: tail
    };
}

// Export
$.Deferred.Sequence = Sequence;

})( jQuery );