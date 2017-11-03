var app = angular.module('app', ['ui.bootstrap']);
app.controller('AppController', function($scope) {
    $scope.tempo = 80;

    var conductor = new BandJS();

    conductor.setTimeSignature(4, 4);
    conductor.setTempo($scope.tempo);

    var soprano = conductor.createInstrument('square'),
    var mezzosoprano = conductor.createInstrument('square'),
    var alto = conductor.createInstrument('square'),
    var tenor = conductor.createInstrument('square'),
    var baritone = conductor.createInstrument('square'),
    var bass = conductor.createInstrument('square');

    // Bar 1
    soprano.repeatStart()
        .note('whole', 'Bb5');

    mezzosoprano.repeatStart()
        .note('whole', 'G5');

    alto.repeatStart()
        .note('whole', 'Eb5');

    tenor.repeatStart()
        .note('whole', 'C4');

    baritone.repeatStart()
        .note('whole', 'Ab4');

    bass.repeatStart()
        .note('whole', 'F2');

    // Bar 2
    soprano.note('quarter', 'A4')
        .note('eighth', 'A4')
        .note('eighth', 'C5')
        .note('quarter', 'E5')
        .note('eighth', 'D5')
        .note('eighth', 'C5');

    alto.note('quarter', 'E4')
        .note('eighth', 'E4')
        .note('eighth', 'A4')
        .note('quarter', 'C5')
        .note('eighth', 'B4')
        .note('eighth', 'A4');

    bass.note('eighth', 'A2')
        .note('eighth', 'A3')
        .note('eighth', 'A2')
        .note('eighth', 'A3')
        .note('eighth', 'A2')
        .note('eighth', 'A3')
        .note('eighth', 'A2')
        .note('eighth', 'A3');

        var player = conductor.finish();

    $scope.playing = $scope.paused = $scope.muted = false;
    $scope.volume = 50;
    $scope.currentSeconds = 0;
    $scope.timeSlider = 0;
    $scope.totalSeconds = conductor.getTotalSeconds();

    var pauseTicker = false;

    conductor.setTickerCallback(function(seconds) {
        $scope.$apply(function() {
            if (! pauseTicker) {
                $scope.currentSeconds = seconds;
            }
        });
    });

    conductor.setOnFinishedCallback(function() {
        $scope.$apply(function() {
            $scope.playing = $scope.paused = false;
        });
    });

    conductor.setOnDurationChangeCallback(function() {
        $scope.totalSeconds = conductor.getTotalSeconds();
    });

    $scope.play = function() {
        $scope.playing = true;
        $scope.paused = false;
        player.play();
    };

    $scope.stop = function() {
        $scope.playing = $scope.paused = false;
        player.stop();
    };

    $scope.pause = function() {
        $scope.paused = true;
        player.pause();
    };

    $scope.updateTime = function() {
        pauseTicker = false;
        player.setTime($scope.currentSeconds);
    };

    $scope.updateTempo = function() {
        pauseTicker = false;
        conductor.setTempo($scope.tempo);
    };

    $scope.movingTime = function() {
        pauseTicker = true;
    };

    $scope.$watch('loop', function() {
        player.loop($scope.loop);
    });

    $scope.$watch('mute', function(newVal, oldVal) {
        if (newVal === oldVal) {
            return;
        }

        if ($scope.mute) {
            player.mute();
        } else {
            player.unmute();
        }
        $scope.muted = $scope.mute;
    });

    $scope.$watch('volume', function() {
        conductor.setMasterVolume($scope.volume / 100);
    });
});

app.filter('musicTime', function() {
    function pad ( num, size ) {
        return ( Math.pow( 10, size ) + ~~num ).toString().substring( 1 );
    }

    return function(seconds, showRemaining) {
        var duration = moment.duration(parseInt(seconds), 'seconds'),
            secs = duration.seconds(),
            mins = duration.minutes(),
            hrs = duration.hours();

        if (hrs > 0) {
            mins += (hrs * 60);
        }

        return mins + ':' + pad(secs, 2);
    }
});
