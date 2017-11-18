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
    soprano.note('whole', 'Bb5');

    mezzosoprano.note('whole', 'G5');

    alto.note('whole', 'Eb5');

    tenor.note('whole', 'C4');

    baritone.note('whole', 'Ab4');

    bass.note('whole', 'F2');

    // Bar 2
    soprano.note('half', 'Bb5')
        .note('half', 'Bb5');

    alto.note('half', 'Gb5')
        .note('half', 'Gb5');

    tenor.note('half', 'C4')
         .note('half', 'C4');

    bass.note('eighth', 'F2')
        .note('eighth', 'F2')
        .note('eighth', 'F2')
        .note('eighth', 'F2')
        .note('eighth', 'F2')
        .note('eighth', 'F2')
        .note('eighth', 'F2')
        .note('eighth', 'F2');


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
