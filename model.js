import SimpleLinkedList from './simplelinkedlist.js';

export const list = new SimpleLinkedList();

export function init() {
    console.log('Model init');
    loadCannon();
}

export function dump() {
    let node = list.head;
    let output = '';
    while (node != null) {
        output += '"' + node.data + node.id + '"';
        output += ' -> ';

        node = node.next;
    }
    output += 'null';
    console.log(output);
}

// **** WRAPPERS ****
export function addRandomBall() {
    const ball = randomBall();
    const newBallNode = list.add(ball); // Ensure this returns the actual node
    console.log('Added new ball node:', newBallNode); // Debugging statement
    return newBallNode; // Return the exact ball node reference
}

function addBall(ball) {
    list.add(ball);
    return ball;
}

// TODO: Implement more functions
export function insertBallAfter(data, node) {
    return list.insertAfter(data, node);
}

export function getFirstBall() {
    return list.head;
}

export function getNextBall(ball) {
    return ball.next;
}

function numberOfBalls() {
    return list.size();
}

// **** CANNON ****
let cannonBall;

export function loadCannon() {
    cannonBall = randomBall();
}

export function getCannonBall() {
    return cannonBall;
}

// **** MATCHES ****

export function checkMatches(node) {
    let current = node;
    let before = [];
    let after = [];

    // check left by going backwards in the list from the current node
    if (current.prev) {
        current = node.prev; // skip the current
        while (current != null && current.data == node.data) {
            before.push(current);
            current = current.prev;
        }
    }

    // check right by going forwards in the list from the current node
    if (node.next) {
        current = node.next; // skip the current
        while (current != null && current.data == node.data) {
            after.push(current);
            current = current.next;
        }
    }

    return [...before, node, ...after];
}

export function removeMatches(matches) {
    for (const match of matches) {
        list.remove(match);
    }
}

// **** BALLS ****

const balls = ['🔴', '🔵', '🟡', '🟢'];

function randomBall() {
    return balls[Math.floor(Math.random() * balls.length)];
}

function red() {
    return balls[0];
}

function blue() {
    return balls[1];
}

function yellow() {
    return balls[2];
}

function green() {
    return balls[3];
}

// debugger;
