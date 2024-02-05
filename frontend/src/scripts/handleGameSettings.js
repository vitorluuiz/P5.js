class Settings {
    constructor(_music, _bounce, _velocity, _units, _radius) {
        this.options = {
            music: _music,
            bounce: _bounce,
            velocity: _velocity,
            units: _units,
            radius: _radius
        }
    };
}

function displaySettings() {
    let settings = getSettings();

    document.getElementById('music').innerText = settings.options.music;
    document.getElementById('bounce').innerText = settings.options.bounce;
    document.getElementById('velocity').innerText = settings.options.velocity;
    document.getElementById('units').innerText = settings.options.units;
    document.getElementById('radius').innerText = settings.options.radius;
}

const onChangeSlider = (value, target) => {
    let targetDiv = document.getElementById(target);
    targetDiv.innerText = Number.parseInt(value);
}

const onChangeOption = (target) => {
    let targetDiv = document.getElementById(target);
    if (targetDiv.innerText == 'OFF') {
        targetDiv.innerText = 'ON';
    } else {
        targetDiv.innerText = 'OFF';
    }
}

const onApplySettings = () => {
    let snackbar = document.getElementById('settings-bar');
    snackbar.classList.add('visible');

    setTimeout(() => snackbar.classList.remove('visible'), 2500);
}

function applySettings() {
    let music = document.getElementById('music').innerText;
    let bounce = document.getElementById('bounce').innerText;
    let velocity = document.getElementById('velocity').innerText;
    let units = document.getElementById('units').innerText;
    let radius = document.getElementById('radius').innerText;

    let settings = new Settings(
        music,
        bounce,
        parseInt(velocity),
        parseInt(units),
        parseInt(radius));


    onApplySettings();
    sessionStorage.setItem('game-settings', JSON.stringify(settings));
}

function loadSettings() {
    let settings;

    if (sessionStorage.getItem('game-settings') != null) {
        settings = JSON.parse(sessionStorage.getItem('game-settings'));
        settings = new Settings(
            settings.options.music,
            settings.options.bounce,
            settings.options.velocity,
            settings.options.units,
            settings.options.radius
        );
    } else {
        settings = new Settings("OFF", "OFF", 10, 7, 14);
    }

    sessionStorage.setItem('game-settings', JSON.stringify(settings));
    return settings;
}

function getSettings() {
    let settings = loadSettings();

    return settings;
}