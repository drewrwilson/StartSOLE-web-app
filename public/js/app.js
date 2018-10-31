function initSideNav() {
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
}

function initPushPin() {
    var elems = document.querySelectorAll('#pushpin-wrapper');
    M.Pushpin.init(elems, { top: 141.5, offset: 74});
}

function initScrollSpy() {
    var elems = document.querySelectorAll('.scrollspy');
    M.ScrollSpy.init(elems, {});
}

function initTabs() {
    var elems = document.querySelectorAll('.tabs');
    M.Tabs.init(elems, {});
}

function initDatePicker() {
    var elems = document.querySelectorAll('.datepicker');
    M.Datepicker.init(elems, {
        minDate: new Date()
    });
}

function initTimePicker() {
    var elems = document.querySelectorAll('.timepicker');
    M.Timepicker.init(elems, {});
}

function initSelect() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
}

function initTooltips() {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems, {});
}

function initSlider() {
    var elems = document.querySelectorAll('.slider');
    var instances = M.Slider.init(elems, {});
}

function initMaterialBoxed() {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, {});
}

function initCollapsible() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {});
}

function initModal() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
}