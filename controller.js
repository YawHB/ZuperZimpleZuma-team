import * as model from './model.js';
import * as view from './view.js';

// TODO: Export functions used by the view

window.addEventListener('load', init);

function init() {
    console.log('Controller init');
    model.init();
    view.init();

    createInitialChain();
    view.updateDisplay(model);
    // show debug info on the model
    model.dump();

    // store "shortcuts" to model and view in window
    window.model = model;
    window.view = view;
}

function createInitialChain() {
    for (let i = 0; i < 5; i++) {
        model.addRandomBall();
    }
}

// TODO: Add controller functions to handle things happening in the view
// controller.js
function addNewBall() {
    const newBallNode = model.addRandomBall(); // Get the new ball node
    console.log('New ball node reference:', newBallNode); // Log the reference

    view.updateDisplay(model); // Update the display
    view.animateNewBall(model, newBallNode); // Pass the correct ball node and model
    model.dump();
}

function insertBallAfter(ball) {
    const cannonBall = model.getCannonBall();
    console.log(cannonBall);

    const newNode = model.insertBallAfter(cannonBall, ball);
    console.log(newNode);

    console.log(`Inserted ${cannonBall.data} after ${ball.data}`);
    model.loadCannon(); // reload cannon with a new ball

    view.updateDisplay(model);
    view.animateCannonBall(model, newNode);
    model.dump();
}

// **** ANIMATIONS ****

// TODO: Add controller functions to be called when animations have completed
function removeMatches(ball) {
    console.log('removeMatches called with', ball);
    const matches = model.checkMatches(ball);
    if (matches.length < 3) return;
    view.animateRemoveBalls(model, matches);
}

function removeBalls(balls) {
    model.removeMatches(balls);
    view.updateDisplay(model);
}

export { addNewBall, insertBallAfter, removeMatches, removeBalls };
