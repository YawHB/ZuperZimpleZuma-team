import * as view from './view.js';
import * as controller from './controller.js';

// *********************************
// *                               *
// *         ANIMATIONS            *
// *                               *
// *********************************

function animateNewBall(model, newBall) {
    console.log('Animating new ball', newBall);

    // Update the entire model display first
    view.updateDisplay(model);

    // Find the visualBall for the newBall
    const visualBall = view.getVisualBallForModelNode(newBall); // Note: fixed getVisualBallForModelNode call to use view
    if (!visualBall) {
        console.error('No visualBall found for newBall', newBall);
        return;
    }
    const onlyImg = visualBall.firstElementChild; // We are only animating the image

    // First: Find the initial position of the visual ball (before it appears)
    const startRect = onlyImg.getBoundingClientRect();

    // Simulate that it's starting from off-screen
    onlyImg.style.setProperty('--delta-x', '1500px');

    // Last: Find the final position of the ball (after it's been updated in the DOM)
    const endRect = onlyImg.getBoundingClientRect();

    // Invert: Calculate the difference in X between the start and end positions
    const deltaX = endRect.left - (startRect.left - 1500); // not really fan of the magic number -1500, but it works

    // Set the --delta-x property with the calculated deltaX
    onlyImg.style.setProperty('--delta-x', `${deltaX}px`);

    // Play: Add the animation class to start the transition
    onlyImg.classList.add('animate-add');

    // Clean up after the animation is done
    onlyImg.addEventListener('animationend', function doneAnimateNewBall() {
        onlyImg.removeEventListener('animationend', doneAnimateNewBall);
        onlyImg.classList.remove('animate-add');

        // Optionally remove the --delta-x property if you don't need it afterward
        onlyImg.style.removeProperty('--delta-x');
    });
}
/**
 * Use simple animation to expand the space already occupied by a visualball
 */
function animateExpandSpaceForBall(visualBall) {
    visualBall.classList.add('animate-expand');
    visualBall.addEventListener('animationend', doneExpanding);

    function doneExpanding() {
        visualBall.removeEventListener('animationend', doneExpanding);
        visualBall.classList.remove('animate-expand');
    }
}

/**
 * Use FLIP animation to animate a ball from the position of the canonball
 */
function animateCannonBall(model, newBall) {
    console.log(`AnimateCannonBall:`);
    console.log(newBall);
    // Start by updating the entire model
    view.updateDisplay(model);

    // Find the visualBall for this newBall
    const visualBall = view.getVisualBallForModelNode(newBall);

    // Animate the space for the new ball
    animateExpandSpaceForBall(visualBall);

    // Do FLIP animation to move the newball from the position of the cannonball
    // to the current position of the visualBall

    // First: Find the starting position of the ball - which is where the cannonball is
    const visualCannonball = document.querySelector('#cannon .ball img');
    const cannonRect = visualCannonball.getBoundingClientRect(); // get bounding box of cannonball

    // Find the position (x and y) of the visualCannonBall
    // positions are contained in the cannonRect object (left and top properties

    // Last: Find the destination position of the ball - which is where it has been added
    const ballImage = visualBall.querySelector('img'); // only use the img, not the entire element with the button
    const ballRect = ballImage.getBoundingClientRect(); // get bounding box of the new ball

    // Find the position (x and y) of the ballImage
    // positions are contained in the ballRect object (left and top properties)

    // Invert: calculate the distance to move from source to destination
    const deltaX = cannonRect.left - ballRect.left; // calculate x-axis difference
    const deltaY = cannonRect.top - ballRect.top; // calculate y-axis difference

    // Play: run the animation from source to destination
    ballImage.style.setProperty('--delta-x', `${deltaX}px`);
    ballImage.style.setProperty('--delta-y', `${deltaY}px`);
    ballImage.classList.add('animate-fromcannon');

    // Hide the cannonball while animating
    document.querySelector('#cannon .ball img').classList.add('hide');

    ballImage.addEventListener('animationend', doneMoving);

    function doneMoving() {
        ballImage.removeEventListener('animationend', doneMoving);
        ballImage.classList.remove('animate-fromcannon');
        ballImage.style.removeProperty('--delta-x');
        ballImage.style.removeProperty('--delta-y');

        // Show the cannonball again, after animating
        document.querySelector('#cannon .ball img').classList.remove('hide');
        // TODO: Notify controller when ball has moved
        console.log('Done moving canonball');
        controller.removeMatches(newBall);
    }
}

function animateRemoveBalls(model, balls) {
    // NOTE: Run the animation-implode animations BEFORE updating the view
    console.log('Animating remove balls called with', balls);

    let first = true;
    const lastBall = balls[balls.length - 1];
    const nextBall = model.getNextBall(lastBall);

    for (const ball of balls) {
        const visualBall = view.getVisualBallForModelNode(ball); // Use getVisualBallForModelNode to get the visual representation
        visualBall.classList.add('animate-implode'); // Add the implode class to start the removal animation

        if (first) {
            first = false;
            visualBall.addEventListener('animationend', () => {
                // After the animation ends for the first ball, update the view and notify the controller
                view.updateDisplay(model);
                // Check if nextBall is not null before passing to removeMatches
                if (nextBall) {
                    controller.removeMatches(nextBall);
                }
                controller.removeBalls(balls);
            });
        }
    }
}

export { animateNewBall, animateCannonBall, animateRemoveBalls };
