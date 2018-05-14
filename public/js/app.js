function initPushPin() {
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('#pushpin-wrapper');
        var instances = M.Pushpin.init(elems, { top: 141.5, offset: 74});
    });
}
