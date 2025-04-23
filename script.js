let pressCount = 0;
let currentBalloon = null;
let balloonYOffset = 90;

const burstSound = new Audio("Graphics/burst.mp3");
let burstCount = 0;



document.getElementById("handle").addEventListener("click", () => {
  const handle = document.getElementById("handle");
  handle.style.transform = "translateY(10px)";
  setTimeout(() => {
    handle.style.transform = "translateY(0px)";
  }, 100);

  const pumpArea = document.getElementById("pump-area");
  const pumpRect = pumpArea.getBoundingClientRect();

  if (!currentBalloon) {
    balloonYOffset = 90; // Reset for new balloon
    currentBalloon = createBalloon(pumpRect);
  }

  pressCount++;

  // Move balloon upward after each press
  currentBalloon.style.top = `${pumpRect.top + balloonYOffset}px`;
  balloonYOffset -= 10;

  // Inflate stages
  if (pressCount === 1) {
    scaleBalloon(currentBalloon, 0.33);
  } else if (pressCount === 2) {
    scaleBalloon(currentBalloon, 0.66);
  } else if (pressCount === 3) {
    scaleBalloon(currentBalloon, 1);
    setTimeout(() => {
      flyBalloon(currentBalloon);
      currentBalloon = null;
      pressCount = 0;
    }, 500);
  }
});

function createBalloon(pumpRect) {
  const balloon = document.createElement("div");
  balloon.className = "balloon";

  const balloonIndex = Math.floor(Math.random() * 10) + 1;
  const letterChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z

  const balloonImg = document.createElement("img");
  balloonImg.src = `Graphics/ballon_${balloonIndex}.png`;
  balloonImg.style.width = "80px";
  balloonImg.style.height = "auto";

  const letter = document.createElement("img");
  letter.src = `Graphics/${letterChar}.png`;
  letter.style.position = "absolute";
  letter.style.top = "25%";
  letter.style.left = "25%";
  letter.style.width = "30px";

  balloon.appendChild(balloonImg);
  balloon.appendChild(letter);

  balloon.style.position = "absolute";
  balloon.style.left = `${pumpRect.left - 20}px`;
  balloon.style.top = `${pumpRect.top + 90}px`; // Initial
  balloon.style.transform = "scale(0)";
  balloon.style.zIndex = 5;

  document.getElementById("balloons-container").appendChild(balloon);

  balloon.addEventListener("click", () => {
    burstSound.play();
  
    // Burst animation
    const burst = document.createElement("img");
    burst.src = "Graphics/burst.png";
    burst.style.position = "absolute";
    burst.style.width = "60px";
    burst.style.left = `${balloon.offsetLeft}px`;
    burst.style.top = `${balloon.offsetTop}px`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 300);
  
    // Remove the balloon
    balloon.remove();
  
    // Increment and update the burst counter
    burstCount++;
    document.getElementById("burstCounter").textContent = `Balloons Burst: ${burstCount}`;
  });
  
  
    
    


  return balloon;
}


  

function scaleBalloon(balloon, scaleValue) {
  balloon.animate([
    { transform: `scale(${scaleValue - 0.1})` },
    { transform: `scale(${scaleValue})` }
  ], {
    duration: 300,
    fill: "forwards"
  });
}

function flyBalloon(balloon) {
  const angle = Math.random() * 2 * Math.PI;
  const speed = 2 + Math.random() * 2;
  let dx = Math.cos(angle) * speed;
  let dy = Math.sin(angle) * speed;

  const interval = setInterval(() => {
    const rect = balloon.getBoundingClientRect();

    // Reverse direction if hitting walls, and nudge it slightly
    if (rect.left <= 0 || rect.right >= window.innerWidth) {
      dx *= -1;
      balloon.style.left = `${balloon.offsetLeft + dx}px`; // small move
    }
    if (rect.top <= 0 || rect.bottom >= window.innerHeight) {
      dy *= -1;
      balloon.style.top = `${balloon.offsetTop + dy}px`; // small move
    }

    balloon.style.left = `${balloon.offsetLeft + dx}px`;
    balloon.style.top = `${balloon.offsetTop + dy}px`;
  }, 30);
}


