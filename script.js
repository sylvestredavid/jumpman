let img;
let imgProp = {
    left: 150,
    bottom: 49,
    idleD: './img/droite1.png',
    runD: './img/droite2.png',
    idleG: './img/gauche1.png',
    runG: './img/gauche2.png',
    dead: './img/stop.png',
}
let goombas = [];
let colision = false;
let isJump, recule, isGameOver, isGrounded = false;
let body;
let container;
let floors = [];
let goombasContainer;

function createContainer() {
    container = document.createElement('div');
    container.style.position = 'relative';
    container.style.height = "500px";
    container.style.width = "800px";
    container.style.border = "3px solid black";
    container.style.overflow = "hidden";
    container.style.margin = "100px auto";
    container.style.textAlign = "center";
    let instruction = document.createElement('p');
    instruction.style.marginTop = "50px";
    instruction.innerText = "Utilisez les flèches pour vous déplacer et le bouton gauche de la souris pour sauter";
    container.appendChild(instruction);
    body.appendChild(container);
}

function createImg() {
    img = document.createElement('img');
    img.src = imgProp.idleD;
    img.style.position = 'absolute';
    img.style.bottom = imgProp.bottom + "px";
    img.style.left = imgProp.left + "px";
    container.appendChild(img);
}

function createFloor(left, width, isPlateform) {
    let sol = document.createElement('div');
    sol.style.position = 'absolute';
    sol.style.bottom = isPlateform ? "120px" : "0px";
    sol.style.height = isPlateform ? "10px" : "51px";
    sol.style.background = "url(./img/sol.png) top center repeat-x";
    sol.style.left = left + "px";
    sol.style.width = width + "px";
    return sol;
}

function createWorld() {
    floors.push(createFloor(0, 500, false))
    floors.push(createFloor(600, 500, false))
    floors.push(createFloor(1200, 230, true))
    floors.push(createFloor(1600, 800, false))
    floors.push(createFloor(2500, 500, false))
    floors.push(createFloor(3100, 100, true))
    floors.push(createFloor(3300, 900, false))
    floors.push(createFloor(3500, 100, true))
    floors.forEach(f => {
        container.appendChild(f)
    })
}

function generateGoombas() {
    goombas.push(createGoomba(300, 51, false))
    goombas.push(createGoomba(450, 80, true))
    goombas.push(createGoomba(700, 51, false))
    goombas.push(createGoomba(1000, 51, false))
    goombas.push(createGoomba(1300, 130, false))
    goombas.push(createGoomba(1500, 100, true))
    goombas.push(createGoomba(1800, 51, false))
    goombas.push(createGoomba(2200, 51, false))
    goombas.push(createGoomba(2425, 55, true))
    goombas.push(createGoomba(2700, 51, false))
    goombas.push(createGoomba(2900, 51, false))
    goombas.push(createGoomba(3090, 130, false))
    goombas.push(createGoomba(3400, 51, false))
    goombas.push(createGoomba(3500, 130, false))
    goombas.push(createGoomba(3800, 51, false))
    goombasContainer = document.createElement('div');
    goombasContainer.style.position = 'absolute';
    goombasContainer.style.left = "0";
    goombasContainer.style.bottom = "0";
    goombasContainer.style.right = "0";
    goombasContainer.style.top = "0";
    goombasContainer.style.zIndex = "-10";
    container.appendChild(goombasContainer)
    goombas.forEach(g => {
        goombasContainer.appendChild(g)
    })

    animeGoobas()
}

function createGoomba(left, bottom, isAile) {
    let goomba = document.createElement('img');
    goomba.src = isAile ? './img/mechantAile.png' : './img/mechant.png';
    goomba.style.position = 'absolute';
    goomba.style.bottom = bottom + "px";
    goomba.style.left = left + "px";
    if(isAile) {
        goomba.classList.add('aile');
    }
    return goomba;
}

/**
 * fonction qui anime les goombas suivant si ils sont ailés ou pas
 */
function animeGoobas() {
    goombas.forEach(g => {
        const initialBottom = (container.clientHeight - g.offsetTop) - g.clientHeight;
        if (g.classList.contains("aile")) {
            g.animate(
                [{bottom: initialBottom + "px"},
                    {bottom: (initialBottom + 50) + "px"},
                    {bottom: initialBottom + "px"}], {
                    duration: 2000,
                    iterations: Infinity
                }
            )
        } else {
            // on gere la direction de l'image avec un setInterval qui donne l'impréssion que le goomba tourne
            g.style.transform = 'rotateY(180deg)'
            setTimeout(() => {
                g.style.transform = 'rotateY(0)'
            }, 1500)
            setInterval(() => {
                g.style.transform = 'rotateY(180deg)'
                setTimeout(() => {
                    g.style.transform = 'rotateY(0)'
                }, 1500)
            }, 3000)
            g.animate(
                [{left: g.offsetLeft + "px"},
                {left: (g.offsetLeft + 80) + "px"},
                {left: g.offsetLeft + "px"}], {
                    duration: 3000,
                    iterations: Infinity
                }
            )
        }
    })
}

/**
 * fonction pour faire avancer le joueur, en fait c'est le paysage qui bouge ;-)
 */
function run() {
    let i = 0;
    window.addEventListener("keydown", (e) => {
        // si on appuie sur la touche droite, on deplace les goombas et les sols de 4px vers la gauche
        if (e.code === "ArrowRight" && !isGameOver) {
            recule = false;
            goombasContainer.style.left = (goombasContainer.offsetLeft - 8) + "px"
            floors.forEach((f) => {
                f.style.left = (f.offsetLeft - 8) + "px"
            })
            // on appel la fonction qui verifie si on se fait tuer par un goomba
            killed()
            if (!isJump && !isGameOver && isGrounded) {
                if (i % 3 === 0) {
                    img.src = imgProp.runD
                } else {
                    img.src = imgProp.idleD
                }
            }
        } else if (e.code === "ArrowLeft" && !isGameOver) { // si on appuie sur la touche gauche, on deplace les goombas et les sols de 4px vers la droite
            recule = true;
            goombasContainer.style.left = (goombasContainer.offsetLeft + 8) + "px"
            floors.forEach((f) => {
                f.style.left = (f.offsetLeft + 8) + "px"
            })
            // on appel la fonction qui verifie si on se fait tuer par un goomba
            killed()
            if (!isJump && !isGameOver && isGrounded) {
                if (i % 3 === 0) {
                    img.src = imgProp.runG
                } else {
                    img.src = imgProp.idleG
                }
            }
        }
        i++
    }, false)
    window.addEventListener("keyup", (e) => {
        i = 0;
        if (e.code === "ArrowRight" && !isJump && !isGameOver) {
            img.src = imgProp.idleD
        } else if (e.code === "ArrowLeft" && !isJump && !isGameOver) {
            img.src = imgProp.idleG
        }
    })
}

/**
 * fonction pour faire sauter le personnage
 */
function jump() {
    document.addEventListener('mousedown', (e) => {
        // si on est au sol et si on est pas en train de sauter, on utilise un setInterval pour faire monter le personnage
        if (isGrounded && !isJump) {
            const hauteur = imgProp.bottom + 100;
            isJump = true;
            isGrounded = false;
            if (recule) {
                img.src = imgProp.runG
            } else {
                img.src = imgProp.runD
            }
            let jump = setInterval(() => {
                if (imgProp.bottom <= hauteur) {
                    imgProp.bottom += 1;
                    img.style.bottom = imgProp.bottom + "px";
                } else {
                    clearInterval(jump)
                    isJump = false
                }
            }, 5);
        }
    })
}

/**
 * fonction qui simule la gravité, si la position left du person n'est pas supérieur à la position left d'un des sols et la position left du person n'est pas inférieur a la position lef du sol plus la largeur du sol, le personnage perd des pixels au bottom
 */
function gravity() {
    let jump = setInterval(() => {
        if (!isJump) {
            imgProp.bottom -= 1;
            img.style.bottom = imgProp.bottom + "px";
            killGoomba()
            floors.forEach(f => {
                const bottom = (container.clientHeight - f.offsetTop) - f.clientHeight;
                if (((imgProp.left + img.clientWidth >= f.offsetLeft) && (imgProp.left <= f.offsetLeft + f.clientWidth)) && (imgProp.bottom <= (f.clientHeight + bottom)) && !(imgProp.bottom <= bottom) && !isGameOver) {
                    imgProp.bottom = f.clientHeight + bottom;
                    img.style.bottom = imgProp.bottom + "px";
                    if (!isGrounded) {
                        if (recule) {
                            img.src = imgProp.idleG
                        } else {
                            img.src = imgProp.idleD
                        }
                        isGrounded = true;
                    }
                }
            });
            if (imgProp.bottom < 15) {
                isGameOver = true;
                img.src = imgProp.dead;
                setTimeout(() => {
                    clearInterval(jump)
                    location.reload();
                }, 500)
            }
        }

    }, 5);
}

/**
 * fonction qui vérifie si le perso se fait tuer par un goomba, si la position left du perso + sa largeur est spuérieur ou égale a la position left du goomba et la position left du perso est inérieur ou agale a la position left
 * du goomba + sa largeur et que la position bottom du perso est inférieur a la position bottom du goomba + sa hauteur, le personnage meurt
 */
function killed() {
    goombas.forEach(g => {
        const bottom = (container.clientHeight - g.offsetTop) - g.clientHeight;
        if (((imgProp.left + img.clientWidth >= (g.offsetLeft + goombasContainer.offsetLeft)) && (imgProp.left <= (g.offsetLeft + g.clientWidth + goombasContainer.offsetLeft))) && (imgProp.bottom <= (g.clientHeight + bottom)) && !isJump) {
            isGameOver = true;
            img.src = imgProp.dead;
            let jump = setInterval(() => {
                if (imgProp.bottom <= 80) {
                    imgProp.bottom += 1;
                    img.style.bottom = imgProp.bottom + "px";
                } else {
                    clearInterval(jump)
                }
            }, 8);
            setTimeout(() => {
                let jump = setInterval(() => {
                    if (imgProp.bottom > -10) {
                        imgProp.bottom -= 1;
                        img.style.bottom = imgProp.bottom + "px";
                        killGoomba()
                    } else {
                        location.reload();
                        clearInterval(jump)
                    }
                }, 8);
            }, 400);
        }
    })
}


/**
 * fonction qui vérifie si le perso tue un goomba, si la position left du perso + sa largeur est spuérieur ou égale a la position left du goomba et la position left du perso est inérieur ou agale a la position left
 * du goomba + sa largeur et que la position bottom du perso est inférieur a la position bottom du goomba + sa hauteur, le perso tue le goomba (cette fonction est appelée lors de la descente d'un saut
 */
function killGoomba() {
    goombas.forEach(g => {
        const bottom = (container.clientHeight - g.offsetTop) - g.clientHeight;
        if (((imgProp.left + img.clientWidth >= g.offsetLeft + goombasContainer.offsetLeft) && (imgProp.left <= g.offsetLeft + g.clientWidth + goombasContainer.offsetLeft)) && (imgProp.bottom <= (g.clientHeight + bottom)) && !isGameOver) {
            imgProp.bottom += 20;
            img.style.bottom = imgProp.bottom + "px";
            const index = goombas.indexOf(g);
            if (index > -1) {
                goombas.splice(index, 1)
            }
            setTimeout(() => {
                g.remove()
                if (goombas.length === 0) {
                    gagne();
                }
            }, 50)
        }
    })
}

/**
 * fonction qui affiche gagné
 */
function gagne() {
    let gagner = document.createElement('p');
    gagner.style.fontSize = "50px";
    gagner.style.marginTop = "150px";
    gagner.innerText = "Gagné !"
    let rejouer = document.createElement('p');
    rejouer.style.fontSize = "30px";
    rejouer.style.marginTop = "10px";
    rejouer.innerText = "Rejouer?";
    rejouer.style.zIndex = "100";
    rejouer.addEventListener("mouseenter", () => {
        rejouer.style.color = "red";
        rejouer.style.cursor = "pointer";
    })
    rejouer.addEventListener("mouseleave", () => {
        rejouer.style.color = "black";
        rejouer.style.cursor = "default";
    })
    rejouer.addEventListener("mousedown", () => {
        location.reload()
    })
    container.appendChild(gagner)
    container.appendChild(rejouer)
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

(function () {
    body = document.getElementById("body");
    createContainer()
    createImg();
    createWorld()
    generateGoombas();
    gravity()
    run()
    jump()

})();
