/**
 * Created by justin on 6/13/18.
 */
var slider = document.getElementById('test-slider');

function showRecommended() {
    var duration = document.getElementById('duration');
    var groups = parseInt(document.getElementById('num_groups').value);
    var helper = document.getElementById('duration_helper_text');
    if(duration.value < 30) {
        duration.value = 30;
        helper.innerHTML="SOLEs should be at least 30 minutes";
    }
    else {
        helper.innerHTML="";
    }
    createSlider(parseInt(duration.value),groups);
    document.getElementById('recommended_row').classList.remove("hide");
}

function createSlider(duration,groups) {
    // set minimum and maximum values for question, review, and close phases
    var minQuestion = 2;
    var maxQuestion = Math.min(10,Math.round(duration/10));
    var minReview = groups*1.5;
    var maxReview = groups*4.5;
    var maxClose = 10;
    var hasClose = document.getElementById('exit_ticket').checked;
    if(hasClose){ var close = 10}
    else { close = 0}


    noUiSlider.create(slider, {
        start: [2, duration-groups*2.5-10, duration-close],
        connect: [true, true, true, false],
        range: {
            'min': [-10],
            'max': [duration]
        }
    });

    var connect = slider.querySelectorAll('.noUi-connect');
    var classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-3-color'];

    for ( var i = 0; i < connect.length; i++ ) {
        connect[i].classList.add(classes[i]);
    }
    slider.noUiSlider.on('change', function ( values, handle ) {

        var v = [
            Math.max(minQuestion,Math.min(maxQuestion, values[0])),
            Math.max(duration-maxReview,Math.min(duration-minReview, values[1]))];

        if ( v[0] != values[0] || v[1] != values[1] ) {
            slider.noUiSlider.set(v);
        }

    });


    var questionTime = document.getElementById('recommended_question');
    var reviewTime = document.getElementById('recommended_review');

    slider.noUiSlider.on('update', function( values, handle ) {

        var value = values[handle];

        switch(handle) {
            case 0:
                questionTime.value = Math.round(value);
                break;
            case 1:
                reviewTime.value = duration - Math.round(value);
                break;
        }
    });

    questionTime.addEventListener('change', function(){
        slider.noUiSlider.set([this.value, null]);
    });

    reviewTime.addEventListener('change', function(){
        slider.noUiSlider.set([null, duration-this.value]);
    });

}
