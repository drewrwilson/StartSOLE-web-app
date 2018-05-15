function initPushPin() {
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('#pushpin-wrapper');
        M.Pushpin.init(elems, { top: 141.5, offset: 74});
    });
}

function initScrollSpy() {
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.scrollspy');
        M.ScrollSpy.init(elems, {});
    });
}
