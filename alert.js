const ALART_PRIMARY = 'alert-primary';
const ALART_SUCCESS = 'alert-primary';
const ALART_DANGER = 'alert-primary';
const ALART_WARNING = 'alert-primary';
const ALART_INFO = 'alert-primary';

function HideAlert() {
    $('#alert-primary').hide();
    $('#alert-success').hide();
    $('#alert-danger').hide();
    $('#alert-warning').hide();
    $('#alert-info').hide();

    $('#alert-success-in').text('');
    $('#alert-danger-in').text('');
    $('#alert-warning-in').text('');
    $('#alert-info-in').text('');
}

function ShowAlart(level, Content, isHTML, isFadeIn) {
    if (level != ALART_PRIMARY) {
        if (isHTML) {
            $('#' + level + '-in').html(Content);
        } else {
            $('#' + level + '-in').text(Content);
        }
        if (isFadeIn) {
            $('#' + level + '-in').fadeIn();
        } else {
            $('#' + level + '-in').show();
        }
    } else {
        if (isHTML) {
            $('#alert-primary').html(Content);
        } else {
            $('#alert-primary').text(Content);
        }
        if (isFadeIn) {
            $('#' + level).fadeIn();
        } else {
            $('#' + level).show();
        }
    }
}