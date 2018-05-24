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
    M.Datepicker.init(elems, {});
}

function initTimePicker() {
    var elems = document.querySelectorAll('.timepicker');
    M.Timepicker.init(elems, {});
}