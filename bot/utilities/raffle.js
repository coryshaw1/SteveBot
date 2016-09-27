module.exports.raffle = null;
module.exports.raffleStarted = false;
module.exports.lockedNumberOne = false;
module.exports.usersThatPropped = [];
module.exports.usersInRaffle = [];

var vm = this;

// //start another raffle in 15-45 min
// setTimeout(function(){raffleService.startRaffle(bot)}, (Math.floor(Math.random() * (1000*60*45)) + (1000*60*15)));

module.exports.startRaffle = function startRaffle(bot) {

    if(vm.raffle) clearTimeout(vm.raffle); //don't have multiple raffle timeouts running at once

    //start another raffle in 15-45 min
    setTimeout(function(){
        vm.startRaffle(bot);
    }, (Math.floor(Math.random() * (1000*60*45)) + (1000*60*15)));

    if(bot.getQueue().length <= 1 || vm.raffleStarted === true) return; //don't start a raffle if queue is too small or another is started

    vm.raffleStarted = true;
            
    bot.sendChat(":loudspeaker: STARTING A RAFFLE! @djs want to be moved closer to the dj booth? type :point_right: " +
        "!join :point_left: and you might just get lucky! :clock7: you've got 30 seconds!");

    vm.raffle = setTimeout(function() {
        var numberEntered = vm.usersInRaffle.length + (vm.lockedNumberOne ? 1 : 0);
        bot.sendChat(":clock7: The raffle expires in 10 seconds, " + numberEntered + " user" 
            + (numberEntered == 1 ? " is" : "s are") + " participating! Hurry @djs and :point_right: !join :point_left:");
    
        setTimeout(function() {

            var min = 0;
            var numberEntered = vm.usersInRaffle.length + (vm.lockedNumberOne ? 1 : 0); //add the person that locked number one
            if(numberEntered == 0) {
                bot.sendChat('No one entered the raffle! Be sure to pay attention for the next one!');
                vm.usersInRaffle = [];
                vm.raffleStarted = false;
                vm.lockedNumberOne = false;
                return;
            }
            else if(numberEntered == 1 && vm.lockedNumberOne) {
                bot.sendChat(':trophy: The raffle ended and only the next DJ, @' + vm.lockedNumberOne + ', participated; therefore, the queue stays the same!');
                vm.usersInRaffle = [];
                vm.raffleStarted = false;
                vm.lockedNumberOne = false;
                return;
            }

            var randomWinner = vm.usersInRaffle[Math.floor(Math.random() * (vm.usersInRaffle.length - min)) + min];

            if(bot.getQueuePosition(randomWinner.id) > 0) {
                bot.moderateMoveDJ(randomWinner.id, !vm.lockedNumberOne ? 0 : 1, function(response){});
            }

            if(numberEntered == 1) {
                bot.sendChat(':trophy: The raffle has ended! 1 user participated and our lucky winner is: @' + randomWinner.username + '!');
            }
            else {
                bot.sendChat(':trophy: The raffle has ended! ' + numberEntered + ' users participated and our lucky winner is: @' + randomWinner.username + '!');
            }

            vm.usersInRaffle = [];
            vm.raffleStarted = false;
            vm.lockedNumberOne = false;
        }, 10000);
    }, 20000);
};